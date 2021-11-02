---
id: W8D2A
name: Building Via The Makefile
file_version: 1.0.2
app_version: 0.6.4-0
file_blobs:
  Makefile: 62f138c19c4c70cd40b15f148ecb77cb64b6bafa
  docusaurus.config.js: 30cd143aea2172d645633057483a87891c7b2970
---

Running A Build (And Rebuilding Prod From The Last Change)
----------------------------------------------------------

In almost all cases, you should just use `Make` to build. If you don't have Make installed, you can run the shell commands, but it's strongly encouraged that you use it.

To understand the Makefile, just run `make help` to see the available targets, and an explanation of what they do. The output is defined in the file itself and explained below this snippet:

<br/>

In fact, it's the default target.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 Makefile
```
⬜ 3      -include .buildrc
⬜ 4      
🟩 5      help:
🟩 6      	@echo "Target              | Explanation"
🟩 7      	@echo "------------------- + ------------------------------------------------------------------"
🟩 8      	@echo "production          | Run a complete production build from scratch."
🟩 9      	@echo "rebuild-remote      | Rebuild the production site with no changes."
🟩 10     	@echo "release-notes       | Generate or refresh release notes from clickup"
🟩 11     	@echo "dev                 | alias for npx docusaurus run. Interactive dev environment"
🟩 12     	@echo "debug               | open a browser window to the docusaurus state explorer" 
🟩 13     	@echo "                    | (requires devinstance running)"
🟩 14     	@echo "pretend             | alias for npm docusaurus serve - serve a production build locally."
🟩 15     	@echo "world               | distclean, production and then dev"
🟩 16     	@echo "clean               | remove module cache and build directories"
🟩 17     	@echo "distclean           | runs clean, and also removes .docusaurus and lockfiles"
🟩 18     	@echo "maintainer-clean    | removes *all* untracked files, even if ignored by .gitignore."
🟩 19     	@echo "                    | Use carefully!"
🟩 20     	@echo "help                | this help screen (and default if no other argument is given)"
🟩 21     
🟩 22     all: help
⬜ 23     
⬜ 24     production:
⬜ 25     	@echo "Creating production build"
```

<br/>

