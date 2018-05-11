'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getProjectConfig;

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _path3 = require('./path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getProjectConfig(configName, packConfig) {
    var defaultConfig = require(_path2.default.join('../config', configName));
    defaultConfig = defaultConfig.default || defaultConfig;

    if (typeof defaultConfig === 'function') {
        defaultConfig = defaultConfig(packConfig);
    }

    var context = (0, _path3.getContext)();
    var configInProject = _path2.default.resolve(context, './config', configName);

    if ((0, _fs.existsSync)(configInProject)) {
        var projectConfig = require(configInProject);
        projectConfig = projectConfig.default || projectConfig;

        return typeof projectConfig === 'function' ? projectConfig(defaultConfig, packConfig) : projectConfig;
    }

    return defaultConfig;
}