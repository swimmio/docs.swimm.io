# Extra Features
These are extra features of Swimm that are available at an additional plan level, or are still very experimental and require contacting us to enable them. If you'd like to use one of the features below, please reach out to us and we'll get you taken care of.

## Exercises

Exercises allow simulated changes in the code to indtroduce problems that learners need to solve. They work by storing a patch that gets applied to the code when the exercise is started, storing hints that you define to guide the learner to the solution and ultimately a path to an executable or script to run in order to confirm that the solution is correct.

These exercise units provide a safe, sandboxed way for people to jump into real problems they'll encounter with the code and solve them with gentle, gradual guidance.

To create an exercise, make sure you're starting with a clean repo state. Swimm will ask you to modify the code base in some way - this is where you introduce the problem that the learner is going to need to fix. Swimm will then store it as a patch to apply, and keep it in sync as the code changes. 

You then need to supply a definition of done (e.g. "_Code no longer leaks memory when run under valgrind._") and as many hints as you like. Try to structure your hints similarly to the way that many games provide hints - vague and subtle at first, then increasingly descriptive. Swimm will, without any additional hints provided, indicate what file the learner should start with.

Exercises are available under a feature flag; if you'd like us to enable them for you, please reach out to support. 