"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = requireUncached;
function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}