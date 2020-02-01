'use strict';

var CLPack = require('./dist');
CLPack = CLPack.default || CLPack;

exports.build = CLPack.build;
exports.server = CLPack.server;
