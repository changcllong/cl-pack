const { server } = require('../../dist/index');

server({
    entry: {
        index: './src/index.js'
    },

    css: {
        extractCss: true,
        modules: true
    },

    commonChunks: {
        vendor: ['node_modules']
    },

    dev: {
        options: {
            writeToDisk: true
        }
    }
});
