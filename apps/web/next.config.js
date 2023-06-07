/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    distDir: '../dist/client',
    typescript: {
        tsconfigPath: '../tsconfig.client.json',
    },
}

module.exports = nextConfig
