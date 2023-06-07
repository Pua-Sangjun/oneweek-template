import {generateRollupConfig} from '@oneweek/rollup-config'

export default generateRollupConfig({
    entrypoint: 'src/index.ts',
    packageDir: __dirname,
})
