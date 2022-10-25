# Exercise2: Invariants

So far we have learned about annotations on contracts (`#invariant`), and annotations on functions (`#if_succeeds`).
It turns out however, that you can also use the `if_succeeds` annotation on contracts as well. When you use `if_succeeds` on a contract,
its the same as adding that `if_succeeds` to every function in the contract. We will use an `if_succeeds` on the contract level for the following exercise.

## Setup

To run this exercise you will need `git`, `node` (version 16.0 or later) and `npm`.
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

Express the above 2 annotations as `#if_succeeds`s on the whole contract. Note that you may need more than 2 annotations to express this.

## Instrumenting and testing

Instrument the contract as we have shown you before.

```
scribble --arm contracts/Purchase.sol --output-mode files
```

We have added the skeleton of an empty test under `test/Purchase.js`. Write some tests for this contract, and run them using the following command:

```
npx hardhat test
```

## Restoring our code

You can always restore the original code using:

```
scribble --disarm contracts/Purchase.sol --output-mode files
```