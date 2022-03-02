const { default: BigNumber } = require("bignumber.js");
const { assert } = require("chai");
const { ethers, contract } = require("hardhat");
const { artifacts } = require("hardhat");
const { web3 } = require("hardhat");

const truffleAssert = require("truffle-assertions");

const { callMethod } = require("./utils.js");

const Proxy = artifacts.require("Proxy");
const LogicOne = artifacts.require("LogicV1");
const LogicTwo = artifacts.require("LogicV2");

contract("Proxy Test", (accounts) => {
  const deployer = accounts[0];
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    // Proxy Contract
    this.ProxyInstance = await Proxy.new({ from: deployer });
    this.Proxy = await new web3.eth.Contract(
      this.ProxyInstance.abi,
      this.ProxyInstance.address
    );

    // Logic One Contract
    this.LogicOneInstance = await LogicOne.new({ from: deployer });
    this.LogicOne = await new web3.eth.Contract(
      this.LogicOneInstance.abi,
      this.LogicOneInstance.address
    );

    // Logic Two Contract
    this.LogicTwoInstance = await LogicTwo.new({ from: deployer });
    this.LogicTwo = await new web3.eth.Contract(
      this.LogicTwoInstance.abi,
      this.LogicTwoInstance.address
    );

    // Set Implementation
    await this.ProxyInstance.setImplementation(this.LogicOneInstance.address, {
      from: deployer,
    });
  });

  describe("Test - Proxy", async () => {
    it("Check Proxy Address", async () => {
      assert.equal(
        await callMethod(this.Proxy.methods.getImplementation, []),
        this.LogicOneInstance.address
      );
    });

    it("Check Logic", async () => {
      const updatedProxy = new ethers.Contract(
        this.ProxyInstance.address,
        this.LogicOneInstance.abi,
        owner
      );
      await updatedProxy.initialize();

      assert.equal(await updatedProxy.magicValueV1(), 619);

      await updatedProxy.updateMagicValueV1(51);

      assert.equal(await updatedProxy.magicValueV1(), 51);

      await this.ProxyInstance.setImplementation(
        this.LogicTwoInstance.address,
        {
          from: deployer,
        }
      );

      const secondUpdatedProxy = new ethers.Contract(
        this.ProxyInstance.address,
        this.LogicTwoInstance.abi,
        owner
      );

      await secondUpdatedProxy.initialize();
      assert.equal(await secondUpdatedProxy.magicValueV1(), 51);
      assert.equal(await secondUpdatedProxy.magicValueV2(), 619);

      await secondUpdatedProxy.updateMagicValueV2(2018);
      await secondUpdatedProxy.doMagicV1();

      assert.equal(await secondUpdatedProxy.magicValueV1(), 102);
      assert.equal(await secondUpdatedProxy.magicValueV2(), 2018);
    });
  });
});
