const { expect } = require("chai");

describe("Administrable", async function () {
  let adminitrable;
  let acct1
  let acct2

  before(async function () {
    const [owner, _acct1, _acct2] = await ethers.getSigners();
    acct1 = _acct1;
    acct2 = _acct2;

    const AdministrableContract = await ethers.getContractFactory("Administrable");
    administrable = await AdministrableContract.deploy();
  });


  it("Add 0 admin", async () => {
    await administrable.addAdmin("0x0000000000000000000000000000000000000000");
  })

  it("Add admin", async () => {
    await administrable.addAdmin(acct2.address);
  })
});
