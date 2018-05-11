'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackBase = require('./webpack.base.config');

var _webpackBase2 = _interopRequireDefault(_webpackBase);

var _webpackRules = require('./webpack.rules.config');

var _webpackRules2 = _interopRequireDefault(_webpackRules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (packConfig) {
    var webpackConfig = (0, _webpackBase2.default)(packConfig);

    webpackConfig.mode = 'development';

    webpackConfig.module.rules = (0, _webpackRules2.default)(packConfig, 'dev');

    if (packConfig.hot) {
        Object.keys(webpackConfig.entry).forEach(function (entryName) {
            webpackConfig.entry[entryName].unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true');
        });

        webpackConfig.plugins.push(new _webpack2.default.HotModuleReplacementPlugin());
    }

    return webpackConfig;
};