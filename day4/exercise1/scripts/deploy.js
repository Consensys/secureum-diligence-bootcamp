const hre = require("hardhat");

async function main() {
    const provider = await hre.ethers.getDefaultProvider("http://localhost:8545");
    const network = await provider.getNetwork();
    console.log("Network chain ID:", network.chainId);
    const signers = await hre.ethers.getSigners();
    console.log("Signers:", signers);
    const deployer = signers[0];
    const owner = await deployer.getAddress();
    console.log(
        `Owner: ${owner}`
    );
    const GaslessDestroy = await hre.ethers.getContractFactory("GaslessDestroy");
    const contract = await GaslessDestroy.deploy(owner);
    const deployedContract = await contract.deployed();
    console.log(
        `Deployed at: ${contract.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
