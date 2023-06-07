import {generateRollupConfig} from '@oneweek/rollup-config'

export default generateRollupConfig({
    entrypoint: 'index.ts',
    packageDir: __dirname,
    configModules: ['cjs', 'esm'],
})
