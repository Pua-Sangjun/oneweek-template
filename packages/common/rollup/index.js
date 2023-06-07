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
 * @description oneweek monotemplate에서 packages를 만들기 위한 rollup config
 * @param entrypoint : rollup input entrypoint
 * @param packageDir : __dirname 주입
 * @returns rollup config
 */
exports.generateRollupConfig = function generateRollupConfig({entrypoint, packageDir}) {
    const packageJSON = require(path.join(packageDir, 'package.json'))

    const input = typeof entrypoint === 'string' ? {input: {index: entrypoint}} : {input: entrypoint}

    const config = {
        ...input,
        output: {
            dir: 'dist',
            format: 'esm',
            exports: 'named',
            interop: 'esModule',
        },
        plugins: [
            typescript({
                useTsconfigDeclarationDir: true,
                tsconfig: 'tsconfig.json',
            }),
            ...defaultPlugins,
        ],
        external: [...Object.keys(packageJSON.dependencies)],
    }

    return config
}
