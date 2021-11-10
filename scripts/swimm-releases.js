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
/* What can a release look like? 0.6.3 || 0.6.3.1 || 0.6.3-1 */
const ValidVersionPattern = /(^[0-9]+['.']+[0-9]+['.']+[0-9]+([a-zA-Z]?))+([\.]?[0-9]?)+([\-?]+[0-9?])?/gm;

/* A Global release config object that many things contribute to building. */
let NewReleaseConfig = {};

/* The current (live) release config on the site. */
let CurrentReleaseConfig = null;

/* We get 100 API calls a day, so backfill has to be planned. We also keep track of other things for safety */
let TotalNeededCalls = 0;
let AllowedCalls = 100;
let TotalReleases = 0;


let fs = require('fs');
let path = require('path');
let https = require('https');
let shajs = require('sha.js');
let hash = require('object-hash');

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
 * @returns 
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
 * Build a release object with things associated with a version.
 * 
 * @param {Object} versionContext - context for the release (factory, or from the command line)
 * @param {Object} ReleaseData - chunk of release data where this version can be found.
 */
function ImportRelease(versionContext, releaseData) {
    let versionName = versionContext['name'];
    
    let lastImported = ReleaseExists(versionName);
    /* need to have some option of forcing this */

    if (lastImported ) {
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
function ReleaseContextFactory(swimmVersionString) {
    let backfill = {
        name: swimmVersionString,
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
 * @param {String} version - Single version to import, default is all. 
 */
function BackfillReleases(version = null) {
    let exportedReleases = JSON.parse(fs.readFileSync('./releases.exports.json'));
    for (const [key, value] of Object.entries(exportedReleases.folders)) {
        let search = value.name.match(ValidVersionPattern);
        if (search !== null) {
            /* 
               The .replace() here is for legacy compatibility.
               Some very early releases had a 'u' after the last identifier, indicating 'micro'
               Just transoform any extraneous strings after the last number to .1 for a new release.
            */
            let release = search.toString().replace(/[a-z]$/g, "\.1");
            /* Here, we have *a* valid version folder. */
            if (version !== null) {
                /* Are we looking for just this one? */
                if (release === version) {
                    ImportRelease(ReleaseContextFactory(release), value);
                    return;
                }
            } else {
                ImportRelease(ReleaseContextFactory(release), value);
            }
        }
    }
}

function WriteReleaseDraft(version) {
    LoadIntermediateReleaseConfig();
    let target = NewReleaseConfig[version];
    let path = './changelog/' + target.name;
    if (fs.existsSync(path)) {
        console.log('Not recreating notes for already-published release ', target.name);
        return;
    }
    path = './scripts/output/' + target.name;
    fs.mkdirSync(path, { recursive: true });
    fs.writeFileSync(`${path}/index.mdx`, target.template);
    return;
}

function WriteReleaseDrafts() {
    LoadIntermediateReleaseConfig();
    for(const [key, value] of Object.entries(NewReleaseConfig)) {
        WriteReleaseDraft(value.name);
    }
}

/**
 * Given a version (or versions) imported with BackfillReleases(), we now need to get the actual
 * tasks, which is going to take some coordination depending on how many. 
 * 
 * @param {String} version - Single version to import, defaults to all
 * TODO: Make this deal with API request limits and spacing
 */
function BackfillReleaseNotes(version = null) {
    if (version !== null) {
        GetReleaseTasks(NewReleaseConfig['version']);
        return;
    }   
    for (const [key,  value] of Object.entries(NewReleaseConfig)) {
        GetReleaseTasks(value['name']);
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
            res.on('headers', (headers) => console.log('Returned Headers:', headers));
            res.on('data', chunk => response.push(chunk));
            res.on('end', () => { 
                const data = Buffer.concat(response).toString(); 
                resolve(data); 
            });
        });
        request.on('error', e => {
            console.error(e);
            reject(e);
        });
        request.end();
    });
}

/**
 * We heavily cache configs generated from API calls because we only get
 * 100 of them a day. This just makes it simple to do that.
 * 
 * @param {String} path 
 * @param {Object} value 
 */
function WriteReleaseCache(path, value) {
    fs.writeFileSync(path, value, 'utf-8', function(e) {
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
    var create = false;
    try {
        var statObj = fs.statSync('./releases.exports.json');
    } 
    catch (err) {
        /* It doesn't exist. Proceed so it gets created. */
        console.log('Release cahce does not yet exist.');
        create = true;
    }

    console.log('We are out!');
    return;
    /*
    if (keep == true) {
        const now = Date.now();
        const age = Math.floor((now - ctime) / 1000);
        if (age >= 604800) {
            console.log('Release cache is over a week old. Stand by - refreshing it ...');
            keep = false;
        }
    }

    if (keep == true)
        return;
    
    let queryUrl = `/api/v2/space/${process.env.SwimmReleases_ReleaseSpaceId}/folder?archived=true`;
    SendAPIRequest(queryUrl).then((value) => {
        WriteReleaseCache('./releases.exports.json', value);
        if (callback instanceof Function) {
            callback(value);
        }
    });
    */
}

/**
 * Once release notes have been generated, there's no reason to have 
 * the task/list references any longer. We also add some final metadata
 * about this run so we know how old the config is, etc.
 */
function FinalizeReleaseConfig() {
    /* Remove the bits we don't want to keep */
    for (const [key, value] of Object.entries(NewReleaseConfig)) {
        delete NewReleaseConfig[key]['changes'];
        delete NewReleaseConfig[key]['notes'];
        delete NewReleaseConfig[key]['calls'];
        /* TODO: Need some method of back-dating automatically here */
        if (NewReleaseConfig[key]['date'] == null) {
            NewReleaseConfig[key]['date'] = Date.now();
        }
    }
    /* Resolve the latest version we know of */
    let versionNames = Object.keys(NewReleaseConfig);
    NewReleaseConfig['current'] = versionNames.pop();
    console.log(`\nFinalizeReleaseConfig() :: The latest version I know of is ${NewReleaseConfig['current']} with ${TotalReleases} total releases. If that's not right, go fix it.`);

    /* Hash the object prior to metadata so it can be verified by removing metadata */
    let configHash = hash(NewReleaseConfig);

    /* Add the metadata */
    NewReleaseConfig['metadata'] = {
        generated: Date.now(),
        hash: configHash,
        generator: './scripts/swimm-releases.js'
    };

    /* That's it! */
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
    /* TODO: fail */
    WriteReleaseCache('./releases.imports.json', JSON.stringify(NewReleaseConfig, null, 2));
}

/**
 * 
 * Write the actual configuration that ships with the site. Well, pretend for right now, 
 */
function WriteReleaseConfig() {
    FinalizeReleaseConfig();
    /* TODO: fail */
    WriteReleaseCache('./releases.config.json', JSON.stringify(NewReleaseConfig, null, 2));
}

/**
 * 
 * Read the current site release config into a global.
 * Returns false on failure.
 * @returns {Boolean}  
 */

function LoadCurrentReleaseConfig() {
    if (CurrentReleaseConfig == null)
        CurrentReleaseConfig = JSON.parse(fs.readFileSync('./releases.config.json'));
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
        NewReleaseConfig = JSON.parse(fs.readFileSync('./releases.imports.json'));
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


/* Main execution */




/*
 * https://www.youtube.com/watch?v=5LhcNZk9blQ
 */
if (shajs('sha512').update(process.env.SwimmReleases_Configured).digest('base64') !== 
    '+tAhfeyz6KrpLiVvboiRfDVKOyFp5ROYBiT7DiRawpjNbYzXZbhFkWfJC5jkkbg5+hxWXgq2A7ykrQn4D2dW8g==') {
        console.error('This is not yet ready for use.');
        process.exit(1);
}


RefreshReleaseCache(function(d) {
    console.log('Release Cache Refreshed.');
});

BackfillReleases();
if (TotalReleases > 0) {
    WriteIntermediateReleaseConfig();
    WriteReleaseConfig();
    console.log(`\n${TotalNeededCalls} API calls are needed to import tasks for this run. With ${AllowedCalls} daily allowed calls, that's gonna take ${TotalNeededCalls / AllowedCalls} days.\n`);
    process.exit(0);
}

LoadIntermediateReleaseConfig();
BackfillReleaseNotes();
WriteIntermediateReleaseConfig();
WriteReleaseDrafts();

