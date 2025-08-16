import { ethers } from 'ethers';
import { SIMPLEOFFER_CONTRACT } from './metadata';
import { formatDate, handleContractError, executeContractTransactionWithRetry, validateTransactionInputs, executeApprovalWithRetry } from '.';
import { PYUSD_TOKEN_ADDRESS, ACTIVE_CHAIN } from '../constants';

export async function deployContract(
    signer,
    title,
    description,
    serviceType,
    deliverables,
    amount,
    deadline
) {
    try {
        // Check if signer is available and connected
        if (!signer) {
            throw new Error('No signer available. Please connect your wallet.');
        }

        // Get the current network from the signer
        const network = await signer.provider.getNetwork();
        console.log('Deploying to network:', network.name, network.chainId);

        // Check if we're on the expected network
        if (network.chainId !== ACTIVE_CHAIN.id) {
            const currentNetworkName = network.chainId === 11155111 ? 'Sepolia Testnet' : 
                                     network.chainId === 1 ? 'Ethereum Mainnet' : 
                                     `Unknown (${network.chainId})`;
            throw new Error(`Wrong network! Expected ${ACTIVE_CHAIN.name} (${ACTIVE_CHAIN.id}) but connected to ${currentNetworkName}. Please switch your wallet to ${ACTIVE_CHAIN.name}.`);
        }

        // Deploy contract with ethers
        const factory = new ethers.ContractFactory(
            SIMPLEOFFER_CONTRACT.abi,
            SIMPLEOFFER_CONTRACT.bytecode,
            signer
        );

        const options = {
            // gasLimit: 3000000,
            // gasPrice: 10000000000,
        };

        // Convert amount to Wei units (PYUSD uses 6 decimals like USDC)
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 6);

        console.log(
            'Deploying offer contract...',
            'Title:', title,
            'Amount in Wei:', amountInWei.toString(),
            'Deadline:', deadline,
            'PYUSD Address:', PYUSD_TOKEN_ADDRESS
        );

        const contract = await factory.deploy(
            title,
            description,
            serviceType,
            deliverables,
            amountInWei,
            deadline,
            PYUSD_TOKEN_ADDRESS
        );

        await contract.deployed();
        console.log('deployed contract...', contract.address);
        return contract;
    } catch (error) {
        console.error('Contract deployment error:', error);
        handleContractError(error, 'deploy contract');
    }
}

export const getMetadata = async (signer, address) => {
    const contract = new ethers.Contract(address, SIMPLEOFFER_CONTRACT.abi, signer);
    
    // Get offer metadata (returns struct)
    const metadata = await contract.getOfferMetadata();
    console.log('offer metadata result', metadata);
    
    // Get offer status (returns struct)
    const status = await contract.getOfferStatus();
    console.log('offer status result', status);
    
    // Format amount from Wei (6 decimals for PYUSD)
    const formattedAmount = ethers.utils.formatUnits(metadata.amount, 6);
    console.log('formatted amount:', formattedAmount);
    
    return {
        title: metadata.title,
        description: metadata.description, 
        serviceType: metadata.serviceType,
        category: metadata.serviceType, // Map serviceType to category for frontend compatibility
        deliverables: metadata.deliverables,
        amount: formattedAmount,
        deadline: new Date(metadata.deadline.toNumber() * 1000).toLocaleDateString(),
        isActive: metadata.isActive,
        createdAt: formatDate(metadata.createdAt.toNumber() * 1000),
        owner: status.owner,
        client: status.client,
        isAccepted: status.isAccepted,
        isFunded: status.isFunded,
        isCompleted: status.isCompleted
    };
};

// Complete offer (owner only) - marks work as done
export const completeOffer = async (signer, contractAddress) => {
    try {
        const contract = new ethers.Contract(contractAddress, SIMPLEOFFER_CONTRACT.abi, signer);
        const tx = await contract.completeOffer();
        await tx.wait();
        console.log('Offer completed successfully');
        return tx;
    } catch (error) {
        console.error('Error completing offer:', error);
        handleContractError(error, 'complete offer');
    }
};

// Withdraw funds (owner only) - after completion
export const withdrawFunds = async (signer, contractAddress) => {
    try {
        const contract = new ethers.Contract(contractAddress, SIMPLEOFFER_CONTRACT.abi, signer);
        const tx = await contract.withdrawFunds();
        await tx.wait();
        console.log('Funds withdrawn successfully');
        return tx;
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        handleContractError(error, 'withdraw funds');
    }
};

// Get contract balance
export const getContractBalance = async (signer, contractAddress) => {
    try {
        const contract = new ethers.Contract(contractAddress, SIMPLEOFFER_CONTRACT.abi, signer);
        const balance = await contract.getContractBalance();
        // Format balance from Wei (6 decimals for PYUSD)
        return ethers.utils.formatUnits(balance, 6);
    } catch (error) {
        console.error('Error getting contract balance:', error);
        return '0';
    }
};

