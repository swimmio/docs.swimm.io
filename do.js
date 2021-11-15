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
const { SwimmReleases } = require('./scripts/swimm-releases.js'); 
const { Command, Option } = require('commander');
const program = new Command();
let fs = require('fs');
let YAML = require('yaml');

/* Option handlers */

function validateOption_versionName(option, prev) {
    let search = option.match(SwimmReleases.ValidVersionPattern());
    if (search == null) {
        console.error('Version name format must be one of: "0.1.2", "0.1.2u", "0.1.2.3", "0.1.2-3"');
        process.exit(1);
    }
}

function validateOption_configFile(option, prev) {
    if (! fs.existsSync(option)) {
        console.error(`Invalid production config file location specified: ${option}`);
        process.exit(1);
    }
}

function validateOption_releaseConfig(option, prev) {
    if (! fs.existsSync(option)) {
        console.error(`Invalid release data config file location specified: ${option}`);
        process.exit(1);
    }
    let releaseConfig = fs.readFileSync(option, 'utf8');
    console.log(YAML.parse(releaseConfig));
}

function validateOption_stagger(option, prev) {
    console.log(option);
}

/* Metadata */

program
    .version('0.0.1', '-V, --version', 'print version information and exit normally.')
    .name("do")
    .description("The doer of release things that need done.")
    .usage("<global options> [arguments] <releasefile.yml>")
    .helpOption('-h, --help', 'read more information');

/* Global flags */

program
    .option('-c, --current-config [file.json]', 
        'production (current) releases configuration file location, if different than usual.', './releases.config.json', validateOption_configFile)
    .option('-C, --release-config [file.yml]', 'pre-set values that will get passed to ReleaseFactory.', validateOption_releaseConfig)

/* Runtime Stuff */

program
    .option('-v, --version-name <version>', 'the Swimm version name, e.g. "0.1.2" or "0.1.2.3" or "0.1.2-3"', validateOption_versionName)
    .option('-d, --debug', 'turn this on if you love undefined behavior')
    .option('-s, --stagger [interval]', 'When backfilling, back-date release notes to avoid flooding feeds.', 'offset:minimum', validateOption_stagger)
    .addOption(new Option('-m, --mode <mode>', 'function to perform.').choices(["init", "import", "draft", "release", "refresh", "backfill"]));


program.parse();
const options = program.opts();

switch (options.mode) {
    /* Create the cache directory if needed, and initialize blank configs */
    case 'init':
        break;
    /* Import a release from a release config file (default is versionName.yml, e.g. 0.1.2.yml */
    case 'import':
        break;
    /* Draft release notes for any unreleased versions we know about, as best as we can. */
    case 'draft':
        break;
    /* Push a drafted version live in the release notes. */
    case 'release':
        break;
    /* Refresh the version cache */
    case 'refresh':
        SwimmReleases.RefreshCache();
        break;
    /* Backfill versions we don't yet have into the cache & write intermediate config with default values */
    case 'backfill':
       break;
    /* Commander shouldn't let us get here but famous last words and all */
    case undefined:
        console.error('Missing required option --mode, try --help for more.');
        process.exit(1);
    default:
        console.error(`Unknown option '${options.mode}' passed. Try --help mode'`);
        process.exit(1);
}


