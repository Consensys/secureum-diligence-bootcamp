# Example 2: #if_updated 

In this example we will learn how to use annotations on individual state
variables - `#if_updated` and `#if_assigned`.  We will use the same sample
`Administrable` contract as the previous `forall` exercise, but this time
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
cd day2/example2_if_updated
npm install
```

## The problem

In `contracts/Administrable.sol` we have provided a simple contract that maintains a list of administrators, allows adding a new administrator (by a current one) and querying whether some address is an admin. Admins are stored in 2 ways - as a list of addresses, and as a mapping from address to bool, allowing for quicker access.

Lets try to check the following property:

"The 0 address is never an admin"

We can formalize this informal property in scribble, as the following `#if_updated` annotation on the state variables themselves:

```
/// #if_updated forall (address a in isAdmin) a != address(0);
address[] admins;

/// #if_updated forall (address x in isAdmin) x != address(0);
mapping (address => bool) public isAdmin;
```

The added annotations will be checked *each* time that the state variables are updated, even if only a single field is updated.

At this point you should be able to instrument the code with scribble, run the tests and verify that one test fails:

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

The annotations we added walk over all entries in the `admins`/`isAdmin` variables, even if we are only updating only one entry. This is a little wasteful.
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

WARNING: `if_assigned` can be a little tricky. Because it talks about only one part of the datastructure, its possible that values change unexpectedly. For example if you have:

```
  /// #if_assigned[i] admins[i] != address(0);
  address[] admins;
```

you might expect that its not possible for the `admins` array to contain 0s. However this possible with the following 2 statements:

```
admins = [address(0), address(0)];
```

or

```
admins.push(address(0));
```

Since in those 2 statements we are simultaneously changing some values, and potentially adding/deleting values, its hard to instrument those with `if_assigned`, so for now we omit those.

As a rule of thumb, always try to use `if_updated` as its safer (its checked on *any* updated). Only use `if_assigned` if you can't express what you need with `if_updated`, or if the instrumentation overhead is too large.
