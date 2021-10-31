---
id: W8D2A
name: Building Via The Makefile
file_version: 1.0.2
app_version: 0.6.4-0
file_blobs:
  Makefile: 0ab27439987023497000a12aaee9239ff398ea07
  docusaurus.config.js: 07d35e2cd6bfee547ea8bc5744c9d1208adb5586
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
🟩 6      	@echo "Target                     | Explanation"
🟩 7      	@echo "production                 | Run a complete production build from scratch."
🟩 8      	@echo "rebuild-remote             | Rebuild the production site with no changes."
🟩 9      	@echo "release-notes              | Generate or refresh release notes from clickup"
🟩 10     	@echo "dev                        | alias for npx docusaurus run. Interactive dev environment"
🟩 11     	@echo "pretend                    | alias for npm docusaurus serve - serve a production build locally."
🟩 12     	@echo "world                      | distclean, production and then dev"
🟩 13     	@echo "clean                      | remove module cache and build directories"
🟩 14     	@echo "distclean                  | runs clean, and also removes .docusaurus and lockfiles"
🟩 15     	@echo "help                       | this help screen (and default if no other argument is given)"
🟩 16     
🟩 17     all: help
⬜ 18     
⬜ 19     production:
⬜ 20     	@echo "Creating production build"
```

<br/>

To get up and running locally, just run make `world`[<sup id="k0gwV">↓</sup>](#f-k0gwV) . To start a development environment just run make `dev`[<sup id="Z1fu52N">↓</sup>](#f-Z1fu52N) . Eventually, the `release-notes`[<sup id="Z1qSKUd">↓</sup>](#f-Z1qSKUd) target will run another local script that queries Clickup to generate or refresh a list of all changes as structured in `📄 changelog`

Because Docusaurus V2 is still in beta, there may be _slight_ idiosyncrasies with link and duplicate route checking that don't show up in your local dev environment, however, they will show up when you run a full production build.

So, at the minimum, you should run `make production` at least prior to pushing, and ideally before commits to any changes to the link. structure of the site. This behavior is defined in `📄 docusaurus.config.js`

<br/>

If you want to ask Netlify to rebuild the site from the latest ref (HEAD) without any changes being applied (for dynamic hooks), you can do it with the `rebuild`[<sup id="fyJzh">↓</sup>](#f-fyJzh) target. First, set the environmental variable `NETLIFY_REBUILD_WEBHOOK`[<sup id="Z1wcQaQ">↓</sup>](#f-Z1wcQaQ) to be the URL of the site's 'rebuild' web hook as obtained by logging into Netlify. You'll also obviously need curl.

To avoid exporting it all the time, the Makefile will read environmental vars from a `.buildrc` file, which is part of the Makefile help output:
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 Makefile
```
⬜ 21     	npm install && npm run build || true
⬜ 22     
🟩 23     rebuild-remote:
🟩 24     ifndef NETLIFY_REBUILD_WEBHOOK
🟩 25     	@echo
🟩 26     	@echo "NETLIFY_REBUILD_WEBHOOK must be set to the correct URL in the enviornment."
🟩 27     	@echo "If you create a .buildrc file in the same directory as the Makefile with it defined, it will be included."
🟩 28     	@echo
🟩 29     	@echo "Try this:"
🟩 30     	@echo "    echo \"NETLIFY_REBUILD_WEBHOOK=https//url.to.webhook\" > .buildrc"
🟩 31     	@echo "    echo \".buildrc\" >> .gitignore"
🟩 32     	@echo 
🟩 33     	@echo "This makes sure the hook isn't shared or tracked, but keeps you from having to keep exporting it."
🟩 34     	@echo
🟩 35     	@exit 1
🟩 36     endif
🟩 37     	@curl -X POST -d '{}' ${NETLIFY_REBUILD_WEBHOOK} > /dev/null 2>&1
🟩 38     	@exit $?
⬜ 39     
⬜ 40     clean:
⬜ 41     	@echo "Clearing build cache ..."
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
.PHONY: all help production rebuild-remote clean distclean dev pretend
```

<span id="f-Z1wcQaQ">NETLIFY_REBUILD_WEBHOOK</span>[^](#Z1wcQaQ) - "Makefile" L24
```
ifndef NETLIFY_REBUILD_WEBHOOK
```

<span id="f-Zl2UoL">onBrokenLinks</span>[^](#Zl2UoL) - "docusaurus.config.js" L11
```javascript
  onBrokenLinks: 'throw',
```

<span id="f-fyJzh">rebuild</span>[^](#fyJzh) - "Makefile" L23
```
rebuild-remote:
```

<span id="f-Z1qSKUd">release-notes</span>[^](#Z1qSKUd) - "Makefile" L9
```
	@echo "release-notes              | Generate or refresh release notes from clickup"
```

<span id="f-k0gwV">world</span>[^](#k0gwV) - "Makefile" L12
```
	@echo "world                      | distclean, production and then dev"
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBZG9jcy5zd2ltbS5pbyUzQSUzQXN3aW1taW8=/docs/W8D2A).