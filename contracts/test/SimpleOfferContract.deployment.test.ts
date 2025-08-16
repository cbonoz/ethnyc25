import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleOfferContract, MockERC20 } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("SimpleOfferContract Deployment", function () {
  let simpleOffer: SimpleOfferContract;
  let mockToken: MockERC20;
  let owner: any;
  let client: any;

  const OFFER_TITLE = "Test Web Development";
  const OFFER_DESCRIPTION = "Build a simple website";
  const SERVICE_TYPE = "Web Development";
  const DELIVERABLES = "Responsive website with 3 pages";
  const OFFER_AMOUNT = ethers.utils.parseUnits("100", 6); // 100 PYUSD (6 decimals)
  const DEADLINE = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now

  beforeEach(async function () {
    [owner, client] = await ethers.getSigners();

    // Deploy mock PYUSD token
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20Factory.deploy("PayPal USD", "PYUSD", 6);
    await mockToken.deployed();

    // Deploy SimpleOfferContract
    const SimpleOfferFactory = await ethers.getContractFactory("SimpleOfferContract");
    simpleOffer = await SimpleOfferFactory.deploy(
      OFFER_TITLE,
      OFFER_DESCRIPTION,
      SERVICE_TYPE,
      DELIVERABLES,
      OFFER_AMOUNT,
      DEADLINE,
      mockToken.address
    );
    await simpleOffer.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial parameters", async function () {
      // Check basic contract state
      expect(await simpleOffer.owner()).to.equal(owner.address);
      expect(await simpleOffer.paymentToken()).to.equal(mockToken.address);
      expect(await simpleOffer.isAccepted()).to.equal(false);
      expect(await simpleOffer.isCompleted()).to.equal(false);
      expect(await simpleOffer.isFunded()).to.equal(false);
    });

    it("Should set correct offer metadata", async function () {
      const metadata = await simpleOffer.getOfferMetadata();
      
      expect(metadata.title).to.equal(OFFER_TITLE);
      expect(metadata.description).to.equal(OFFER_DESCRIPTION);
      expect(metadata.serviceType).to.equal(SERVICE_TYPE);
      expect(metadata.deliverables).to.equal(DELIVERABLES);
      expect(metadata.amount).to.equal(OFFER_AMOUNT);
      expect(metadata.deadline).to.equal(DEADLINE);
      expect(metadata.isActive).to.equal(true);
      expect(metadata.createdAt).to.be.gt(0);
    });

    it("Should have correct offer status", async function () {
      const status = await simpleOffer.getOfferStatus();
      
      expect(status.owner).to.equal(owner.address);
      expect(status.client).to.equal(ethers.constants.AddressZero);
      expect(status.isAccepted).to.equal(false);
      expect(status.isFunded).to.equal(false);
      expect(status.isCompleted).to.equal(false);
    });

    it("Should emit OfferCreated event on deployment", async function () {
      // We need to deploy a new contract to check the event
      const SimpleOfferFactory = await ethers.getContractFactory("SimpleOfferContract");
      
      await expect(
        SimpleOfferFactory.deploy(
          OFFER_TITLE,
          OFFER_DESCRIPTION,
          SERVICE_TYPE,
          DELIVERABLES,
          OFFER_AMOUNT,
          DEADLINE,
          mockToken.address
        )
      ).to.emit(SimpleOfferFactory, "OfferCreated")
       .withArgs(owner.address, OFFER_AMOUNT, OFFER_TITLE);
    });

    it("Should have zero contract balance initially", async function () {
      expect(await simpleOffer.getContractBalance()).to.equal(0);
    });

    it("Should have no requests initially", async function () {
      expect(await simpleOffer.getRequestCount()).to.equal(0);
      expect(await simpleOffer.getRequesterAddresses()).to.deep.equal([]);
    });
  });
});
