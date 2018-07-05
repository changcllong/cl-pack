import path from 'path';
import { isObject } from 'util';
import { existsSync } from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import WebpackVisualizerPlugin from 'webpack-visualizer-plugin';
import getExistConfigPath from '../util/getExistConfigPath';

export default (packConfig) => {
    const {
        path: _path,
        publicPath,
        filename,
        chunkFilename,
        library,
        libraryTarget,
        CONTEXT,
        entry,
        resolve,
        target,
        externals,
        commonChunks,
        runtimeChunk,
        html,
        stylelint,
        visualizer
    } = packConfig;

    const webpackConfig = {
        context: CONTEXT,

        resolve: resolve,

        entry: entry
    };

    if (target) {
        webpackConfig.target = target;
    }

    if (externals) {
        webpackConfig.externals = externals;
    }

    webpackConfig.output = {
        path: path.resolve(CONTEXT, _path),
        publicPath,
        filename,
        chunkFilename
    };

    if (library) {
        webpackConfig.output.library = library;
    }

    if (libraryTarget) {
        webpackConfig.output.libraryTarget = libraryTarget;
    }

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

    if (target !== 'node' && isObject(html)) {
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
