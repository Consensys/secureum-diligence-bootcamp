const { expect } = require("chai");

describe("SimpleAuction", async function () {
  let purchase;
  let acct1
  let acct2

  before(async function () {
    const [owner, _acct1, _acct2] = await ethers.getSigners();
    acct1 = _acct1;
    acct2 = _acct2;

    const SimpleAuctionContract = await ethers.getContractFactory("SimpleAuction");
    purchase = await SimpleAuctionContract.connect(acct1).deploy(1000, acct1.address);
  });

  it("Write your test here...", async () => {
  })
});
