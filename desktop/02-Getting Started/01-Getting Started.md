# Diving In

Are you ready for great documentation? Awesome! To get the most out of Swimm, we recommend that you read through the following sections:

 - [Workspaces](../Workflow/Workspaces)
 - [Playlists](../Workflow/Playlists%20And%20Plans)
 - [Documents](../Workflow/Documents)
 - [Smart Text & Smart Paths](../Workflow/Smart%20Text)

Here's a quick video to illustrate Swimm's Document & Playlist workflow, as well as some tips on how to approach documenting a code base from scratch:

:::note Video Tutorial - Getting Started Documenting A Code Base

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/GPQc9inXQEM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

:::

Getting the hang of these only takes a few minutes. Once you understand the tools that Swimm provides, all that's left is to jump in and get to documenting things. Figuring out a strategy, or even what to prioritize can be arduous; we've put together a short presentation that goes over the four most common documentation strategies that we've observed:

:::note Four Documentation Strategies Explained - Swimmversity

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/AqRzi51xFzA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

:::

We've gathered other wisdom regarding how to approach a code base with an eye for documenting it and consolidated it below:

## Using Swimm To Onboard New Developers

There's two kinds of onboarding that you probably need to consider:

 - Onboarding for developers new to the _company_, and,
 - Onboarding for developers that are new to a certain part of the _code_.

In the case of a new hire, both things are going to be required. In the case of lots of microservices, or other situations where you have a lot of active code repositories that might follow some very different design scenarios, you should probably think of onboarding as something that even senior employees need to do.

You could start your first playlist as a launchpad for people new to the _company_ - How do you Github? How do you VPN? How does the CI process work? Think of the stuff that you'd need to know pretty much no matter what code base you were working on.

Then, individual teams can craft onboarding playlists to help folks new to their code set up the local build, tools, etc.

Don't forget to capture [all the high-level knowledge](#tying-narrative-docs-to-code) as well. 


## Documenting Libraries

Libraries and APIs are difficult to generalize in a way where we can suggest exactly where to dive in beyond to say that Swimm can be the glue that you've been looking for to tie a lot of things together. You might be using Swagger to generate OpenAPI docs from code, and then using the Swagger/OpenAPI docs to generate route mappings for services - and this is a very common thing to do. Swimm is in it _for the human_ - what would someone unfamiliar with that process need to know? What's the base level of knowledge to understand it, and how does someone get there? Those are great ideas for playlists with lots of opportunities to bring in actual code.

Swimm's snippets lend _extremely_ well to documenting client code for libraries, even if the library just wraps an API using a specific language. Using it, you can walk someone through how to instantiate the library, how to debug responses, and what calls are available. [Smart Text](../Workflow/Smart%20Text) along with snippets will help you ensure that this kind of documentation is easy to keep up-to-date.

**Don't forget to document likely endeavors** - A playlist to get started with a quick run through the five most common things someone would do with the library is a great starting point as well. If someone downloads `libcurl`, for instance, they probably want to know how to use it to make HTTP GET/POST/HEAD requests and would definitely appreciate a playlist that said "How to make basic HTTP requests."

## Documenting Microservice Flow

You probably want some playlists that someone can follow through multiple repositories. As of right now, that's implemented with something called a [plan](../Workflow/Playlists%20And%20Plans). A plan is a playlist that can span multiple repositories. Very soon, this functionality will be merged into a single object, the playlist.

Don't forget to document service flows based on common things that someone might want to do, as noted when relating to libraries above.

## Tying Narrative Docs To Code

There are times when you need to explain things, but there really aren't any concrete code snippets that make sense to illustrate. Knowing that part of the magic of Swimm is tying documentation to code, we hit a cannundrum wondering how to keep these sorts of things in sync.

While microservices are an example of a pattern that illustrates this well, it equally applies to any scenario where you want readers to have the narratives _about_ the code in addition to, and often _aside from_ the code itself.

[We have a tutorial especially for this](../Tutorials/High%20Level%20Documentation), which we hope answers your questions. 
 
## Expanding General Documentation Coverage

If you're taking over maintaining a code base, or have been struggling to figure out how to bring up your coverage in general, we've got a great blog post on [How to artfully Dive Out of Docu-debt](https://swimm.io/blog/how-to-artfully-dive-out-of-documentation-deficit-and-into-continuous-documentation/). In there we give some stragies for figuring out what to prioritize, and some goal-oriented writing tips. It's not at all dissimilar to figuring out what code needs tested; it just involves factoring humans in a bit more. 

This list is not at all exhaustive. If you're using Swimm and having a hard time figuring out how to dive in, please reach out to us to schedule a free 1:1 session. We've got a lot of experience in the area and we want you to succeed!
