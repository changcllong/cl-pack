module.exports = function(config) {
    config.runtimeChunk = {
        name: 'manifest'
    };

    config.commonChunks = {
        vendor: ['node_modules']
    };

    return config;
};
