'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _util = require('util');

var _fs = require('fs');

var _cleanWebpackPlugin = require('clean-webpack-plugin');

var _cleanWebpackPlugin2 = _interopRequireDefault(_cleanWebpackPlugin);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _stylelintWebpackPlugin = require('stylelint-webpack-plugin');

var _stylelintWebpackPlugin2 = _interopRequireDefault(_stylelintWebpackPlugin);

var _existConfig = require('../util/existConfig');

var _existConfig2 = _interopRequireDefault(_existConfig);

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
        html = packConfig.html,
        stylelint = packConfig.stylelint;


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

    if (stylelint) {
        var stylelintOptions = _extends({
            context: _path3.default.resolve(CONTEXT, 'src')
        }, (0, _util.isObject)(stylelint) ? stylelint : {});
        if (!(stylelintOptions.configFile && (0, _fs.existsSync)(stylelintOptions.configFile))) {
            stylelintOptions.configFile = (0, _existConfig2.default)('stylelint', CONTEXT) || (0, _existConfig2.default)('stylelint', __dirname);
        }

        webpackConfig.plugins.push(new _stylelintWebpackPlugin2.default(stylelintOptions));
    }

    Object.keys(html).forEach(function (name) {
        webpackConfig.plugins.push(new _htmlWebpackPlugin2.default({
            filename: name + '.html',
            template: html[name].template,
            chunks: html[name].chunks
        }));
    });

    return webpackConfig;
};