'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEthersSigner } from '../../hooks/useEthersSigner';
import { getMetadata } from '../../util/appContract';

export default function useOwnerOffers() {
    const signer = useEthersSigner();
    const [loading, setLoading] = useState(false);
    const [offers, setOffers] = useState([]);
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

    const fetchOwnerOffers = useCallback(async () => {
        if (!signer || !userAddress) {
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
                        const metadata = await getMetadata(signer, offer.contractAddress);
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
    }, [signer, userAddress]);

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

    useEffect(() => {
        if (userAddress) {
            fetchOwnerOffers();
        }
    }, [fetchOwnerOffers, userAddress]);

    return {
        loading,
        offers,
        userAddress,
        refetch: fetchOwnerOffers,
        addOffer
    };
}
