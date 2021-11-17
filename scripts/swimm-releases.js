#!/usr/bin/env node
/** Copyright 2021 Swimm, Inc. Cobbled together by Tim Post <tim@swimm.io>
 * Tool to import versions & release notes from Swimm's task & bug tracker (ClickUp)
 * Not intended for any use, including educational. It's just easier to have it
 * here.
 * 
 * License: MIT
 * 
 * Note that this is VERY soon going to become a proper class that the CLI will just 
 * import normally. Right now I'm just figuring out what needs to be exported (public)
 * in this mix bag of helper functions, and what can go away altogether.
 * 
 * I wouldn't bother with any changes other than re-write it into a class, but I'm going
 * to do that anyway.
 */
"use strict"

/* Environmental variables */
require('dotenv').config();

/* What can a release look like? 0.6.3 || 0.6.3.1 || 0.6.3-1 */
const ValidVersionPattern = /(^[0-9]+['.']+[0-9]+['.']+[0-9]+([a-zA-Z]?))+([\.]?[0-9]?)+([\-?]+[0-9?])?/gm;

/* A Global release config object that many things contribute to building. */
let NewReleaseConfig = {};

/* The current (live) release config on the site. */
let CurrentReleaseConfig = null;

/* We get 100 API calls a day, so backfill has to be planned. We also keep track of other things for safety */
let RemainingCalls = 1;
let CallsReset = 0;
let LastRan = 0;


/* A running counter to see if there's work left to do */
let TotalReleases = 0;

/* For backfilling, we may need to plan a couple of days @ 100 calls a day */
let TotalNeededCalls = 0;

/**
 * We cache most API responses.
 * 
 *  - Those that are now static / archived (e.g. task lists) are always kept. They won't change.
 * 
 *  - Those that change with release cycles are refreshed on-demand.
 * 
 * This is because we get a finite amount of API requests, so we don't waste them reading the same
 * response over and over again for a task that was finished a year ago.
 */
let CacheFolder = './.swimmreleases';
let ExportedReleaseConfig = 'releases.exports.json';
let IntermediateReleaseConfig = 'releases.imports.json';
let StateReleaseConfig = 'releases.state.json';

/* Ultimately, the configuration file that the site will use */
let ProductionReleaseConfig = 'releases.config.json';

/* Root of API calls, with trailing slash */
let API = 'https://api.clickup.com/api/v2/';

let fs = require('fs');
let https = require('https');
let YAML = require('yaml');

/* We hash the final (production) config object before metadata is inserted, with the hash as
 * part of the metadata. This lets the site verify the configuration during build.
 */
let hash = require('object-hash');


/**
 * Get a list of tasks given a space ID
 * This is currently not returning the correct number of tasks.
 * @param {Integer} id - ID of the team 
 * @param {Function} callback where it goes.
 * @returns {JSON} - Raw API response, which is also what's written to cache
 */
function GetReleaseTasksByTeam(id, callback) {
    let cacheNode = `releases.teamlist_${id}_.json`;
    let cacheValue = ReadReleaseCache(cacheNode);
    if (cacheValue !== null) { 
        callback(cacheValue);
        return;
    }
    let queryUrl = `${API}/team/${id}/task?statuses%5B%5D=complete&archived=true`;
    SendAPIRequest(queryUrl).then((value) => {
        let responseData = JSON.parse(value);
        if (! responseData.err) {
            WriteReleaseCache(`releases.teamlist_${id}_.json`, value);
        }
        if (callback instanceof Function) {
            callback(responseData);
        }
        return value;
    });
}

/**
 * Get a list of tasks by a given list ID.
 * 
 * @param {Integer} id - The ID of the task.
 * @param {Function} callback - Callback function that receives the decoded response
 * @returns {JSON} - Raw API response, which is also what's written to cache
 */
function GetReleaseTasksByList(id, callback) {
    let cacheNode = `releases.tasklist_${id}_.json`;
    let cacheValue = ReadReleaseCache(cacheNode);
    if (cacheValue !== null) { 
        if (callback instanceof Function) {
            callback(cacheValue);
        }
        return cacheValue;
    }
    let queryUrl = `${API}/list/${id}/task?&statuses%5B%5D=complete`;
    SendAPIRequest(queryUrl).then((value) => {
        WriteReleaseCache(cacheNode, value);
        let responseData = JSON.parse(value);
        if (callback instanceof Function) {
            callback(responseData);
        }
        return value;
    });
}

