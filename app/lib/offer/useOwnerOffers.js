'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWalletClient } from '../../hooks/useWalletClient';
import { useWalletAddress } from '../../hooks/useWalletAddress';
import { getMetadata } from '../../util/appContractViem';

export default function useOwnerOffers() {
    const walletClient = useWalletClient();
    const { address: userAddress, hasChanged: addressChanged, resetHasChanged } = useWalletAddress();
    const [loading, setLoading] = useState(false);
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        if (userAddress) {
            fetchOwnerOffers();
        } else {
            // Clear offers when no user address
            setOffers([]);
        }
    }, [userAddress]); // Remove fetchOwnerOffers from dependencies to prevent infinite loop

    // Watch for address changes and refetch
    useEffect(() => {
        if (addressChanged && userAddress) {
            console.log('🔄 User address changed - refetching owner offers');
            fetchOwnerOffers();
            resetHasChanged();
        } else if (addressChanged && !userAddress) {
            setOffers([]);
            resetHasChanged();
        }
    }, [addressChanged]); // Only depend on addressChanged

    const fetchOwnerOffers = useCallback(async () => {
        if (!walletClient || !userAddress) {
            return;
        }

        try {
            setLoading(true);
            
            // Get stored contract addresses from localStorage for now
            // In a real app, you'd query events or use a backend service
            const storedOffers = JSON.parse(localStorage.getItem('userOffers') || '[]');
            const ownerOffers = storedOffers.filter(offer => 
                offer.owner && offer.owner.toLowerCase() === userAddress.toLowerCase()
            );

            const offerDetails = await Promise.all(
                ownerOffers.map(async (offer) => {
                    try {
                        const metadata = await getMetadata(walletClient, offer.contractAddress);
                        return {
                            contractAddress: offer.contractAddress,
                            ...metadata,
                            // Add quick status summary
                            status: getOfferStatus(metadata)
                        };
                    } catch (error) {
                        console.error(`Error fetching offer ${offer.contractAddress}:`, error);
                        return null;
                    }
                })
            );

            // Filter out failed fetches
            const validOffers = offerDetails.filter(offer => offer !== null);
            setOffers(validOffers);
            
        } catch (error) {
            console.error('Error fetching owner offers:', error);
        } finally {
            setLoading(false);
        }
    }, [walletClient, userAddress]);

    const getOfferStatus = (metadata) => {
        if (!metadata.isActive) return 'inactive';
        if (metadata.isCompleted) return 'completed';
        if (metadata.isFunded) return 'funded';
        if (metadata.isAccepted) return 'accepted';
        return 'pending';
    };

    const addOffer = useCallback((contractAddress, offerData) => {
        // Store new offer in localStorage
        const storedOffers = JSON.parse(localStorage.getItem('userOffers') || '[]');
        const newOffer = {
            contractAddress,
            owner: userAddress,
            createdAt: new Date().toISOString(),
            ...offerData
        };
        
        const updatedOffers = [...storedOffers, newOffer];
        localStorage.setItem('userOffers', JSON.stringify(updatedOffers));
        
        // Refresh the offers list
        fetchOwnerOffers();
    }, [userAddress, fetchOwnerOffers]);

    return {
        loading,
        offers,
        userAddress,
        refetch: fetchOwnerOffers,
        addOffer
    };
}
