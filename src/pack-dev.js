#!/usr/bin/env node

process.env.NODE_ENV = 'development';

import program from 'commander';

program
    .option('-p, --port <port>', 'server listen port')
    .parse(process.argv);

import getProjectConfig from './util/getProjectConfig';
import CLPack from './index';

const packConfig = getProjectConfig('pack.config.js');
const webpackConfig = getProjectConfig('webpack.dev.config.js');

const pack = new CLPack(packConfig);

pack.server(webpackConfig, program);
