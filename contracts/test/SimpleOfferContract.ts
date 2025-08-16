import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import { parseEther } from "viem";

describe("SimpleOfferContract", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  
  // Test accounts
  const [owner, client, other] = await viem.getWalletClients();
  
  // Test data
  const offerData = {
    title: "Web Development Service",
    description: "Build a modern React application with smart contract integration",
    serviceType: "Development",
    deliverables: "Complete web application with source code and documentation",
    amount: parseEther("100"), // 100 tokens
    deadline: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60), // 30 days from now
  };

  let mockToken: any;
  let offerContract: any;

  describe("Deployment", function () {
    it("Should deploy MockERC20 token", async function () {
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD",
        "PYUSD",
        parseEther("10000"), // 10,000 tokens initial supply
      ]);
      
      assert.equal(await mockToken.read.name(), "Test PYUSD");
      assert.equal(await mockToken.read.symbol(), "PYUSD");
      assert.equal(await mockToken.read.totalSupply(), parseEther("10000"));
    });

    it("Should deploy SimpleOfferContract with correct initial values", async function () {
      // First deploy the mock token
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD",
        "PYUSD",
        parseEther("10000"),
      ]);
      
      // Then deploy the offer contract
      offerContract = await viem.deployContract("SimpleOfferContract", [
        offerData.title,
        offerData.description,
        offerData.serviceType,
        offerData.deliverables,
        offerData.amount,
        offerData.deadline,
        mockToken.address,
        client.account.address,
      ]);
      
      // Check contract state
      assert.equal(await offerContract.read.owner(), owner.account.address);
      assert.equal(await offerContract.read.client(), client.account.address);
      assert.equal(await offerContract.read.isAccepted(), false);
      assert.equal(await offerContract.read.isCompleted(), false);
      assert.equal(await offerContract.read.isFunded(), false);
    });

    it("Should emit OfferCreated event on deployment", async function () {
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD",
        "PYUSD",
        parseEther("10000"),
      ]);
      
      const deploymentBlockNumber = await publicClient.getBlockNumber();
      
      offerContract = await viem.deployContract("SimpleOfferContract", [
        offerData.title,
        offerData.description,
        offerData.serviceType,
        offerData.deliverables,
        offerData.amount,
        offerData.deadline,
        mockToken.address,
        client.account.address,
      ]);
      
      // Check for OfferCreated event
      const events = await publicClient.getContractEvents({
        address: offerContract.address,
        abi: offerContract.abi,
        eventName: "OfferCreated",
        fromBlock: deploymentBlockNumber,
        strict: true,
      });
      
      assert.equal(events.length, 1);
      assert.equal(events[0].args.owner, owner.account.address);
      assert.equal(events[0].args.amount, offerData.amount);
      assert.equal(events[0].args.title, offerData.title);
    });
  });

  describe("Offer Details", function () {
    it("Should return correct offer details", async function () {
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD", 
        "PYUSD", 
        parseEther("10000")
      ]);
      
      offerContract = await viem.deployContract("SimpleOfferContract", [
        offerData.title,
        offerData.description,
        offerData.serviceType,
        offerData.deliverables,
        offerData.amount,
        offerData.deadline,
        mockToken.address,
        client.account.address,
      ]);
      
      const details = await offerContract.read.getOfferDetails();
      
      assert.equal(details[0], offerData.title); // title
      assert.equal(details[1], offerData.description); // description
      assert.equal(details[2], offerData.serviceType); // serviceType
      assert.equal(details[3], offerData.deliverables); // deliverables
      assert.equal(details[4], offerData.amount); // amount
      assert.equal(details[5], offerData.deadline); // deadline
      assert.equal(details[6], true); // isActive
      assert.equal(details[8], owner.account.address); // offerOwner
      assert.equal(details[9], client.account.address); // offerClient
      assert.equal(details[10], false); // accepted
      assert.equal(details[11], false); // funded
      assert.equal(details[12], false); // completed
    });

    it("Should return correct contract balance", async function () {
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD",
        "PYUSD", 
        parseEther("10000")
      ]);
      
      offerContract = await viem.deployContract("SimpleOfferContract", [
        offerData.title,
        offerData.description,
        offerData.serviceType,
        offerData.deliverables,
        offerData.amount,
        offerData.deadline,
        mockToken.address,
        client.account.address,
      ]);
      
      // Initially should be 0
      assert.equal(await offerContract.read.getContractBalance(), 0n);
    });
  });

  describe("Accept Offer Flow", function () {
    it("Should allow client to accept offer", async function () {
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD",
        "PYUSD",
        parseEther("10000"),
      ]);
      
      offerContract = await viem.deployContract("SimpleOfferContract", [
        offerData.title,
        offerData.description,
        offerData.serviceType,
        offerData.deliverables,
        offerData.amount,
        offerData.deadline,
        mockToken.address,
        client.account.address,
      ]);
      
      // Get deployment block for event checking
      const blockNumber = await publicClient.getBlockNumber();
      
      // Client accepts the offer using the client wallet
      const hash = await client.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "acceptOffer",
      });
      
      // Wait for transaction
      await publicClient.waitForTransactionReceipt({ hash });
      
      // Check state changed
      assert.equal(await offerContract.read.isAccepted(), true);
      
      // Check for OfferAccepted event
      const events = await publicClient.getContractEvents({
        address: offerContract.address,
        abi: offerContract.abi,
        eventName: "OfferAccepted",
        fromBlock: blockNumber,
        strict: true,
      });
      
      assert.equal(events.length, 1);
      assert.equal(events[0].args.client, client.account.address);
    });

    it("Should reject non-client trying to accept", async function () {
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD",
        "PYUSD",
        parseEther("10000"),
      ]);
      
      offerContract = await viem.deployContract("SimpleOfferContract", [
        offerData.title,
        offerData.description,
        offerData.serviceType,
        offerData.deliverables,
        offerData.amount,
        offerData.deadline,
        mockToken.address,
        client.account.address,
      ]);
      
      try {
        await other.writeContract({
          address: offerContract.address,
          abi: offerContract.abi,
          functionName: "acceptOffer",
        });
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert.ok(error.message.includes("Only designated client"));
      }
    });
  });

  describe("Fund Contract Flow", function () {
    it("Should allow funding after acceptance", async function () {
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD",
        "PYUSD",
        parseEther("10000"),
      ]);
      
      // Transfer tokens to client
      await mockToken.write.transfer([client.account.address, parseEther("1000")]);
      
      offerContract = await viem.deployContract("SimpleOfferContract", [
        offerData.title,
        offerData.description,
        offerData.serviceType,
        offerData.deliverables,
        offerData.amount,
        offerData.deadline,
        mockToken.address,
        client.account.address,
      ]);
      
      // Client accepts offer
      await client.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "acceptOffer",
      });
      
      // Client approves token spending
      await client.writeContract({
        address: mockToken.address,
        abi: mockToken.abi,
        functionName: "approve",
        args: [offerContract.address, offerData.amount],
      });
      
      const blockNumber = await publicClient.getBlockNumber();
      
      // Fund the contract
      const hash = await client.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "fundContract",
      });
      
      await publicClient.waitForTransactionReceipt({ hash });
      
      assert.equal(await offerContract.read.isFunded(), true);
      assert.equal(await offerContract.read.getContractBalance(), offerData.amount);
      
      // Check for OfferFunded event
      const events = await publicClient.getContractEvents({
        address: offerContract.address,
        abi: offerContract.abi,
        eventName: "OfferFunded",
        fromBlock: blockNumber,
        strict: true,
      });
      
      assert.equal(events.length, 1);
      assert.equal(events[0].args.funder, client.account.address);
      assert.equal(events[0].args.amount, offerData.amount);
    });
  });

  describe("Complete Offer Flow", function () {
    it("Should allow owner to complete funded offer", async function () {
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD",
        "PYUSD",
        parseEther("10000"),
      ]);
      
      // Transfer tokens to client
      await mockToken.write.transfer([client.account.address, parseEther("1000")]);
      
      offerContract = await viem.deployContract("SimpleOfferContract", [
        offerData.title,
        offerData.description,
        offerData.serviceType,
        offerData.deliverables,
        offerData.amount,
        offerData.deadline,
        mockToken.address,
        client.account.address,
      ]);
      
      // Accept and fund offer
      await client.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "acceptOffer",
      });
      
      await client.writeContract({
        address: mockToken.address,
        abi: mockToken.abi,
        functionName: "approve",
        args: [offerContract.address, offerData.amount],
      });
      
      await client.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "fundContract",
      });
      
      const blockNumber = await publicClient.getBlockNumber();
      
      // Owner completes offer
      const hash = await owner.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "completeOffer",
      });
      
      await publicClient.waitForTransactionReceipt({ hash });
      
      assert.equal(await offerContract.read.isCompleted(), true);
      
      // Check for OfferCompleted event
      const events = await publicClient.getContractEvents({
        address: offerContract.address,
        abi: offerContract.abi,
        eventName: "OfferCompleted",
        fromBlock: blockNumber,
        strict: true,
      });
      
      assert.equal(events.length, 1);
      assert.equal(events[0].args.owner, owner.account.address);
    });
  });

  describe("Withdraw Funds Flow", function () {
    it("Should allow owner to withdraw after completion", async function () {
      mockToken = await viem.deployContract("MockERC20", [
        "Test PYUSD",
        "PYUSD",
        parseEther("10000"),
      ]);
      
      // Transfer tokens to client
      await mockToken.write.transfer([client.account.address, parseEther("1000")]);
      
      offerContract = await viem.deployContract("SimpleOfferContract", [
        offerData.title,
        offerData.description,
        offerData.serviceType,
        offerData.deliverables,
        offerData.amount,
        offerData.deadline,
        mockToken.address,
        client.account.address,
      ]);
      
      // Complete the full flow
      await client.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "acceptOffer",
      });
      
      await client.writeContract({
        address: mockToken.address,
        abi: mockToken.abi,
        functionName: "approve",
        args: [offerContract.address, offerData.amount],
      });
      
      await client.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "fundContract",
      });
      
      await owner.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "completeOffer",
      });
      
      // Check initial balances
      const initialOwnerBalance = await mockToken.read.balanceOf([owner.account.address]);
      const blockNumber = await publicClient.getBlockNumber();
      
      // Withdraw funds
      const hash = await owner.writeContract({
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "withdrawFunds",
      });
      
      await publicClient.waitForTransactionReceipt({ hash });
      
      // Check final balances
      const finalOwnerBalance = await mockToken.read.balanceOf([owner.account.address]);
      assert.equal(finalOwnerBalance - initialOwnerBalance, offerData.amount);
      assert.equal(await offerContract.read.getContractBalance(), 0n);
      
      // Check for FundsWithdrawn event
      const events = await publicClient.getContractEvents({
        address: offerContract.address,
        abi: offerContract.abi,
        eventName: "FundsWithdrawn",
        fromBlock: blockNumber,
        strict: true,
      });
      
      assert.equal(events.length, 1);
      assert.equal(events[0].args.recipient, owner.account.address);
      assert.equal(events[0].args.amount, offerData.amount);
    });
  });
});
