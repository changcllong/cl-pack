'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('../util/path');

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    CONTEXT: (0, _path.getContext)(),
    path: './dist',
    publicPath: 'http://localhost:8080/assets/',

    filename: '[name].js',
    chunkFilename: '[name].js',

    entry: {
        index: ['./src/index.js']
    },

    // js: ['jsx'],

    // css: ['sass'],

    eslint: false,

    assets: ['jpg', 'jpeg', 'png', 'gif', 'mp3', 'ttf', 'woff', 'woff2', 'eot', 'svg'],

    html: {
        index: {
            template: 'template/index.html',
            chunks: ['index']
        }
    },

    runtimeChunk: false,

    commonChunks: {
        // vendor: [
        //     'react',
        //     'react-dom'
        // ]
    },

    dev: {
        port: 8080,
        hot: true,
        staticPath: './assets',
        mockPath: './mock'
    },

    prd: {
        filename: '[name]@[chunkhash].js',
        chunkFilename: '[name]@[chunkhash].js',
        cssFilename: '[name]@[contenthash].css'
    }
};