// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleOfferContract is ReentrancyGuard {
    
    // Offer metadata structure
    struct OfferMetadata {
        string title;
        string description;
        string serviceType;
        string deliverables;
        uint256 amount;
        uint256 deadline;
        bool isActive;
        uint256 createdAt;
        uint256 depositAmount;
    }
    
    // Offer status structure
    struct OfferStatus {
        address owner;
        address client;
        bool isAccepted;
        bool isFunded;
        bool isCompleted;
        bool isDepositPaid;
        uint256 paidAmount;
        uint256 remainingAmount;
    }
    
    // Client offer request structure
    struct ClientOfferRequest {
        address clientAddress;
        string message;
        uint256 requestedAt;
        bool isRejected;
    }
    
    // Contract state
    address public owner;
    address public client;
    OfferMetadata public offerMetadata;
    IERC20 public paymentToken;
    bool public isAccepted;
    bool public isCompleted;
    bool public isFunded;
    bool public isDepositPaid;
    uint256 public paidAmount;
    
    // Client offer requests
    mapping(address => ClientOfferRequest) public clientOfferRequests;
    address[] public requesterAddresses;
    address public pendingClient;
    
    // Events
    event OfferCreated(address indexed owner, uint256 amount, string title);
    event ClientRequested(address indexed client, string message, uint256 timestamp);
    event OfferRequestRejected(address indexed client, uint256 timestamp);
    event OfferAccepted(address indexed client, uint256 timestamp);
    event OfferFunded(address indexed funder, uint256 amount);
    event DepositPaid(address indexed client, uint256 amount);
    event RemainingBalancePaid(address indexed client, uint256 amount);
    event OfferCompleted(address indexed owner, uint256 timestamp);
    event FundsWithdrawn(address indexed recipient, uint256 amount);
    event OfferDeactivated(address indexed owner, uint256 timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only offer owner can call this function");
        _;
    }
    
    modifier onlyClient() {
        require(msg.sender == client, "Only designated client can call this function");
        _;
    }
    
    constructor(
        string memory _title,
        string memory _description,
        string memory _serviceType,
        string memory _deliverables,
        uint256 _amount,
        uint256 _deadline,
        address _paymentToken,
        uint256 _depositAmount
    ) {
        owner = msg.sender;
        paymentToken = IERC20(_paymentToken);
        
        // Validate deposit amount if provided
        if (_depositAmount > 0) {
            require(_depositAmount < _amount, "Deposit amount must be less than total amount");
        }
        
        offerMetadata = OfferMetadata({
            title: _title,
            description: _description,
            serviceType: _serviceType,
            deliverables: _deliverables,
            amount: _amount,
            deadline: _deadline,
            isActive: true,
            createdAt: block.timestamp,
            depositAmount: _depositAmount
        });
        
        emit OfferCreated(owner, _amount, _title);
    }
    
    // Request and fund offer (handles both full payment and deposit)
    function requestAndFundOffer(string memory _message) external nonReentrant {
        require(offerMetadata.isActive, "Offer is not active");
        require(!isAccepted, "Offer already accepted");
        require(!isCompleted, "Offer already completed");
        require(msg.sender != owner, "Owner cannot request their own offer");
        require(clientOfferRequests[msg.sender].clientAddress == address(0), "Already requested");
        
        // Create the request
        clientOfferRequests[msg.sender] = ClientOfferRequest({
            clientAddress: msg.sender,
            message: _message,
            requestedAt: block.timestamp,
            isRejected: false
        });
        
        requesterAddresses.push(msg.sender);
        
        // Set this client as the pending client (not yet accepted, waiting for owner decision)
        pendingClient = msg.sender;
        
        // Determine payment amount (deposit or full amount)
        uint256 paymentAmount;
        if (offerMetadata.depositAmount > 0) {
            paymentAmount = offerMetadata.depositAmount;
            require(paymentAmount > 0, "Deposit amount must be greater than 0");
            require(paymentAmount < offerMetadata.amount, "Deposit must be less than total amount");
        } else {
            paymentAmount = offerMetadata.amount;
        }
        
        // Transfer payment
        require(paymentToken.transferFrom(msg.sender, address(this), paymentAmount), "Payment transfer failed");
        paidAmount = paymentAmount;
        
        if (offerMetadata.depositAmount > 0) {
            isDepositPaid = true;
            emit DepositPaid(msg.sender, paymentAmount);
        } else {
            isFunded = true;
            emit OfferFunded(msg.sender, paymentAmount);
        }
        
        // Emit request event
        emit ClientRequested(msg.sender, _message, block.timestamp);
    }

    // Reject a client offer request (owner only) - allows client to withdraw funds if they paid
    function rejectOfferRequest(address _clientAddress) external onlyOwner {
        require(clientOfferRequests[_clientAddress].clientAddress != address(0), "No request found");
        require(!clientOfferRequests[_clientAddress].isRejected, "Request already rejected");
        require(!isCompleted, "Cannot reject after completion");
        require(_clientAddress == pendingClient, "Can only reject the pending client");
        
        clientOfferRequests[_clientAddress].isRejected = true;
        
        // Clear the pending client since they're rejected
        pendingClient = address(0);
        
        emit OfferRequestRejected(_clientAddress, block.timestamp);
    }

    // Withdraw funds after being rejected (for clients who were rejected after paying)
    function withdrawAfterRejection() external nonReentrant {
        require(clientOfferRequests[msg.sender].clientAddress != address(0), "No request found");
        require(clientOfferRequests[msg.sender].isRejected, "Request not rejected");
        
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        
        // Calculate how much this client paid (if they were the pending client)
        uint256 refundAmount = 0;
        if (paidAmount > 0 && msg.sender == clientOfferRequests[msg.sender].clientAddress) {
            refundAmount = paidAmount;
        }
        
        require(refundAmount > 0, "No payment to refund");
        require(balance >= refundAmount, "Insufficient contract balance");
        
        // Reset payment tracking
        paidAmount = 0;
        isDepositPaid = false;
        isFunded = false;
        
        require(paymentToken.transfer(msg.sender, refundAmount), "Refund transfer failed");
        emit FundsWithdrawn(msg.sender, refundAmount);
    }

    // Pay remaining balance for deposit-based offers
    function payRemainingBalance() external nonReentrant onlyClient {
        require(offerMetadata.depositAmount > 0, "This offer doesn't require a deposit");
        require(isDepositPaid, "Deposit not paid yet");
        require(!isFunded, "Already fully funded");
        require(isAccepted, "Offer must be accepted");
        
        uint256 remainingAmount = offerMetadata.amount - paidAmount;
        require(remainingAmount > 0, "No remaining balance");
        
        require(paymentToken.transferFrom(msg.sender, address(this), remainingAmount), "Payment transfer failed");
        
        paidAmount += remainingAmount;
        isFunded = true;
        
        emit RemainingBalancePaid(msg.sender, remainingAmount);
        emit OfferFunded(msg.sender, remainingAmount);
    }
    
    // Mark offer as completed (owner only) - this also accepts the pending client
    function completeOffer() external onlyOwner {
        require(pendingClient != address(0), "No pending client request");
        require(paidAmount > 0, "No payment received");
        require(!isCompleted, "Offer already completed");
        
        // Accept the pending client
        if (!isAccepted) {
            client = pendingClient;
            isAccepted = true;
            emit OfferAccepted(client, block.timestamp);
        }
        
        // Verify payment requirements
        if (offerMetadata.depositAmount > 0) {
            require(isDepositPaid, "Deposit must be paid");
            // For deposit offers, completion doesn't require full funding
            // The owner can complete the work and request remaining payment separately
        } else {
            require(isFunded, "Contract must be funded");
        }
        
        isCompleted = true;
        emit OfferCompleted(owner, block.timestamp);
    }
    
    // Withdraw funds after completion (owner only)
    function withdrawFunds() external onlyOwner nonReentrant {
        require(isCompleted, "Offer must be completed");
        
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        
        require(paymentToken.transfer(owner, balance), "Withdrawal failed");
        emit FundsWithdrawn(owner, balance);
    }
    
    // Emergency withdraw for client if deadline passed and not completed
    function emergencyWithdraw() external nonReentrant {
        require(paidAmount > 0, "No payment made"); // Works for both deposit and full payment
        require(!isCompleted, "Offer already completed");
        require(block.timestamp > offerMetadata.deadline, "Deadline not reached");
        require(msg.sender == client, "Only client can emergency withdraw");
        
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        
        require(paymentToken.transfer(client, balance), "Emergency withdrawal failed");
        emit FundsWithdrawn(client, balance);
    }
    
    // Deactivate offer (owner only) - prevents new applications but allows existing work to continue
    function deactivateOffer() external onlyOwner {
        require(offerMetadata.isActive, "Offer is already deactivated");
        offerMetadata.isActive = false;
        emit OfferDeactivated(owner, block.timestamp);
    }
    
    // Get basic offer metadata
    function getOfferMetadata() external view returns (OfferMetadata memory) {
        return offerMetadata;
    }
    
    // Get offer participants and status
    function getOfferStatus() external view returns (OfferStatus memory) {
        uint256 remainingAmount = 0;
        if (offerMetadata.depositAmount > 0 && paidAmount < offerMetadata.amount) {
            remainingAmount = offerMetadata.amount - paidAmount;
        }
        
        return OfferStatus({
            owner: owner,
            client: client,
            isAccepted: isAccepted,
            isFunded: isFunded,
            isCompleted: isCompleted,
            isDepositPaid: isDepositPaid,
            paidAmount: paidAmount,
            remainingAmount: remainingAmount
        });
    }
    
    // Get remaining balance for deposit offers
    function getRemainingBalance() external view returns (uint256) {
        if (offerMetadata.depositAmount == 0 || paidAmount >= offerMetadata.amount) {
            return 0;
        }
        return offerMetadata.amount - paidAmount;
    }
    
    // Check if offer requires deposit
    function getRequiresDeposit() external view returns (bool) {
        return offerMetadata.depositAmount > 0;
    }
    
    // Get deposit amount
    function getDepositAmount() external view returns (uint256) {
        return offerMetadata.depositAmount;
    }
    
    // Get offer details (simplified version for backward compatibility)
    function getOfferDetails() external view returns (
        string memory title,
        string memory description,
        string memory serviceType,
        string memory deliverables,
        uint256 amount,
        uint256 deadline,
        bool isActive,
        uint256 createdAt,
        bool requiresDeposit,
        uint256 depositAmount
    ) {
        return (
            offerMetadata.title,
            offerMetadata.description,
            offerMetadata.serviceType,
            offerMetadata.deliverables,
            offerMetadata.amount,
            offerMetadata.deadline,
            offerMetadata.isActive,
            offerMetadata.createdAt,
            offerMetadata.depositAmount > 0, // Derived from depositAmount
            offerMetadata.depositAmount
        );
    }
    
    // Get contract balance
    function getContractBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }
    
    // Get client offer request
    function getClientOfferRequest(address _clientAddress) external view returns (ClientOfferRequest memory) {
        return clientOfferRequests[_clientAddress];
    }
    
    // Get all requester addresses
    function getRequesterAddresses() external view returns (address[] memory) {
        return requesterAddresses;
    }
    
    // Get number of requests
    function getRequestCount() external view returns (uint256) {
        return requesterAddresses.length;
    }
    
    // Get all offer requests in a single call
    function getAllOfferRequests() external view returns (ClientOfferRequest[] memory) {
        ClientOfferRequest[] memory allRequests = new ClientOfferRequest[](requesterAddresses.length);
        
        for (uint i = 0; i < requesterAddresses.length; i++) {
            allRequests[i] = clientOfferRequests[requesterAddresses[i]];
        }
        
        return allRequests;
    }
    
    // Get offer requests for a specific client address
    function getClientOfferRequests(address _clientAddress) external view returns (ClientOfferRequest memory) {
        return clientOfferRequests[_clientAddress];
    }
}
