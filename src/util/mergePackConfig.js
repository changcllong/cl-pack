import { isArray } from 'util';

export default function merge(configs, env) {
    if (!isArray(configs)) {
        configs = [configs];
    }
    configs.forEach(config => {
        Object.keys(config[env]).forEach(key => {
            config[key] = config[env][key];
        });
    });

    const _config = {};
    configs.reduce((resultConfig, config) => {
        Object.keys(config).forEach(key => {
            resultConfig[key] = config[key];
        })
    }, _config);

    return _config;
}
