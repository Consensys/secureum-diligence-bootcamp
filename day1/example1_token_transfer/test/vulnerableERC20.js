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

  it("Transfer", async () => {
    const balanceBefore = await vulnerableToken.balanceOf(acct2.address);
    await vulnerableToken.connect(acct1).approve(acct2.address, 1)
    await vulnerableToken.connect(acct1).transfer(acct2.address, 1);
    const balanceAfter =  await vulnerableToken.balanceOf(acct2.address);

    expect(balanceBefore).to.be.lte(balanceAfter);
  })

  it("Transfer same", async () => {
    const balanceBefore = await vulnerableToken.balanceOf(acct1.address);
    await vulnerableToken.connect(acct1).approve(acct1.address, 1)
    await vulnerableToken.connect(acct1).transfer(acct1.address, 1);
    const balanceAfter =  await vulnerableToken.balanceOf(acct1.address);

    expect(balanceBefore).to.be.lte(balanceAfter);
  })
});
