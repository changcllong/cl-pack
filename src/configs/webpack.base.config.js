import path from 'path';
import { isObject } from 'lodash';
// import { existsSync } from 'fs';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

export default (packConfig) => {
    const {
        mode,
        context,
        hash,
        entry,
        commonChunks,
        minimizer,
        css
    } = packConfig;
    const { stylelint, extractCss } = css;

    const webpackConfig = {
        mode,
        context,
        entry
    };

    // if (target) {
    //     webpackConfig.target = target;
    // }

    // if (externals) {
    //     webpackConfig.externals = externals;
    // }

    webpackConfig.output = {
        path: path.resolve(context, 'dist'),
        publicPath: '',
        filename: hash ? '[name]@[chunkhash].js' : '[name].js',
        chunkFilename: hash ? '[name]@[chunkhash].js' : '[name].js'
    };

    // if (library) {
    //     webpackConfig.output.library = library;
    // }

    // if (libraryTarget) {
    //     webpackConfig.output.libraryTarget = libraryTarget;
    // }
    const optimization = {
        minimize: false
    };

    if (isObject(commonChunks)) {
        const cacheGroups = {};

        Object.keys(commonChunks).forEach(chunkName => {
            const pattern = commonChunks[chunkName].join('|');
            cacheGroups[chunkName] = {
                chunks: 'all',
                test: new RegExp(`(${pattern})`),
                name: chunkName,
                priority: 10,
                enforce: true
            }
        });

        optimization.runtimeChunk = {
            name: 'manifest'
        };

        optimization.splitChunks = {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: cacheGroups
        };
    }

    if (minimizer) {
        optimization.minimize = true;
        optimization.minimizer = [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin()
        ];
    }

    webpackConfig.optimization = optimization;

    // if (devtool) {
    //     webpackConfig.devtool = devtool;
    // }

    // webpackConfig.module = {};

    webpackConfig.plugins = [
        new CleanWebpackPlugin({ verbose: true })
    ];

    if (stylelint) {
        // const stylelintOptions = {
        //     context: path.resolve(CONTEXT, 'src'),
        //     ...isObject(stylelint) ? stylelint : {}
        // };
        // if (!(stylelintOptions.configFile && existsSync(stylelintOptions.configFile))) {
        //     stylelintOptions.configFile = getExistConfigPath('stylelint', CONTEXT) || getExistConfigPath('stylelint', __dirname);
        // }

        webpackConfig.plugins.push(new StylelintWebpackPlugin(isObject(stylelint) ? stylelint : undefined));
    }

    if (extractCss) {
        webpackConfig.plugins.push(new MiniCssExtractPlugin({
            filename: hash ? '[name]@[contenthash].css' : '[name].css'
        }))
    }

    // if (target !== 'node' && isObject(html)) {
    //     Object.keys(html).forEach(name => {
    //         webpackConfig.plugins.push(new HtmlWebpackPlugin({
    //             filename: `${name}.html`,
    //             template: html[name].template,
    //             chunks: html[name].chunks
    //         }));
    //     });
    // }

    // if (visualizer) {
    //     webpackConfig.plugins.push(new WebpackVisualizerPlugin());
    // }

    return webpackConfig;
};
