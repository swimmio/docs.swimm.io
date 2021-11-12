#!/usr/bin/env node
/** Copyright 2021 Swimm, Inc.
 * Tool to import release notes from Swimm's task & bug tracker (ClickUp, currently)
 * Not really useful to anyone else without modification, but it's easy enough to ship
 * in this repository. Requires configuration from environmental variables that aren't
 * included here.
 * 
 * License: MIT
 */

 "use strict"
 
const { Command } = require('commander');
const program = new Command();

/* Metadata */
program
    .version('0.0.1', '-v, --version', 'print version information and exit normally.')
    .name("do")
    .description("The doer of things that need done.")
    .usage("[global options] command [arguments]")
    .helpOption('-h, --help', 'read more information');

/* Global flags */
program
    .option('-V, --verbose', 'Be extremely noisy about what\'s happening.')
    .option('-r, --refresh-cache', 'Refresh stored API responses before starting.')
    .option('-d, --dry-run', 'Don\'t actually do anything, but show what would be done.');

/* Global options */
program
    .option('-c, --config [file]', 'releases configuration file location', './releases.config.json')

/* Mode command group */
program
    .command('mode <mode>', 'create update delete')
    .command('set <key> <value>', 'set release context keys')
    .command('get <key>', 'show context value <key>')
    .command('list', 'list the current transaction', { isDefault: true })
    .command('run', 'run the current transaction')
    .command('resume [name]', 'resume the last job that ran, or a specific save.')
    .command('save [name]', 'save the current transaction with an optional nickname.')
    .command('start <name>', 'start a new transaction named <name>')
    .command('drop', 'forget the current transaction; don\'t write any updates if it was resumed.')

program.parse();
const options = program.opts();
console.log(options);

