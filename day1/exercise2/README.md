# Exercise2: Invariants

In the previous exercise we learned about the simplest kind of Scribble
annotation - `#if_succeeds` on functions. Apart from annotating functions,
scribble also allows you to annotate entire contracts. One possible annotation
is the `#invariant` annotation on a contract, that we will explore in this
tutorial.

## Setup

To run this tutorial you will need `git`, `node` (version 16.0 or later) and `npm`.
After you have checked out this repo, you can install the needed packages by running:

```
cd day1/exercise2
npm install
```

## Invariants

In this exercise we will look at an example escrow contract taken from the
[solidity
documentation](https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html#safe-remote-purchase).

The `Purchase` contract implements a state machine that locks 2x the amounts of
funds neccessary for a purchase from both a seller and a buyer, and upon
successful confirmation from the buyer releases the funds appropriately. Locking
funds from both parties disincetivises bad behavior from both.

Central to the correctness of this contract is that it implements a state machine correctly, and only the
right actor (buyer or seller) can trigger a specific transition. In English, we can state the transitions as follows:

1. We can move into the `Locked` state only from the `Created` state. After moving into the `Locked` state, the `msg.sender` becomes the `buyer`.

2. We can move into the `Release` state only from the `Locked` state. Only the `buyer` can do this move.

Express the above 2 annotations as `#invaraint`s on the whole contract. 

## Instrumenting and testing

Instrument the contract as we have shown you before.

```
scribble --arm contracts/Purchase.sol --output-mode files
```

We have added the skeleton of an empty test under `test/Purchase.js`. Feel free to add your own test code there to check the transitions after arming.
You can run your tests using:

```
npx hardhat test
```


We have introduced a bug in the contract. The bug is related to the state
transitions, and your annotations should be able to catch it. However to catch
the bug, you must also write tests to exercise your code. Can you write a test
to catch that bug, using the instrumented code?

(Hint: Look at the annotations you have written, and think about edge cases you can test)


## Restoring our code

You can always restore the original code using:

```
scribble --disarm contracts/Purchase.sol --output-mode files
```