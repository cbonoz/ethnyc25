import { ethers } from 'ethers';
import { SIMPLEOFFER_CONTRACT } from './metadata';
import { formatDate, handleContractError, executeContractTransactionWithRetry, validateTransactionInputs, executeApprovalWithRetry } from '.';
import { PYUSD_TOKEN_ADDRESS } from '../constants';

// Helper function to hash passcode
export function hashPasscode(passcode) {
    if (!passcode || passcode.trim() === '') {
        return ethers.constants.HashZero;
    }
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(passcode));
}

export async function deployContract(
    signer,
    policyName,
    policyDescription,
    businessType,
    location,
    employeeCount,
    maxAmount,
    category,
    passcode = ''
) {
    try {
        // Check if signer is available and connected
        if (!signer) {
            throw new Error('No signer available. Please connect your wallet.');
        }

        // Get the current network from the signer
        const network = await signer.provider.getNetwork();
        console.log('Deploying to network:', network.name, network.chainId);

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

        // Hash the passcode if provided
        const passcodeHash = hashPasscode(passcode);

        // Convert maxAmount to Wei units to match how claims are submitted
        const maxAmountInWei = ethers.utils.parseUnits(maxAmount.toString(), 18);

        console.log(
            'Deploying reimbursement policy contract...',
            policyName,
            policyDescription,
            businessType,
            location,
            employeeCount,
            maxAmount,
            'maxAmountInWei:', maxAmountInWei.toString(),
            category,
            'PYUSD Address:',
            PYUSD_TOKEN_ADDRESS,
            'Has Passcode:',
            passcode ? 'Yes' : 'No'
        );

        const contract = await factory.deploy(
            policyName,
            policyDescription,
            businessType,
            location,
            employeeCount,
            maxAmountInWei, // Use Wei units to match claim submission format
            category,
            PYUSD_TOKEN_ADDRESS, // Add PYUSD token address as the last parameter
            passcodeHash
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
    const result = await contract.getPolicyMetadata();
    console.log('policy metadata result', result);
    console.log('raw maxAmount from contract:', result[2].maxAmount.toString());
    
    const formattedMaxAmount = ethers.utils.formatUnits(result[2].maxAmount, 18);
    console.log('formatted maxAmount:', formattedMaxAmount);
    
    return {
        name: result[0],
        description: result[1],
        policyParams: {
            businessType: result[2].businessType,
            location: result[2].location,
            employeeCount: result[2].employeeCount,
            maxAmount: formattedMaxAmount, // Keep as string to preserve precision
            category: result[2].category,
            isActive: result[2].isActive
        },
        claimCount: result[3].toNumber(),
        createdAt: formatDate(result[4].toNumber() * 1000),
        owner: result[5],
    };
};