/**
 * Get the actual *tasks* associated with each list that we associated with the release.
 * This usually ends up meaning 4 - 5 API calls per task.
 * (Currently, this returns a mock array)
 * @param {String} version 
 */
function GetReleaseTasks(version) {
    if (NewReleaseConfig[version]['notes'] !== null) {
        console.log(`${version} ** GetReleaseTasks(): I already have the copleted tasks for this release.`)
        return;
    }
    let mock = [
        '  - Fed feral Smurfs to Gargamel.\n',
        '  - Cleaned up all the Smurf droppings so nobody mistakes them for blueberries.\n',
        '  - Pruned back Smurfberry bushes so we attract fewer smurfs.\n',
        '  - Realized that Azrael is kind of a dark name for a cartoon cat, even an evil one.\n'
    ];
    NewReleaseConfig[version]['notes'] = mock;
    NewReleaseConfig[version]['template'] = PrepReleaseNotes(NewReleaseConfig[version]);
}

/**
 * See if a list should be fetched for completed tasks for release notes.
 * We don't want to query lists that we know (usually) don't yield anything for notes.
 * It's assumed that the person editing the notes will be aware if something worth
 * mentioning wasn't picked up (this is not a fully automatic process)
 * This is a work-in-progress.
 * 
 * @param {String} folder 
 * @returns {Boolean}
 */
function CheckFolderBlocklist(folder) {
    const blockList = ['Product', 'Devrel', 'Release', 'release', 'Flow', 'Website'];
    const haystack = folder.toString();
    let matches = false;
    blockList.forEach(function(item, index, array) {
        if (haystack.indexOf(item) !== -1) {
            console.log(`        => Blocklist hit on ${haystack} (entry: ${item})`);
            matches = true;
        }
    });
    return matches;
}

/**
 * Here's where we actually query to get a list of changes from each list associated with this release.
 * This is what we use to pre-populate the release notes, which we hand-edit before publishing.
 * 
 * @param {String} version - Swimm release, e.g, 0.7.8-9 or 9.8.7.6 
 */
function FilterReleaseTasks(version) {
    let rawCategories = NewReleaseConfig[version]['changes'];
    let filteredCategories = {};
    let calls_needed = 0;

    for (const [key, value] of Object.entries(rawCategories)) {
        console.log(`\n      ${version} :: Mentions list ${key} named ${value.name}`);
        if (CheckFolderBlocklist(value.name)) {
            continue;
        }

        calls_needed += 1;
        filteredCategories[key] = {name: value['name']};
        filteredCategories[key]['statuslist'] = {};

        for (const [key1, value1] of Object.entries(rawCategories[key]['statuslist'])) {
            filteredCategories[key]['statuslist'][key1] = {id: value1['id'], name: value1['status']};
            console.log(`        -> Contains status ID: ${value1.id} Named: ${value1.status} (added to query heap)`);
        }
    }

    NewReleaseConfig[version]['changes'] = filteredCategories;
    console.log(`\n${version} imported :: ${calls_needed} API calls still needed to fetch tasks.\n\n`);
    NewReleaseConfig[version]['calls'] = calls_needed;
    TotalNeededCalls += calls_needed;
}

/**
 * See if a release exist in the current (running) site version config.
 * 
 * @param {String} version - normalized version string to check
 * @returns {Boolean}
 */
function ReleaseExists(version) {
    LoadCurrentReleaseConfig();
    return(CurrentReleaseConfig[version] instanceof Object ? CurrentReleaseConfig[version]['date'] : false);
}

/**
 * Build a release object with things associated with a version from backfill. 
 * Normally, we just import YAML to ImportRelease, but this one is special, it 
 * brings in all the historical releases, so we name it Swimmport :)
 * 
 * @param {Object} versionContext - context for the release (factory, or from the command line)
 * @param {Object} ReleaseData - chunk of release data where this version can be found.
 */
