# Coupling Dissertation-style Docs To Code

High-level documentation is an important part of software documentation that is often overlooked. When we refer to high-level documentation, we're referring specifically to things like:

 - Architecture overviews
 - Rationale For technical decisions & implementations
 - Roadmap
 - How-to documents for local build setup & workflow

The theme here is none of these documents tend to lend particularly well at snippet selection. Some don't really gesture to the code, some gesture at _all_ of the code. In these cases, we recommend using snippets, but very strategically. Here's a short and funny video about the Skynet robot uprising being caused by out-of-date documentation just like what's mentioned above:

:::note Video Tutorial: How To Couple "Unsnippetable" Docs To Code

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/jlxB4ReuhZk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

:::

In a nutshell:

 - Use version numbers in snippets to get a prod from `swimm verify` when new versions get released. This should help you remember to at least check on documents where they get autosynced. 
 - Use snippets from select algorithms to get prods that are far less likely to autosync when major changes happen to business logic, which should certainly cause you to revisit this kind of documentation for relevance and correctness.
 - Use snippets from argument parsing or where you set up new routes or other places where `swimm verify` will be likely to trip when you add new major features.

 There's no one-size-fits-all approach to doing this, it depends on how your code is organized and how you're running the CI / pre-commit checks. With a little creativity, you can successfully keep an eye on these.

 We highly recommend using [Swimm's Smart Text feature](../Workflow/Smart%20Text) wherever possible across all of your documentation in addition to this, as it will save you time and effort.