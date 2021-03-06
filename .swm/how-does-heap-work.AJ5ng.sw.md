---
id: AJ5ng
name: How Does Heap Work?
file_version: 1.0.2
app_version: 0.9.1-1
file_blobs:
  swimm.config.js: 0451ddd2b7da0ded9e20c21a2b27b9950b8aa9e5
  src/theme/Footer.js: f422471de05ac9b62e8a2a612ebe3a2f6c5c66a1
---

Heap Is Currently Kind Of Messy.
--------------------------------

Originally, we wanted to load heap through Google Tag Manager as described in [SEO Plugin Configuration](seo-plugin-configuration.faNzX.sw.md), however, we could not (for reasons that are yet to be understood) get heap to actually fire on the page, even when the code was obviously there.

To get around that, we're loading it **synchronously** in the footer through an ad-hoc component we call by wrapping the theme/Footer component that actually runs the heap code in the browser. Why the footer? Because right now, the Docusaurus header is a very steady moving target and even wrapping it could cause problems.

How Do I Turn Heap On Or Off?
-----------------------------

If that's all you need to do, see below, and you can skip the rest of this document.

<br/>

Edit the Swimm config, and in `heap`[<sup id="1hXtI7">↓</sup>](#f-1hXtI7) set `enabled`[<sup id="2hlK3e">↓</sup>](#f-2hlK3e) to `false` if you want to turn it off, or `true` if you want to turn it on. A build is required for the change to go live.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 swimm.config.js
```javascript
⬜ 11             release: ':exclamation:  :ocean::ship::swimmer::rocket::new::boom::tada::sparkles:',
⬜ 12             video: ':movie_camera::clapper::cinema:',
⬜ 13         },
🟩 14         heap: {
🟩 15              enabled: false,
🟩 16             id: '2760903549',
🟩 17             params: [
🟩 18                 "addEventProperties", 
🟩 19                 "addUserProperties", 
🟩 20                 "clearEventProperties", 
🟩 21                 "identify", 
🟩 22                 "resetIdentity", 
🟩 23                 "removeEventProperty", 
🟩 24                 "setEventProperties", 
🟩 25                 "track", 
🟩 26                 "unsetEventProperty"
🟩 27             ]
🟩 28         }
⬜ 29     }
⬜ 30     
⬜ 31     export {SiteSettings};
```

<br/>

How is Heap actually sent to the browser and run?
-------------------------------------------------

To avoid swizzling theme components during the Docusaurus2 beta, we define a new footer component that just wraps the standard footer component. This happens in `📄 src/theme/Footer.js`, which Docusaurus knows to load in lieu of the standard footer component:

<br/>

We can't import Footer from Footer because to understand recursion is to understand recursion, so we just grab a reference copy of the original `@theme-original/Footer` as `OrginalFooter`.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/theme/Footer.js
```javascript
🟩 1      import OriginalFooter from '@theme-original/Footer';
⬜ 2      import React from 'react';
```

<br/>

Then, we present the original theme footer through the reference we made, and if (and only if) we're running in a browser do we actually run the code via `<HeapAnalytics>`.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/theme/Footer.js
```javascript
⬜ 30         return null;
⬜ 31     }
⬜ 32     
🟩 33     export default function Footer(props) {
🟩 34         const isBrowser = useIsBrowser();
🟩 35         return (
🟩 36             <>
🟩 37             <OriginalFooter {...props} />
🟩 38             {isBrowser && <HeapAnalytics />}
🟩 39             </>
🟩 40         );
🟩 41     }
```

<br/>

Why is this icky, and what will change?
---------------------------------------

We should just load Heap through `<script>` tags in the header like anything else, and also be able to control events and stuff from the configuration. It's a very simple plugin to write in order to accomplish this, but we'll do that during a cool-down cycle.

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-2hlK3e">enabled</span>[^](#2hlK3e) - "swimm.config.js" L15
```javascript
         enabled: false,
```

<span id="f-1hXtI7">heap</span>[^](#1hXtI7) - "swimm.config.js" L14
```javascript
    heap: {
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBZG9jcy5zd2ltbS5pbyUzQSUzQXN3aW1taW8=/docs/AJ5ng).