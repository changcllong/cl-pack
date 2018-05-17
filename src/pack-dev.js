import path from 'path';
import url from 'url';
import { isObject } from 'util';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import httpProxyMiddleware from 'http-proxy-middleware';
import getProjectConfig from './util/projectConfig';
import requireUncached from './util/requireUncached';
import { getContext } from './util/path';
import merge from './util/mergeConfig';

const app = express();

const context = getContext();

const packConfig = getProjectConfig('pack.config.js');
merge(packConfig, 'dev');

const {
    port,
    hot,
    staticPath,
    mockPath,
    proxy,
    mock
} = packConfig;

const webpackConfig = getProjectConfig('webpack.dev.config.js', packConfig);

const complier = webpack(webpackConfig);

const webpackDevOptions = {
    quiet: false,
    noInfo: false,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: webpackConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: { colors: true },
    serverSideRender: true
}

const devMiddleware = webpackDevMiddleware(complier, webpackDevOptions);

devMiddleware.waitUntilValid(() => {
    app.use(devMiddleware);
    if (hot) {
        app.use(webpackHotMiddleware(complier));
    }
});

function proxyMiddleware(req, res, next) {
    const rules = [];
    if (isObject(proxy)) {
        Object.keys(proxy).forEach(from => {
            rules.push({
                from: from,
                to: proxy[from]
            });
        });
    } else {
        next();
    }

    if (!rules.some(rule => {
        const from = new RegExp(rule.from);

        if (from.test(req.url)) {
            const toUrl = req.url.replace(from, rule.to);

            if (/^(https{0,1}:){0,1}\/\//.test(rule.to)) {
                const targetUrl = url.parse(toUrl, false, true);
                const pathRewrite = {};
                pathRewrite[rule.from] = targetUrl.path;

                httpProxyMiddleware(req.url, {
                    target: `${targetUrl.protocol || req.protocol}//${targetUrl.host}`,
                    pathRewrite,
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
        const regFrom = new RegExp(from);

        if (regFrom.test(req.url)) {
            const resData = mock[from];

            res.setHeader('Content-Type', 'application/json');
            if (isObject(resData)) {
                res.end(JSON.stringify(resData));
            } else {
                const data = requireUncached(path.resolve(context, resData));
                res.end(JSON.stringify(data));
            }
            return true;
        }
        return false;
    }

    if (!(isObject(mock) && Object.keys(mock).some(existMockData))) {
        next();
    }
}

app.use(mockMiddleware);

app.use(express.static(path.resolve(context, staticPath)));
app.listen(port);
