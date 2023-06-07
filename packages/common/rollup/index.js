const path = require('path')

const babel = require('@rollup/plugin-babel').default
const json = require('@rollup/plugin-json')
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve').default
const peerDepsExternal = require('rollup-plugin-peer-deps-external')
const typescript = require('rollup-plugin-typescript2')

const extensions = ['.ts', '.tsx']

const defaultPlugins = [
    peerDepsExternal(),
    babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        skipPreflightCheck: true,
        extensions,
    }),
    resolve(),
    commonjs(),
    json(),
]

/**
 * @description oneweek monoTemplate에서 packages를 만들기 위한 rollup config
 * @param entrypoint : rollup input entrypoint
 * @param packageDir : __dirname 주입
 * @param configModules : esm, cjs가 필요할 때, 주입
 * @returns rollup config
 */
exports.generateRollupConfig = function generateRollupConfig({entrypoint, packageDir, configModules = ['esm']}) {
    const packageJSON = require(path.join(packageDir, 'package.json'))

    const input = typeof entrypoint === 'string' ? {input: {index: entrypoint}} : {input: entrypoint}
    const isOnlyESM = configModules.length === 1 && configModules[0] === 'esm'
    const config = configModules.map((module) => {
        const isCommonJS = module === 'cjs'
        const dirPath = `dist${isCommonJS || isOnlyESM ? '' : '/esm'}`

        return {
            ...input,
            output: {
                dir: dirPath,
                format: module,
                exports: 'named',
                interop: isCommonJS ? 'auto' : 'esModule',
            },
            plugins: [
                typescript({
                    useTsconfigDeclarationDir: true,
                    tsconfig: path.join(packageDir, isCommonJS || isOnlyESM ? 'tsconfig.json' : 'tsconfig.esm.json'),
                }),
                ...defaultPlugins,
            ],
            external: [...Object.keys(packageJSON.dependencies)],
        }
    })

    return config
}
