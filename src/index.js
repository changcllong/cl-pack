import path from 'path';
import url from 'url';
import { isObject } from 'lodash';
// import { isString, isFunction } from 'util';
import ora from 'ora';
import chalk from 'chalk';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import httpProxyMiddleware from 'http-proxy-middleware';
import express from 'express';
// import { getPackConfig, getWebpackConfig } from './util/getProjectConfig';
// import requireUncached from './util/requireUncached';
// import { getContext } from './util/path';

import defaultPackConfig from './configs/pack.config';
import getBaseWebpackConfig from './configs/webpack.base.config';
import { getJSRules, getCSSRules, getAssetsRules } from './configs/webpack.rules.config';
import mergePackConfig from './utils/mergePackConfig';
import mergeWebpackConfig from './utils/mergeWebpackConfig';
import requireUncached from './utils/requireUncached';

const webpackMode = [
    'development',
    'production'
]

const getWebpackConfig = (packConfig) => {
    const baseWebpackConfig = getBaseWebpackConfig(packConfig);

    if (!isObject(baseWebpackConfig.module)) {
        baseWebpackConfig.module = {};
    }

    baseWebpackConfig.module.rules = [
        ...getJSRules(packConfig),
        ...getCSSRules(packConfig),
        ...getAssetsRules(packConfig)
    ];

    if (isObject(packConfig.webpack)) {
        return mergeWebpackConfig(baseWebpackConfig, packConfig.webpack);
    }

    return baseWebpackConfig;
};

const handleWebpackRunRet = (err, stats) => {
    if (err) {
        console.log(chalk.red('  Build failed with errors.\n'));
        console.log(chalk.red(err.stack || err));
        if (err.details) {
            console.log(chalk.red(err.details));
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        return false;
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false, // if you are using ts-loader, setting this to true will make typescript errors show up during build
        chunks: false,
        chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'));
        // eslint-disable-next-line prefer-promise-reject-errors
        return false;
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server or node env.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ));
    return true;
}

const pack = (webpackConfig) => {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            handleWebpackRunRet(err, stats) ? resolve({ err, stats }) : reject({ err, stats });
        });
    });
}

const build = (userPackConfig, callback) => {
    const packConfig = mergePackConfig(defaultPackConfig, userPackConfig);
    const webpackConfig = getWebpackConfig(packConfig);
    const { dll } = packConfig;

    if (webpackMode.indexOf(webpackConfig.mode) < 0) {
        webpackConfig.mode = 'production';
    }

    const spinner = ora('building for production...');
    spinner.start();

    const finnalCallback = ({ err, stats }) => {
        spinner.stop();
        callback && callback(err, stats);
    }

    if (isObject(dll)) {
        pack(dll)
            .then(
                () => pack(webpackConfig),
                err => {
                    throw err;
                }
            )
            .then(finnalCallback, finnalCallback);
    } else {
        pack(webpackConfig).then(finnalCallback, finnalCallback);
    }
};

const startDevServer = (packConfig, webpackConfig, program) => {
    const app = express();
    const { context, dev } = packConfig
    const {
        options,
        port,
        hot,
        staticPath,
        proxy,
        mock
    } = dev;
    const complier = webpack(webpackConfig);

    const webpackDevOptions = {
        publicPath: webpackConfig.output.publicPath,
        ...options
    }

    const devMiddleware = webpackDevMiddleware(complier, webpackDevOptions);

    devMiddleware.waitUntilValid(() => {
        app.use(devMiddleware);
        if (hot) {
            app.use(webpackHotMiddleware(complier));
        }
    });

    // 代理与url重写中间件
    function proxyMiddleware (req, res, next) {
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

        if (rules.length > 0 && !rules.some(rule => {
            const from = new RegExp(rule.from);

            if (from.test(req.url)) {
                if (/^(https{0,1}:)\/\//.test(rule.to)) {
                    const targetUrl = new url.URL(rule.to);
                    const pathRewrite = {};
                    pathRewrite[rule.from] = targetUrl.pathname;

                    httpProxyMiddleware(req.url, {
                        target: `${targetUrl.protocol || req.protocol}//${targetUrl.host}`,
                        pathRewrite,
                        changeOrigin: true
                    })(req, res, next);

                    return true;
                } else {
                    req.url = req.url.replace(from, rule.to);
                    return false;
                }
            }
            return false;
        })) {
            next();
        }
    }

    app.use(proxyMiddleware);

    // mock数据中间件
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

    if (program && program.port) {
        app.listen(program.port);
    } else {
        app.listen(port);
    }
};

const server = (userPackConfig, program) => {
    const packConfig = mergePackConfig(defaultPackConfig, userPackConfig);
    const webpackConfig = getWebpackConfig(packConfig);
    const { dll } = packConfig;

    if (webpackMode.indexOf(webpackConfig.mode) < 0) {
        webpackConfig.mode = 'development';
    }

    console.log('server webpackConfig', webpackConfig.optimization.splitChunks);

    if (isObject(dll)) {
        pack(dll)
            .then(() => {
                startDevServer(packConfig, webpackConfig, program);
            })
            .catch(() => {});
    } else {
        startDevServer(packConfig, webpackConfig, program);
    }
};

export { build, server };
