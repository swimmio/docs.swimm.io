# User Roles

By default, all Swimm users have the ability to modify or remove any content that they create, and modify content that others have created. 

## The Admin User

The workspace administrative account has the power to use all features of Swimm, including enabling of things like markdown export. Ideally, the admin user also has privileges to configure things on the build / continuous integration server as well, so that they can make sure Swimm verifies the documentation as being up-to-date as part of the CI process.

## What's a "Lifeguard" in Swimm?

Technically, "Lifeguards" are Swimm users that have administrative privileges, but their role is more of owning and evangelizing the documentation, in addition to creating a significant amount of it (relative to the overall coverage). Lifeguards can do more than just update settings - they teach developers how to use Swimm, they make sure documentation standards remain enforced by helping the team find a process that everyone can live with, and they take away as much friction between joining a team and getting up to speed as possible. They're some of the nicest people you'll ever know.

Effective lifeguards should:

 1. Encourage the use of `swimm verify` at logical opportunities to ensure documentation keeps in sync with code. They should also look at `swimm coverage` to make sure lots of undocumented code isn't being suddenly introduced without notice. Lifeguards should work to avoid needing to dedicate entire sprints to catch up on documentation debt.
 2. Teach other team members how to create great documentation with Swimm - from showing people how to figure out what to prioritize, all the way to teaching people how to write for future versions of themselves. Lifeguards know they can't write everything alone, so they work to keep their team engaged in writing great documentation.
 3. Embody and promote a culture of learning and knowledge sharing. Lifeguards make sure the documentation works by constantly evaluating how well new team members get up to speed on the code, and contributing to documentation themselves.

It's normal for organizations to have multiple lifeguards, but we don't recommend making _everyone_ a lifeguard for safety and security reasons.