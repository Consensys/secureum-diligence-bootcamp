# Exercise 1: Fuzzing Lessons

In this exercise, you will walk through the [tutorial on fuzzing lessons](https://fuzzing-docs.diligence.tools/general/fuzzing-lessons) to become familiar with the workflow.


## Setup

To run this tutorial you will need `git`, `node` (version 16.0 or later), `npm`, `scribble`, and `diligence-fuzzing`.

You can install scribble globally by running:

```
npm install -g eth-scribble
```

You can install the `diligence-fuzzing` CLI tool by running:

```
pip3 install diligence-fuzzing
```

After you have checked out this repo, you can install the needed packages by running:

```
cd day4/exercise1
npm install
```

We have already prepared a few key files that you can edit if needed:
- `day4/exercise1/contracts/GaslessDestroy.sol`: contract to be fuzzed
- `day4/exercise1/.fuzz.yml`: fuzzing configuration
- `day4/exercise1/scripts/deploy.js`: Hardhat deployment script
- `day4/exercise1/scripts/lesson.js`: Hardhat script for running the lesson

