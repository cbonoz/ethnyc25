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
    
    // Contract state
    address public owner;
    address public client;
    OfferMetadata public offerMetadata;
    IERC20 public paymentToken;
    bool public isAccepted;
    bool public isCompleted;
    bool public isFunded;
    
    // Events
    event OfferCreated(address indexed owner, uint256 amount, string title);
    event OfferAccepted(address indexed client, uint256 timestamp);
    event OfferFunded(address indexed funder, uint256 amount);
    event OfferCompleted(address indexed owner, uint256 timestamp);
    event FundsWithdrawn(address indexed recipient, uint256 amount);
    
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
        address _client
    ) {
        owner = msg.sender;
        client = _client;
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
    
    // Accept the offer (client only)
    function acceptOffer() external onlyClient {
        require(offerMetadata.isActive, "Offer is not active");
        require(!isAccepted, "Offer already accepted");
        
        isAccepted = true;
        emit OfferAccepted(client, block.timestamp);
    }
    
    // Fund the contract (anyone can fund, typically client)
    function fundContract() external nonReentrant {
        require(isAccepted, "Offer must be accepted first");
        require(!isFunded, "Contract already funded");
        require(offerMetadata.isActive, "Offer is not active");
        
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
    function emergencyWithdraw() external onlyClient nonReentrant {
        require(isFunded, "Contract not funded");
        require(!isCompleted, "Offer already completed");
        require(block.timestamp > offerMetadata.deadline, "Deadline not reached");
        
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        
        require(paymentToken.transfer(client, balance), "Emergency withdrawal failed");
        emit FundsWithdrawn(client, balance);
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
}
