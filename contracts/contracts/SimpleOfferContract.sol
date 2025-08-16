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
    }
    
    // Offer status structure
    struct OfferStatus {
        address owner;
        address client;
        bool isAccepted;
        bool isFunded;
        bool isCompleted;
    }
    
    // Client offer request structure
    struct ClientOfferRequest {
        address clientAddress;
        string message;
        uint256 requestedAt;
        bool isApproved;
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
    
    // Client offer requests
    mapping(address => ClientOfferRequest) public clientOfferRequests;
    address[] public requesterAddresses;
    address public pendingClient;
    
    // Events
    event OfferCreated(address indexed owner, uint256 amount, string title);
    event ClientRequested(address indexed client, string message, uint256 timestamp);
    event OfferRequestApproved(address indexed client, uint256 timestamp);
    event OfferRequestRejected(address indexed client, uint256 timestamp);
    event OfferAccepted(address indexed client, uint256 timestamp);
    event OfferFunded(address indexed funder, uint256 amount);
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
        address _paymentToken
    ) {
        owner = msg.sender;
        paymentToken = IERC20(_paymentToken);
        
        offerMetadata = OfferMetadata({
            title: _title,
            description: _description,
            serviceType: _serviceType,
            deliverables: _deliverables,
            amount: _amount,
            deadline: _deadline,
            isActive: true,
            createdAt: block.timestamp
        });
        
        emit OfferCreated(owner, _amount, _title);
    }
    
    // Request and immediately fund offer (one-step process)
    function requestAndFundOffer(string memory _message) external nonReentrant {
        require(offerMetadata.isActive, "Offer is not active");
        require(!isAccepted, "Offer already accepted");
        require(msg.sender != owner, "Owner cannot request their own offer");
        require(clientOfferRequests[msg.sender].clientAddress == address(0), "Already requested");
        
        // Create the request
        clientOfferRequests[msg.sender] = ClientOfferRequest({
            clientAddress: msg.sender,
            message: _message,
            requestedAt: block.timestamp,
            isApproved: true, // Auto-approved since they're paying
            isRejected: false
        });
        
        requesterAddresses.push(msg.sender);
        
        // Set this client as the chosen one and accept the offer
        client = msg.sender;
        pendingClient = msg.sender;
        isAccepted = true;
        
        // Transfer payment
        uint256 amount = offerMetadata.amount;
        require(paymentToken.transferFrom(msg.sender, address(this), amount), "Payment transfer failed");
        isFunded = true;
        
        // Emit events
        emit ClientRequested(msg.sender, _message, block.timestamp);
        emit OfferRequestApproved(msg.sender, block.timestamp);
        emit OfferAccepted(msg.sender, block.timestamp);
        emit OfferFunded(msg.sender, amount);
    }

    // Request to work on this offer with a message (original method for manual approval flow)
    function requestOffer(string memory _message) external {
        require(offerMetadata.isActive, "Offer is not active");
        require(!isAccepted, "Offer already accepted");
        require(msg.sender != owner, "Owner cannot request their own offer");
        require(clientOfferRequests[msg.sender].clientAddress == address(0), "Already requested");
        
        clientOfferRequests[msg.sender] = ClientOfferRequest({
            clientAddress: msg.sender,
            message: _message,
            requestedAt: block.timestamp,
            isApproved: false,
            isRejected: false
        });
        
        requesterAddresses.push(msg.sender);
        emit ClientRequested(msg.sender, _message, block.timestamp);
    }
    
    // Approve a client offer request (owner only)
    function approveOfferRequest(address _clientAddress) external onlyOwner {
        require(offerMetadata.isActive, "Offer is not active");
        require(!isAccepted, "Offer already accepted");
        require(clientOfferRequests[_clientAddress].clientAddress != address(0), "No request found");
        require(!clientOfferRequests[_clientAddress].isRejected, "Request was rejected");
        
        // Set this client as the chosen one
        client = _clientAddress;
        pendingClient = _clientAddress;
        clientOfferRequests[_clientAddress].isApproved = true;
        
        emit OfferRequestApproved(_clientAddress, block.timestamp);
    }
    
    // Reject a client offer request (owner only)
    function rejectOfferRequest(address _clientAddress) external onlyOwner {
        require(clientOfferRequests[_clientAddress].clientAddress != address(0), "No request found");
        require(!clientOfferRequests[_clientAddress].isApproved, "Request already approved");
        
        clientOfferRequests[_clientAddress].isRejected = true;
        emit OfferRequestRejected(_clientAddress, block.timestamp);
    }
    
    // Accept the offer (approved client only)
    function acceptOffer() external {
        require(offerMetadata.isActive, "Offer is not active");
        require(!isAccepted, "Offer already accepted");
        require(msg.sender == client, "Not the approved client");
        require(clientOfferRequests[msg.sender].isApproved, "Request not approved");
        
        isAccepted = true;
        emit OfferAccepted(client, block.timestamp);
    }
    
    // Fund the contract (approved client only)
    function fundContract() external nonReentrant {
        require(isAccepted, "Offer must be accepted first");
        require(!isFunded, "Contract already funded");
        require(offerMetadata.isActive, "Offer is not active");
        require(msg.sender == client, "Only approved client can fund");
        
        uint256 amount = offerMetadata.amount;
        require(paymentToken.transferFrom(msg.sender, address(this), amount), "Payment transfer failed");
        
        isFunded = true;
        emit OfferFunded(msg.sender, amount);
    }
    
    // Mark offer as completed (owner only)
    function completeOffer() external onlyOwner {
        require(isAccepted, "Offer must be accepted");
        require(isFunded, "Contract must be funded");
        require(!isCompleted, "Offer already completed");
        
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
        require(isFunded, "Contract not funded");
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
        return OfferStatus({
            owner: owner,
            client: client,
            isAccepted: isAccepted,
            isFunded: isFunded,
            isCompleted: isCompleted
        });
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
        uint256 createdAt
    ) {
        return (
            offerMetadata.title,
            offerMetadata.description,
            offerMetadata.serviceType,
            offerMetadata.deliverables,
            offerMetadata.amount,
            offerMetadata.deadline,
            offerMetadata.isActive,
            offerMetadata.createdAt
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
