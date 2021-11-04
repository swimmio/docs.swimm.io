# Swimm Playlists

Playlists are lists of docs, images, videos and even external links that allow developers to pick up knowledge in a prescribed order. Playlists in Swimm are analgous to playlists in music and streaming applications; things are learned in a certain order while the student can manage interruptions by easily seeing where they left off. 

Playlists are particularly important when creating a structured onboarding plan and/or when trying to explain a broad subject that's hard to explain in one document. It's also a way to structure different "learning paths" where bits of content can be used differently in different contexts.

## Standard Playlists

Standard playlists are available from the repository view of a workspace. Standard playlists allow you to step through documentation specific to the _current_ repository, as well as external links, images, videos or markdown files contained within the current repository. An example standard playlist might look like this:

 1. Markdown Link: How to set up your local build dependencies
 2. Markdown Link: README file about debugging
 3. Swimm Doc: Introduction to instantiating the library
 4. Swimm Doc: How to add configuration values
 5. Swimm Doc: How to add a module
 6. YouTube Video: Library creator describes rationale of how things are structured

And you could have more, what's important to take away is all of these items are focused on and relevant to things in the _current_ repository. But, sometimes playlists need to span multiple repositories, or even include multiple playlists. That's where Workspace Playlists come into play (no pun intended).

## Workspace Playlists (Formerly known as Plans)

Workspace playlists have all of the power of standard playlists, but can also span multiple repositories, or group multiple playlists from the same or different repositories together. If you wish to make a "playlist of playlists", use a workspace playlist. An example of how you might structure one could be:

 1. Image: Code flow diagram
 2. Playlist: How to build service-1 locally (from the service-1 repository)
 3. Playlist: How to debug service-1 locally (from the service-1 repository)
 4. Video Link: How we use Skaffold to deploy 
 5. Playlist: How to build service-2 locally (from the service-2 repository)

Whether the docs come from a single, or multiple repositories within the workspace doesn't really matter. Additionally, Swimm will indicate to the reader if they are missing local repositories required to complete the list. 

Playlists (both Standard & Workspace) are still under active development. If you find a use case that we don't support very well, please reach out to us and let us know!