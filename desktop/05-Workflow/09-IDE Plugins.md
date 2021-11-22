# IDE Plugins

Swimm currently supports integration with VSCode, and all JetBrains IDEs. Our next target IDE is Visual Studio.

As more plugins are ready, they will appear on the "Integrations" tab from any repository:

![Integrations](/img/desktop/integrations.png "Integrations Menu")

Links to install the extensions (from the official website, as well as within the IDE) are listed at the bottom of the page.

## VSCode

You can install the VSCode Plugin by visiting the IDE plugins page in Swimm's integration menu (recommended), or by searching for it in the VSCode market. Once Installed, you can see what files are documented in the code base by clicking on the Swimm view on the left-side:

![Swimm VSCode Sidebar](/img/desktop/swimm-vscode-sidebar.png "Swimm in the VSCode Sidebar")

And then you'll see links to documentation above any code referenced in a snippet:

![Swimm VSCode Hint](/img/desktop/swimm-vscode-hint.png "Hint for Swimm Docs covering code below it")

Clicking on the 'hint' link will do one of two things, depending on how you have Swimm setup:

 1. If you have [markdown export enabled](../Getting%20Help/How%20Do%20I#how-do-i-enable-markdown-exporting), Swimm will load the corresponding Markdown file as a new tab in VSCode. 
 2. If you don't have export enabled, or no doc for the link has been generated yet, you'll be taken to the document within the app itself. 

## IntelliJ

We have a plugin that works across all IntelliJ platforms (IDEA, PHPStorm, others) which [can be downloaded from their site](https://plugins.jetbrains.com/plugin/17201-swimm) and is also available from within the IDE interface to the marketplace. 

Installed, it provides the same experience as the VSCode plugin, with the same contextual hints and on-click behavior:

![Swimm IntelliJ Plugin](/img/desktop/intellij_plugin.gif "Swimm's IntelliJ Plugin")


## Status Of Other IDE Plugins

Here's a brief status of what we're working on. Check our [blog](https://swimm.io/blog) for updates & release notes, or [join our Slack community](https://swimm.live/slack) if you'd like to test these when they're alpha-quality but stable.

| IDE | Functionality | Status | Implemented |
| --- | --- | --- | --- |
| VSCode | Consuming (read-only) within the IDE | Available (Beta) | 0.4.0 |
| IntelliJ (all IDEs) | Consuming (read-only) within the IDE | Available (Beta) | 0.5.0 |
| Visual Studio | Consuming (read-only) within the IDE | In Development | TBD |

If you'd like us to support another IDE, please don't hesitate to reach out!