import { isArray, isObject } from 'util';

export default function merge(configs, env) {
    if (!isArray(configs)) {
        configs = [configs];
    }
    configs.forEach(config => {
        if (isObject(config[env])) {
            Object.keys(config[env]).forEach(key => {
                config[key] = config[env][key];
            });
        }
    });

    const _config = {};
    configs.reduce((resultConfig, config) => {
        Object.keys(config).forEach(key => {
            resultConfig[key] = config[key];
        });
        return resultConfig;
    }, _config);

    return _config;
}
