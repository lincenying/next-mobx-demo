/* eslint-disable no-inline-comments */
const path = require('path')
const withLess = require('@zeit/next-less')
const withCss = require('@zeit/next-css')
const commonsChunkConfig = require('@zeit/next-css/commons-chunk-config')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

if (typeof require !== 'undefined') {
    require.extensions['.css'] = () => {}
}

const css = withCss({
    webpack: (config, { dev, isServer }) => {
        // 浏览器端
        if (!isServer) {
            config.resolve.alias['~api'] = path.join(__dirname, 'api/index-client.js')
        } else {
            config.resolve.alias['~api'] = path.join(__dirname, 'api/index-server.js')
        }
        config.resolve.alias['@'] = path.join(__dirname)
        // config.node = {
        //     fs: 'empty',
        //     child_process: 'empty'
        // }
        /* Enable only in Production */
        if (!dev) {
            // Service Worker
            const oldEntry = config.entry
            config.entry = () =>
                oldEntry().then(entry => {
                    if (entry['main.js']) entry['main.js'].push(path.resolve('./utils/offline'))
                    return entry
                })
            config.plugins.push(
                new SWPrecacheWebpackPlugin({
                    cacheId: 'next-demo',
                    filepath: './static/sw.js',
                    minify: true,
                    staticFileGlobsIgnorePatterns: [/\.next\//],
                    staticFileGlobs: [
                        'static/**/*' // Precache all static files by default
                    ],
                    runtimeCaching: [
                        // Example with different handlers
                        {
                            handler: 'fastest',
                            urlPattern: /[.](png|jpg|css)/
                        },
                        {
                            handler: 'networkFirst',
                            urlPattern: /^http.*/ //cache all files
                        }
                    ]
                })
            )
        }
        config = commonsChunkConfig(config, /\.(less|css)$/)
        return config
    }
})

module.exports = withLess(css)
