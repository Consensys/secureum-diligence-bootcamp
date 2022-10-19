# Example 3: #assert and #let

In this example we will learn how to use annotations before individual statements - `#assert` and `#let`.
To motivate their use, we will look at the 'batchSend' function in the provided `BatchSend` contract.

## Setup

To run this tutorial you will need `git`, `node` (version 16.0 or later) and `npm` and `scribble`.
You can install scribble globally by running:

```
npm install -g eth-scribble
```

After you have checked out this repo, you can install the needed packages by running:

```
cd day2/example3_assert
npm install
```

## The problem

In `contracts/BatchSend.sol` we have provided a simple contract `BatchSend` that sends a certain amount of eth to a bunch of addresses. One informal property we may want to state about this contract is that: "We expect all transfers to succeed".

At first we can try to express this as an `if_succeeds` property, that specifies that the balance of the i-th receiver changes by the i-th amount:

```
  /// #if_succeeds forall(uint i in receivers) old(receivers[i].balance) + amounts[i] == receivers[i].balance;
  function batchSend(
    address payable[] memory receivers,
    uint[] memory amounts) public {
```

However, when we try to instrument this we run into an error:

```
$ scribble --arm contracts/BatchSend.sol --output-mode files
contracts/BatchSend.sol:5:61 TypeError: Cannot use forall variable i inside of an old() context since the whole forall is not in the old context.
contracts/BatchSend.sol:5:61:
  /// #if_succeeds forall(uint i in receivers) old(receivers[i].balance) + amounts[i] == receivers[i].balance;
```

The issue is that we are trying to compute an unbounded amount of old values inside the forall. This is currently not supported by Scribble. 
Alternatively, we could try to make an `old()` copy of the entire `receivers` array, but that is also not currently supported for performance reasons.

At this point we are stuck. How do we talk about the value of each address before and after the transfer, if we can't use a `forall`? Inline statements to the rescue!

Scribble allows inline annotations - `#let` and `#assert` that can be inserted before any statement in a function. `#let` allows users to create ghost local variables, while an `#assert` acts just like a normal assert, but it can also use the ghost local variables in scope. With those two it's trivial to express the desired behavior:

```
      for (uint i = 0; i < receivers.length; i++) {
        /// #let oldBalance := receivers[i].balance;
        receivers[i].send(amounts[i]);
        /// #assert receivers[i].balance == oldBalance + amounts[i];
        0;
      }
```

Note the dummy `0;` statement we added at the end. This is a syntactic limitation of the AST building process, which requires us to add a dummy statement in order to insert an annotation at the end of a basic block.

At this point you can instrument the code, run the tests, and verify that one of the tests fails.

## Instrumenting with scribble

We can instrument the invariants as usual with scribble:

```
scribble --arm contracts/BatchSend.sol --output-mode files
```

And now if we run the tests:

```
npx hardhat test
```

We will notice that the "Send with reject" test fails as expected:

```sh
$ npx hardhat test
...
  BatchSend
    ✔ Send (53ms)
    ✔ Send with duplicates (55ms)
    1) Send with reject


  2 passing (1s)
  1 failing

  1) BatchSend
       Send with reject:
     Error: VM Exception while processing transaction: reverted with panic code 0x1 (Assertion error)
    at BatchSend.batchSend (contracts/BatchSend.sol:22)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at runNextTicks (node:internal/process/task_queues:65:3)
    at listOnTimeout (node:internal/timers:528:9)
    at processTimers (node:internal/timers:502:7)
    at HardhatNode._mineBlockWithPendingTxs (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:1802:23)
    at HardhatNode.mineBlock (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:491:16)
    at EthModule._sendTransactionAndReturnHash (node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:1522:18)
```

At this point you can undo the instrumentation with:


```
scribble --disarm contracts/BatchSend.sol --output-mode files
```
