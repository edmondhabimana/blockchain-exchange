const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token;

  beforeEach(async () => {
    //Fetch Token contract
    const Token = await ethers.getContractFactory("Token");
    //deploy the contract
    token = await Token.deploy("Dapp University", "DAPP", "1000000");
  });

  describe("Deployment", () => {
    const name = "Dapp University";
    const symbol = "DAPP";
    const decimals = "18";
    const totalSupply = tokens(1000000);

    it("has correct name", async () => {
      //Read token name and check that name is correct
      expect(await token.name()).to.equal(name);
    });

    it("has correct symbol", async () => {
      //Read token symbol and check that symbol is correct
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has correct decimals", async () => {
      //Read token decimal and check that decimal is correct
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has correct total supply", async () => {
      //Read token total supply and check that total supply is correct
      expect(await token.totalSupply()).to.equal(totalSupply);
    });
  });
});
