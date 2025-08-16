
'use client';

import React, { useState, useEffect, useMemo } from 'react';

export default function useOwnerOffers(shouldFetch = false, userAddress = null) {
    const [loading, setLoading] = useState(false);
    const [offers, setOffers] = useState([]);
    const stableUserAddress = useMemo(() => userAddress ? userAddress.toLowerCase() : null, [userAddress]);

    useEffect(() => {
        // Only run if explicitly enabled and we have a stable user address
        if (!shouldFetch || !stableUserAddress) {
            setOffers([]);
            setLoading(false);
            return;
        }

        const fetchOffers = () => {
            try {
                setLoading(true);
                // Get offers from localStorage
                const storedOffers = JSON.parse(localStorage.getItem('userOffers') || '[]');
                console.log('📦 All stored offers:', storedOffers);
                console.log('👤 Looking for offers owned by:', stableUserAddress);
                const userOffers = storedOffers.filter(offer => {
                    const isMatch = offer.owner && offer.owner.toLowerCase() === stableUserAddress;
                    console.log('🔍 Checking offer:', {
                        contractAddress: offer.contractAddress,
                        owner: offer.owner,
                        userAddress: stableUserAddress,
                        isMatch: isMatch
                    });
                    return isMatch;
                });
                // Only update state if offers actually changed
                setOffers(prev => JSON.stringify(prev) !== JSON.stringify(userOffers) ? userOffers : prev);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching owner offers:', error);
                setOffers([]);
                setLoading(false);
            }
        };

        fetchOffers();
    }, [shouldFetch, stableUserAddress]);

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
