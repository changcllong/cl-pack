'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getJsRule = getJsRule;
exports.default = getRules;

var _miniCssExtractPlugin = require('mini-css-extract-plugin');

var _miniCssExtractPlugin2 = _interopRequireDefault(_miniCssExtractPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getJsRule(packConfig, env) {
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
        if ((typeof eslint === 'undefined' ? 'undefined' : _typeof(eslint)) === 'object') {
            eslintRule.options = eslint;
        }
        rule.use.push(eslintRule);
    }

    return rule;
}

function getRules(packConfig, env) {
    var js = packConfig.js,
        css = packConfig.css;


    var rules = [getJsRule(packConfig, env), {
        test: /\.(css|scss)$/,
        use: [env === 'prd' ? _miniCssExtractPlugin2.default.loader : 'style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/
    }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 8192,
                name: 'images/[name].[ext]'
            }
        }]
    }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 8192,
                mimetype: 'application/font-woff',
                name: 'fonts/[name].[ext]'
            }
        }]
    }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
            loader: 'file-loader',
            options: {
                limit: 8192,
                mimetype: 'application/font-woff',
                name: 'fonts/[name].[ext]'
            }
        }]
    }];

    return rules;
}