const fs = require('fs')

const Terser = require('terser')
const glob = require('glob')

async function minifyFiles(path) {
    const targetPath = `${path}/**/*.js`
    const filePaths = glob.sync(targetPath)

    for await (const filePath of filePaths) {
        try {
            const compressedFile = await Terser.minify(fs.readFileSync(filePath, 'utf8'), {
                mangle: true,
                compress: true,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                keep_classnames: true,
                safari10: true,
            })
            fs.writeFileSync(filePath, compressedFile.code)
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(`${filePath}를 minify 하는 과정에서 에러가 발생했습니다.`, e)
            process.exit(1)
        }
    }
}

const [, , dirPath] = process.argv

const files = minifyFiles(dirPath)

minifyFiles(files)
