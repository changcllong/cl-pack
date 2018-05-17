import { isString, isObject } from 'util';
import webpack from 'webpack';
import webpackBaseConfig from './webpack.base.config';
import getRules from './webpack.rules.config';

function addHotClientJS(entry) {
    const clientJS = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true';

    if (isString(entry)) {
        entry = [clientJS, entry];
    } else if (Array.isArray(entry)) {
        entry.unshift(clientJS);
    } else if (isObject(entry)) {
        Object.keys(entry).forEach(key => {
            entry[key] = addHotClientJS(entry[key]);
        })
    }
    return entry;
}

export default (packConfig) => {
    const webpackConfig = webpackBaseConfig(packConfig);

    webpackConfig.mode = 'development';

    webpackConfig.module.rules = getRules(packConfig, 'dev');

    if (packConfig.hot) {
        addHotClientJS(webpackConfig.entry);

        webpackConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
    }

    return webpackConfig;
};
