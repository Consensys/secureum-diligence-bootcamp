const { expect } = require("chai");

describe("Pow2", async function () {
  let pow2;
  let acct1
  let acct2

  before(async function () {
    const [owner, _acct1, _acct2] = await ethers.getSigners();
    acct1 = _acct1;
    acct2 = _acct2;

    const Pow2Contract = await ethers.getContractFactory("Pow2");
    pow2 = await Pow2Contract.deploy();
  });

  it("Pow2 ok", async () => {
    await pow2.computePow2();
  })
});
