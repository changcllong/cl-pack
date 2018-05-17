module.exports = function(config) {
    config.dev.mock = {
        '^/api0$': {from: 'changcllong', message: 'Hello World'},
        '^/api1$': './mock/data.json',
        '^/api2$': {from: 'api2'}
    };

    return config;
};
