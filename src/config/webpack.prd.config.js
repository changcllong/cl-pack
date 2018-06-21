import { isString, isObject } from 'util';
import webpack from 'webpack';
import WebpackMd5Hash from 'webpack-md5-hash';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import WebpackVisualizerPlugin from 'webpack-visualizer-plugin';
import webpackBaseConfig from './webpack.base.config';
import getRules from './webpack.rules.config';

export default (packConfig) => {
    const webpackConfig = webpackBaseConfig(packConfig);
    const {
        path: _path,
        CONTEXT,
        cssFilename,
        minimizer
    } = packConfig;

    webpackConfig.mode = 'production';

    webpackConfig.module.rules = getRules(packConfig, 'prd');

    webpackConfig.plugins.push(new CleanWebpackPlugin([ _path], { root: CONTEXT, verbose: false }));

    webpackConfig.plugins.push(new WebpackMd5Hash());

    webpackConfig.plugins.push(
        new MiniCssExtractPlugin({
            filename: cssFilename
        })
    );

    if (minimizer) {
        const _minimizer = [];
        const {
            js,
            css
        } = minimizer;

        if (js) {
            _minimizer.push(new UglifyJsPlugin(isObject(js) ? js : {}));
        }
        if (css) {
            _minimizer.push(new OptimizeCSSAssetsPlugin(isObject(css) ? css : {}));
        }
    
        webpackConfig.optimization.minimizer = _minimizer;
    }

    return webpackConfig;
};
