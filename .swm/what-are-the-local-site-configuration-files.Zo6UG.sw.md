---
id: Zo6UG
name: What Are The Local Site Configuration Files?
file_version: 1.0.2
app_version: 0.6.3-1
file_blobs:
  docusaurus.config.js: 07d35e2cd6bfee547ea8bc5744c9d1208adb5586
  src/components/SwimmUtils.js: 0cb464d4d114ac2f74512cdb1465098c906d0746
  swimm.config.js: e3a0736ae5e3774ea4afe7767deda06ae23bae01
  swimm.versions.config.js: 5007e00a30036a3d7a7e4d03294784a6823bda99
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
⬜ 42           }),
⬜ 43         ],
⬜ 44       ],
🟩 45       // see https://docusaurus.io/docs/api/docusaurus-config#scripts
🟩 46       scripts: 
🟩 47       [
🟩 48     
🟩 49       ],
⬜ 50       plugins: [
⬜ 51         [
⬜ 52           require.resolve("@easyops-cn/docusaurus-search-local"),
```

<br/>

The Swimm Config
----------------

This config can store whatever needs to be kept track of. Use the functions in `📄 src/components/SwimmUtils.js` to get to it:

<br/>

After you import the SwimmUtils component, you can call `Swimm`[<sup id="Z20hdNe">↓</sup>](#f-Z20hdNe) with an argument to get the configuration object that you need. For instance, `Swimm('version')` would return an object with information about the current version.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/components/SwimmUtils.js
```javascript
⬜ 7      
⬜ 8      import styles from './SwimmUtils.module.css';
⬜ 9      
🟩 10     function Swimm(props) {
🟩 11         var index = props || 'version';
🟩 12         return SiteSettings[index];
🟩 13     }
⬜ 14     
⬜ 15     Swimm.propTypes = {
⬜ 16         index: PropTypes.string
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
⬜ 18         }
⬜ 19     }
⬜ 20     
🟩 21     function GetCurrentSwimmRelease() {
🟩 22         var currentVersion = SwimmVersions.current;
🟩 23         return SwimmVersions[currentVersion];
🟩 24     }
🟩 25     
🟩 26     function GetAllSwimmReleases() {
🟩 27         return SwimmVersions;
🟩 28     }
🟩 29     
🟩 30     function GetSpecificSwimmRelease(props) {
🟩 31         if (typeof(SwimmVersions[props]) != "undefined")
🟩 32             return SwimmVersions[props];
🟩 33         return null;
🟩 34     }
⬜ 35     
⬜ 36     export {
⬜ 37         GetCurrentSwimmRelease as default,
```

<br/>

The history itself is self-explanatory. The null fields are strings when set (URLs to the main blog post, Twitter post and Linked in post (if any) that we ship with some releases.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 swimm.versions.config.js
```javascript
🟩 1      const SwimmVersions = {
🟩 2          current: '0.6.3',
🟩 3          '0.6.3': {
🟩 4              major: 0,
🟩 5              minor: 6,
🟩 6              patch: 3,
🟩 7              blog: null,
🟩 8              tweet: null,
🟩 9              linkedin: null
🟩 10         },
🟩 11         '0.6.2': {
🟩 12             major: 0,
🟩 13             minor: 6,
🟩 14             patch: 2,
⬜ 15             blog: null,
⬜ 16             tweet: null,
⬜ 17             linkedin: null        
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

<span id="f-Z20hdNe">Swimm</span>[^](#Z20hdNe) - "src/components/SwimmUtils.js" L10
```javascript
function Swimm(props) {
```

<span id="f-Z2cFg3m">version</span>[^](#Z2cFg3m) - "swimm.config.js" L4
```javascript
    version: GetCurrentSwimmRelease(),
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/#/repos/Z2l0aHViJTNBJTNBZG9jcy5zd2ltbS5pbyUzQSUzQXN3aW1taW8=/docs/Zo6UG).