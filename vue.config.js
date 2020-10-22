// const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const PrerenderSPAPlugin = require('prerender-spa-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path');
const resolve = (dir) => {
    return path.join(__dirname, dir)
}
const copyStatic = (NODE_ENV) => {
    let arr = [];
    if (NODE_ENV === 'production') {
        arr.push({ source: resolve('public'), destination: resolve('deploy/canvas-front/dist') });
    } else if (NODE_ENV === 'staging') {
        arr.push({ source: resolve('dist'), destination: resolve('deploy/canvas-front/dist') })
    }
    return arr;
}
const bundlePlugin = (NODE_ENV) => {
    let plugins;
    if (['production', 'staging'].includes(NODE_ENV)) {
        plugins = [
            // Gzip
            new CompressionPlugin({
                test: /\.(js|css|html|svg)$/,
                threshold: 10240,
                deleteOriginalAssets: false,
            }),
            new FileManagerPlugin({
                onStart: {
                    delete: [
                        resolve('/deploy'),
                    ]
                },
                onEnd: {
                    mkdir: [
                        resolve('/deploy/canvas-front'),
                    ],
                }
            })
        ]
    } else {
        plugins = []
    }
    return plugins
}
module.exports = {
    runtimeCompiler: true,
    productionSourceMap: false,
    configureWebpack: {
        plugins: bundlePlugin(process.env.NODE_ENV),
        resolve: {
            extensions: ['.js', '.ts', '.tsx', '.vue', '.json'],
            alias: {
                '@': resolve('src'),
            },
        },
    },
    devServer: {},
    css: {
        extract: ['production', 'staging'].includes(process.env.NODE_ENV) ? true : false,
        loaderOptions: {
            postcss: {
                plugins: [
                    require("postcss-sprites")({
                        basePath: './src/assets/sprites-icon/',
                        spritePath: process.env.NODE_ENV === "staging" ? './dist/img/sprites' : './canvashtml/img/sprites',
                        retina: true,
                        filterBy: function (image) {
                            if (image.url.includes('sprites-icon')) {
                                if (!/\.png$/.test(image.url)) {
                                    return Promise.reject(new Error('Allow only png files'));
                                }
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Allow only png files'));
                        },
                        groupBy: function (image) {
                            const spritesPaths = image.url.split('sprites-icon');
                            if (spritesPaths.length > 1) {
                                const spritesImagePaths = spritesPaths[1].split('/').filter(i => i != '');
                                const groupName = spritesImagePaths[0];
                                return Promise.resolve(groupName);

                            } else {
                                return Promise.reject(new Error('Not a group name.'));
                            }
                        }
                    })
                ]
            }
        }
    },
    chainWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            config.plugin("copy").tap(args => {
                args[0].push({
                    from: require("path").resolve("location.js"),
                    to: require("path").resolve("canvashtml")
                });
                return args;
            })
        }
        config.plugin("html").tap(args => {
            args[0].title = 'Component Live Viewer'
            return args
        })
    },
}