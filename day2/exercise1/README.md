# Example1: Administrable

In this exercise we will try to combine what you've learned about `#forall`,
`#if_updated` and `#let`/`#assert`.  This is an exercise in several parts. In
each part you will add some annotations, and then verify that the code can be
instrumented, and the tests run without failures. In the end you will submit your completed solidity file for 

## Setup

To complete this exercise you will need `git`, `node` (version 16.0 or later) and `npm`.
After you have checked out this repo, you can install the needed packages by running:

```
cd day2/exercise1/
npm install
```

## The contract 

In `contracts/TimedSafe.sol` we have provided a simple contract `TimedSafe` that stores some amount of eth for a specified amount of time. After that amount of time has passed, the eth can be split amongst a set of recipients, each recipient getting a specified fraction of the total amount of eth. When the contract is constructed, the recipients, fractions, and amount of time to lock the account (in seconds) are set:

```
  constructor(address[] memory _recepients, uint256[] memory _fractions, uint _duration) payable {
```

After the amount of time has expired the contract provides 2 ways to get the eth out - `withdrawFunds()` withdraws only the funds for one recipient (the `msg.sender`). `disperseFunds` on the other hand sends the funds for all recipients with a single call.

As usual you can instrument this contract with:

```
scribble --arm contracts/TimedSafe.sol --output-mode files
```

and revert the instrumentation with:

```

scribble --disarm contracts/TimedSafe.sol --output-mode files
```

You can run tests with `npx hardhat test`. Before you start make sure all tests run successfully.

## Warmup: `invariants`, `if_succeeds` and `unchecked_sum`

As warmup, translate the following english language properties into scribble annotations. Make sure that the contract can be instrumented, compiled, and all tests pass successfully.

1. At all times, the sum of all `faction`'s equals to "DECIMALS" (i.e. the fractions add up to 1).

2. `withdrawFunds` and `disperseFunds` can only be called after `duration` has passed (or after we've reached `releaseTime`).

3. The constructor should succeed only if the number of fractions is equal to the number of recipients 


## Part 1: `forall`

Translate the following property into a scribble annotation. Make sure that the contract can be instrumented, compiled, and all tests pass successfully.

1. At all times, for each recipient, the `dispersed` amount is always less than or equal to the total fraction that is owed to them.

What annotation type will you pick here?

## Part 2: `if_updated`

Translate the following property into a scribble annotation. Use an `if_updated` annotation. Make sure that the contract can be instrumented, compiled, and all tests pass successfully.

1. The `disperesed` array can only be modified after the specified duration has passed (or after we've reached `releaseTime`).


## Part 3: `if_assigned`

Express the property from part 1 using an `if_assigned` annotation. Make sure that the contract can be instrumented, compiled, and all tests pass successfully. As a reminder, the property was:

1. At all times, for each recipient, the `dispersed` amount is always less than or equal to the total fraction that is owed to them.

## Part 4: `#let`/`#assert`

Add `#let`/`#assert` annotations in `disperseFunds`, that check the following property:

1. Each recipient's balance increases by the amount that is owed to them (the total fraction minus whatever has been dispersed so far).

Make sure that the contract can be instrumented, compiled, and all tests pass successfully.