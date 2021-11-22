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
const { SwimmCacheManager } = require('./scripts/SwimmReleaseManager.js');
const { Command, Option } = require('commander');
const program = new Command();
let fs = require('fs');
let YAML = require('yaml');

let Version = null;
let ReleaseContext = null;
let UseTheForce = false;


/* Option handlers */

function validateOption_versionName(option, prev) {
    let search = option.match(SwimmReleases.ValidVersionPattern());
    if (search == null) {
        console.error('Version name format must be one of: "0.1.2", "0.1.2u", "0.1.2.3", "0.1.2-3"');
        process.exit(1);
    }
    Version = option;
}

/* Metadata */

program
    .version('0.0.1', '-V, --version', 'print version information and exit normally.')
    .name("do")
    .description("The doer of release things that need done.")
    .usage("<global options> [arguments] <releasefile.yml>")
    .helpOption('-h, --help', 'read more information');

/* Runtime Stuff */

program
    .option('-r, --release <name>', 
        'the Swimm version name, e.g. "0.1.2" or "0.1.2.3" or "0.1.2-3"', validateOption_versionName)
    .option('-f, --force', 
        'Import intermediate configs for all releases, even if in production.', false)
    .addOption(new Option('-m, --mode <mode>', 
        'function to perform.').choices([
            "init",
            "create", 
            "update", 
            "export", 
            "draft", 
            "publish",
            "refresh",  
            "backfill", 
            "backfill-notes", 
            "commit",
            "push",
            "magic"
        ])
    );


function validateVersion() {
    if (Version === null) {
        console.error('You must specify a --versionName for this mode.');
        process.exit(1);
    }
}

program.parse();
const options = program.opts();
UseTheForce = options.force;

if (options.mode === "undefined") {
    console.error('Malformed option to --mode, try --help for a list of valid options.');
    process.exit(1);
}

let cache = new SwimmCacheManager;

switch (options.mode) {
    /* Create the cache directory if needed, and initialize blank configs */
    case 'init':
        SwimmReleases.Init();
        console.log('You very likely now want to re-run with --mode=refresh');
        break;
    /* Create a bare minimum config for a release. */
    case 'create':
        /* create a new skeletal config as YAML then update it */
        validateVersion();
        /* for now just do it by hand */
        break;
    /* Import a release from a yaml config */
    case 'update':
        validateVersion();
        let context = cache.readMetaData(Version);
        if (context === null) {
            console.error(`I'm sorry Dave, I'm afraid I can't do that. (Try exporting it first)`);
            process.exit(1);
        }
        
        context.major = parseInt(context.major, 10);
        context.minor = parseInt(context.minor, 10);
        context.patch = parseInt(context.patch, 10);
        context.patchlevel = context.patchlevel == null ? 0 : parseInt(context.patchlevel, 10);
        context.name = context.name.toString();

        SwimmReleases.Update(Version, context);

        break;
    /* Export YAML stringified live config object for a version. */
    case 'export':
        validateVersion();
        SwimmReleases.Export(Version);
        break;
    /* Draft release notes for any unreleased versions we know about, as best as we can. */
    case 'draft':
        SwimmReleases.Drafts();
        break;
    /* Publish A Release Notes Draft */
    case 'publish':
        validateVersion();
        SwimmReleases.Publish(Version);
        break;
    /* Refresh the version cache */
    case 'refresh':
        SwimmReleases.Refresh();
        break;
    /* Backfill versions we don't yet have into the cache & write intermediate config with default values */
    case 'backfill':
        SwimmReleases.Backfill(UseTheForce);
       break;
    /* Backfill release notes for the imported versions */
    case 'backfill-notes':
        SwimmReleases.Notes();
        break;
    /* Produce a config that can be copied over to production */
    case 'commit':
        SwimmReleases.Write();
        break;
    /* Actually push a 'next' config live */
    case 'push':
        SwimmReleases.Release();
        break;
    /* This points to whatever command I'm currently working on. Never quite know what that might be. */
    case 'magic':
        console.log(`It's a kind of magic ...`);
        break;
    default:
        console.error(`Unknown option '${options.mode}' passed. Try --help mode'`);
        process.exit(1);
}
