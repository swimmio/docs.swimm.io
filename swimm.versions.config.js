const SwimmVersions = {
    current: '0.6.3',
    '0.6.3': {
        major: 0,
        minor: 6,
        patch: 3,
        blog: null,
        tweet: null,
        linkedin: null
    },
    '0.6.2': {
        major: 0,
        minor: 6,
        patch: 2,
        blog: null,
        tweet: null,
        linkedin: null        
    }
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