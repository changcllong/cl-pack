const path = require('path');

module.exports = {
    entry: {
        main: './src/index.js'
    },

    css: {
        extractCss: true,
        modules: true
    },

    minimizer: true,

    hash: true,

    commonChunks: {
        base: ['node_modules']
    },

    webpack: {
        output: {
            path: path.resolve('./dist'),
            publicPath: '/'
        }
    }
}
