'use client';

import React, { useState, useEffect } from 'react';

export default function useOwnerOffers(shouldFetch = false, userAddress = null) {
    const [loading, setLoading] = useState(false);
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        // Only run if explicitly enabled and we have a user address
        if (!shouldFetch || !userAddress) {
            setOffers([]);
            setLoading(false);
            return;
        }

        const fetchOffers = () => {
            try {
                setLoading(true);
                
                // Get offers from localStorage
                const storedOffers = JSON.parse(localStorage.getItem('userOffers') || '[]');
                const userOffers = storedOffers.filter(offer => 
                    offer.owner && offer.owner.toLowerCase() === userAddress.toLowerCase()
                );

                setOffers(userOffers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching owner offers:', error);
                setOffers([]);
                setLoading(false);
            }
        };

        fetchOffers();
    }, [shouldFetch, userAddress]); // Simple dependencies

    return {
        loading,
        offers,
        refreshOffers: () => {
            if (shouldFetch && userAddress) {
                setLoading(true);
                const storedOffers = JSON.parse(localStorage.getItem('userOffers') || '[]');
                const userOffers = storedOffers.filter(offer => 
                    offer.owner && offer.owner.toLowerCase() === userAddress.toLowerCase()
                );
                setOffers(userOffers);
                setLoading(false);
            }
        }
    };
}
