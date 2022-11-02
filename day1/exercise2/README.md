# Exercise 2: Invariants

In the previous exercise we learned about the simplest kind of Scribble
annotation - `#if_succeeds` on functions. Apart from annotating functions,
scribble also allows you to annotate entire contracts. One possible annotation
is the `#invariant` annotation on a contract, that we will explore in this
exercise.

## Setup

To run this tutorial you will need `git`, `node` (version 16.0 or later) and `npm` and `scribble`.
You can install scribble globally by running:

```
npm install -g eth-scribble
```

After you have checked out this repo, you can install the needed packages by running:

```
cd day1/exercise2
npm install
```

## Invariants

In this exercise we will look at an example auction contract taken from the
[solidity
documentation](https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html#simple-open-auction).

The `SimpleAuction` contract implements a timed open auction, where users may vote, delegate their votes, and votes can be finally tallied.
Additionally the chairperson may end the auction and tally the votes, but only after the time period has expired.

Write a `#invariant` annotation on the entire contract, that checks that:

The auction may only end (as marked by the value of the `ended` state variable), after the auction time has ran out.

## Instrumenting and testing

Instrument the contract as we have shown you before.

```
scribble --arm contracts/SimpleAuction.sol --output-mode files
```

Write a test, that tries to end an auction, before the time has passed (use the starting code in tests/SimpleAuction.js). Try running your tests with:

```
npx hardhat test
```

You should be able to cause your annotation to fail.

## Restoring our code

You can always restore the original code using:

```
scribble --disarm contracts/SimpleAuction.sol --output-mode files
```