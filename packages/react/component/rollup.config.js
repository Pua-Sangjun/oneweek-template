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
        exports: 'named',
        format: 'esm',
        interop: 'esModule',
    },
    plugins: [
        typescript({useTsconfigDeclarationDir: true, tsconfig: 'tsconfig.json'}),
        peerDepsExternal(),
        babel({
            babelHelpers: 'bundled',
            exclude: /node_modules/,
            skipPreflightCheck: true,
            extensions: ['.ts', '.tsx'],
        }),
    ],
    external: [...Object.keys(pkg.dependencies)],
}

export default config
