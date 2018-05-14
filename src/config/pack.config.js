import { getContext } from '../util/path';
import path from 'path';

export default {
    CONTEXT: getContext(),
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

    assets: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'mp3',
        'ttf',
        'woff',
        'woff2',
        'eot',
        'svg'
    ],

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
