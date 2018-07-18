import { getContext } from '../util/path';

export default {
    CONTEXT: getContext(),
    path: './dist',
    publicPath: '',

    filename: '[name].js',
    chunkFilename: '[name].js',
    library: '',
    libraryTarget: '',

    entry: {
        index: ['./src/index.js']
    },

    resolve: {},

    target: 'web',

    externals: false,

    stylelint: {
        files: ['**/*.css', '**/*.less', '**/*.s?(a|c)ss']
    },

    eslint: false,

    // 用于配置file-loader
    assets: {
        'jpg|jpeg|png|gif|mp3|ttf|woff|woff2|eot|svg': {}
    },

    // 用于配置HtmlWebpackPlugin
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

        hotClientJS: {
            path: '/__webpack_hmr',
            timeout: 10000,
            reload: true,
        },

        devtool: 'eval-source-map',

        /**
         * '^/index0$': 'http://localhost:8080/index.html'
         * '^/index1$': '/index.html'
         */
        proxy: {},

        /**
         * '^/api0$': {from: 'changcllong', message: 'Hello World'}
         * '^/api1$': './mock/data.json'
         */
        mock: {}
    },

    prd: {
        filename: '[name]@[chunkhash].js',
        chunkFilename: '[name]@[chunkhash].js',
        cssFilename: '[name]@[contenthash].css',

        // js、css压缩配置
        minimizer: {
            // 配置UglifyJsPlugin
            js: {
                cache: true,
                parallel: true,
                sourceMap: false
            },
            // 配置optimize-css-assets-webpack-plugin
            css: {}
        }
    }
};
