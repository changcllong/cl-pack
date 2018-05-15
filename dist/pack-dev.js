'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _httpProxyMiddleware = require('http-proxy-middleware');

var _httpProxyMiddleware2 = _interopRequireDefault(_httpProxyMiddleware);

var _projectConfig = require('./util/projectConfig');

var _projectConfig2 = _interopRequireDefault(_projectConfig);

var _requireUncached = require('./util/requireUncached');

var _requireUncached2 = _interopRequireDefault(_requireUncached);

var _path3 = require('./util/path');

var _mergeConfig = require('./util/mergeConfig');

var _mergeConfig2 = _interopRequireDefault(_mergeConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var context = (0, _path3.getContext)();

var packConfig = (0, _projectConfig2.default)('pack.config.js');
(0, _mergeConfig2.default)(packConfig, 'dev');

var port = packConfig.port,
    hot = packConfig.hot,
    staticPath = packConfig.staticPath,
    mockPath = packConfig.mockPath,
    proxy = packConfig.proxy,
    mock = packConfig.mock;


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
    app.use(devMiddleware);
    if (hot) {
        app.use((0, _webpackHotMiddleware2.default)(complier));
    }
});

function proxyMiddleware(req, res, next) {
    var rules = [];
    if ((typeof proxy === 'undefined' ? 'undefined' : _typeof(proxy)) === 'object') {
        Object.keys(proxy).forEach(function (from) {
            rules.push({
                from: from,
                to: proxy[from]
            });
        });
    } else {
        next();
    }

    if (!rules.some(function (rule) {
        var from = new RegExp(rule.from);

        if (from.test(req.url)) {
            var toUrl = req.url.replace(from, rule.to);

            if (/^(https{0,1}:){0,1}\/\//.test(rule.to)) {
                var targetUrl = _url2.default.parse(toUrl, false, true);
                var pathRewrite = {};
                pathRewrite[rule.from] = targetUrl.path;

                (0, _httpProxyMiddleware2.default)(req.url, {
                    target: (targetUrl.protocol || req.protocol) + '//' + targetUrl.host,
                    pathRewrite: pathRewrite,
                    changeOrigin: true
                })(req, res, next);

                return true;
            } else {
                req.url = toUrl;
                return false;
            }
        }
        return false;
    })) {
        next();
    }
}

app.use(proxyMiddleware);

function mockMiddleware(req, res, next) {

    function existMockData(from) {
        var regFrom = new RegExp(from);

        if (regFrom.test(req.url)) {
            var resData = mock[from];

            res.setHeader('Content-Type', 'application/json');
            if ((typeof resData === 'undefined' ? 'undefined' : _typeof(resData)) === 'object') {
                res.end(JSON.stringify(resData));
            } else {
                var data = (0, _requireUncached2.default)(_path2.default.resolve(context, resData));
                res.end(JSON.stringify(data));
            }
            return true;
        }
        return false;
    }

    if (!((typeof mock === 'undefined' ? 'undefined' : _typeof(mock)) === 'object' && Object.keys(mock).some(existMockData))) {
        next();
    }
}

app.use(mockMiddleware);

app.use(_express2.default.static(_path2.default.resolve(context, staticPath)));
app.listen(port);