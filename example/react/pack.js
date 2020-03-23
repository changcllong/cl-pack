const { build } = require('../../dist/index');
const path = require('path');

build({
    entry: {
        main: './src/index.js'
    },

    css: {
        extractCss: true,
        modules: true
    },

    commonChunks: {
        base: ['node_modules']
    },

    webpack: {
        output: {
            path: path.resolve('./dist'),
            publicPath: '/'
        }
    }
});
