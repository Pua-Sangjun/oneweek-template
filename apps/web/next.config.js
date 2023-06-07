// @ts-check
const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    distDir: '../dist/client',
    compiler: {
        styledComponents: true,
    },
    typescript: {
        tsconfigPath: '../tsconfig.client.json',
    },
    webpack: ({plugins, ...restConfig}, {webpack}) => {
        return {
            ...restConfig,
            plugins: [...plugins, new webpack.IgnorePlugin({resourceRegExp: /\/__tests__\//})],
            optimization: {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {
                            safari10: true,
                        },
                    }),
                ],
            },
        }
    },
}

module.exports = nextConfig
