# Swimm Smart Text

We talked about Swimm's Smart Text feature in the [Documents](Documents#smart-text) overview, but we'll expand on it in a little more detail here. Smart Text & Smart Paths can save you hours of having to update your documentation to reflect refactoring with clunky regular expressions. Smart Text & Smart Paths are some of Swimm's most powerful features.

:::note Video Tutorial: Swimm's Smart Text & Smart Paths Feature Walkthrough

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/YylvDtK5yzk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

:::

When refactoring happens, things move, and they move in ways that can really break your documentation. The list below is not at all exhaustive, but illustrates ways that changes can create a lot of work for documentarians:

| Change | Impact |
| --- | --- |
| File paths moved (src/ -> libfoo/src) | Any mention of the literal path in the documentation now takes people to the wrong place. |
| `ModuleConnector` gets renamed to `AppModuleConnector` so that `DataModuleCollector` can be a  thing. | All documentation for `ModuleConnector` is immediately out of date with no indication as to why |
| `/content/index.html` -> `content/en/index.html` | Localization path name changes |

... and any other time where you need the change you just made in your code to reflect _at every single instance_ of that code being mentioned within the documentation.

Once you make a major change, and you're ready to commit it, run `swimm verify` before you commit - it will pick up on the change and let you know the impact. You can then accept the autosynced suggestions by editing the doc, hovering over the highlighted smart text, and clicking "accept" on the flyout menu that unfolds.

Or, you might want to commit, and then address what `swimm verify` pointed out, which would commit the documentation changes. It's up to you and how you like to stage your commits, many folks have their own way of doing it.