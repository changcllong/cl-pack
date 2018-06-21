'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = require('util');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackMd5Hash = require('webpack-md5-hash');

var _webpackMd5Hash2 = _interopRequireDefault(_webpackMd5Hash);

var _cleanWebpackPlugin = require('clean-webpack-plugin');

var _cleanWebpackPlugin2 = _interopRequireDefault(_cleanWebpackPlugin);

var _miniCssExtractPlugin = require('mini-css-extract-plugin');

var _miniCssExtractPlugin2 = _interopRequireDefault(_miniCssExtractPlugin);

var _optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

var _optimizeCssAssetsWebpackPlugin2 = _interopRequireDefault(_optimizeCssAssetsWebpackPlugin);

var _uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

var _uglifyjsWebpackPlugin2 = _interopRequireDefault(_uglifyjsWebpackPlugin);

var _webpackVisualizerPlugin = require('webpack-visualizer-plugin');

var _webpackVisualizerPlugin2 = _interopRequireDefault(_webpackVisualizerPlugin);

var _webpackBase = require('./webpack.base.config');

var _webpackBase2 = _interopRequireDefault(_webpackBase);

var _webpackRules = require('./webpack.rules.config');

var _webpackRules2 = _interopRequireDefault(_webpackRules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (packConfig) {
    var webpackConfig = (0, _webpackBase2.default)(packConfig);
    var _path = packConfig.path,
        CONTEXT = packConfig.CONTEXT,
        cssFilename = packConfig.cssFilename,
        minimizer = packConfig.minimizer;


    console.log(cssFilename);

    webpackConfig.mode = 'production';

    webpackConfig.module.rules = (0, _webpackRules2.default)(packConfig, 'prd');

    webpackConfig.plugins.push(new _cleanWebpackPlugin2.default([_path], { root: CONTEXT, verbose: false }));

    webpackConfig.plugins.push(new _webpackMd5Hash2.default());

    webpackConfig.plugins.push(new _miniCssExtractPlugin2.default({
        filename: cssFilename
        // chunkFilename: "[name].chunk@[contenthash].css"
    }));

    if (minimizer) {
        var _minimizer = [];
        var js = minimizer.js,
            css = minimizer.css;


        if (js) {
            _minimizer.push(new _uglifyjsWebpackPlugin2.default((0, _util.isObject)(js) ? js : {}));
        }
        if (css) {
            _minimizer.push(new _optimizeCssAssetsWebpackPlugin2.default((0, _util.isObject)(css) ? css : {}));
        }

        webpackConfig.optimization.minimizer = _minimizer;
    }

    return webpackConfig;
};