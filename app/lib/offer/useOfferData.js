'use client';

import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getMetadata } from '../../util/appContractViem';

// Simple cache to prevent re-fetching
const dataCache = new Map();

export default function useOfferData(offerId) {
    const { primaryWallet } = useDynamicContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offerData, setOfferData] = useState(null);

    useEffect(() => {
        if (!offerId) {
            setLoading(false);
            return;
        }

        // Check cache first
        if (dataCache.has(offerId)) {
            const cachedData = dataCache.get(offerId);
            setOfferData(cachedData);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                console.log('Fetching offer data for contract:', offerId);
                const metadata = await getMetadata(null, offerId);
                
                if (!metadata) {
                    throw new Error('No metadata returned from contract');
                }

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

                // Cache the result
                dataCache.set(offerId, data);
                setOfferData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching offer data:', error);
                setError(error.message || 'Failed to load offer data');
                setLoading(false);
            }
        };

        fetchData();
    }, [offerId]);

    // Simple wallet address - no complex memoization
    const userAddress = primaryWallet?.address || null;
    
    // Simple ownership check
    const isOwner = userAddress && offerData && 
        userAddress.toLowerCase() === offerData.owner?.toLowerCase();

    return {
        loading,
        error,
        offerData,
        userAddress,
        isOwner,
        refetch: () => {
            dataCache.delete(offerId);
            setLoading(true);
            setError(null);
        }
    };
}