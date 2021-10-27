# Workspaces

Workspaces are home bases where teams can collaborate. Workspaces group repositories together so that they can relate to [Playlists And Plans](Playlists%20And%20Plans). Think of them a a landing page that groups repositories together as a starting point.

You can have as many workspaces as you need, use them whenever it makes sense in the scheme of how your teams are organized. It's expected that several or more workspaces might feature some of the same repositories. It's also expected that developers might be active in multiple workspaces. **If you're at all unsure of how many workspaces you need, we suggest starting with just one, and seeing how your needs grow from there.**

If you have a single repository, it makes sense to use a single workspace. However, if you have several repositories that look something like this:

```sh
front-end/
blog-cms/
design-assets/
caching/
```

... then you might want to consider having a Designer workspace in addition to a Front End workspace. 

If you have lots of micro-services like:

```sh
catalog-service/
reviews-service/
gitops-repository/
data-broker-service/
adserver/
dropship-api-service/
```

... then you could consider one workspace per team that works on these services, or you might prefer to just use a single workspace. Just know that they're a grouping mechanism and use them in a way that makes sense to you.
