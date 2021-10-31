import GetCurrentSwimmRelease from './swimm.versions.config.js';

const SiteSettings = {
    version: GetCurrentSwimmRelease(),
    community: {
        slack: 'https://swimm.live/slack',
        officeHours: 'https://calendly.com/timpost/swimm-s-office-hours-with-tim-post',
    },
    emojiShortcuts: {
        default: ':ocean:',
        release: ':exclamation:  :ocean::ship::swimmer::rocket::new::boom::tada::sparkles:', 
    },
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

export {SiteSettings};