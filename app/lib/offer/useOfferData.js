'use client';

import React, { useState, useEffect } from 'react';
import { useEthersSigner } from '../../hooks/useEthersSigner';
import { getMetadata } from '../../util/appContract';

export default function useOfferData(offerId) {
    const signer = useEthersSigner();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offerData, setOfferData] = useState(null);
    const [userAddress, setUserAddress] = useState(null);

    useEffect(() => {
        const getUserAddress = async () => {
            if (signer) {
                try {
                    const address = await signer.getAddress();
                    setUserAddress(address);
                } catch (error) {
                    console.error('Error getting user address:', error);
                }
            }
        };

        getUserAddress();
    }, [signer]);

    const fetchOfferData = async () => {
        if (!signer || !offerId) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching offer data for contract:', offerId);
            const metadata = await getMetadata(signer, offerId);
            
            const data = {
                contractAddress: offerId,
                title: metadata.title,
                description: metadata.description,
                category: metadata.category || metadata.serviceType,
                serviceType: metadata.serviceType,
                deliverables: metadata.deliverables,
                amount: metadata.amount,
                deadline: metadata.deadline,
                isActive: metadata.isActive,
                createdAt: metadata.createdAt,
                owner: metadata.owner,
                client: metadata.client,
                isAccepted: metadata.isAccepted,
                isFunded: metadata.isFunded,
                isCompleted: metadata.isCompleted
            };
            
            setOfferData(data);
            
        } catch (error) {
            console.error('Error fetching offer data:', error);
            setError(error.message || 'Failed to load offer data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfferData();
    }, [signer, offerId]);

    const isOwner = userAddress && offerData && 
        userAddress.toLowerCase() === offerData.owner.toLowerCase();

    return {
        loading,
        error,
        offerData,
        userAddress,
        isOwner,
        refetch: fetchOfferData
    };
}
