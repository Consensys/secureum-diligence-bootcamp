# Example 1: #if_updated 

In this example we will learn how to use annotations on individual state
variables - `#if_updated` and `#if_assigned`.  We will use the same sample
`Administrable` contract as in the previous `forall` exercise, but this time
instead of adding the annotation as an `#invariant` that is checked at
observable points on the contract, we will add it as an
`#if_updated`/`#if_assigned` annotation that is checked each time the target
state variable is updated.

## Setup

To run this tutorial you will need `git`, `node` (version 16.0 or later) and `npm` and `scribble`.
You can install scribble globally by running:

```
npm install -g eth-scribble
```

After you have checked out this repo, you can install the needed packages by running:

```
cd day2/example1_if_updated
npm install
```

## The problem

In `contracts/Administrable.sol` we have provided a simple contract that maintains a list of administrators, allows adding a new administrator (by a current one) and querying whether some address is an admin. Admins are stored in 2 ways - as a list of addresses, and as a mapping from address to bool, allowing for quicker access.

Lets try to check the following property:

"The second admin is never the 0 address"

We pick the second admin for convenience, as the first admin is pushed by the constructor.
We can formalize this informal property in scribble, as the following `#if_updated` annotation on the state variables themselves:

```
/// #if_updated admins[1] != address(0);
address[] admins;
```

The added annotations will be checked *each* time that the state variables are updated, even if another field is updated.

At this point if you instrument the code with scribble and run the tests, you will get a confusing failure during code deployment:

```
  1) Administrable
       "before all" hook for "Add 0 admin":
     Error: cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="VM Exception while processing transaction: reverted with panic code 0x32 (Array accessed at an out-of-bounds or negative index)"
     ....
```

The key is the "Array accessed at an out-of-bounds or negative index" part. If you think about it, state invariants are checked at every point, including at the end of the constructor. At the end of the consturctor, there is only 1 entry in admins, but we are indexing `admins[1]` in the annotation! That causes the index out of bounds error, breaking contract deployment. We can account for this by fixing our annotation to:

```
/// #if_updated admins.length > 1 ==> admins[1] != address(0);
address[] admins;
```

And now we see the expected test failure:

```
  Administrable
    1) Add 0 admin
    ✔ Add admin


  1 passing (1s)
  1 failing

  1) Administrable
       Add 0 admin:
     Error: VM Exception while processing transaction: reverted with panic code 0x1 (Assertion error)
    at Administrable.Administrable_admins_address_push (contracts/Administrable.sol:43)
    at Administrable.addAdmin (contracts/Administrable.sol:23)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at runNextTicks (node:internal/process/task_queues:65:3)
    at listOnTimeout (node:internal/timers:528:9)
    at processTimers (node:internal/timers:502:7)
    at HardhatNode._mineBlockWithPendingTxs (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:1802:23)
    at HardhatNode.mineBlock (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:491:16)
    at EthModule._sendTransactionAndReturnHash (node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:1522:18)
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

## Checking with #if_assigned

The annotations we added walk over all entries in the `admins`/`isAdmin` variables, even if we are only updating one entry. This is a little wasteful.
To fix this, we also provide an alternative `#if_assigned` annotation. Unlike `#if_updated`, `#if_assigned` allows us to talk about updates to a specific part of a datastructure. For example, if we want to only check something when an *individual* entry in the `admins` array is updated, we can write this as follows:

```
  /// #if_assigned[i] admins[i] != address(0);
  address[] admins;
```

Note the `[i]` after `if_assigned`. This allows us to talk about the case when only the `i`-th entry is updated, and we can directly check something on just that update. This way we can re-write our original `if_updated` annotations as `if_assigned` as follows:

```
  /// #if_assigned[i] admins[i] != address(0);
  address[] admins;

  /// #if_assigned[x] x != address(0);
  mapping (address => bool) public isAdmin;
```

You should again be able to instrument the code, run tests, and verify that one test fails.

WARNING: `if_assigned` can be a little tricky. Because it talks about only one part of the datastructure, it's possible that values change unexpectedly. For example if you have:

```
  /// #if_assigned[i] admins[i] != address(0);
  address[] admins;
```

you might expect that it's not possible for the `admins` array to contain 0s. However this is possible with the following two statements:

```
admins = [address(0), address(0)];
```

or

```
admins.push(address(0));
```

Since in those two statements we are simultaneously changing some values, and potentially adding/deleting values, it's hard to instrument those with `if_assigned`, so for now we omit those.

As a rule of thumb, always try to use `if_updated` as it's safer (it's checked on *any* updated). Only use `if_assigned` if you can't express what you need with `if_updated`, or if the instrumentation overhead is too large.