function Swimmport(versionContext, releaseData, force) {
    let versionName = versionContext['name'];
    let lastImported = ReleaseExists(versionName);
    if (lastImported && force == false) {
        console.log(`${versionName} ** Skipping (previously imported ${new Date(lastImported)})`);
        return;
    }
    /* Figure out the version, and fill in what we know about it from context */
    let keys = ['major', 'minor', 'patch', 'patchlevel'];
    let values = versionName.replace('-', '.').split('.');
    const releaseVersion = keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index] ? values[index] : null }), {});
    NewReleaseConfig[versionName] = {
        ...releaseVersion,
        ...versionContext
    };
    console.log(versionName, ' :: Initialized.')
    /* Now, get list of lists of lists so we know how to ask what changed in this release. */ 
    NewReleaseConfig[versionName]['changes'] = {};
    let statuses = {};
    for (const [key, value] of Object.entries(releaseData['lists'])) {
        let needle = releaseData['lists'][key]['id'];
        let haystack = releaseData['lists'][key]['name'];
        for (const [key1, value1] of Object.entries(releaseData['lists'][key]['statuses'])) {
            statuses[key1] = {id: value1['id'], status: value1['status'], type: value1['type']};
        }
        NewReleaseConfig[versionName]['changes'][needle] = {name: haystack, statuslist: statuses}
    }
    console.log(versionName, ' :: Packed all associated task list IDs and statuses - resolving lists ...')
    FilterReleaseTasks(versionName);
    TotalReleases += 1;
}

/**
 * Generate a release context, as if it came from the command line, but only the name was specified.
 * Useful during backfill.
 * 
 * @param {String} swimmVersionString - Swimm release name, e.g. 0.1.2 / 0.1.2-3 / 0.1.2.3 
 * @returns {Object}
 */
function ReleaseContextFactory(release) {
    let backfill = {
        name: release,
        date: null, 
        security: false,
        notes: null,
        blog: null, 
        tweet: null, 
        youtube:null, 
        linkedin: null,
    };
    return backfill;
}

/**
 * Backfill one specified release, or all releases.
 * 
 * @param {Function} callback - Callback to notify when done. 
 */
function BackfillReleases(force, callback) {
    let exportedReleases = ReadReleaseCache(ExportedReleaseConfig);
    if (typeof exportedReleases.folders === "undefined") {
        console.error(`I can't find the exports from ClickUp. You need to re-run with --mode refresh.`);
        process.exit(1);
    }

    for (const [key, value] of Object.entries(exportedReleases.folders)) {
        let search = value.name.match(ValidVersionPattern);
        if (search !== null) {
            let release = search.toString().replace(/[a-z]$/g, "\.1");
            console.log(`Calling ImportRelease & ReleaseContextFactory`);
            Swimmport(ReleaseContextFactory(release), value, force);
        }
    }

    if (callback instanceof Function) {
        callback();
    }
}

/**
 * Given a suitably-populated intermediate release config, 
 * create a draft release notes directory/entry. If we could
 * get tasks associated with it, they'll be written as a markdown
 * list at the bottom of the content.
 * 
 * @param {String} version 
 */
function WriteReleaseDraft(version) {
    let target = NewReleaseConfig[version];
    
    if (typeof target.template === 'undefined') {
        console.error('Tasks have not yet been backfilled. Run --mode=backfill-notes first.');
        process.exit(1);
    }

    let path = './changelog/' + target.name;
    if (fs.existsSync(path)) {
        console.log('Not recreating notes for already-published release ', target.name);
        return;
    }

    path = `${CacheFolder}/drafts/${target.name}`;
    fs.mkdirSync(path, { recursive: true });
    fs.writeFileSync(`${path}/index.mdx`, target.template);

    let metadata = {
        security: target.security,
        blog: target.blog,
        tweet: target.tweet,
        youtube: target.youtube,
        linkedin: target.linkedin
    };

    fs.writeFileSync(`${path}/${target.name}.yml`, YAML.stringify(metadata));
    
    return;
}

/**
 * Create a release notes draft for every release in the intermediate config
 * that doesn't yet have published release notes. 
 */
