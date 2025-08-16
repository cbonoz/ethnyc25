'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWalletClient } from '../../hooks/useWalletClient';
import { useWalletAddress } from '../../hooks/useWalletAddress';
import { getMetadata } from '../../util/appContractViem';

export default function useOfferData(offerId) {
    const walletClient = useWalletClient();
    const { address: userAddress } = useWalletAddress(); // Remove hasChanged tracking for basic metadata
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offerData, setOfferData] = useState(null);
    const hasLoadedRef = useRef(false);

    const fetchOfferData = useCallback(async () => {
        console.log('fetchOfferData called with:', { walletClient: !!walletClient, offerId });
        
        if (!offerId) {
            console.log('Missing offerId, setting loading to false');
            setLoading(false);
            return;
        }

        // For public contract data, we don't need a wallet client
        // We can read contract metadata without wallet connection
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching offer data for contract:', offerId);
            console.log('About to call getMetadata...');
            const metadata = await getMetadata(null, offerId); // Pass null for walletClient
            console.log('getMetadata returned:', metadata);
            
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
            
            setOfferData(data);
            hasLoadedRef.current = true;
            
        } catch (error) {
            console.error('Error fetching offer data:', error);
            setError(error.message || 'Failed to load offer data');
        } finally {
            setLoading(false);
        }
    }, [offerId]); // Only depend on offerId

    useEffect(() => {
        // Only fetch once when component mounts and offerId is available
        if (!hasLoadedRef.current && offerId) {
            console.log('Initial fetch for offerId:', offerId);
            fetchOfferData();
        }
    }, [fetchOfferData]); // Now we can safely depend on fetchOfferData since it's memoized

    // Manual refetch function - for when user performs actions that change the offer state
    const refetch = useCallback(async () => {
        console.log('Manual refetch requested for offerId:', offerId);
        hasLoadedRef.current = false;
        await fetchOfferData();
    }, [fetchOfferData]);

    const isOwner = userAddress && offerData && 
        userAddress.toLowerCase() === offerData.owner.toLowerCase();

    return {
        loading,
        error,
        offerData,
        userAddress,
        isOwner,
        refetch
    };
}
