import path from 'path';
import { isObject } from 'util';
import { existsSync } from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import getExistConfigPath from '../util/existConfig';

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
        html,
        stylelint,
        visualizer
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
        // new CleanWebpackPlugin([ _path], { root: CONTEXT, verbose: false })
    ];

    if (stylelint) {
        const stylelintOptions = {
            context: path.resolve(CONTEXT, 'src'),
            ...isObject(stylelint) ? stylelint : {},
        };
        if (!(stylelintOptions.configFile && existsSync(stylelintOptions.configFile))) {
            stylelintOptions.configFile = getExistConfigPath('stylelint', CONTEXT) || getExistConfigPath('stylelint', __dirname);
        }

        webpackConfig.plugins.push(new StylelintWebpackPlugin(stylelintOptions));
    }

    if (isObject(html)) {
        Object.keys(html).forEach(name => {
            webpackConfig.plugins.push(new HtmlWebpackPlugin({
                filename: `${name}.html`,
                template: html[name].template,
                chunks: html[name].chunks
            }));
        });
    }

    if (visualizer) {
        webpackConfig.plugins.push(new WebpackVisualizerPlugin());
    }

    return webpackConfig;
};
