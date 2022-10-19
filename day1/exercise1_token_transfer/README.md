# Exercise1: Vulnerable ERC20 Token

In this exercise we will learn how to do a basic Scribble instrumentation, and
demonstrate that it catches a bug by writing a test. Later while using
Diligence Fuzzing (or other tools) you will not need to write your own tests -
this will be the job of the fuzzing engine/other tool.

## Setup

To run this tutorial you will need `git`, `node` (verison 16.0 or later) and `npm`.
After you have checked out this repo, you can install the needed packages by running:

```
cd day1/exercise1_token_transfer
npm install
```

## The problem

In `contracts/vulnerableERC20.sol` we have provided an ERC20 token that has a
bug. The bug revolves around the functionality of the `transfer` function. While
the bug may not be immediately discoverable, we can try and sus it out using
scribble.  In normal scribble use, we would:

1. Think of how we *believe* this function should behave, and write it up as a series of annotations.
2. Instrument the code
3. Run an automated checking tool such as Diligence Fuzzing, Mythril, Echidna, etc. on the instrumented code.

However for the sake of this tutorial, we will just translate one specific
natural language specification in scribble, and show that it can be violated
with a concrete test.

## Adding an annotation

There are many things that we can say we expect hold true of the `transfer()` function. One thing we can say for example is that:

"If the `transfer(to, amount)` call succeeds, then the balance of the `msg.sender` will decrease by `amount`.

This can be encoded by adding the following docstring above `transfer()`:

```
  /// #if_succeeds "The sender spends _value" old(_balances[msg.sender]) - _value == _balances[msg.sender];
  function transfer(address _to, uint256 _value) external returns (bool) {
```

There are several things to note about this annotation:

1. It *must* be held inside a docstring. (i.e. a comment that is enclosed by
`///` or `/** */`). If you use a normal comment (`//` or `/* */` it will be
ignored).

2. Annotations begin with a specific '#'-prefixed keyword. In this case `#if_succeeds` specifies a condition that must hold after `transfer()` successfully finishes executing.

3. The actual annotation is a simple Solidity expression, with a couple of extra features. In the above example the extra feature is the `old()` keyword, which
specifies to take the value of the inner expression *before* the start of the `transfer()` function call.

Putting these 3 things together, the annotation `old(_balances[msg.sender]) -
_value == _balances[msg.sender]` precisely mimics the english description: the
value of `_balances[msg.sender]` before the call to `transfer()` minus `_value`
must be equal to the new value of `_balances[msg.sender]` after the call to
`transfer`.

## Instrumenting with scribble

The annotation as a comment is not very useful on its own. The `scribble` instrumentation tools turns this annotation into an executable check by running:

```
scribble --arm contracts/vulnerableERC20.sol --output-mode files
```

There are 2 things to unpack here. First the `--output-mode files` option
specifies that the instrumented code should be written out to files instead of
to stdout. Second the `--arm` option specifies that those files should overwrite
the original annotated solidity files instead of creating new files.

After running this, if we open up `contracts/vulnerableERC20.sol` we would find that the `transfer()` function has been changed to something like this:

```
    function transfer(address _to, uint256 _value) external returns (bool RET_0) {
        vars0 memory _v;
        unchecked {
            _v.old_0 = _balances[msg.sender];
        }
        RET_0 = _original_VulnerableToken_transfer(_to, _value);
        unchecked {
            if (!((_v.old_0 - _value) == _balances[msg.sender])) {
                emit AssertionFailed("0: The sender spends _value");
                assert(false);
            }
        }
    }
```

The logic of the original `transfer()` function has been moved into
`_original_VulnerableToken_transfer`, which is called in the middle of this new
`transfer()` function. The new function calls the original function, and
implements the check from the annotation. It stores the balance of `msg.sender`
before calling `_original_VulnerableToken_transfer` in `_v.old_0`, and uses that
to compute wether the annotation holds. If it doesn't, it emits an
`AssertionFailed` event and triggers an assertion failure.

## Testing the annotation

In `test/vulnerableERC20.js` we wrote a simple test that moves 1 wei from one address to another. You can run this test after instrumenting and verify that it still passes after instrumenting, by running:

```
npx hardhat test
```

The fact that the annotation holds for one test, or even a hundred tests
*doesn't make it true*. And we can demonstrate this by tweaking the test
a little. Change the following lines:

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

Essentially what we've done is change the test to transfer from `acct1` back to itself, instead of into `acct2`. We just happen to know that this particular test
may trip up our annotation. As you will find in later lectures, in practice the work of finding these weird edge cases is (mostly) done by the fuzzer, not by you.

Now if you run the test again you will get an assertion failure:

```sh
$ npx hardhat test
...
  vulnerableERC20
    1) Transfer


  0 passing (1s)
  1 failing

  1) vulnerableERC20
       Transfer:
     Error: VM Exception while processing transaction: reverted with panic code 0x1 (Assertion error)
    at VulnerableToken.transfer (contracts/vulnerableERC20.sol:46)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at runNextTicks (node:internal/process/task_queues:65:3)
    at listOnTimeout (node:internal/timers:528:9)
    at processTimers (node:internal/timers:502:7)
    at HardhatNode._mineBlockWithPendingTxs (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:1802:23)
    at HardhatNode.mineBlock (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:491:16)
    at EthModule._sendTransactionAndReturnHash (node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:1522:18)
```

If you squint carefully at the code for `transfer()` you will see the error around these lines:

```
    uint256 newBalanceFrom = _balances[from] - _value;
    uint256 newBalanceTo = _balances[_to] + _value;
    _balances[from] = newBalanceFrom;
    _balances[_to] = newBalanceTo;
```

Essentially when `from` and `_to` are equal, we are updating the same entry in `_balances` with 2 different values, instead of noticing that there is no
change in the balances.

## Restoring our code

The instrumentation made a mess of our solidity file. We can undo this with the following command:

```
scribble --disarm contracts/vulnerableERC20.sol --output-mode files
```

This is the same as the instrumentation command above, only with `--arm`
replaced with `--disarm`.  At this point we are done with the exercise.