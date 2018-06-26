import { getContext } from '../util/path';

export default {
    CONTEXT: getContext(),
    path: './dist',
    publicPath: '',

    filename: '[name].js',
    chunkFilename: '[name].js',

    entry: {
        index: ['./src/index.js']
    },

    stylelint: {
        files: ['**/*.css', '**/*.less', '**/*.s?(a|c)ss']
    },

    eslint: false,

    assets: {
        'jpg|jpeg|png|gif|mp3|ttf|woff|woff2|eot|svg': {}
    },

    html: {
        index: {
            template: 'template/index.html'
        }
    },

    runtimeChunk: false,

    commonChunks: {
    },

    visualizer: false,

    dev: {
        port: 8080,
        hot: true,
        staticPath: './assets',

        // '^/index0$': 'http://localhost:8080/index.html',
        // '^/index1$': '/index.html'
        proxy: {},

        // '^/api0$': {from: 'changcllong', message: 'Hello World'},
        // '^/api1$': './mock/data.json'
        mock: {}
    },

    prd: {
        filename: '[name]@[chunkhash].js',
        chunkFilename: '[name]@[chunkhash].js',
        cssFilename: '[name]@[contenthash].css',

        minimizer: {
            js: {
                cache: true,
                parallel: true,
                sourceMap: false
            },
            css: {}
        }
    }
};