To get up and running locally, just run `make world`. To start a development environment just run make `dev`[<sup id="Z1fu52N">↓</sup>](#f-Z1fu52N) . Eventually, a `release-notes` target will run another local script that queries Clickup to generate or refresh a list of all changes as structured in `📄 changelog`

Because Docusaurus V2 is still in beta, there may be _slight_ idiosyncrasies with link and duplicate route checking that don't show up in your local dev environment, however, they will show up when you run a full production build.

So, at the minimum, you should run `make production` at least prior to pushing, and ideally before commits to any changes to the link. structure of the site. This behavior is defined in `📄 docusaurus.config.js`

<br/>

If you want to ask Netlify to rebuild the site from the latest ref (HEAD) without any changes being applied (for dynamic hooks), you can do it with the `rebuild`[<sup id="ZgJ4b1">↓</sup>](#f-ZgJ4b1) target. First, set the environmental variable `NETLIFY_REBUILD_WEBHOOK`[<sup id="Z23vEV9">↓</sup>](#f-Z23vEV9) to be the URL of the site's 'rebuild' web hook as obtained by logging into Netlify. You'll also obviously need curl.

To avoid exporting it all the time, the Makefile will read environmental vars from a `.buildrc` file, which is part of the Makefile help output:
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 Makefile
```
⬜ 26     	npm install --legacy-peer-deps && npm run build || true
⬜ 27     
🟩 28     rebuild-remote:
🟩 29     ifndef NETLIFY_REBUILD_WEBHOOK
🟩 30     	@echo
🟩 31     	@echo "NETLIFY_REBUILD_WEBHOOK must be set to the correct URL in the enviornment."
🟩 32     	@echo "If you create a .buildrc file in the same directory as the Makefile with it defined, it will be included."
🟩 33     	@echo
🟩 34     	@echo "Try this:"
🟩 35     	@echo "    echo \"NETLIFY_REBUILD_WEBHOOK=https//url.to.webhook\" > .buildrc"
🟩 36     	@echo "    echo \".buildrc\" >> .gitignore"
🟩 37     	@echo 
🟩 38     	@echo "This makes sure the hook isn't shared or tracked, but keeps you from having to keep exporting it."
🟩 39     	@echo
🟩 40     	@exit 1
🟩 41     endif
🟩 42     	@curl -X POST -d '{}' ${NETLIFY_REBUILD_WEBHOOK} > /dev/null 2>&1
🟩 43     	@exit $?
⬜ 44     
⬜ 45     clean:
⬜ 46     	@echo "Clearing build cache ..."
```

<br/>

Build Behavior & Tests
----------------------

The Docusaurus configuration file dictates how certain kinds of breakage should be treated during the build. Throughout the content process, we use a `<Link />` component to manage links (see [How Do Links Work?](how-do-links-work.ANv7K.sw.md) ). External links are not (yet) validated on build, but internal links are.

If an internal link made with the `<Link />` component can't be resolved to a specific route, the behavior is to throw an exception. Internal broken links are very bad for SEO and can create interesting issues with automatic sitemap generator.

If you _must_ insert a non-working link (for cases where content will not be available until the site is generated and running in production, such as additional navigation in a search context) then use regular markdown link syntax, e.g, `[link title](https://example.com)`. If that **positively** will not work, the behavior can be changed in the Docusaurus configuration file, but make absolutely certain you're solving the problem the right way.

<br/>

We throw `onBrokenLinks`[<sup id="Zl2UoL">↓</sup>](#f-Zl2UoL) because we never want to push a broken link. This means any link defined in the header, footer, or sidebar, as well as any link created by the `@docusaurus/Link` component.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 docusaurus.config.js
```javascript
⬜ 8        tagline: 'Swimm Dev Docs',
⬜ 9        url: 'https://docs.swimm.io',
⬜ 10       baseUrl: '/',
🟩 11       onBrokenLinks: 'throw',
🟩 12       onBrokenMarkdownLinks: 'warn',
⬜ 13       favicon: 'img/favicon.svg',
⬜ 14       organizationName: 'swimmio', // Usually your GitHub org/user name.
⬜ 15       projectName: 'docs.swimm.io', // Usually your repo name.
```

<br/>

Lints & Static Analysis
-----------------------

For right now, we're not using any Markdown lints in the `📄 docs` `📄 src/pages` or `📄 changelog` directories because there are still too many vague corner cases with MDX that can create confusion. Non-devs on the marketing team might need to update or create content, and they shouldn't need to deal with weird behavior from seeing it work on the local dev server to seeing it break in production. MDX can sometimes break if a newline separator is missing, or other circumstances where automatic linting could create infuriating bugs.

When MDX matures a bit more, we'll run lints for markdown. In the meantime, you can use whatever you want for JS & CSS.

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-Z1fu52N">dev</span>[^](#Z1fu52N) - "Makefile" L1
```
.PHONY: all help production rebuild-remote clean distclean dev debug world
```

<span id="f-Z23vEV9">NETLIFY_REBUILD_WEBHOOK</span>[^](#Z23vEV9) - "Makefile" L29
```
ifndef NETLIFY_REBUILD_WEBHOOK
```

<span id="f-Zl2UoL">onBrokenLinks</span>[^](#Zl2UoL) - "docusaurus.config.js" L11
```javascript
  onBrokenLinks: 'throw',
```

<span id="f-ZgJ4b1">rebuild</span>[^](#ZgJ4b1) - "Makefile" L28
```
rebuild-remote:
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBZG9jcy5zd2ltbS5pbyUzQSUzQXN3aW1taW8=/docs/W8D2A).