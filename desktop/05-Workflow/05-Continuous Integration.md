# Continuous Integration

We highly recommend that you incorporate continuous integration into your workflow if you haven't yet, and make Swimm a part of that integration. 
Once you do that, you'll have continuous documentation. 

Our CLI tools can inform your build process of:

 - Documentation being out-of-sync
 - Documentation _coverage_ falling below a configurable, defined value expressed as a score between 0.00 and 100.00.
 
Your build process can then decide what to do - block the build? open issues and set a due date? It's up to your team to decide what works best, 
but the debt won't just slide by quietly anymore. 

Swimm also supports pre-commit hooks that run in your local repository when they're triggered by a commit. The pre-commit hooks are identical in functionality to the continuous integration hooks, the difference is they run only on your machine.

Examples for Github Actions, Bitbucket Pipelines, Travis and Husky can be found within the "Integrations" menu up top which is visible when you have any repository selected:

![Swimm CI Options](/img/desktop/swimm-ci.png "Swimm's CI Options")

**Note: If you see any errors about git not properly being configured, [make sure the CI image has the minimum config needed for git to work read-only](../Getting%20Help/FAQ#i-see-error-your-git-is-not-properly-configured-in-reference-to-username)** 

We never commit during the CI process, but Git needs an email and name configured to do most read operations as well.

Below are the example configs for all CI / pre-commit setups that we support, and an overview of how you could develop something to work on a custom CI server. 

### Github Actions

Note that we don't want 'shallow' pulls where only the last few revisions are considered - Swimm needs a full clone of the entire history to work properly. 

```yml
name: Swimm
on: pull_request
jobs:
  Verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0 # pulling the commits history is required for the verification to function properly
          ref: ${{ github.head_ref }} # making sure we have the latest head ref 
      - uses: swimmio/swimm-verify-action@v1.2

```

### Bitbucket Pipelines

```yml
image: atlassian/default-image:latest
pipelines:
  default:
    - parallel:
        - step:
            name: Documentation
            script:
              - echo "Verifying documentation units"
              - wget -O swimm_cli https://releases.swimm.io/ci/latest/packed-swimm-linux-cli
              - chmod +x ./swimm_cli
              - ./swimm_cli --version
              - ./swimm_cli verify
```

### Travis CI

```yml
- wget -O swimm_cli https://releases.swimm.io/ci/latest/packed-swimm-linux-cli
- ./swimm_cli --version
- ./swimm_cli verify

```

### Gitlab

```yml
image: ubuntu:latest
# We deliberately do not cache anything
test_async:
 script:
   - echo "Verifying documentation units"
   - wget -O swimm_cli https://releases.swimm.io/ci/latest/packed-swimm-linux-cli
   - chmod +x ./swimm_cli
   - ./swimm_cli --version
   - ./swimm_cli verify
```

### Azure DevOps Pipelines

Note that Microsoft no longer grants free parallel tasks to new Azure DevOps users; this was done in response to some folks abusing the build servers. Hence, you'll need to have been given a grant to continue using parallel jobs for free, or you need to be on a paid account. 

Below is the YAML to configure the pipeline:

```yml

# Pipeline config to verify Swimm docs as in-sync
# Copyright 2021 Swimm
# License: MIT

trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- bash: |
    echo "Verifying documentation units"
    git config --global user.name "Username"
    git config --global user.email "me@example.com"
    wget -O swimm_cli https://releases.swimm.io/ci/latest/packed-swimm-linux-cli
    chmod +x ./swimm_cli
    ./swimm_cli --version
    ./swimm_cli verify
  displayName: "Swimm Verify"

```

Note that Git _must_ have a minimal configuration even for read-only options like those that `swimm verify` runs, so make sure you provide a value for `user.name` and `user.email` (as we have done in the config) if your pipeline configs don't currently get those from the environment. 

Please let us know if you encounter any issues with Azure DevOps Pipeline Integration. 

### Circle CI

Swimm runs swimmingly on CircleCI! Here's an example `.circleci/config.yml` file that you can adapt to your needs. The most important part of it is the `swimm-verify` job definition:

```yml
# Use the latest 2.1 version of CircleCI pipeline process engine.
# See: https://circleci.com/docs/2.0/configuration-reference
version: 2.1
jobs:
  swimm-verify:
    docker:
      - image: ubuntu:latest
    steps:
      - checkout
      - run:
          name: Run tests
          command: |
            git config --global user.name "Pretend User"
            git config --global user.email "pretend@example.com"
            wget -O swimm_cli https://releases.swimm.io/ci/latest/packed-swimm-linux-cli
            chmod +x ./swimm_cli
            ./swimm_cli --version
            ./swimm_cli verify
workflows:
  sample:
    jobs:
      - swimm-verify
```

Ordinarily, your `workflows:` section will already be defined, just put `- swimm-verify` under one of the defined jobs, where you want it to run.

### Jenkins

The best way to run on Jenkins is through a "Freestyle Project", formerly known as a "Workflow". You can set up a project called "Swimm Verification" and point it at your repository, with whatever triggers or timing you'd like. There are only a few things that you have to watch out for:

 1. If you are using Jenkins' advanced clone configuration, _make sure you disable the shallow pull option_ - Swimm is going to require that the entire history be present.

 2. You're going to need `curl` installed, which you can do via `apt-get install curl`

Once you have that done, under Build, select "Execute Shell" and paste the following commands:

```shell
stage('Swimm Verify') {
  steps {
    script {
      echo "Verifying documentation"
      sh '''

        git config --global user.name "user.name"
        git config --global user.email "youremail@domain.com"
        wget -O swimm_cli https://releases.swimm.io/ci/latest/packed-swimm-linux-cl
        chmod +x ./swimm_cli
        ./swimm_cli --version
        ./swimm_cli verify

        '''

    }
  }
}
```

You can put whatever logic you'd like following that, `swimm verify` will exit with a nonzero status if there's a problem. It's also up to you if you'd like to set up a project just for this, or just add it as the last step to an existing project - the scripts will all run the same.

Also note that we're not using `GIT_COMMITTER_NAME` or `GIT_COMMITTER_EMAIL` as they aren't always set. This doesn't matter, as Swimm never commits anything during the CI process - it's just the minimum config `git` requires in order to function. If you'd rather set them through Jenkins, it can be done through the "Additional Behaviours" option from the Git selection menu (as described in [this Stack Overflow answer](https://stackoverflow.com/a/32635853/50049))

### Husky

Add the following to your `package.json` file:

```js
// package.json
{
 "scripts": {
   "pre-commit": "swimm verify"
 }
}
```

Then, run the following in your terminal while in the repository root:

```sh
// run in terminal
$ npx husky add .husky/pre-commit "npm run pre-commit"
```

### pre-commit

[Pre-commit](https://pre-commmit.com) works with Git to intercept certain kinds of events through the use of hooks, which allows actions to run before the commit transaction actually takes place. Swimm's CI tools are just as useful if run pre-commit as they are if run through a CI server - the main difference is the check runs on your local machine _before_ the commit actually takes place, and not as a part of the push / PR / review cycle.

The result is the same, failed documentation checks can trigger other things to happen, or even block the commit, depending on the conventions that feel right for you and your team.

To install pre-commit hooks, first install pre-commit, and then follow the instructions [in this repository](https://github.com/swimmio/pre-commit). 

## Other CI / Build Servers / Test Servers

If you'd like us to support another kind of system, please let us know! In most cases, we can have a usable integration ready in a week or less.

If you need to integrate Swimm into a custom system, or need to get something up and running on a system we don't yet support right away, here are 
some things to keep in mind:

### Shellcode Example: Verifying Docs As Up-To-Date

`swimm verify` Is the command to run in order to see if documentation is up to date. If not, it will tell you which modules need attention, and exit with a nonzero status.

If you need to run the test 'headless' on a build server, you can use the following command to pull in the latest client and have node.js (10.15.0+) execute it:

```sh
echo "Verifying documentation"
git config --global user.name "user.name"
git config --global user.email "youremail@domain.com"
wget -O swimm_cli https://releases.swimm.io/ci/latest/packed-swimm-linux-cl
chmod +x ./swimm_cli
./swimm_cli --version
./swimm_cli verify
``` 
### Shellcode Example: Verify Overall Coverage

`swimm coverage` Will scan whatever code Git knows about and compare that to the amount of documentation you've created. The result will be a score of 0 to 100. To get that number, try the following command:

```sh
swimm_cli coverage | grep "/" | awk '{print $4}'

```

Expect a float (as in 0.00 or 89.73). If you need a whole number (0 - 100), run this instead:

```sh
swimm_cli coverage | grep "/" | awk '{print $4}' | cut -d. -f1

```

Again, if you need to run headless on a build server that we don't currently have integration for, use the same method we used above for `verify`, except run `coverage` instead. 

If you get stuck or just want to show us what you came up with, please reach out!

