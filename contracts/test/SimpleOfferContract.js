const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleOfferContract", function () {
  let owner, client, other;
  let token, offer;
  const amount = ethers.utils.parseUnits("1000", 18);
  const deposit = ethers.utils.parseUnits("100", 18);
  const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

  beforeEach(async function () {
    [owner, client, other] = await ethers.getSigners();
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy();
    await token.deployed();
    const SimpleOfferContract = await ethers.getContractFactory("SimpleOfferContract");
    offer = await SimpleOfferContract.deploy(
      "Test Title",
      "Test Description",
      "ServiceType",
      "Deliverables",
      amount,
      deadline,
      token.address,
      deposit
    );
    await offer.deployed();
    // Fund client for tests
    await token.transfer(client.address, ethers.utils.parseUnits("2000", 18));
  });

  it("should have correct initial metadata", async function () {
    const details = await offer.getOfferDetails();
    expect(details[0]).to.equal("Test Title");
    expect(details[4]).to.equal(amount);
    expect(details[6]).to.equal(true); // isActive
    expect(details[8]).to.equal(true); // requiresDeposit
    expect(details[9]).to.equal(deposit);
  });

  it("should allow owner to deactivate offer", async function () {
    await offer.deactivateOffer();
    const details = await offer.getOfferDetails();
    expect(details[6]).to.equal(false); // isActive
  });

  it("client can request and fund offer", async function () {
    await token.connect(client).approve(offer.address, deposit);
    await offer.connect(client).requestAndFundOffer("I want this offer");
    expect(await offer.paidAmount()).to.equal(deposit);
    expect(await offer.isDepositPaid()).to.equal(true);
  });

  it("owner can reject and client can withdraw after rejection", async function () {
    await token.connect(client).approve(offer.address, deposit);
    await offer.connect(client).requestAndFundOffer("I want this offer");
    await offer.rejectOfferRequest(client.address);
    const before = await token.balanceOf(client.address);
    await offer.connect(client).withdrawAfterRejection();
    const afterBal = await token.balanceOf(client.address);
    expect(afterBal).to.be.gt(before);
  });

  it("client can pay remaining balance after completion", async function () {
    await token.connect(client).approve(offer.address, deposit);
    await offer.connect(client).requestAndFundOffer("I want this offer");
    await offer.completeOffer();
    await token.connect(client).approve(offer.address, amount.sub(deposit));
    await offer.connect(client).payRemainingBalance();
    expect(await offer.isFunded()).to.equal(true);
  });

  it("owner can complete offer", async function () {
    await token.connect(client).approve(offer.address, deposit);
    await offer.connect(client).requestAndFundOffer("I want this offer");
    await offer.completeOffer();
    expect(await offer.isCompleted()).to.equal(true);
  });

  it("owner can withdraw funds after completion", async function () {
    await token.connect(client).approve(offer.address, deposit);
    await offer.connect(client).requestAndFundOffer("I want this offer");
    await offer.completeOffer();
    const before = await token.balanceOf(owner.address);
    await offer.withdrawFunds();
    const afterBal = await token.balanceOf(owner.address);
    expect(afterBal).to.be.gt(before);
  });

  it("client cannot emergency withdraw before deadline", async function () {
    await token.connect(client).approve(offer.address, deposit);
    await offer.connect(client).requestAndFundOffer("I want this offer");
    await expect(offer.connect(client).emergencyWithdraw()).to.be.revertedWith("Deadline not reached");
  });
});
