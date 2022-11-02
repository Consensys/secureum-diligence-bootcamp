# Example 2: Invariants

In the previous example we learned about the simplest kind of Scribble
annotation - `#if_succeeds` invariants on functions. Apart from annotating
functions, scribble also allows you to annotate entire contracts. One possible
annotation is the `#invariant` annotation on a contract, that we will explore in this
tutorial.

## Setup

To run this tutorial you will need `git`, `node` (version 16.0 or later) and `npm` and `scribble`.
You can install scribble globally by running:

```
npm install -g eth-scribble
```
.
After you have checked out this repo, you can install the needed packages by running:

```
cd day1/example2_totalSupply
npm install
```

## Invariants

We will look at the same `VulnerableToken` contract as in the previous example.
But this time we will try to express a property that shouldn't just hold after
one function succeeds, but instead it should hold when *every* external call
into the contract succeeds. Even more, this property should hold whenever the
contract itself makes an external call to another contract. This way, the
property is true whenever we look at the contract's state, while the contract is
not executing.

In english, the property can be expressed as:

Its always true that the sum of all (non-zero) values in `_balances` is equal to the `_totalSupply` state variable.

The reason for checking that this property is true only when the contract is not itself executing, is that the contract may temporarily violate it while updating its own state. For example consider these two lines from `transferFrom`:

```
    _balances[_from] -= _value;
    _balances[_to] += _value;
```

Right between those two lines, the property stated above is temporarily violated. But its established right after the second line, and well before we exit the call to `transferFrom`.

We can express this property with the following annotation:

```
/// #invariant unchecked_sum(_balances) == _totalSupply;
contract VulnerableToken {
...
```

Unlike the `if_succeeds` annotation, `#invariant` can only be applied in a
docstring above a contract. It is checked on all public/external function of
this contract, and all inheriting contracts (and in several other places).

The `unchecked_sum` keyword is a builtin Scribble aggregator that computes the
sum of all values in a container. (in the case of mappings all *explicitly
assigned* values).


## Instrumenting and testing

Again we can instrument the invariant with the following command:

```
scribble --arm contracts/vulnerableERC20.sol --output-mode files
```

After running this, if we open up `contracts/vulnerableERC20.sol` we would find that not just `transfer()`, but all public/external functions have been changed to check the invariant specified, by calling `__scribble_check_state_invariants`. 


## Testing the annotation

The test in `test/vulnerableERC20.js` is the same test as in the previous example - moving 1 wei from one address to another. Again this doesn't catch the edge case
in `transfer()` that causes the failure. You can run `npx hardhat test` after instrumenting and the test will succeed.

Again change the following lines:

```
    const balanceBefore = await vulnerableToken.balanceOf(acct2.address);
    await vulnerableToken.connect(acct1).approve(acct2.address, 1)
    await vulnerableToken.connect(acct1).transfer(acct2.address, 1);
    const balanceAfter =  await vulnerableToken.balanceOf(acct2.address);
```

to:

```
    const balanceBefore = await vulnerableToken.balanceOf(acct1.address);
    await vulnerableToken.connect(acct1).approve(acct1.address, 1)
    await vulnerableToken.connect(acct1).transfer(acct1.address, 1);
    const balanceAfter = await vulnerableToken.balanceOf(acct1.address);
```

Essentially what we've done is change the test to transfer from `acct1` back to itself, instead of into `acct2`.
Now if you run the test again you will get an assertion failure:

```sh
$ npx hardhat test
...
  vulnerableERC20
    1) Transfer


  0 passing (2s)
  1 failing

  1) vulnerableERC20
       Transfer:
     Error: VM Exception while processing transaction: reverted with panic code 0x1 (Assertion error)
    at VulnerableToken.__scribble_VulnerableToken_check_state_invariants_internal (contracts/vulnerableERC20.sol:92)
    at VulnerableToken.__scribble_check_state_invariants (contracts/vulnerableERC20.sol:99)
    at VulnerableToken.transfer (contracts/vulnerableERC20.sol:40)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at runNextTicks (node:internal/process/task_queues:65:3)
    at listOnTimeout (node:internal/timers:528:9)
    at processTimers (node:internal/timers:502:7)
    at HardhatNode._mineBlockWithPendingTxs (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:1802:23)
    at HardhatNode.mineBlock (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:491:16)
    at EthModule._sendTransactionAndReturnHash (node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:1522:18)
```

The failure of our invariant is again caused by the same bug in `transfer()`, but notice that we caught it even though we didn't specify any annotation on `transfer()` specifically.

## Restoring our code

We can again undo our instrumentation with the following command:

```
scribble --disarm contracts/vulnerableERC20.sol --output-mode files
```