function WriteReleaseDrafts(callback = null) {
    LoadIntermediateReleaseConfig();
    for(const [key, value] of Object.entries(NewReleaseConfig)) {
        WriteReleaseDraft(value.name);
    }
    if (callback instanceof Function) {
        callback();
    }
}

/**
 * Given a version (or versions) imported with BackfillReleases(), we now need to get the actual
 * tasks, which is going to take some coordination depending on how many. 
 * 
 * @param {String} version - Single version to import, defaults to all
 * TODO: Make this deal with API request limits and spacing
 */
function BackfillReleaseNotes(version = null, callback = null) {
    LoadIntermediateReleaseConfig();
    if (version !== null) {
        GetReleaseTasks(NewReleaseConfig['version']);
        WriteIntermediateReleaseConfig();
        if (callback instanceof Function) {
            callback();
        }
        return;
    }

    for (const [key,  value] of Object.entries(NewReleaseConfig)) {
        GetReleaseTasks(value['name']);
    }
    WriteIntermediateReleaseConfig();
    
    if (callback instanceof Function) {
        callback();
    }
    return;
}

/**
 * Send a GET request to the ClickUp API
 * 
 * @param {String} queryUrl 
 * @returns {Promise}
 */
async function SendAPIRequest(queryUrl) {
    return new Promise(async (resolve, reject) => {
        const requestOptions = {
            hostname: 'api.clickup.com',
            port: 443,
            path: queryUrl,
            method: 'GET',
            headers: {
                'Authorization': process.env.SwimmReleases_Token    
            }
        };
        let response = [];
        const request = https.request(requestOptions, (res) => {
            RemainingCalls = res.headers['x-ratelimit-remaining'];
            CallsReset = res.headers['x-ratelimit-reset'];
            res.on('data', chunk => response.push(chunk));
            res.on('end', () => {
                /* So we know how many calls we have left, and when they reset. For backfilling */
                WriteReleaseState();
                const data = Buffer.concat(response).toString();
                resolve(data); 
            });
        });
        request.on('error', e => {
            /* We don't get charged for the request if there's an error response, 
            so no need to update state */
            console.error(e);
            reject(e);
        });
        request.end();
    });
}

/**
 * Attempt to read a cached object.
 * 
 * @param {String} node relative to the root of the cache folder. 
 * @returns {Object} or null.
 */
function ReadReleaseCache(node) {
    let entry = `${CacheFolder}/${node}`;
    if (fs.existsSync(entry)) {
        return JSON.parse(fs.readFileSync(entry));
    } else
        return null;
}

/**
 * Write to the release cache.
 * 
 * @param {String} path 
 * @param {Object} value 
 */
function WriteReleaseCache(path, value) {
    fs.writeFileSync(`${CacheFolder}/${path}`, value, 'utf-8', function(e) {
        if (e) {
            console.error(`Could not write to ${path}, exiting ...`);
            process.exit(1);
        }
    });
}

/**
 * The release cache is a ginormous object that we get by grabbing the entire
 * list of folders associated with releases. With this, we can actually backfill
 * each release with release notes pre-populated from what changed in that release,
 * so that a human can go clean up & edit them for publishing.
 * 
 * This is called by ImportReleases if no cache exists, as well as from the command line.
 * 
 * @param {Function} callback - Callback to call once done
 */
function RefreshReleaseCache(callback) {  
    let queryUrl = `/api/v2/space/${process.env.SwimmReleases_ReleaseSpaceId}/folder?archived=true`;
    SendAPIRequest(queryUrl).then((value) => {
        WriteReleaseCache(ExportedReleaseConfig, value);
        if (callback instanceof Function) {
            callback(value);
        }
    });
}

/**
 * (re)-Initialize the release cache.
 * Intentionally unhandled, we should stop everything if this doesn't work.
 */
function InitializeReleaseCache() {
    if (! fs.existsSync(CacheFolder)) {
        fs.mkdirSync(CacheFolder);
    }

    if (! fs.existsSync(ProductionReleaseConfig)) {
        fs.writeFileSync(ProductionReleaseConfig, '{}');
    }

    if (fs.existsSync(`${CacheFolder}/drafts`)) {
        fs.rmdirSync(`${CacheFolder}/drafts`, { recursive: true });
    }

    WriteReleaseCache(ExportedReleaseConfig, '{}');
    WriteReleaseCache(IntermediateReleaseConfig, '{}');
    WriteReleaseCache(ProductionReleaseConfig, '{}');
}


