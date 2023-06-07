import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import pkg from './package.json'

const config = {
    input: {
        index: 'index.ts',
    },
    output: {
        dir: './dist',
        format: 'esm',
    },
    plugins: [
        typescript({useTsconfigDeclarationDir: true, tsconfig: 'tsconfig.json'}),
        peerDepsExternal(),
        babel({
            babelHelpers: 'bundled',
            exclude: /node_modules/,
            skipPreflightCheck: true,
            extensions: ['.ts', '.tsx'],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: '> 0.25%, not dead, ie >= 11, not op_mini all',
                        useBuiltIns: 'usage',
                        forceAllTransforms: true,
                        corejs: {
                            version: 3.21,
                            proposals: false,
                        },
                    },
                ],
            ],
        }),
    ],
    external: [...Object.keys(pkg.dependencies)],
}

export default config
