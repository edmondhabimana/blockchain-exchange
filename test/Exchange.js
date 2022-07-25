const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe(() => {
  let accounts, deployer, feeAccount, exchange;
  const feePercent = 10;

  beforeEach(async () => {
    accounts = await ethers.getSigner();
    deployer = accounts[0];
    feeAccount = accounts[1];

    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await tokens.deploy(feeAccount.address, feePercent);
  });

  describe("Deployment", () => {
    it("tracks the fee account", async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    });

    it("tracks the fee account", async () => {
      expect(await exchange.feePercent()).to.equal(feePercent);
    });
  });
});
