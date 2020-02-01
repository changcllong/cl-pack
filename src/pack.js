#!/usr/bin/env node

/* eslint-disable import/first */

process.env.NODE_ENV = 'production';

import program from 'commander';

program
    .option('-c, --config <path>', 'cl-pack config file path')
    .parse(process.argv);

import getConfigFromPath from './utils/getConfigFromPath';
import { build } from './index';

build(program.config ? getConfigFromPath(program.config) : undefined);
