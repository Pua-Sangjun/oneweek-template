import path from 'path'

import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import builtins from 'builtin-modules'
import commonjs from '@rollup/plugin-commonjs'
import preserveDirectives from 'rollup-plugin-preserve-directives'
import type {RollupOptions, OutputOptions, ModuleFormat} from 'rollup'
import type {TransformOptions} from '@babel/core'

function verifyPackageJSON(packageDir: string) {
    const packageJSON = require(path.join(packageDir, 'package.json'))

    if (!packageJSON['files']) {
        throw new Error('package.json에 file 필드가 필요합니다. 이 필드는 npm publish 시에 배포되는 파일 목록입니다.')
    }

    if (!packageJSON['exports']) {
        throw new Error('package.json에 exports 필요합니다.')
    }

    if (!packageJSON['exports']['.']) {
        throw new Error('package.json에 exports 필드에 . 필드가 필요합니다.')
    }

    const exportsMain = packageJSON['exports']['.']

    if (!exportsMain['require'] || !exportsMain['import'] || !exportsMain['types']) {
        throw new Error(
            'exports["."] 필드에 require, import, types 필드가 필요합니다. 각각 commonjs, esmodule, typescript를 위한 필드입니다.',
        )
    }

    if (!packageJSON['exports']['./package.json'] || packageJSON['exports']['./package.json'] !== './package.json') {
        throw new Error(
            'package.json에 exports 필드에 ./package.json을 키로 ./package.json을 선언해주세요. 라이브러리 사용시에 사용자가 `package.json`을 정확히 위함입니다.',
        )
    }

    return packageJSON
}

const SUPPORT_MODULES: ReadonlyArray<ModuleFormat> = ['cjs', 'esm']

interface GenerateRollupConfigOptions {
    entrypoint: string | Record<'index' & string, string>
    outpoint?: {
        require: string
        import: string
        types: string
    }
    packageDir: string
    extensions?: string[]
    plugins: RollupOptions['plugins']
    scss: boolean
    ie: boolean
    minify: boolean
}

const commonBabelPresets = [
    '@babel/preset-typescript',
    [
        '@babel/preset-react',
        {
            runtime: 'automatic',
        },
    ],
]
const commonBabelPlugins = ['@babel/plugin-proposal-class-properties']

export function generateRollupConfig({
    entrypoint,
    outpoint,
    packageDir,
    extensions = ['.ts', '.tsx'],
    plugins: extraPlugins = [],
    ie = false,
    minify = true,
}: GenerateRollupConfigOptions): Array<RollupOptions> {
    const packageJSON = verifyPackageJSON(packageDir)

    const outputPath = outpoint || packageJSON['exports']['.']

    const input: Record<'index' | string, string> =
        typeof entrypoint === 'string'
            ? {index: path.join(packageDir, entrypoint)}
            : Object.entries(entrypoint).reduce(
                  (acc, [key, value]) => ({...acc, [key]: path.join(packageDir, value)}),
                  {},
              )

    return SUPPORT_MODULES.map((module) => {
        const isCommonJS = module === 'cjs'
        const isESM = module === 'esm'

        if (!isCommonJS && !isESM) {
            throw new Error('module은 cjs 또는 esm만 지원합니다.')
        }

        const buildOutput = isCommonJS ? outputPath['require'] : outputPath['import']

        const output: OutputOptions[] = [
            {
                format: module,
                dir: path.dirname(buildOutput),
                ...(isESM
                    ? {
                          entryFileNames: `[name]${path.extname(buildOutput)}`,
                          preserveModulesRoot: path.dirname(input.index),
                          preserveModules: true,
                      }
                    : {
                          exports: 'auto',
                      }),
            },
        ]

        const babelPreset: {presets?: TransformOptions['presets']; plugins?: TransformOptions['plugins']} = ie
            ? {
                  presets: [
                      [
                          '@babel/preset-env',
                          {
                              useBuiltIns: 'usage',
                              targets: '> 0.25%, not dead, ie >= 11, not op_mini all',
                              corejs: {version: 3.29, proposals: false},
                          },
                      ],
                      ...commonBabelPresets,
                  ],
                  plugins: commonBabelPlugins,
              }
            : {
                  presets: commonBabelPresets,
                  plugins: commonBabelPlugins,
              }

        const plugins = [
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                exclude: /node_modules/,
                extensions,
                ...babelPreset,
            }),
            json(),
            preserveDirectives(),
            ...(minify ? [terser()] : []),
            ...extraPlugins,
        ]

        return {
            input,
            output,
            plugins,
            external: [
                ...Object.keys(packageJSON?.dependencies || []),
                ...Object.keys(packageJSON?.peerDependencies || []),
                ...builtins,
            ],
        }
    })
}
