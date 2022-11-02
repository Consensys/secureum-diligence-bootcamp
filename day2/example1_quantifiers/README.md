# Example1: Quantifiers

In this example we will learn how to use universal quantification (forall) over
containers (maps and arrays) in Scribble.

## Setup

To run this tutorial you will need `git`, `node` (version 16.0 or later) and `npm` and `scribble`.
You can install scribble globally by running:

```
npm install -g eth-scribble
```

After you have checked out this repo, you can install the needed packages by running:

```
cd day2/example1_quantifiers
npm install
```

## The problem

In `contracts/Administrable.sol` we have provided a simple contract that maintains a list of administrator, allows adding a new administrator (by a current one) and querying whether some address is an admin. Admins are stored in 2 ways - as a list of addresses, and as a mapping from address to bool, allowing for quicker access.

Below are 2 properties we may want to check for this contract:

1. The 0 address is never an admin
2. For every address `x` in the `admins` array, `isAdmin[x]` is true.

Both of those can be expressed as a 'forall`. Even though property 1 doesn't have the words 'for all' in it, we can paraphrase it as "for every address `x` in `admins`/`isAdmin`, `x` is not 0".

We can formalize these two informal properties in scribble, as the following contract invariants:

```
/// #invariant forall (address a in isAdmin) a != address(0);
/// #invariant forall (uint i in admins) isAdmin[admins[i]];
contract Administrable {
```

## Instrumenting with scribble

We can instrument the invariants as usual with scribble:

```
scribble --arm contracts/Administrable.sol --output-mode files
```

And now if we run the tests:

```
npx hardhat test
```

We will notice that the second test "Add 0 admin" fails as expected:

```sh
$ npx hardhat test
...
  Administrable
    ✔ Add admin
    1) Add 0 admin


  1 passing (2s)
  1 failing

  1) Administrable
       Add 0 admin:
     Error: VM Exception while processing transaction: reverted with panic code 0x1 (Assertion error)
    at Administrable.__scribble_Administrable_check_state_invariants_internal (contracts/Administrable.sol:111)
    at Administrable.__scribble_check_state_invariants (contracts/Administrable.sol:122)
    at Administrable.addAdmin (contracts/Administrable.sol:51)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at HardhatNode._mineBlockWithPendingTxs (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:1802:23)
    at HardhatNode.mineBlock (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:491:16)
    at EthModule._sendTransactionAndReturnHash (node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:1522:18)
    at HardhatNetworkProvider.request (node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:118:18)
    at EthersProviderWrapper.send (node_modules/@nomiclabs/hardhat-ethers/src/internal/ethers-provider-wrapper.ts:13:20)
```

Therefore our annotations are checked as expected.

## Restoring our code

We can undo our instrumentation as usual with:

```
scribble --disarm contracts/Administrable.sol --output-mode files
```