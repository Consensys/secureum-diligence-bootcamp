# Exercise 2: Fuzzing Workflow

In this exercise, you will gain more experience with the typical fuzzing workflow. To get started, pick an existing contract or set of contracts for which you have written Scribble specifications in the past.

## Task A: Set up a fuzzing campaign

First, set up a fuzzing campaign, unless you have already done this earlier.

## Task B: Start a fuzzing campaign

Start a short (for instance, 10 minutes) fuzzing campaign and wait for it to finish. You can set the time limit via the `time_limit` property in the fuzzing configuration.

## Task C: Enable incremental fuzzing

Next, enable incremental fuzzing (see the [tutorial](https://fuzzing-docs.diligence.tools/general/incremental-fuzzing)) for your project. Make a small change to one of the specifications or add a new specification. Now, start a second campaign. You should see that the second campaign quickly reaches similar code coverage as the first campaign.

## Task D: Add more specifications and refine them

You can now add more specifications and check if they are covered when starting new campaigns.

If specifications are not covered, review the fuzzer setup based on the process from the lecture. If necessary, add fuzzing lessons. Keep running new campaigns to make sure all specifications are covered. Try to cover as much of the code as possible.

## Task E: Test your specifications and refine them

Use the process from the lecture to test your specifications by intoducing bugs in the code and making sure they are detected by the fuzzer (by triggering property violations). Refine specifications or the fuzzer setup if introduced bugs are not detected. Repeat this process until you get a hang of it.

## Task F: Repeat this exercise for more contracts

To get more experience, repeat this exercise for other contracts.

