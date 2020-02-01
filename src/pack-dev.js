#!/usr/bin/env node

/* eslint-disable import/first */

process.env.NODE_ENV = 'development';

import program from 'commander';

program
    .option('-p, --port <port>', 'server listen port')
    .option('-c, --config <path>', 'cl-pack config file path')
    .parse(process.argv);

import getConfigFromPath from './utils/getConfigFromPath';
import { server } from './index';

server(program.config ? getConfigFromPath(program.config) : undefined, program);
