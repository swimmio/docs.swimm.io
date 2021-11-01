const SwimmVersions = {
    current: '0.6.4',
    '0.6.4': {major: 0,minor: 6,patch: 4,blog: null,tweet: null,linkedin: null},
    '0.6.3': {major: 0,minor: 6,patch: 3,blog: null,tweet: null,linkedin: null},
    '0.6.2': {major: 0,minor: 6,patch: 2,blog: null,tweet: null,linkedin: null},
    '0.4.4': {major: 0,minor: 4,patch: 4,blog: 'https://swimm.io/blog/release-notes-dive-into-0-4-4/',tweet: '1390180301993910278',linkedin: null},
}

function GetCurrentSwimmRelease() {
    var currentVersion = SwimmVersions.current;
    return SwimmVersions[currentVersion];
}

function GetAllSwimmReleases() {
    return SwimmVersions;
}

function GetSpecificSwimmRelease(props) {
    if (typeof(SwimmVersions[props]) != "undefined")
        return SwimmVersions[props];
    return null;
}

export {
    GetCurrentSwimmRelease as default,
    GetAllSwimmReleases,
    GetSpecificSwimmRelease,
    SwimmVersions
}