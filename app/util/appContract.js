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
    deadline,
    clientAddress
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
            'Description:', description,
            'Service Type:', serviceType,
            'Deliverables:', deliverables,
            'Amount:', amount,
            'Amount in Wei:', amountInWei.toString(),
            'Deadline:', deadline,
            'PYUSD Address:', PYUSD_TOKEN_ADDRESS,
            'Client Address:', clientAddress
        );

        const contract = await factory.deploy(
            title,
            description,
            serviceType,
            deliverables,
            amountInWei,
            deadline,
            PYUSD_TOKEN_ADDRESS,
            clientAddress
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
