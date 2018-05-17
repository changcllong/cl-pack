'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = require('util');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackBase = require('./webpack.base.config');

var _webpackBase2 = _interopRequireDefault(_webpackBase);

var _webpackRules = require('./webpack.rules.config');

var _webpackRules2 = _interopRequireDefault(_webpackRules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addHotClientJS(entry) {
    var clientJS = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true';

    if ((0, _util.isString)(entry)) {
        entry = [clientJS, entry];
    } else if (Array.isArray(entry)) {
        entry.unshift(clientJS);
    } else if ((0, _util.isObject)(entry)) {
        Object.keys(entry).forEach(function (key) {
            entry[key] = addHotClientJS(entry[key]);
        });
    }
    return entry;
}

exports.default = function (packConfig) {
    var webpackConfig = (0, _webpackBase2.default)(packConfig);

    webpackConfig.mode = 'development';

    webpackConfig.module.rules = (0, _webpackRules2.default)(packConfig, 'dev');

    if (packConfig.hot) {
        addHotClientJS(webpackConfig.entry);

        webpackConfig.plugins.push(new _webpack2.default.HotModuleReplacementPlugin());
    }

    return webpackConfig;
};