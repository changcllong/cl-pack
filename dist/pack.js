'use strict';

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _projectConfig = require('./util/projectConfig');

var _projectConfig2 = _interopRequireDefault(_projectConfig);

var _path = require('./util/path');

var _mergeConfig = require('./util/mergeConfig');

var _mergeConfig2 = _interopRequireDefault(_mergeConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = 'production';

var context = (0, _path.getContext)();

var spinner = (0, _ora2.default)('building for production...');
spinner.start();

var packConfig = (0, _projectConfig2.default)('pack.config.js');
(0, _mergeConfig2.default)(packConfig, 'prd');
var webpackConfig = (0, _projectConfig2.default)('webpack.prd.config.js', packConfig);

(0, _webpack2.default)(webpackConfig, function (err, stats) {
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
    console.log(_chalk2.default.red('  Build failed with errors.\n'));
    process.exit(1);
  }

  console.log(_chalk2.default.cyan('  Build complete.\n'));
  console.log(_chalk2.default.yellow('  Tip: built files are meant to be served over an HTTP server.\n' + '  Opening index.html over file:// won\'t work.\n'));
});