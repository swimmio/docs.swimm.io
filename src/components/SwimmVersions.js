import SwimmVersions from '../../releases.config.json';

/**
 * Get the version object for the current Swimm version. 
 * @returns {Object}
 */
function GetCurrentSwimmRelease() {
    var currentVersion = SwimmVersions.current;
    return SwimmVersions[currentVersion];
}

/**
 * Get info about a specific release. 
 * @param {props} props The version to get.
 * @returns object or null
 */
function GetSpecificSwimmRelease(props) {
    if (typeof(SwimmVersions[props]) != "undefined")
        return SwimmVersions[props];
    return null;
}

export {
    GetCurrentSwimmRelease as default,
    GetSpecificSwimmRelease
}