# How To Upgrade To `sw.md` Format

We're working hard on an upcoming release of Swimm that will bring us quite
a few steps closer to saving documentation without the need for additional
metadata within the document itself. We want Swimm to be a full-fledged 
docs-as-code (DAC) solution, so we're working on getting rid of the JSON.

Swimm Markdown (pronounced "swahm-dee", or "swimm-dee") is how the new format 
is being developed, and we'll be telling you all about it in the very near future. 

**Right now, our product teams really need your help. They need you to 
upgrade to the new type now, so that they can continue developing it.**

This only takes a minute, and we thank you from the deep oceans of our 💙s.

## Web Users

Fix and commit any outdated docs.

At the top of the repository view, you'll see the following banner:

!["Save Docs In The New Markdown Format Banner"](/img/desktop/upgrade-banner.png)

Click that, and follow through the dialog box that asks you to open a PR to 
upgrade:

!["Save Docs In sw.md dialog"](/img/desktop/swmd-upgrade-dialog.png)

After that, merge the PR to your main branch. **Your upgrade is now done**.

## Desktop Users

Make sure you're running the latest version.

In a terminal, change into the repo directory and run the following
command to verify that all your docs are up-to-date:

```sh
swimm verify
```

Fix and commit any outdated docs using the Swimm app.

Open the `.swm/swimm.json` file (relative to your repository root). The file
for the repository that hosts this website currently looks like this:

```js
{
    "repo_id": "cu1SPrdutxiowHC7RsFY"
}
```

You need to add the custom `configuration` object as shown below:

```js
{
    "repo_id": "cu1SPrdutxiowHC7RsFY",
    "configuration": {
        "swmd": true
    }
}
```

Then, in a terminal, run the following
command:

```sh
swimm upgrade-files -a
```

You'll see something resembling the following output:

```sh
┌─[timothypost@tim] - [~/code/swimm.io/docs.swimm.io] - [2021-10-13 10:22:18]
└─[0] <git:(master 6fe4730) > swimm upgrade-files -a
Info: Verifying units before attempting to upgrade...

✔ How Do Links Work? (ANv7K) is verified.
✔ Creating Static Pages (CVk1i) is verified.
✔ Creating Custom Components (DV_q9) is verified.
✔ Building The Site Manually (Rmly2) is verified.
✔ Building Via The Makefile (W8D2A) is verified.
✔ Creating Documents (W9vNb) is verified.
✔ Creating Blog Posts (axB2v) is verified.
✔ SEO Plugin Configuration (faNzX) is verified.
✔ Starting Upgrade... ⭐✨⭐

✔  * ANv7K
✔  * CVk1i
✔  * DV_q9
✔  * Rmly2doc
✔  * W8D2A
✔  * W9vNb
✔  * axB2v
✔  * faNzX
✔ Upgrade finished successfully! ⭐✨⭐
┌─[timothypost@tim] - [~/code/swimm.io/docs.swimm.io] - [2021-10-13 10:23:26]
└─[0] <git:(master 6fe4730✗➦✱+) > 
```

You can then commit and push the changes. **Your upgrade is now done**.
