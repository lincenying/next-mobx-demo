/* eslint-disable no-inline-comments */
const path = require('path')
const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')
// const commonsChunkConfig = require('@zeit/next-css/commons-chunk-config')
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
        if (isServer) {
            const antStyles = /antd\/.*?\/style\/css.*?/
            const origExternals = [...config.externals]
            config.externals = [
                (context, request, callback) => {
                    if (request.match(antStyles)) return callback()
                    if (typeof origExternals[0] === 'function') {
                        origExternals[0](context, request, callback)
                    } else {
                        callback()
                    }
                },
                ...(typeof origExternals[0] === 'function' ? [] : origExternals)
            ]

            config.module.rules.unshift({
                test: antStyles,
                use: 'null-loader'
            })
        }

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
                    filepath: './public/static/sw.js',
                    templateFilePath: './sw.tmpl.tpl',
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
        // config = commonsChunkConfig(config, /\.(less|css)$/)
        return config
    }
})

module.exports = withSass(css)
