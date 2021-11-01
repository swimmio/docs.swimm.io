---
id: Zo6UG
name: What Are The Local Site Configuration Files?
file_version: 1.0.2
app_version: 0.6.4-0
file_blobs:
  docusaurus.config.js: 30cd143aea2172d645633057483a87891c7b2970
  src/components/SwimmUtils.js: bdca3bf6eea4ed603dc2c45b51b178c65a607b63
  swimm.config.js: e3a0736ae5e3774ea4afe7767deda06ae23bae01
  swimm.versions.config.js: d1111e2af9b3dd92c3564c9b10bf9882593b1dae
---

We have three main configuration files that you need to know about:

1.  `📄 docusaurus.config.js` which is the main Docusaurus configuration.
    
2.  `📄 swimm.config.js` which holds Swimm-related config items for things that aren't components of Docusaurus.
    
3.  `📄 swimm.versions.config.js` which holds metadata about all Swimm releases (or, it soon will)

<br/>

The Docusaurus Config
---------------------

The Docusaurus config is fairly well commented. The only other thing to be aware if is that it's guarded - you can't add values it's not expecting.

<br/>

If you want to add anything to the global config, you have to add it as a child of `customFields`[<sup id="1b4Gb8">↓</sup>](#f-1b4Gb8). There aren't many cases where this would be optimal, most Swimm-specific stuff should go in `📄 swimm.config.js` .
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 docusaurus.config.js
```javascript
⬜ 14       organizationName: 'swimmio', // Usually your GitHub org/user name.
⬜ 15       projectName: 'docs.swimm.io', // Usually your repo name.
⬜ 16       titleDelimiter: '🏊',
🟩 17       customFields: {},
⬜ 18       presets: [
⬜ 19         [
⬜ 20           '@docusaurus/preset-classic',
```

<br/>

You can also define scripts that will be put in the head of every page.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 docusaurus.config.js
```javascript
⬜ 46           }),
⬜ 47         ],
⬜ 48       ],
🟩 49       // see https://docusaurus.io/docs/api/docusaurus-config#scripts
🟩 50       scripts: 
🟩 51       [
🟩 52     
🟩 53       ],
⬜ 54       plugins: [
⬜ 55         [
⬜ 56           require.resolve("@easyops-cn/docusaurus-search-local"),
```

<br/>

The Swimm Config
----------------

This config can store whatever needs to be kept track of. Use the functions in `📄 src/components/SwimmUtils.js` to get to it:

<br/>

After you import the SwimmUtils component, you can call `Swimm`[<sup id="Z1bdEdk">↓</sup>](#f-Z1bdEdk) with an argument to get the configuration object that you need. For instance, `Swimm('version')` would return an object with information about the current version.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/components/SwimmUtils.js
```javascript
⬜ 8      
⬜ 9      import styles from './SwimmUtils.module.css';
⬜ 10     
🟩 11     function Swimm(props) {
🟩 12         var index = props || 'version';
🟩 13         return SiteSettings[index];
🟩 14     }
⬜ 15     
⬜ 16     Swimm.propTypes = {
⬜ 17         index: PropTypes.string
```

<br/>

The objects in `SiteSettings`[<sup id="28FeRl">↓</sup>](#f-28FeRl) contain what's needed. Add more as needed. Note that `version`[<sup id="Z2cFg3m">↓</sup>](#f-Z2cFg3m) comes from `GetCurrentSwimmRelease`[<sup id="1j2puY">↓</sup>](#f-1j2puY), which comes from `📄 swimm.versions.config.js`
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 swimm.config.js
```javascript
⬜ 1      import GetCurrentSwimmRelease from './swimm.versions.config.js';
⬜ 2      
🟩 3      const SiteSettings = {
🟩 4          version: GetCurrentSwimmRelease(),
🟩 5          community: {
🟩 6              slack: 'https://swimm.live/slack',
🟩 7              officeHours: 'https://calendly.com/timpost/swimm-s-office-hours-with-tim-post',
🟩 8          },
🟩 9          emojiShortcuts: {
🟩 10             default: ':ocean:',
🟩 11             release: ':exclamation:  :ocean::ship::swimmer::rocket::new::boom::tada::sparkles:', 
🟩 12         },
🟩 13         heap: {
🟩 14              enabled: true,
🟩 15             id: '2760903549',
🟩 16             params: [
🟩 17                 "addEventProperties", 
🟩 18                 "addUserProperties", 
🟩 19                 "clearEventProperties", 
🟩 20                 "identify", 
🟩 21                 "resetIdentity", 
🟩 22                 "removeEventProperty", 
🟩 23                 "setEventProperties", 
🟩 24                 "track", 
🟩 25                 "unsetEventProperty"
🟩 26             ]
🟩 27         }
🟩 28     }
⬜ 29     
⬜ 30     export {SiteSettings};
```

<br/>

The Swimm Releases Config
-------------------------

This is just a config that contains (or soon will) all of the Swimm releases with metadata about each one. This will soon be backfilled from all previous releases.

The config exports a couple of functions to make it convenient to get to the data

<br/>

Once you have included the config like any other component, you can get the current release or all releases, or a specific release by name.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 swimm.versions.config.js
```javascript
⬜ 6          '0.4.4': {major: 0,minor: 4,patch: 4,blog: 'https://swimm.io/blog/release-notes-dive-into-0-4-4/',tweet: '1390180301993910278',linkedin: null},
⬜ 7      }
⬜ 8      
🟩 9      function GetCurrentSwimmRelease() {
🟩 10         var currentVersion = SwimmVersions.current;
🟩 11         return SwimmVersions[currentVersion];
🟩 12     }
🟩 13     
🟩 14     function GetAllSwimmReleases() {
🟩 15         return SwimmVersions;
🟩 16     }
🟩 17     
🟩 18     function GetSpecificSwimmRelease(props) {
🟩 19         if (typeof(SwimmVersions[props]) != "undefined")
🟩 20             return SwimmVersions[props];
🟩 21         return null;
🟩 22     }
⬜ 23     
⬜ 24     export {
⬜ 25         GetCurrentSwimmRelease as default,
```

<br/>

The history itself is self-explanatory. The null fields are strings when set (URLs to the main blog post, Twitter post and Linked in post (if any) that we ship with some releases.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 swimm.versions.config.js
```javascript
🟩 1      const SwimmVersions = {
🟩 2          current: '0.6.4',
🟩 3          '0.6.4': {major: 0,minor: 6,patch: 4,blog: null,tweet: null,linkedin: null},
🟩 4          '0.6.3': {major: 0,minor: 6,patch: 3,blog: null,tweet: null,linkedin: null},
🟩 5          '0.6.2': {major: 0,minor: 6,patch: 2,blog: null,tweet: null,linkedin: null},
🟩 6          '0.4.4': {major: 0,minor: 4,patch: 4,blog: 'https://swimm.io/blog/release-notes-dive-into-0-4-4/',tweet: '1390180301993910278',linkedin: null},
🟩 7      }
⬜ 8      
⬜ 9      function GetCurrentSwimmRelease() {
⬜ 10         var currentVersion = SwimmVersions.current;
```

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-1b4Gb8">customFields</span>[^](#1b4Gb8) - "docusaurus.config.js" L17
```javascript
  customFields: {},
```

<span id="f-1j2puY">GetCurrentSwimmRelease</span>[^](#1j2puY) - "swimm.config.js" L4
```javascript
    version: GetCurrentSwimmRelease(),
```

<span id="f-28FeRl">SiteSettings</span>[^](#28FeRl) - "swimm.config.js" L3
```javascript
const SiteSettings = {
```

<span id="f-Z1bdEdk">Swimm</span>[^](#Z1bdEdk) - "src/components/SwimmUtils.js" L11
```javascript
function Swimm(props) {
```

<span id="f-Z2cFg3m">version</span>[^](#Z2cFg3m) - "swimm.config.js" L4
```javascript
    version: GetCurrentSwimmRelease(),
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBZG9jcy5zd2ltbS5pbyUzQSUzQXN3aW1taW8=/docs/Zo6UG).