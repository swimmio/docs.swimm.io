# Hey Stash, What's In The Box?

The files in this directory are perfectly harmless as long as you don't
run them without CAREFULLY inspecting what they do. These are scripts
that are used to maintain this instance.

We ship them as part of the source to the site because:

 - The Swimm Documentation for this repo mentions them quite a bit, 
 - They don't contain any kind of secrets or anything else of significance,
 - They really help in some of the things that go on to maintain the documentation site,
 - Maybe you can repurpose something or even just get inspired to do something for your workflow.

However, we don't offer ANY sort of warranty, or guarantee of suitability
for any purpose (as the license states). 

With that said, here's what does what:

 - `swimm-releases.js` provides functionality for the `../do.js` (do) command. This is what
   we used to backfill all the changelogs from our task tracker, as well as what we use
   to publish new release notes. This is a static site, so automation was a big need.

   - `example.yml` is an example of a release config file to import a new release into
   the system. Once it's in the system, we can pull down the release notes mostly
   automatically (a human still needs to edit / polish before publishing)

In the main directory, `do` is sort of the unofficial CLI for managing our specific
things in this site, things that don't yet make sense to write as plugins that would
add core functionality to the package scripts and such. 

Eventually, we may develop some kind of Clickup plugin that can fetch and embed
content so bugs and docs could live a little closer together, but that's way down
the road.