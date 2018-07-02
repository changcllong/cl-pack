const CLPack = require('../../index');
const nodeExternals = require('webpack-node-externals');

const pack = new CLPack({
    filename: '[name].js',
    target: 'node',
    externals: [nodeExternals({modulesDir: '../../node_modules'})],
    html: false,
    minimizer: false
});

pack.build();
