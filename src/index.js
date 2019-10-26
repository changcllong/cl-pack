import path from 'path';
import url from 'url';
import { isObject, isString, isFunction } from 'util';
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

const ORIGIN_PACK_CONFIG = Symbol('CLPack/originPackConfig');
const PACK_CONFIG = Symbol('CLPack/packConfig');
const WEBPACK_CONFIG = Symbol('CLPack/webpackConfig');
const ENV = Symbol('CLPack/env');

const ENV_NAME = {
    PRD: 'prd',
    DEV: 'dev'
};

const isEnvName = (function() {
    const set = new Set();
    Object.keys(ENV_NAME).forEach(key => {
        set.add(ENV_NAME[key]);
    });
    return function(name) {
        return set.has(name);
    }
})();

export default class CLPack {
    constructor(packConfig) {
        this[ORIGIN_PACK_CONFIG] = packConfig;
        this[PACK_CONFIG] = {};
        this[WEBPACK_CONFIG] = {};
        this[ENV] = undefined;
    }

    useDev() {
        this[ENV] = ENV_NAME.DEV;
        return this;
    }

    usePrd() {
        this[ENV] = ENV_NAME.PRD;
        return this;
    }

    /**
     * 根据项目配置和框架默认配置生成完整的配置对象
     * @param {string} env 当前环境'prd'or'dev'
     * @param {Object|Function} packConfig 项目配置
     */
    getPackConfig(env, packConfig) {
        if (!isString(env) && packConfig === undefined) {
            packConfig = env;
            env = undefined;
        }
        if (!isEnvName(env)) {
            env = this[ENV] || ENV_NAME.PRD;
        }
        this[ENV] = env;
        if (isObject(packConfig) || isFunction(packConfig)) {
            packConfig = [this[ORIGIN_PACK_CONFIG], packConfig];
        } else {
            packConfig = this[ORIGIN_PACK_CONFIG];
        }
        this[PACK_CONFIG] = getPackConfig(this[ENV], packConfig);
        return this[PACK_CONFIG];
    }

    /**
     * 生成最终的webpack配置
     * @param {string} env 当前环境'prd'or'dev'
     * @param {Function} webpackConfig 项目提供的webpack配置
     */
    getWebpackConfig(env, webpackConfig) {
        if (!isString(env) && webpackConfig === undefined) {
            webpackConfig = env;
            env = undefined;
        }
        this.getPackConfig(env);
        this[WEBPACK_CONFIG] = getWebpackConfig(this[ENV], this[PACK_CONFIG], webpackConfig);
        return this[WEBPACK_CONFIG];
    }

    build(webpackConfig, callback) {
        const spinner = ora('building for production...');
        spinner.start();
        webpack(this.getWebpackConfig(ENV_NAME.PRD, webpackConfig), (err, stats) => {
            spinner.stop();
            if (err) {
                console.log(chalk.red('  Build failed with errors.\n'));
                console.log(chalk.red(err.stack || err));
                if (err.details) {
                    console.log(chalk.red(err.details));
                }
                callback && callback(err, stats);
                return;
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
                callback && callback(err, stats);
                return;
            }

            console.log(chalk.cyan('  Build complete.\n'));
            console.log(chalk.yellow(
                '  Tip: built files are meant to be served over an HTTP server or node env.\n' +
              '  Opening index.html over file:// won\'t work.\n'
            ));
            callback && callback(err, stats);
        });
    }

    /**
     * 类似build，但使用watch模式，可监听文件修改重新打包
     * @param {*} webpackConfig 项目提供的webpack配置
     * @param {*} options watch选项
     * @param {*} callback 每一次打包后的回调
     */
    watch(webpackConfig, options, callback) {
        const spinner = ora('building for production...');
        spinner.start();
        webpack(this.getWebpackConfig(ENV_NAME.PRD, webpackConfig)).watch({ ...options || {} }, (err, stats) => {
            if (err) {
                console.log(chalk.red('  Build failed with errors.\n'));
                console.log(chalk.red(err.stack || err));
                if (err.details) {
                    console.log(chalk.red(err.details));
                }
                spinner.stop();
                callback && callback(err, stats);
                return;
            }

            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n');

            if (stats.hasErrors()) {
                console.log(chalk.red('  Build failed with errors.\n'));
                spinner.stop();
                callback && callback(err, stats);
                return;
            }

            console.log(chalk.cyan('  Build complete.\n'));
            spinner.info('pack in watch mode...');
            callback && callback(err, stats);
        });
    }

    server(webpackConfig, program) {
        webpackConfig = this.getWebpackConfig(ENV_NAME.DEV, webpackConfig);
        const app = express();
        const context = getContext();
        const {
            port,
            hot,
            staticPath,
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
    }
}
