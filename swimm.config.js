const SiteSettings = {
    version: {
        major: 0,
        minor: 6,
        patch: 3,
        codename: null,
        blog: null,
        tweet: null,
        linkedin: null
    },
    community: {
        slack: 'https://swimm.live/slack',
        officeHours: null,
    },
    analytics: {
        heap: {
            enabled: true,
            id: '2760903549',
            params: [
                "addEventProperties", 
                "addUserProperties", 
                "clearEventProperties", 
                "identify", 
                "resetIdentity", 
                "removeEventProperty", 
                "setEventProperties", 
                "track", 
                "unsetEventProperty"
            ]
        }
    }
}

export {
    SiteSettings,
}