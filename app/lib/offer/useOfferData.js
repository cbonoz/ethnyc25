'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEthersSigner } from '../../hooks/useEthersSigner';
import { getMetadata } from '../../util/appContract';

export default function useOfferData(offerId) {
    const signer = useEthersSigner();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offerData, setOfferData] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const hasLoadedRef = useRef(false);

    const fetchOfferData = async () => {
        if (!signer || !offerId) {
            setLoading(false);
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
            hasLoadedRef.current = true;
            
            // Get user address
            try {
                const address = await signer.getAddress();
                setUserAddress(address);
            } catch (err) {
                console.error('Error getting user address:', err);
            }
            
        } catch (error) {
            console.error('Error fetching offer data:', error);
            setError(error.message || 'Failed to load offer data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasLoadedRef.current) {
            fetchOfferData();
        }
    }, [signer, offerId]);

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
