import { isString, isObject } from 'lodash';
import webpack from 'webpack';

function addHotClientJS(entry, clientJS) {
    let retEntry;

    if (isString(entry)) {
        retEntry = [clientJS, entry];
    } else if (Array.isArray(entry)) {
        retEntry = [clientJS].concat(entry);
    } else if (isObject(entry)) {
        retEntry = {};
        Object.keys(entry).forEach(key => {
            retEntry[key] = addHotClientJS(entry[key], clientJS);
        });
    }
    return retEntry;
}

function getClientJS(hotClientJS) {
    let clientJS = 'webpack-hot-middleware/client?';
    const _hotClientJS = isObject(hotClientJS) ? { ...hotClientJS } : {};

    if (!isString(_hotClientJS.path)) {
        _hotClientJS.path = '/__webpack_hmr';
    }

    clientJS = Object.keys(_hotClientJS).reduce((clientJS, key, index, arr) => {
        if (key === 'ansiColors' || key === 'overlayStyles') {
            clientJS += `${key}=${encodeURIComponent(JSON.stringify(_hotClientJS[key]))}`;
        } else {
            clientJS += `${key}=${_hotClientJS[key]}`;
        }
        if (arr.length !== index + 1) {
            clientJS += '&';
        }
        return clientJS;
    }, clientJS);

    return clientJS;
}

export default (hotClientJS, webpackConfig) => {
    const clientJS = getClientJS(hotClientJS); // 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true';
    webpackConfig.entry = addHotClientJS(webpackConfig.entry, clientJS);

    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );

    return webpackConfig;
};
