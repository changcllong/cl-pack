import { existsSync } from 'fs';
import path from 'path';
import { isFunction, isObject } from 'util';
import webpackMerge from 'webpack-merge';
import { getContext } from './path';
import merge from './mergePackConfig';

export default function getProjectConfig(configName) {
    const context = getContext();
    const configInProject = path.resolve(context, './config', configName);

    if (existsSync(configInProject)) {
        const projectConfig = require(configInProject);

        return projectConfig.default || projectConfig;
    }

    return undefined;
}

export function getPackConfig(env, packConfig) {
    let defaultConfig = require('../config/pack.config');
    defaultConfig = defaultConfig.default || defaultConfig;

    if (isFunction(packConfig)) {
        packConfig = merge(packConfig(defaultConfig), env);
    } else if (isObject(packConfig)) {
        packConfig = merge([defaultConfig, packConfig], env);
    } else {
        packConfig = merge(defaultConfig, env);
    }

    return packConfig;
}

export function getWebpackConfig(env, packConfig, customWebpackConfig) {
    let webpackConfig = env === 'dev' ? require('../config/webpack.dev.config') : require('../config/webpack.prd.config');
    webpackConfig = webpackConfig.default || webpackConfig;
    if (isFunction(webpackConfig)){
        webpackConfig = webpackConfig(packConfig);
    }

    let mergedWebpackConfig;
    if (isFunction(customWebpackConfig)) {
        mergedWebpackConfig = customWebpackConfig(webpackConfig);
    } else if (isObject(customWebpackConfig)) {
        mergedWebpackConfig = webpackMerge(webpackConfig, customWebpackConfig);
    } else {
        mergedWebpackConfig = webpackConfig;
    }

    return mergedWebpackConfig;
}
