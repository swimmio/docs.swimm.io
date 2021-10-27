# General Troubleshooting

Below are some common troubleshooting questions that we receive, with answers. These problems stem from things Swimm can't control (such as the way CI containers might be configured, or something as simple as a team member forgetting to push). If you run into trouble and don't see your question here, or need any other help, [contact us](Getting%20Support) and we'll help you figure it out.

## A doc was started on another branch, but it never got pushed. Now we see a stub for it. What do we do?

What you're seeing is the 'stub' that Swimm created when someone on another branch created and saved the document. It looks like a stub because they haven't pushed their code yet, which means you haven't pulled the actual content. You might want to check quickly that you've pulled the latest changes

That 'stub' will stick around until the creator removes it (which will also delete their local copy of it), or in cases where the local copy is no longer available, the admin of the workspace will be able to delete the reference to the document by deleting it as if it were any other doc. 

If you run into trouble, reach out to us.

## I see "Error, your git is not properly configured!" in reference to user.name

If this is happening locally, you probably need to double-check your Git configuration (name, email, editor, etc). Retrace your steps (did you forget that you were SSH'd into a remote machine?). `user.name` and `user.email` can't be NULL for Git to work.

If this is coming from the output of your CI server, then it's likely that something isn't passing these options to the container running the CI workflow - it's hard for us to suggest how to troubleshoot that, but you can (as a workaround) run:

```
git confg user.name Nobody && git config user.email nobody@example.com
```

... as part of the CI process. Swimm needs to be able to run (read-only) Git commands in order for the verification routines to work, and it can't do that unless Git has at least a minimal configuration.

Check with the admin of your CI server to find out what might be going wrong with the correct information being passed through. The work-around isn't harmful as swimm never needs to commit during the verify process, but other things could be at play.

## We don't have Node installed on our CI images, do we really need it?

Yes. This isn't a pain point for running on the desktop as it's all neatly bundled, but the verification code does need node in order to run. If that's not possible (and there are many great reasons why that might be the case) we recommend [using pre-commit instead](../Workflow/Continuous%20Integration#pre-commit), or as a work-around to just evaluate how the process might look before you invest in updating your CI containers. 

## When Swimm Verify runs on our CI, everything is reported as out-of-date, but locally, it's current. Why?

There are two reasons that this could be happening:

 1. Your CI server is running an old version of Node. If you're running 10 or below, there will be subtle problems - we recommend upgrading to at least version 12 (or later).
 2. Your forge host is doing a 'shallow' pull of the repo where only the most recent history is fetched - you can typically change this in the settings menu at the host. Some do this because often the entire history isn't needed to run code tests, but it is needed by Swimm's CLI tools for accuracy.