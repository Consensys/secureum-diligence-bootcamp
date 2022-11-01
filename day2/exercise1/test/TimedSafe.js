const { expect } = require("chai");
const { ethers } = require("hardhat");

const timer = ms => new Promise( res => setTimeout(res, ms));

describe("TimedSafe", async function () {
  let TimedSafeContract;
  let acct1
  let acct2
  let acct3

  before(async function () {
    const [owner, _acct1, _acct2, _acct3] = await ethers.getSigners();
    acct1 = _acct1;
    acct2 = _acct2;
    acct3 = _acct3;

    TimedSafeContract = await ethers.getContractFactory("TimedSafe");
  });

  it("Disperse one", async() => {
    const safe = await TimedSafeContract.deploy([acct2.address], [10**9], 1, { value: 100});

    const oldBalance = (await ethers.provider.getBalance(acct2.address)).toBigInt();

    await timer(1000);

    await safe.connect(acct1).disperseFunds();
    const newBalance = (await ethers.provider.getBalance(acct2.address)).toBigInt();

    expect(newBalance).to.eq(oldBalance + BigInt(100));
  })

  it("Disperse several", async() => {
    const safe = await TimedSafeContract.deploy([acct2.address, acct3.address], [5*10**8, 5*10**8], 2, { value: 100});

    const oldBalance = (await ethers.provider.getBalance(acct2.address)).toBigInt();

    await timer(2000);

    await safe.connect(acct1).disperseFunds();
    const newBalance = (await ethers.provider.getBalance(acct2.address)).toBigInt();

    expect(newBalance).to.eq(oldBalance + BigInt(50));
  })

  it("Disperse too early", async() => {
    const safe = await TimedSafeContract.deploy([acct2.address, acct3.address], [5*10**8, 5*10**8], 2, { value: 100});

    let failFun = safe.connect(acct1).disperseFunds();
    await expect(failFun).rejectedWith("Too early")
  })

  it("Withdraw one", async() => {
    const safe = await TimedSafeContract.deploy([acct2.address], [10**9], 1, { value: 10**15});

    const oldBalance = (await ethers.provider.getBalance(acct2.address)).toBigInt();

    await timer(1000);

    await safe.connect(acct2).withdrawFunds();
    const newBalance = (await ethers.provider.getBalance(acct2.address)).toBigInt();

    expect(newBalance).to.be.greaterThan(oldBalance);
  })

  it("Withdraw several", async() => {
    const safe = await TimedSafeContract.deploy([acct2.address, acct3.address], [5*10**8, 5*10**8], 1, { value: 2*10**15});

    const oldBalance = (await ethers.provider.getBalance(acct3.address)).toBigInt();

    await timer(1000);

    await safe.connect(acct2).withdrawFunds();
    await safe.connect(acct3).withdrawFunds();
    const newBalance = (await ethers.provider.getBalance(acct3.address)).toBigInt();

    expect(newBalance).to.be.greaterThan(oldBalance);
  })

  it("Withdraw twice", async() => {
    const safe = await TimedSafeContract.deploy([acct2.address], [10**9], 1, { value: 10**15});

    const oldBalance = (await ethers.provider.getBalance(acct2.address)).toBigInt();

    await timer(1000);

    await safe.connect(acct2).withdrawFunds();
    const newBalance = (await ethers.provider.getBalance(acct2.address)).toBigInt();

    expect(newBalance).to.be.greaterThan(oldBalance);
    await safe.connect(acct2).withdrawFunds();
    const newBalance2 = (await ethers.provider.getBalance(acct2.address)).toBigInt();

    expect(newBalance2).to.be.lessThan(newBalance);
  })

});
