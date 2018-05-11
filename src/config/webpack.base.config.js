import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default (packConfig) => {
    const {
        path: _path,
        publicPath,
        filename,
        chunkFilename,
        CONTEXT,
        entry,
        commonChunks,
        runtimeChunk,
        html
    } = packConfig;

    const webpackConfig = {
        context: CONTEXT,

        resolve: {
            extensions: ['.js', '.jsx'], // 同时支持 js 和 jsx
        },

        entry: entry
    };

    webpackConfig.output = {
        path: path.resolve(CONTEXT, _path),
        publicPath,
        filename,
        chunkFilename
    };

    const cacheGroups = {};

    Object.keys(commonChunks).forEach(chunkName => {
        const pattern = commonChunks[chunkName].join('|');
        cacheGroups[chunkName] = {
            test: new RegExp(`(${pattern})`),
            name: chunkName,
            priority: 10,
            chunks: 'initial',
            enforce: true
        }
    });

    webpackConfig.module = {};

    webpackConfig.optimization = {
        runtimeChunk: runtimeChunk,
        splitChunks: {
            chunks: "async",
            minSize: 50000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: cacheGroups
        }
    };

    webpackConfig.plugins = [
        new CleanWebpackPlugin([path.resolve(CONTEXT, _path)], { verbose: false })
    ];

    Object.keys(html).forEach(name => {
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: html[name].template,
            chunks: html[name].chunks
        }));
    });

    return webpackConfig;
};

// module.exports = {
//     context: SRC_PATH,

//     resolve: {
//         extensions: ['.js', '.jsx'], // 同时支持 js 和 jsx
//     },

//     entry: {
//         index: ['./pages/index.js']
//     },

//     output: {
//         path: ASSETS_BUILD_PATH,
//         publicPath: ASSETS_PUBLIC_PATH,
//         filename: '[name].js',
//         chunkFilename: '[name].js',
//     },

//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 use: [
//                     'babel-loader'
//                 ],
//                 exclude: /node_modules/
//             },
//             {
//                 test: /\.(png|jpg|gif)$/,
//                 use: [
//                     {
//                         loader: 'url-loader',
//                         options: {
//                             limit: 8192,
//                             name: 'images/[name].[ext]'
//                         }
//                     }
//                 ]
//             },
//             {
//                 test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
//                 use: [
//                     {
//                         loader: 'url-loader',
//                         options: {
//                             limit: 8192,
//                             mimetype: 'application/font-woff',
//                             name: 'fonts/[name].[ext]'
//                         }
//                     }
//                 ]
//             },
//             {
//                 test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             limit: 8192,
//                             mimetype: 'application/font-woff',
//                             name: 'fonts/[name].[ext]'
//                         }
//                     }
//                 ]
//             }
//         ]
//     },

//     optimization: {
//         runtimeChunk: {
//             name: 'manifest'
//         },
//         splitChunks: {
//             chunks: "async",
//             minSize: 50000,
//             minChunks: 1,
//             maxAsyncRequests: 5,
//             maxInitialRequests: 3,
//             name: true,
//             cacheGroups: {
//                 vendors: {
//                     name: 'vendor',
//                     test: /[\\/]node_modules[\\/]/,
//                     chunks: 'initial',
//                     priority: -10,
//                     enforce: true
//                 }
//             }
//         }
//     },

//     plugins: [
//         new CleanWebpackPlugin([ASSETS_BUILD_PATH], { verbose: false })
//     ]
// };
