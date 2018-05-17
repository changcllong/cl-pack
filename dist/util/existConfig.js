'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getExistConfigPath;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getExistConfigPath(filename, dir) {
    var names = ['.' + filename + 'rc.js', '.' + filename + 'rc', filename + '.config.js'];
    var configPath = void 0;
    for (var i = 0; i < names.length; i++) {
        configPath = _path2.default.join(dir, names[i]);
        if ((0, _fs.existsSync)(configPath)) {
            return configPath;
        }
    }
    return undefined;
}