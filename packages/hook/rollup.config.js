import {generateRollupConfig} from '@oneweek-share/rollup-config'

export default generateRollupConfig({
    entrypoint: 'src/index.ts',
    packageDir: __dirname,
})
