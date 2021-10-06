<div align="center" style="background-color: #e5ecff; color: black"><br/><div>DOC</div><h1>Creating Custom Components</h1><br/></div>
<br/>

### Files Used
📄 src/components/SocialAccounts.js

📄 src/components/SocialAccounts.module.css


<br/>

Docusaurus brings the full power of React, so it's very straightforward to install and use new components via `npm` or create something on-the-fly.

To create one, first create a new file in `src/components ✓` named after your component along with whatever style customizations it will use. A great example of this is in `src/components/SocialAccounts.js ✓` with the corresponding styles in `src/components/SocialAccounts.module.css ✓`

<br/>

First, bring in React, then whatever additional components you'll need (you probably want to grab `clsx ✓` unless you're not generating any markup at all). After that, import your component styles.

<div style="background: #e5ecff; padding: 10px 10px 10px 10px; border-bottom: 1px solid #c1c7d0; border-radius: 4px; color: black">    📄 src/components/SocialAccounts.js ✅ Up to Date*

   </div>

```javascript
🟩 1      import React from 'react';
🟩 2      import clsx from 'clsx';
🟩 3      import { SocialIcon } from 'react-social-icons';
🟩 4      import styles from './SocialAccounts.module.css';
⬜ 5      
⬜ 6      const SocialList = [
⬜ 7      {
```
<br/>

Then, add whatever content is needed. Docusaurus guards the main `docusaurus.config.js ✓` file, although it does make provisions for some custom modules, it's better to just define things in the component itself. We may change how this works depending upon future translation needs, but for now just keep it all together.

<div style="background: #e5ecff; padding: 10px 10px 10px 10px; border-bottom: 1px solid #c1c7d0; border-radius: 4px; color: black">    📄 src/components/SocialAccounts.js ✅ Up to Date*

   </div>

```javascript
⬜ 3      import { SocialIcon } from 'react-social-icons';
⬜ 4      import styles from './SocialAccounts.module.css';
⬜ 5      
🟩 6      const SocialList = [
🟩 7      {
🟩 8          label: "Twitter",
🟩 9          social_url: "https://twitter.com/swimmio",
🟩 10         metadata: (
🟩 11             <>
🟩 12             We love when people tweet about their experiences
🟩 13             with Swimm! Follow us for updates and ways to get
🟩 14             cool swag 😎
🟩 15             </>
🟩 16         ),
🟩 17     },
🟩 18     {
🟩 19         label: "Github",
🟩 20         social_url: "https://github.com/swimmio",
🟩 21         metadata: (
⬜ 22             <>
⬜ 23             Code tutorials, utilities, and examples of open
⬜ 24             source projects using Swimm!
```
<br/>

Use whatever functions you need to build your output. While it's not shown here, you can [get the Docusaurus configuration context within any function](https://docusaurus.io/docs/docusaurus-core#usedocusauruscontext) very easily (it just has to be within a function). This is handy if you need the site URL, or something else that's defined in `docusaurus.config.js ✓`

<div style="background: #e5ecff; padding: 10px 10px 10px 10px; border-bottom: 1px solid #c1c7d0; border-radius: 4px; color: black">    📄 src/components/SocialAccounts.js ✅ Up to Date*

   </div>

```javascript
⬜ 76     },
⬜ 77     ];
⬜ 78     
🟩 79     function SocialCard({label, social_url, metadata}) {
🟩 80         return (
🟩 81             <div className={clsx('col col--4')}>
🟩 82                 <div className="text--center">
🟩 83                     <SocialIcon url={"" + social_url + ""} style={{height: 100, width: 100}} label={"" + label + ""} />
🟩 84                 </div>
🟩 85                 <div className="text--center padding-horiz--md">
🟩 86                     <p>{metadata}</p>
🟩 87                 </div>
🟩 88             </div>
🟩 89         );
🟩 90     }
⬜ 91     
⬜ 92     export default function ListSocialAccounts() {
⬜ 93         return (
```
<br/>

Then export whatever you want to make available, just make sure you have a default and (only) one of them is exported as such.

<div style="background: #e5ecff; padding: 10px 10px 10px 10px; border-bottom: 1px solid #c1c7d0; border-radius: 4px; color: black">    📄 src/components/SocialAccounts.js ✅ Up to Date*

   </div>

```javascript
⬜ 89         );
⬜ 90     }
⬜ 91     
🟩 92     export default function ListSocialAccounts() {
🟩 93         return (
🟩 94             <section className={styles.socialCard}>
🟩 95                 <div className="container">
🟩 96                     <div className="row">
🟩 97                         {SocialList.map((props, idx) => (
🟩 98                             <SocialCard key={idx} {...props} />
🟩 99                         ))}
🟩 100                    </div>
🟩 101                </div>
🟩 102            </section>
🟩 103        );
🟩 104    }
```
<br/>

Because not every component is loaded on every page, there's no reason to always have their styles loaded in the global scope. Additionally, even if we are using a plugin somewhere that renders on every page load (e.g. in the footer), that doesn't mean we'll always be using it. If we disable it, then any styles associated with it become useless overhead.

Finally, if we ever want to package the component separately, it's ideal to package the styles in a self-contained way.

If you're writing a component and the urge to stick something in `src/css/custom.css ✓` sneaks in, there's a really good chance you're not writing a mere component anymore.

<div style="background: #e5ecff; padding: 10px 10px 10px 10px; border-bottom: 1px solid #c1c7d0; border-radius: 4px; color: black">    📄 src/components/SocialAccounts.module.css ✅ Up to Date*

   </div>

```css
🟩 1      .socialCard {
🟩 2          display: flex;
🟩 3          align-items: center;
🟩 4          padding: 2rem 0;
🟩 5          width: 100%;
🟩 6      }
```
<br/>

<br/><br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/#/repos/Z2l0aHViJTNBJTNBZG9jcy5zd2ltbS5pbyUzQSUzQXN3aW1taW8=/docs/DV_q9). Timestamp: 2021-10-06T14:53:19.339Z (UTC)