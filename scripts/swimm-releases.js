#!/usr/bin/env node

const fs = require('fs');
/* We get all possible releases */
const ExportedReleases = JSON.parse(fs.readFileSync('./releases.exports.json'));

/**
 * maor.minor.patch
 * major.minor.patch-patchlevel
 * major.minor.patch.patchlevel
 */
const ReleasePattern = /(^[0-9]+['.']+[0-9]+['.']+[0-9])+([\.]?[0-9]?)+([\-?]+[0-9?])?/gm;

let NewReleaseConfig = {};

function ImportRelease(version, ReleaseData) {
    /* Define the version structure */
    let keys = ['major', 'minor', 'patch', 'patchlevel', 'security', 'blog', 'tweet', 'linkedin'];
    
    /* Fill in what we have from the scripts */
    let values = version.replace('-', '.').split('.');
    const release = keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index] ? values[index] : null }), {});
    NewReleaseConfig[version]=release;

    /* Oh Clickup, how you love your lists of lists of lists <3 <3 <3 */
    NewReleaseConfig[version]['lists'] = {};
    for (const [key, value] of Object.entries(ReleaseData['lists'])) {
        NewReleaseConfig[version]['lists'][ReleaseData['lists'][key]['id']] = ReleaseData['lists'][key]['name'];
    }
}

function ImportReleases(ReleaseData) { 
    for (const [key, value] of Object.entries(ExportedReleases.folders)) {
        let search = value.name.match(ReleasePattern);
        if (search !== null) {
            let release = search.toString();
            ImportRelease(release, value)
        }
    }
}

ImportReleases(ExportedReleases);


fs.writeFileSync('./imports.json', JSON.stringify(NewReleaseConfig, null, 2) , 'utf-8');
