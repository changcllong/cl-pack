'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cleanWebpackPlugin = require('clean-webpack-plugin');

var _cleanWebpackPlugin2 = _interopRequireDefault(_cleanWebpackPlugin);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (packConfig) {
    var _path = packConfig.path,
        publicPath = packConfig.publicPath,
        filename = packConfig.filename,
        chunkFilename = packConfig.chunkFilename,
        CONTEXT = packConfig.CONTEXT,
        entry = packConfig.entry,
        commonChunks = packConfig.commonChunks,
        runtimeChunk = packConfig.runtimeChunk,
        html = packConfig.html;


    var webpackConfig = {
        context: CONTEXT,

        resolve: {
            extensions: ['.js', '.jsx'] // 同时支持 js 和 jsx
        },

        entry: entry
    };

    webpackConfig.output = {
        path: _path3.default.resolve(CONTEXT, _path),
        publicPath: publicPath,
        filename: filename,
        chunkFilename: chunkFilename
    };

    var cacheGroups = {};

    Object.keys(commonChunks).forEach(function (chunkName) {
        var pattern = commonChunks[chunkName].join('|');
        cacheGroups[chunkName] = {
            test: new RegExp('(' + pattern + ')'),
            name: chunkName,
            priority: 10,
            chunks: 'initial',
            enforce: true
        };
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

    webpackConfig.plugins = [new _cleanWebpackPlugin2.default([_path3.default.resolve(CONTEXT, _path)], { verbose: false })];

    Object.keys(html).forEach(function (name) {
        webpackConfig.plugins.push(new _htmlWebpackPlugin2.default({
            filename: name + '.html',
            template: html[name].template,
            chunks: html[name].chunks
        }));
    });

    return webpackConfig;
};