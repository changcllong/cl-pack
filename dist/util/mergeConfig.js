"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = merge;
function merge(config, env) {
    Object.keys(config[env]).forEach(function (key) {
        config[key] = config[env][key];
    });
}