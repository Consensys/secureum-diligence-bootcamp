const { expect } = require("chai");

describe("Purchase", async function () {
  let purchase;
  let acct1
  let acct2

  before(async function () {
    const [owner, _acct1, _acct2] = await ethers.getSigners();
    acct1 = _acct1;
    acct2 = _acct2;

    const PurchaseContract = await ethers.getContractFactory("Purchase");
    purchase = await PurchaseContract.connect(acct1).deploy();
  });

  it("Write your test here...", async () => {
    /// TODO
  })
});
