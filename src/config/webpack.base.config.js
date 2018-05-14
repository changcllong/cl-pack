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
