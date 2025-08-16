'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWalletClient } from '../../hooks/useWalletClient';
import { useWalletAddress } from '../../hooks/useWalletAddress';
import { getMetadata } from '../../util/appContractViem';

export default function useOfferData(offerId) {
    const walletClient = useWalletClient();
    const { address: userAddress, hasChanged: addressChanged, resetHasChanged } = useWalletAddress();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offerData, setOfferData] = useState(null);
    const hasLoadedRef = useRef(false);

    const fetchOfferData = async () => {
        console.log('fetchOfferData called with:', { walletClient: !!walletClient, offerId });
        
        if (!walletClient || !offerId) {
            console.log('Missing walletClient or offerId, setting loading to false');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching offer data for contract:', offerId);
            console.log('About to call getMetadata...');
            const metadata = await getMetadata(walletClient, offerId);
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
    };

    useEffect(() => {
        if (!hasLoadedRef.current && walletClient && offerId) {
            fetchOfferData();
        }
    }, [walletClient, offerId]); // Only depend on these stable values

    // Watch for user address changes and refetch data
    useEffect(() => {
        if (addressChanged && userAddress && hasLoadedRef.current) {
            console.log('🔄 User address changed - refetching offer data for:', offerId);
            hasLoadedRef.current = false;
            fetchOfferData();
            resetHasChanged(); // Reset the change flag
        }
    }, [addressChanged]); // Only depend on addressChanged

    // Manual refetch function
    const refetch = async () => {
        hasLoadedRef.current = false;
        await fetchOfferData();
    };

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
