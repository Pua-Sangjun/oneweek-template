/* eslint-disable @typescript-eslint/naming-convention */
const PROFILES = {
    local: {
        instances: 1,
    },
    dev: {
        instances: 1,
    },
    real: {
        instances: 2,
        out_file: '/dev/null',
        error_file: '/dev/null',
    },
}

function createPm2Config() {
    const profile = process.env.PROFILE || 'local'
    const envConfig = PROFILES[profile]
    return {
        /** @type {Array<import('pm2').StartOptions>} */
        apps: [
            {
                name: 'oneweek-template',
                script: 'dist/server/main.js',
                cwd: './',
                interpreter: 'node',
                exec_mode: 'cluster',
                max_restarts: 5,
                min_uptime: 5000,
                log_date_format: '<YYYY-MM-DD HH:mm:ss>',
                env: {
                    NODE_ENV: 'development', // TODO : production으로 바꿔줘야됨
                    PROFILE: profile,
                },
                watch: false,
                ...envConfig,
            },
        ],
    }
}
// eslint-disable-next-line no-console
console.log(JSON.stringify(createPm2Config(), null, '\t'))

module.exports = createPm2Config()
