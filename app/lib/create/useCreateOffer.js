'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, message } from 'antd';
import { deployContract } from '../../util/appContract';
import { useEthersSigner } from '../../hooks/useEthersSigner';
import { useNetworkSwitcher } from '../../hooks/useNetworkSwitcher';

export default function useCreateOffer() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [offerData, setOfferData] = useState({});
    const [contractAddress, setContractAddress] = useState(null);
    const router = useRouter();
    const signer = useEthersSigner();
    const { ensureCorrectNetwork, requiredNetwork } = useNetworkSwitcher();

    const handleNext = async () => {
        try {
            const values = await form.validateFields();
            setOfferData({ ...offerData, ...values });
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleCreateOffer = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const finalOfferData = { ...offerData, ...values };
            
            console.log('Creating offer with data:', finalOfferData);

            if (!signer) {
                throw new Error('Please connect your wallet to deploy the contract');
            }

            // Ensure we're on the correct network before deploying
            try {
                await ensureCorrectNetwork();
            } catch (networkError) {
                throw new Error(`Network Error: ${networkError.message}`);
            }

            // Calculate deadline (convert timeline to timestamp)
            const deadlineDate = new Date();
            deadlineDate.setDate(deadlineDate.getDate() + 30); // Default 30 days from now
            const deadline = Math.floor(deadlineDate.getTime() / 1000);

            // For now, use a placeholder client address (could be updated later or made configurable)
            const placeholderClient = '0x0000000000000000000000000000000000000001';

            // Deploy the smart contract using updated appContract.js
            const contract = await deployContract(
                signer,
                finalOfferData.title,
                finalOfferData.description,
                finalOfferData.category, // serviceType
                finalOfferData.deliverables,
                finalOfferData.amount,
                deadline,
                placeholderClient // Will be updated when client accepts
            );

            if (contract && contract.address) {
                setContractAddress(contract.address);
                message.success('Offer contract deployed successfully!');
                setCurrentStep(currentStep + 1);
                
                // Store the contract address for navigation
                localStorage.setItem('lastDeployedContract', contract.address);
                
                // Store offer in user's offers list
                const userAddress = await signer.getAddress();
                const storedOffers = JSON.parse(localStorage.getItem('userOffers') || '[]');
                const newOffer = {
                    contractAddress: contract.address,
                    owner: userAddress,
                    createdAt: new Date().toLocaleDateString(),
                    title: finalOfferData.title,
                    description: finalOfferData.description,
                    serviceType: finalOfferData.category,
                    amount: finalOfferData.amount
                };
                
                const updatedOffers = [...storedOffers, newOffer];
                localStorage.setItem('userOffers', JSON.stringify(updatedOffers));
            } else {
                throw new Error('Contract deployment failed - no address returned');
            }
            
        } catch (error) {
            console.error('Error creating offer:', error);
            message.error(`Failed to create offer: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnother = () => {
        // Reset form and state
        form.resetFields();
        setOfferData({});
        setCurrentStep(0);
        setContractAddress(null);
        router.push('/create');
    };

    const handleViewDashboard = () => {
        router.push('/dashboard');
    };

    return {
        form,
        loading,
        currentStep,
        offerData,
        contractAddress,
        handleNext,
        handlePrevious,
        handleCreateOffer,
        handleCreateAnother,
        handleViewDashboard,
        setCurrentStep
    };
}
