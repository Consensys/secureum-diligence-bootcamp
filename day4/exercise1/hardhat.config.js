require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        hardhat: {
            chainId: 1,
            allowUnlimitedContractSize: true,
            accounts: [{
                privateKey: "0x000000000000000000000000000000000000000000000000000000000000affe",
                balance: "1000000000000000000000000000000000000000",
            }],
        },
    },
};
