'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, message } from 'antd';
import { deployContract } from '../../util/appContract';
import { useEthersSigner } from '../../hooks/useEthersSigner';

export default function useCreateOffer() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [offerData, setOfferData] = useState({});
    const [contractAddress, setContractAddress] = useState(null);
    const router = useRouter();
    const signer = useEthersSigner();

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

            // Deploy the smart contract using appContract.js
            const contract = await deployContract(
                signer,
                finalOfferData.title, // policyName
                finalOfferData.description, // policyDescription
                finalOfferData.category, // businessType (using category as business type)
                'Online', // location (default for online services)
                1, // employeeCount (default for individual offers)
                finalOfferData.amount, // maxAmount
                finalOfferData.category, // category
                '' // passcode (empty for public offers)
            );

            if (contract && contract.address) {
                setContractAddress(contract.address);
                message.success('Offer contract deployed successfully!');
                setCurrentStep(currentStep + 1);
                
                // Store the contract address for navigation
                localStorage.setItem('lastDeployedContract', contract.address);
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
