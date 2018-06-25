let CLPack = require('../../dist/index');
CLPack = CLPack.default || CLPack;

const packConfig = require('./config/pack.config');

const pack = new CLPack(packConfig);

pack.build();