/**
 * Once release notes have been generated, there's no reason to have 
 * the task/list references any longer. We also add some final metadata
 * about this run so we know how old the config is, etc.
 */
function FinalizeReleaseConfig(callback=null) {
    /* Remove the bits we don't want to keep */
    for (const [key, value] of Object.entries(NewReleaseConfig)) {
        delete NewReleaseConfig[key]['changes'];
        delete NewReleaseConfig[key]['notes'];
        delete NewReleaseConfig[key]['calls'];
    }
    /* Resolve the latest version we know of */
    let versionNames = Object.keys(NewReleaseConfig);
    NewReleaseConfig['current'] = versionNames.pop();
    
    /* Hash the object prior to metadata so it can be verified by removing metadata */
    let configHash = hash(NewReleaseConfig);

    /* Add the metadata */
    NewReleaseConfig['metadata'] = {
        generated: Date.now(),
        hash: configHash,
        generator: './scripts/swimm-releases.js'
    };

    let results = {
        total: TotalReleases,
        current: NewReleaseConfig['current'],
        metadata: NewReleaseConfig['metadata'],
        live: TotalReleases > 0 ? false:true
    }
    
    if (callback instanceof Function) {
        callback(results);
    }

    return results;
}

/**
 * At this point we know what additional queries we need to run in order to 
 * generate the release note drafts. That was a lot of work, so save it as
 * an intermediate state if we can't run those queries right now.
 * 
 * We can use this to generate the final config, too - there just won't be any
 * pre-populated items to review.
 */
function WriteIntermediateReleaseConfig() {
    WriteReleaseCache(IntermediateReleaseConfig, JSON.stringify(NewReleaseConfig, null, 2));
}

/**
 * 
 * Write the actual configuration that ships with the site.
 * This gets written to the cache where it can be validated and then committed.
 */
function WriteReleaseConfig(callback) {
    LoadIntermediateReleaseConfig();
    FinalizeReleaseConfig();
    WriteReleaseCache(ProductionReleaseConfig, JSON.stringify(NewReleaseConfig, null, 2));
    if (callback instanceof Function) {
        callback(ProductionReleaseConfig);
    }
}

/**
 * Just something so we keep track of how many calls we have left, when they reset, etc
 * between runs.
 */
function WriteReleaseState() {
    let state = {Remaining: RemainingCalls, Resets: CallsReset, Ran: Date.now()};
    WriteReleaseCache(StateReleaseConfig, JSON.stringify(state, null, 2));
}

/**
 * Set globals based on the last run, when needed.
 */
function LoadReleaseState() {
    let state = JSON.parse(fs.readFileSync(StateReleaseConfig));
    RemainingCalls = state.Remaining;
    CallsReset = state.Resets;
    LastRan = state.Ran;
    return;
}

/**
 * 
 * Read the current site release config into a global.
 * Returns false on failure.
 * @returns {Boolean}  
 */
function LoadCurrentReleaseConfig() {
    if (CurrentReleaseConfig == null)
        try {
            CurrentReleaseConfig = JSON.parse(fs.readFileSync(ProductionReleaseConfig));
        } catch (err) {
            console.warn('Could not load a valid release config. First time?', err);
        }
}

/**
 * 
 * Reload the last intermediate release config, so that we can time running all the calls
 * to finish it.
 * 
 * "One hundred requests per day outta be enough for anybody. -- ClickUp"
 */
function LoadIntermediateReleaseConfig() {
    if (Object.keys(NewReleaseConfig).length === 0)
        NewReleaseConfig = JSON.parse(fs.readFileSync(`${CacheFolder}/${IntermediateReleaseConfig}`));
}

/**
 * Generate the index.mdx file to /changelog/version, pre-populated
 * with completed tasks associated with the release.
 * 
 * The intent is not to automatically publish, but to fill a template with items that would
 * likely be included, and have a human edit / inspect it, and then publish it.
 * @param {Object} versionContext - The version 
 */
