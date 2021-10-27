# How do I ... (Common Questions)

We have many questions that pertain to general technical concepts in Swimm asked and answered [on our website](https://swimm.io/blog/get-started-with-swimm-most-frequently-asked/). If you have not yet seen them, please take a look - they answer questions you might have about setting up workflows, and how Swimm thinks and works at a high level. 

Below are questions that you might have as you actually dive into writing documentation using Swimm. If you have a question that isn't answered here, please don't hesitate to reach out to us!

You can also check our [troubleshooting tips](FAQ) for common problems.

## How do I enable markdown exporting?

From the "Integrations" menu in any repository:

![Swimm Integrations](/img/desktop/integrations.png "Integrations Menu")

An admin needs to click the slider to enable exporting:

![Swimm Export](/img/desktop/enable-export.png "Enable Export")

## How do I start a document from a commit SHA? What are the advantages to this?

Think about the last time you committed a non-trivial feature to something. You had code that implemented the feature, code that perhaps implemented configuration options for the feature, changes that added the feature to the build system, tests for the feature, and maybe even some configuration settings for your cluster or web server. That's a _fantastic_ basis from which to structure a document about the new feature, because Swimm will automatically pull in snippets from what you committed.

This means that your new document will be auto-populated with the feature code, configuration code, styles, whatever might be there, and you can simply reselect or discard anything that isn't relevant. Now, all you have to do is write the narrative around how it works.

To do this, open a new document, but select the "From commit SHA" option:

![Doc From Commit SHA](/img/desktop/doc-from-commit-sha.png "Choose the circled option to create a doc from a commit SHA")

This will open a dialog box where you can put in the SHA from the commit log:

![Commit SHA Input](/img/desktop/commit-sha-entry.png "Enter the commit SHA here")

At this point, you'll be brought to the editor where you can adjust the snippets that were imported from the commit, write your text and save it. 

## How do I incorporate markdown documents that I already have into playlists? Can I import them?

We're working hard on a way to import existing markdown documentation so that your Markdown files become Swimm documents ready to be coupled to your code. We're not quite there yet, but you _can_ link to your existing markdown files in playlists (as we'll show below), or use [Smart Paths](../Workflow/Smart%20Text) within docs to reference other `.md` files in your repository.

The playlist link editor allows you to link to files within the repo using a path that is relative to the repo root. In this example, we'd link to the README file in the root of the repository. If we wanted to, we could change that to `documents/markdown/README.md` instead. Make sure you click on the "links" option in the playlist editor, and then add your link as shown:

![Playlist Links To MD Files](/img/desktop/playlist-import-markdown.png "Playlist Links")

