const { expect } = require("chai");
const { ethers } = require("hardhat");

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