function PrepReleaseNotes(versionContext) {
    const date = new Date(versionContext.date);
    const template = 
`---
slug: release-${versionContext.name}
title: Swimm ${versionContext.name} Released
autthors: [swimm]
tags: [release-notes]
date: ${date.getYear()}-${date.getMonth()}-${date.getDate()}
----
import Swimm, {SwimmLink, SwimmMoji, SwimmReleaseBlogPost, SwimmReleaseTweet, SwimmReleaseVideo} from '../../src/components/SwimmUtils.js';

# Swimm ${versionContext.name} Has Been Released!

We're pleased to announce the availability of **Swimm ${versionContext.name}**<SwimmMoji text="release"/>

<SwimmReleaseBlogPost version="${versionContext.name}" />

<SwimmReleaseVideo version="${versionContext.name}" />

## New Features:

## Improvements:

## Bug Fixes:

If you have any questions or issues, please reach out on our <SwimmLink target="slack" />. You can
also drop in during our next <SwimmLink target="officeHours" /> event. We hope to see you there!

<SwimmReleaseTweet version="${versionContext.name}" />

---- AUTO GENERATED NOTES ABOUT THIS RELEASE FOLLOW ----

${versionContext.notes.join('\n')}
`
    return template;
}

function WriteProductionReleaseConfig(callback) {
    LoadIntermediateReleaseConfig();
    FinalizeReleaseConfig();
    let data = JSON.stringify(NewReleaseConfig, null, 2);
    fs.writeFileSync(`./${ProductionReleaseConfig}`, 
        data, 
        'utf-8', 
        function(e) { 
            if (e) {
                console.error('Could not write production config, exiting.');
                process.exit(1);
            }
            if (callback instanceof Function) {
                callback();
            }
        }
    );
}

/**
 * Grab a specific version from the production config and
 * send it to a callback. This is a convenient way to edit
 * any specific release - export it to YAML, edit it, then
 * re-import it.
 * 
 * @param {String} version - Swimm version name
 * @param {Function} callback - Callback function that can receive an object.
 */
function ExportRelease(version, callback) {
    LoadCurrentReleaseConfig();
    if (typeof CurrentReleaseConfig[version] === "undefined") {
        callback({});
        return;
    }
    callback(CurrentReleaseConfig[version]);
    return;
}

function ImportRelease(version, context, callback) {
    LoadCurrentReleaseConfig();
    CurrentReleaseConfig[version] = context;
    fs.writeFileSync(`./${ProductionReleaseConfig}`, 
    JSON.stringify(CurrentReleaseConfig, null, 2), 
    'utf-8', 
    function(e) { 
        if (e) {
            console.error('Could not write production config, exiting.');
            process.exit(1);
        }
        if (callback instanceof Function) {
            callback(CurrentReleaseConfig[version]);
        }
    });
}

/* This is all still in a bit of flux, as noted above. */
let SwimmReleases = {
    ValidVersionPattern: function() { return ValidVersionPattern; },
    Init: function() { InitializeReleaseCache() },
    Export: function(version) { ExportRelease(version, function(data) {console.log(YAML.stringify(data))})},
    Import: function(version, context) { ImportRelease(version, context, function(d) {console.log(d)})},
    Refresh: function() { RefreshReleaseCache(function(){ console.log('Dynamic API cache refreshed');}) },
    Backfill: function(force) { BackfillReleases(force, function() { WriteIntermediateReleaseConfig(); })},
    Notes: function() { BackfillReleaseNotes(null, function() { console.log('Tasks backfilled.')})},
    Write: function() { WriteReleaseConfig(null, function(loc) { console.log(`Config written to ${CacheFolder}/${loc}`)}) },
    Release: function() { WriteProductionReleaseConfig(function() { console.log('Wrote production release config.')})},
    Reload: function() { console.log('reload') },
    Drafts: function() { WriteReleaseDrafts(function() { console.log('Drafts written.')}); },
    Magic: function(id) {
        GetReleaseTasksByTeam(id, function(d){
            if (d.err) {
                console.error(d);
                process.exit(1);
            }
            for (const [key, value] of Object.entries(d.tasks)) {
                console.log(value.folder.name, value.list.name, value.name, value.status.date_closed);
            }
        });
    }
}

module.exports = { SwimmReleases }