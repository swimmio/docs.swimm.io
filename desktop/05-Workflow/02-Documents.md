# Documents

Documents (affectionately called "Docs" in Swimm terminology) are smart objects that tie your narratives to your code. Docs can contain markdown-formatted text, images, links and most important of all, selectable code snippets. As your code changes, any docs that incorporate code snippets will stay in sync.

Swimm gives you two options when creating Docs:

 - Create a new, blank document ready for you to dive into. You might grab this option if you've got what you want to write about top-of-mind and you're ready to start cranking it out. 
 - [Create a doc from a commit SHA](../Getting%20Help/How%20Do%20I#how-do-i-start-a-document-from-a-commit-sha-what-are-the-advantages-to-this), which will pull in snippets from files affected during your most recent commit, which can be a **fantastic** basis for writing new documentation. Keep the snippets you want and need, remove or reselect the rest. 


## Code Snippets

The heart of continuous documentation, snippets are one of the most powerful features of Swimm. Use snippets to illustrate the parts of the code that you need to document; Your readers will see with a visual checkmark that the snippet they're looking at is up-to-date.

If the code changes, Swimm will detect this and:

 1. Mark the snippet as possibly out-of-sync visually, so readers know that something changed.
 2. If the change is relatively minor, Swimm will see it and automatically suggest a correction for the snippet. Lifeguards can accept these changes.
 3. If the change is radical, Swimm will ask Lifeguards if they want to re-select the snippet, or discard it. This can happen during major re-factors.

If you include Swimm in your continuous integration process, your documentation (that Swimm knows about) will also be continuous. We call this continuous documentation; you can read more about how you can accomplish that later in this section of the manual. 

## Formatting

Swimm uses basic [Markdown](https://www.markdownguide.org/basic-syntax/) syntax for formatting. As you enter Markdown, Swimm will automatically style and format your text. For instance, \*\*Bold\*\* automatically becomes **Bold**.

Swimm docs are smart objects - you can grab any block of text, code snippet, image or anything else and re-orient it on the page. 

## Smart Text

While editing, pressing the `/` key will bring up a menu that enables you to easily jump to adding additional snippets, images, links to files in the repository or open a Markdown editor which shows your text without formatting applied (**bold** will appear as \*\*bold\*\* again). When you select a snippet into the snippet gallery, Swimm will learn about the symbols that you've highlighted in the code. For instance, you might have a constant named `MAX_CONNECTIONS` that sets a hard limit on how many active connections a single client can have. This is a heavily used constant, so it's referenced quite a bit through your documentation.

But, a few months later, you need to re-name it as you refactor a bunch of code in the same namespace and realize that you want to have more granular control over different types of connections. With Swimm, _you don't need to worry about updating the documentation everywhere_, as Swimm will understand the change, and use your replacement everywhere. This means you only have to accept Swimm's suggestion (or re-select the snippet with the constant) and the change will apply to all of the docs that reference it.

This is a great feature of Swimm, so it [has its own Smart Text section](Smart%20Text) to dive deeper into situations where you're likely to find it extremely helpful! 


 