// Apply for offer with message (simplified flow)
export const applyForOffer = async (signer, contractAddress, message) => {
    try {
        const contract = new ethers.Contract(contractAddress, SIMPLEOFFER_CONTRACT.abi, signer);
        
        // Apply for the offer with just a message
        const applyTx = await contract.applyForOffer(message);
        await applyTx.wait();
        
        console.log('Application submitted successfully');
        return applyTx;
    } catch (error) {
        console.error('Error applying for offer:', error);
        handleContractError(error, 'apply for offer');
    }
};

// Get all applications for an offer (owner can see these)
export const getOfferApplications = async (signer, contractAddress) => {
    try {
        const contract = new ethers.Contract(contractAddress, SIMPLEOFFER_CONTRACT.abi, signer);
        
        // Get all applicant addresses
        const applicantAddresses = await contract.getApplicantAddresses();
        
        // Get details for each application
        const applications = await Promise.all(
            applicantAddresses.map(async (address) => {
                const application = await contract.getClientApplication(address);
                return {
                    clientAddress: application.clientAddress,
                    message: application.message,
                    appliedAt: new Date(application.appliedAt.toNumber() * 1000).toISOString(),
                    isApproved: application.isApproved,
                    isRejected: application.isRejected
                };
            })
        );
        
        return applications;
    } catch (error) {
        console.error('Error getting applications:', error);
        return [];
    }
};

// Approve application (owner only)
export const approveApplication = async (signer, contractAddress, clientAddress) => {
    try {
        const contract = new ethers.Contract(contractAddress, SIMPLEOFFER_CONTRACT.abi, signer);
        
        const approveTx = await contract.approveApplication(clientAddress);
        await approveTx.wait();
        
        console.log('Application approved successfully');
        return approveTx;
    } catch (error) {
        console.error('Error approving application:', error);
        handleContractError(error, 'approve application');
    }
};

// Reject application (owner only)
export const rejectApplication = async (signer, contractAddress, clientAddress) => {
    try {
        const contract = new ethers.Contract(contractAddress, SIMPLEOFFER_CONTRACT.abi, signer);
        
        const rejectTx = await contract.rejectApplication(clientAddress);
        await rejectTx.wait();
        
        console.log('Application rejected successfully');
        return rejectTx;
    } catch (error) {
        console.error('Error rejecting application:', error);
        handleContractError(error, 'reject application');
    }
};

// Accept offer and fund (approved client only)
export const acceptAndFundOffer = async (signer, contractAddress) => {
    try {
        const contract = new ethers.Contract(contractAddress, SIMPLEOFFER_CONTRACT.abi, signer);
        
        // Get the offer amount for approval
        const metadata = await contract.getOfferMetadata();
        const amount = metadata.amount;
        
        // Approve PYUSD spending
        await executeApprovalWithRetry(signer, PYUSD_TOKEN_ADDRESS, contractAddress, amount);
        
        // Accept the offer
        const acceptTx = await contract.acceptOffer();
        await acceptTx.wait();
        
        // Fund the contract
        const fundTx = await contract.fundContract();
        await fundTx.wait();
        
        console.log('Offer accepted and funded successfully');
        return { acceptTx, fundTx };
    } catch (error) {
        console.error('Error accepting and funding offer:', error);
        handleContractError(error, 'accept and fund offer');
    }
};

// Approve request and begin work (owner only)
export const approveRequest = async (signer, contractAddress) => {
    try {
        // Update request status to approved
        const offerRequests = JSON.parse(localStorage.getItem('offerRequests') || '{}');
        if (offerRequests[contractAddress]) {
            offerRequests[contractAddress].status = 'approved';
            offerRequests[contractAddress].approvedAt = new Date().toISOString();
            localStorage.setItem('offerRequests', JSON.stringify(offerRequests));
        }
        
        console.log('Request approved - work can begin');
        return true;
    } catch (error) {
        console.error('Error approving request:', error);
        throw error;
    }
};

// Reject request and return funds (owner only)
export const rejectRequest = async (signer, contractAddress) => {
    try {
        // Call emergency withdraw to return funds to client
        const contract = new ethers.Contract(contractAddress, SIMPLEOFFER_CONTRACT.abi, signer);
        
        // Get current request info
        const offerRequests = JSON.parse(localStorage.getItem('offerRequests') || '{}');
        const request = offerRequests[contractAddress];
        
        if (!request) {
            throw new Error('No request found for this contract');
        }
        
        // Check contract balance
        const balance = await contract.getContractBalance();
        if (balance.eq(0)) {
            throw new Error('No funds to return');
        }
        
        // Return funds to client (we'll need to add this function to the contract)
        // For now, we'll use the owner's withdraw capability and manually return
        const tx = await contract.withdrawFunds();
        await tx.wait();
        
        // Update request status
        offerRequests[contractAddress].status = 'rejected';
        offerRequests[contractAddress].rejectedAt = new Date().toISOString();
        localStorage.setItem('offerRequests', JSON.stringify(offerRequests));
        
        console.log('Request rejected and funds prepared for return');
        return tx;
    } catch (error) {
        console.error('Error rejecting request:', error);
        handleContractError(error, 'reject request');
    }
};

// Get client request information for a contract (owner only)
export const getClientRequest = (contractAddress) => {
    const offerRequests = JSON.parse(localStorage.getItem('offerRequests') || '{}');
    return offerRequests[contractAddress] || null;
};
