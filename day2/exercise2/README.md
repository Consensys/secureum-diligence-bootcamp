# Exercise 2: Annotating Open Zeppelin

This exercise is more open ended. Feel free to pick one or more of the following OpenZeppelin contracts and add any annotations you see fit:

- ERC20 (https://docs.openzeppelin.com/contracts/4.x/erc20)
- ERC20Votes (https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes)
- ERC20FlashMint (https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20FlashMint)
- ERC721 (https://docs.openzeppelin.com/contracts/4.x/erc721)
- Ownable (https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable)
- Escrow (https://docs.openzeppelin.com/contracts/4.x/api/utils#Escrow)
- Crowdsale (was removed in latest version, https://docs.openzeppelin.com/contracts/2.x/api/crowdsale#Crowdsale)
- VestingWallet (https://docs.openzeppelin.com/contracts/4.x/api/finance#VestingWallet)

In order to test your annotations, you can use the skeleton test code we have given you in `test/OZ_contracts.js`

## Setup

To complete this exercise you will need `git`, `node` (version 16.0 or later) and `npm`.
After you have checked out this repo, you can install the needed packages by running:

```
cd day2/exercise2/
npm install
```

This will install OpenZeppelin's contracts under `node_modules/`.

## Suggested Workflow

In order to exercise your annotated contracts, you can either subclass them with your own contract under `contracts/` or use them directly in the test. For example, lets say you add an annotation to `node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol` like so:

```
 * #invariant _totalSupply == unchecked_sum(_balances);
 */
contract ERC20 is Context, IERC20, IERC20Metadata {
```

In order to exercise your annotation, you can use the following steps:

1. Add a dummy contract under contracts/ that inherits from your target contract. In the case where you are trying to inherit from ERC20 you can do something like this:

```
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dummy is ERC20("Dummy", "DMMY") {
	constructor() {
		_mint(msg.sender, 1000);
	}
}
```

2. Arm your dummy contract as follows:

`scribble --arm contracts/Dummy.sol --output-mode files`


3. Add test code in `test/OZ_contracts.js` that tests your dummy contract. E.g.:

```
describe("ERC20", async function () {

  it("ERC20 Transfer", async() => {
    const [, acct1, acct2] = await ethers.getSigners();
    const ERC20Contract = await ethers.getContractFactory("Dummy");

    const token = await ERC20Contract.deploy();

    const oldBalance = await token.balanceOf(acct2.address);

    await token.transfer(acct2.address, 1);

    const newdBalance = await token.balanceOf(acct2.address);

    expect(newdBalance).to.eq(oldBalance + 1);
  })
});
```

3. Make sure your *instrumented* code passes all tests


4. (harder) Change the (uninstrumented) open zeppelin code, to introduce a bug, that is *caught* by your instrumentation.


## Submission

Please submit a zip file of your repo with your *uninstrumented* *annotated* code. We will take a look at your annotations, and your tests, and give you feedback based on those.
