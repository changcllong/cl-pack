import { existsSync } from 'fs';
import path from 'path';
import { getContext } from './path';

export default function getProjectConfig(configName, packConfig) {
    let defaultConfig = require(path.join('../config', configName));
    defaultConfig = defaultConfig.default || defaultConfig;

    if (typeof defaultConfig === 'function') {
        defaultConfig = defaultConfig(packConfig);
    }

    const context = getContext();
    const configInProject = path.resolve(context, './config', configName);

    if (existsSync(configInProject)) {
        let projectConfig = require(configInProject);
        projectConfig = projectConfig.default || projectConfig;

        return typeof projectConfig === 'function' ?
            projectConfig(defaultConfig, packConfig) :
            projectConfig;
    }

    return defaultConfig;
}
