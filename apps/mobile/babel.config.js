const tsconfig = require('./tsconfig.json')

const {baseUrl = 'src', paths = {}} = tsconfig.compilerOptions

const alias = Object.entries(paths).map((customAliasPath) => {
    const [rawPath, [rawRelativePath]] = customAliasPath
    const path = rawPath.replace('/*', '')
    const relativePath = `${baseUrl}/${rawRelativePath.replace('/*', '')}`
    return {
        rootPathPrefix: path,
        rootPathSuffix: relativePath,
    }
})

module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [['babel-plugin-root-import', {paths: alias}], 'react-native-reanimated/plugin'],
}
