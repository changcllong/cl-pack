'use strict';

import ora from 'ora';
import chalk from 'chalk';
import webpack from 'webpack';

process.env.NODE_ENV = 'production';

import getProjectConfig from './util/projectConfig';
import { getContext } from './util/path';
import merge from './util/mergeConfig';

const context = getContext();

const spinner = ora('building for production...');
spinner.start();

const packConfig = getProjectConfig('pack.config.js');
merge(packConfig, 'prd');
const webpackConfig = getProjectConfig('webpack.prd.config.js', packConfig);

webpack(webpackConfig, (err, stats) => {
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
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ));
});
