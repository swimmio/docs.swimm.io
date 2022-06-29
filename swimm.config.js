import GetCurrentSwimmRelease from './src/components/SwimmVersions.js';

const SiteSettings = {
    version: GetCurrentSwimmRelease(),
    community: {
        slack: 'https://swimm.io/slack',
        officeHours: 'https://calendly.com/timpost/swimm-s-office-hours-with-tim-post',
    },
    emojiShortcuts: {
        default: ':ocean:',
        release: ':exclamation:  :ocean::ship::swimmer::rocket::new::boom::tada::sparkles:',
        video: ':movie_camera::clapper::cinema:',
    },
    heap: {
        enabled: false,
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
