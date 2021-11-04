# Upgrading Plans To Workspace Playlists

As part of our effort to implement Swimm in a full DAC ([Docs As Code](https://www.writethedocs.org/guide/docs-as-code/)) manner, Swimm
now saves Playlists as part of your documents, in our [.sw.md](Upgrading-swmd) format. This means your playlists are constructed
from your docs themselves, not from fragments in our database.

Because the relationship with docs and playlists resides in the docs themselves, there's no way to automatically migrate 
older [plans](../Workflow/Playlists%20And%20Plans) to new workspace playlists.

To recreate your plans as workspace playlists, go to the main workspace page and click "Workspace Playlist":

![Workspace Playlist](/img/desktop/workspace-playlist.png "Swimm's Workspace Playlist")

As you add things to the playlist, Swimm will update the playlist (and the docs it contains) with all of the
needed metadata in the new format.

If you need help, or encounter a problem, please reach out to support.