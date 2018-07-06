import { isString, isObject } from 'util';
import webpack from 'webpack';
import webpackBaseConfig from './webpack.base.config';
import getRules from './webpack.rules.config';

function addHotClientJS(entry, clientJS) {
    let _entry;
    if (isString(entry)) {
        _entry = [ clientJS, entry ];
    } else if (Array.isArray(entry)) {
        _entry = [ clientJS ].concat(entry);
    } else if (isObject(entry)) {
        _entry = {};
        Object.keys(entry).forEach(key => {
            _entry[key] = addHotClientJS(entry[key], clientJS);
        });
    }
    return _entry;
}

function getClientJS(hotClientJS) {
    let clientJS = 'webpack-hot-middleware/client?';
    let _hotClientJS;
    if (isObject(hotClientJS)) {
        _hotClientJS = Object.assign({}, hotClientJS);
    } else {
        _hotClientJS = {};
    }
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

export default (packConfig) => {
    const {
        hot,
        hotClientJS
    } = packConfig;
    const webpackConfig = webpackBaseConfig(packConfig);

    webpackConfig.mode = 'development';

    webpackConfig.module.rules = getRules(packConfig, 'dev');

    if (hot) {
        const clientJS = getClientJS(hotClientJS); // 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true';
        webpackConfig.entry = addHotClientJS(webpackConfig.entry, clientJS);

        webpackConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
    }

    return webpackConfig;
};
