'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getJSRule = getJSRule;
exports.getCSSRule = getCSSRule;
exports.getAssetsRule = getAssetsRule;
exports.default = getRules;

var _fs = require('fs');

var _util = require('util');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _miniCssExtractPlugin = require('mini-css-extract-plugin');

var _miniCssExtractPlugin2 = _interopRequireDefault(_miniCssExtractPlugin);

var _existConfig = require('../util/existConfig');

var _existConfig2 = _interopRequireDefault(_existConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getJSRule(packConfig, env) {
    var eslint = packConfig.eslint;

    var rule = {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/
    };
    if (eslint) {
        var eslintRule = {
            loader: 'eslint-loader'
        };
        if ((0, _util.isObject)(eslint)) {
            eslintRule.options = eslint;
        }
        rule.use.push(eslintRule);
    }

    return rule;
}

function getCSSRule(packConfig, env) {
    var CONTEXT = packConfig.CONTEXT,
        css = packConfig.css,
        postcss = packConfig.postcss;


    var cssOption = _extends({}, css, env === 'prd' ? {
        minimize: { minifyFontValues: false }
    } : {});

    var postcssOption = void 0;
    if (postcss) {
        postcssOption = (0, _util.isObject)(postcss) ? postcss : {};

        if (!(postcss.config && (0, _util.isString)(postcss.config.path) && (0, _fs.existsSync)(_path2.default.resolve(CONTEXT, postcss.config.path)))) {
            postcssOption.config = postcss.config || {};
            postcssOption.config.path = (0, _existConfig2.default)('postcss', CONTEXT) || (0, _existConfig2.default)('postcss', __dirname);
        }
    }

    var rules = [{
        test: /\.css$/i,
        use: [env === 'prd' ? _miniCssExtractPlugin2.default.loader : 'style-loader', {
            loader: 'css-loader',
            options: cssOption
        }].concat(_toConsumableArray(postcss ? [{
            loader: 'postcss-loader',
            options: postcssOption
        }] : []))
    }, {
        test: /\.(scss|sass)$/i,
        use: [env === 'prd' ? _miniCssExtractPlugin2.default.loader : 'style-loader', {
            loader: 'css-loader',
            options: cssOption
        }].concat(_toConsumableArray(postcss ? [{
            loader: 'postcss-loader',
            options: postcssOption
        }] : []), ['sass-loader'])
    }, {
        test: /\.less$/i,
        use: [env === 'prd' ? _miniCssExtractPlugin2.default.loader : 'style-loader', {
            loader: 'css-loader',
            options: cssOption
        }].concat(_toConsumableArray(postcss ? [{
            loader: 'postcss-loader',
            options: postcssOption
        }] : []), ['less-loader'])
    }];

    return rules;
}

function getAssetsRule(packConfig, env) {
    var assets = packConfig.assets;

    var rules = [];

    if ((0, _util.isObject)(assets)) {
        Object.keys(assets).forEach(function (asset) {
            var options = (0, _util.isObject)(assets[asset]) ? assets[asset] : {};
            if (!options.name) {
                options.name = env === 'prd' ? '[path][name]@[hash].[ext]' : '[path][name].[ext]';
            }
            rules.push({
                test: new RegExp('.(' + asset + ')$', 'i'),
                loader: 'file-loader',
                options: options
            });
        });
    }

    return rules;
}

function getRules(packConfig, env) {

    var rules = [getJSRule(packConfig, env)].concat(_toConsumableArray(getCSSRule(packConfig, env)), _toConsumableArray(getAssetsRule(packConfig, env)));

    return rules;
}