const { server } = require('../../dist/index');
const webpack = require('webpack');
const path = require('path');

server({
    entry: {
        main: './src/index.js'
    },

    css: {
        extractCss: true,
        modules: true
    },

    dll: {
        mode: 'development',

        entry: {
            vendor: ['react', 'react-dom']
        },
        output: {
            path: path.resolve('./vendor'),
            filename: '[name].dll.js',
            library: '[name]_library'
        },
        plugins: [
            new webpack.DllPlugin({
                path: path.resolve('./vendor', '[name]-manifest.json'),
                name: '[name]_library'
            })
        ]
    },

    webpack: {
        output: {
            path: path.resolve('./dist'),
            publicPath: '/'
        },
        plugins: [
            new webpack.DllReferencePlugin({
                manifest: path.resolve('./vendor/vendor-manifest.json')
            })
        ]
    },

    dev: {
        options: {
            writeToDisk: true
        }
    }
});
