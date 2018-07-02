import path from 'path';
import url from 'url';
import { isObject, isNumber } from 'util';

import ora from 'ora';
import chalk from 'chalk';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import httpProxyMiddleware from 'http-proxy-middleware';
import express from 'express';
import { getPackConfig, getWebpackConfig } from './util/getProjectConfig';
import requireUncached from './util/requireUncached';
import { getContext } from './util/path';

const PACK_CONFIG = Symbol('CLPack/packConfig');
const CREATE_PACK_CONFIG = Symbol('CLPack/createPackConfig');

export default class CLPack {
    constructor(packConfig) {
        this[PACK_CONFIG] = packConfig;
        this[CREATE_PACK_CONFIG] = function(env) {
            this[PACK_CONFIG] =  getPackConfig(env, this[PACK_CONFIG]);
        }
    }

    createWebpackConfig(env, webpackConfig) {
        this[CREATE_PACK_CONFIG](env);
        return getWebpackConfig(env, this[PACK_CONFIG], webpackConfig);
    }

    build(webpackConfig) {
        const spinner = ora('building for production...');
        spinner.start();
        webpack(this.createWebpackConfig('prd', webpackConfig), (err, stats) => {
            spinner.stop();
            if (err) throw err;
            process.stdout.write(stats.toString({
              colors: true,
              modules: false,
              children: false, // if you are using ts-loader, setting this to true will make typescript errors show up during build
              chunks: false,
              chunkModules: false
            }) + '\n\n');

            if (stats.hasErrors()) {
              console.log(chalk.red('  Build failed with errors.\n'));
              process.exit(1);
            }

            console.log(chalk.cyan('  Build complete.\n'));
            console.log(chalk.yellow(
              '  Tip: built files are meant to be served over an HTTP server or node env.\n' +
              '  Opening index.html over file:// won\'t work.\n'
            ));
        });
    }

    server(webpackConfig, program) {
        webpackConfig = this.createWebpackConfig('dev', webpackConfig);
        const app = express();
        const context = getContext();
        const {
            port,
            hot,
            staticPath,
            mockPath,
            proxy,
            mock
        } = this[PACK_CONFIG];
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

        if(program && program.port) {
            app.listen(program.port);
        } else {
            app.listen(port);
        }
    }
}
