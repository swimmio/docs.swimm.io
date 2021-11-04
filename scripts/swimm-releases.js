#!/usr/bin/env node

const { resolve } = require('path');

/** Copyright 2021 Swimm, Inc.
 * Tool to import release notes from Swimm's task & bug tracker (ClickUp, currently)
 * Not really useful to anyone else without modification, but it's easy enough to ship
 * in this repository. Requires configuration from environmental variables that aren't
 * included here.
 * 
 * License: MIT
 */


/* What can a release look like? 0.6.3 || 0.6.3.1 || 0.6.3-1 */
const ValidVersionPattern = /(^[0-9]+['.']+[0-9]+['.']+[0-9])+([\.]?[0-9]?)+([\-?]+[0-9?])?/gm;

/* A Global release config object that many things contribute to building. */
let NewReleaseConfig = {};

let fs = require('fs');
let https = require('https');
let shajs = require('sha.js');
let command = require('commander');

/**
 * Here's where we actually query to get a list of changes from each list associated with this release.
 * 
 * This is what we use to pre-populate the release notes, which we hand-edit before publishing.
 * 
 * @param {String} version - Swimm release, e.g, 0.7.8-9 or 9.8.7.6 
 * @returns {Object}
 */
function GetReleaseTasks(version) {
    return null;
}

/**
 * Build a release object with things associated with a version.
 * 
 * @param {Object} versionContext - context for the release (factory, or from the command line)
 * @param {Object} ReleaseData - chunk of release data where this version can be found.
 */
function ImportRelease(versionContext, releaseData) {
    /* Figure out the version, and fill in what we know about it from context */
    let keys = ['major', 'minor', 'patch', 'patchlevel'];
    let versionName = versionContext['name'];
    let values = versionName.replace('-', '.').split('.');
    const releaseVersion = keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index] ? values[index] : null }), {});
    NewReleaseConfig[versionName] = {
        ...releaseVersion,
        ...versionContext
    };

    /* Now, get list of lists of lists so we know how to ask what changed in this release. */ 
    NewReleaseConfig[versionName]['changes'] = {};
    let statuses = {};
    for (const [key, value] of Object.entries(releaseData['lists'])) {
        let needle = releaseData['lists'][key]['id'];
        NewReleaseConfig[versionName]['changes'][needle] = {name: releaseData['lists'][key]['name']};
        for (const [key1, value1] of Object.entries(releaseData['lists'][key]['statuses'])) {
            statuses[key1] = {id: value1['id'], status: value1['status'], type: value1['type']};
        }
       NewReleaseConfig[versionName]['changes'][needle]['taskLists'] = { statuses }; 
    }
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
        security: false, 
        blog: null, 
        tweet: null, 
        youtube:null, 
        linkedin: null
    };
    return backfill;
}

/**
 * Backfill any releases (into the config) that don't currently have release notes.
 */
function BackfillReleases() {
    let exportedReleases = JSON.parse(fs.readFileSync('./releases.exports.json'));
    for (const [key, value] of Object.entries(exportedReleases.folders)) {
        let search = value.name.match(ValidVersionPattern);
        if (search !== null) {
            let release = search.toString();
            ImportRelease(ReleaseContextFactory(release), value);
        }
    }
}

/**
 * Send a GET request to the ClickUp API
 * @param {} queryUrl 
 * @returns 
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
 * @returns {object} Exported releases, suitable for ImportRelease() or ImportReleases()
 */
async function RefreshReleaseCache() {
    return new Promise(async (resolve, reject) => {
        let queryUrl = `/api/v2/space/${process.env.SwimmReleases_ReleaseSpaceId}/folder?archived=true`;
        SendAPIRequest(queryUrl).then((value) => {
            WriteReleaseCache('./releases.exports.json', value);
        });
    });
}

/**
 * Ultimately, this needs to remve the lists and statuses from the config prior to writing
 * the (tracked) configuration file. Right now we just dump it into something that we know
 * won't be tracked.
 */
function WriteReleaseConfig() {
    WriteReleaseCache('./releases.imports.json', JSON.stringify(NewReleaseConfig, null, 2));
}

/* Main execution / argument parsing / etc */

/* This needs to be very inconvenient to execute right now. */
if (shajs('sha512').update(process.env.SwimmReleases_Configured).digest('base64') !== 
    '+tAhfeyz6KrpLiVvboiRfDVKOyFp5ROYBiT7DiRawpjNbYzXZbhFkWfJC5jkkbg5+hxWXgq2A7ykrQn4D2dW8g==') {
        console.error('This is not yet ready for use.');
        process.exit(1);
}


//RefreshReleaseCache().then((value) => { resolve(value); });

BackfillReleases();
WriteReleaseConfig();
