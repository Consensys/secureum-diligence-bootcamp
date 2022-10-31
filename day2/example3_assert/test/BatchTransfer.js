const { expect } = require("chai");

describe("BatchSend", async function () {
  let adminitrable;
  let acct1
  let acct2
  let acct3

  before(async function () {
    const [owner, _acct1, _acct2, _acct3] = await ethers.getSigners();
    acct1 = _acct1;
    acct2 = _acct2;
    acct3 = _acct3;

    const BatchSendContract = await ethers.getContractFactory("BatchSend");
    batch = await BatchSendContract.deploy();
  });

  it("Send", async () => {
    await batch.batchSend([acct1.address, acct2.address], [1,1], {value: 2});
  })

  it("Send with duplicates", async () => {
    await batch.batchSend([acct1.address, acct2.address, acct2.address], [1,1,1], {value: 3});
  })

  it("Send with reject", async () => {
    const RejectEthContract = await ethers.getContractFactory("RejectEth");
    reject = await RejectEthContract.deploy();
    await batch.batchSend([acct2.address, reject.address], [1,1], {value: 2});
  })
});
