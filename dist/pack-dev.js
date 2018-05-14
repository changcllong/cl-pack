'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _projectConfig = require('./util/projectConfig');

var _projectConfig2 = _interopRequireDefault(_projectConfig);

var _path3 = require('./util/path');

var _mergeConfig = require('./util/mergeConfig');

var _mergeConfig2 = _interopRequireDefault(_mergeConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var context = (0, _path3.getContext)();

var packConfig = (0, _projectConfig2.default)('pack.config.js');
(0, _mergeConfig2.default)(packConfig, 'dev');

var port = packConfig.port,
    hot = packConfig.hot,
    staticPath = packConfig.staticPath,
    mockPath = packConfig.mockPath;


var webpackConfig = (0, _projectConfig2.default)('webpack.dev.config.js', packConfig);

var complier = (0, _webpack2.default)(webpackConfig);

var webpackDevOptions = {
    quiet: false,
    noInfo: false,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: webpackConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: { colors: true },
    serverSideRender: true
};

var devMiddleware = (0, _webpackDevMiddleware2.default)(complier, webpackDevOptions);

devMiddleware.waitUntilValid(function () {
    var app = (0, _express2.default)();
    app.use(devMiddleware);
    if (hot) {
        app.use((0, _webpackHotMiddleware2.default)(complier));
    }
    app.use(_express2.default.static(_path2.default.resolve(context, staticPath)));
    app.listen(port);
});