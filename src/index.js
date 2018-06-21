#!/usr/bin/env node

import program from 'commander';

program
    .command('dev', 'start dev web server')
    .command('build', 'build project', { isDefault: true })
    .parse(process.argv);
