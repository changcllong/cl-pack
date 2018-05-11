import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getProjectConfig from './util/projectConfig';
import { getContext } from './util/path';
import merge from './util/mergeConfig';

const context = getContext();

const packConfig = getProjectConfig('pack.config.js');
merge(packConfig, 'dev');

const {
    port,
    hot,
    staticPath,
    mockPath
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
    const app = express();
    app.use(devMiddleware);
    if (hot) {
        app.use(webpackHotMiddleware(complier));
    }
    app.use(express.static(path.resolve(context, staticPath)));
    app.listen(port);
});
