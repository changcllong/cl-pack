#!/usr/bin/env node

process.env.NODE_ENV = 'production';

import getProjectConfig from './util/getProjectConfig';
import CLPack from './index';

const packConfig = getProjectConfig('pack.config.js');
const webpackConfig = getProjectConfig('webpack.prd.config.js');

const pack = new CLPack(packConfig);

pack.build(webpackConfig);
