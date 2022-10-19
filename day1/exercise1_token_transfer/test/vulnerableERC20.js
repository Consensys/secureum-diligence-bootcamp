const { expect } = require("chai");

describe("vulnerableERC20", async function () {
  let vulnerableToken;
  let acct1
  let acct2

  before(async function () {
    const [owner, _acct1, _acct2] = await ethers.getSigners();
    acct1 = _acct1;
    acct2 = _acct2;

    const VulnerableTokenContract = await ethers.getContractFactory("VulnerableToken");
    vulnerableToken = await VulnerableTokenContract.deploy();
    await vulnerableToken.connect(owner).transfer(acct1.address, 100);
  });

});