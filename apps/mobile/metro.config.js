const path = require('path')

const {makeMetroConfig} = require('@rnx-kit/metro-config')
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

module.exports = (async () => {
    return makeMetroConfig({
        projectRoot,
        watchFolders: [workspaceRoot],
        resolver: {
            resolveRequest: MetroSymlinksResolver(),
        },
    })
})()
