# Swimm's Atlassian Compass Application 
Swimm’s Atlassian Compass Applicatio allows you to connect Swimm documentation to your corresponding Components in Compass. Specifically, you can add a direct link from Compass to your documentation in Swimm and also track your Component's documentation status in Compass using our GitHub App.\
If you are new to [Swimm](https://swimm.io) you can read our [Quickstart Guide](https://docs.swimm.io/docs/quickstart) first to learn about Swimm and how to use it. Keep in mind that in order to use Swimm's Atlassian Compass Application, you should have repositories set up and [connected to Swimm](https://app.swimm.io/register?redirect=%2F).


## How do I configure the Swimm Compass App?
Start by installing Swimm's Atlassian Compass Application. Then, accept the permissions request, and click "Configure" on the Swimm App in the Apps page.

![Atlassian Configuration](../static/img/atlassian-configure.png)

Here you will see a list of all of your components linked to a GitHub repository.

![Atlassian Components](../static/img/atlassian-components.png)


For each one of your components that include a Swimm GitHub repository, you can:

-   Add a link to your Swimm Docs to the Documentation links of the Component
-   If Swimm's [GitHub App](https://github.com/apps/swimm-io) is installed on the repository, you can track the documentation status
-   Click "Connect All Repositories" to add a link and track them all
-   Click "Connect All Repositories" to create a scorecard that helps you track your complete documentation status at once


## What does the integration look like in Compass?

A link to the Swimm documentation looks like this:

![Atlassian Link to Doc](../static/img/atlassian-linked-to-swimm.png)


The Metric tracking your documentation will be in the Metrics section. Here’s how it looks:

![Atlassian Metric Tracking](../static/img/atlassian-metrics.png)


Remember that the Swimm GitHub App will only track your documentation status when a Pull Request is merged into the main branch. So until that happens, the score will be empty.

The Swimm Documentation Status scorecard gives you an overview of all of your Components at once:

![Atlassian Status Overview](../static/img/atlassian-status-overview.png)


On the right hand side of the Component page, you can see the specific scorecard score:

![Atlassian Score Card](../static/img/atlassian-scorecard.png)

Keep in mind that the Swimm GitHub App will only track your documentation status when a Pull Request is merged into the main branch, so until that happens, the Score will be 0%.

## FAQ
**I can no longer see the "Connect All Repositories" button, but I would like to have a scorecard created to track my Swimm Documentation Status.**
- This happens because all available Swimm repositories are connected. Remove the Swimm documentation link from one of your Components to make the button appear again. Alternatively, create the "Connect All Repositories" button manually by creating a scorecard that applies to the service type of Components with a label called 'Swimm.' Be sure to check if the Outdated Swimm Documentation metric is equal to 0.

**Why is the "Track Documentation Status" disabled for some of my Swimm repositories?**
- The Swimm [GitHub App](https://github.com/apps/swimm-io) is required to track a certain repository documentation status, so please make sure it is installed for the selected repository. If it is installed, please reach out to us in [Swimm's Slack Community](https://join.slack.com/t/swimmcommunity/shared_invite/zt-pizsz0c0-gL0DPEhuj~Jw1QwqBv8WYw) or email <support@swimm.io>.

**I started tracking my Documentation status, but I do not see any changes to the Metric of the Component.**
- Remember that the Swimm GitHub App will only track your documentation status when a Pull Request is merged into the main branch. Also, Swimm will only track repositories that have Swimm Documentation in them. If you've merged a Pull Request to the main branch of the repository with Swimm Docs, please reach out to [Swimm's Slack Community](https://join.slack.com/t/swimmcommunity/shared_invite/zt-pizsz0c0-gL0DPEhuj~Jw1QwqBv8WYw) or email <support@swimm.io>.

**Why can't I see my Component in the app settings table?**
- The Swimm Compass App currently only supports Components of type "Service," so please make sure the Component is marked as such. Also, the Swimm Compass App only supports Components connected to GitHub. So please make sure there is a link to the repository in GitHub under the Repository links section of the component.

**I have a Component with a repository that I know is in Swimm, but I do not see the buttons for it. Why does it say "Start Documenting?"**
- Please verify that the Component only has a single GitHub repository attached to it under the Repository Links section of the component, and that this repository is the one you have in Swimm. If it does exist there, please reach out to [Swimm's Slack Community](https://join.slack.com/t/swimmcommunity/shared_invite/zt-pizsz0c0-gL0DPEhuj~Jw1QwqBv8WYw) or email <support@swimm.io>.
