#!/usr/bin/env node

const fs = require('fs');
/* We get all possible releases */
const ExportedReleases = JSON.parse(fs.readFileSync('./swimm.app.state.json'));

/**
 * maor.minor.patch
 * major.minor.patch-patchlevel
 * major.minor.patch.patchlevel
 */
const ReleasePattern = /(^[0-9]+['.']+[0-9]+['.']+[0-9])+([\.]?[0-9]?)+([\-?]+[0-9?])?/gm;

let NewReleaseConfig = {};

function ImportRelease(version, ReleaseData) {
    let keys = ['major', 'minor', 'patch', 'patchlevel', 'security', 'blog', 'tweet', 'linkedin'];
    let values = version.replace('-', '.').split('.');
    const release = keys.reduce((obj, key, index) => ({ ...obj, [key]: values[index] ? values[index] : null }), {});
    NewReleaseConfig[version]=release;
    NewReleaseConfig[version]['lists'] = ReleaseData['lists'];
}

function ImportReleases(ReleaseData) { 
    for (const [key, value] of Object.entries(ExportedReleases.folders)) {
        let search = value.name.match(ReleasePattern);
        if (search !== null) {
            /* We have a release, normalize the nomenclature */
            let release = search.toString();
            /* Pass it to a helper function */
            ImportRelease(release, value)
        }
    }
}

ImportReleases(ExportedReleases);


let tmp = NewReleaseConfig['0.6.3'];

console.log(tmp, tmp.lists);