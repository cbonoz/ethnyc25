'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Spin, 
    Alert, 
    Button, 
    Tag,
    Row,
    Col,
    Typography
} from 'antd';
import Logo from '../../lib/Logo';
import {
    OfferDetailsCard,
    ContractInfoCard,
    ClientActionsCard,
    OwnerActionsCard,
    OwnerOffersGrid,
    useOfferData,
    useOwnerOffers
} from '../../lib/offer';

const { Title, Paragraph } = Typography;

import { useRef, useCallback } from 'react';

export default function OfferPage({ params }) {
    const router = useRouter();
    // Use React.use() to unwrap the params Promise
    const resolvedParams = React.use(params);
    const { offerId } = resolvedParams;
    const { loading, error, offerData, userAddress, isOwner, refetch } = useOfferData(offerId);

    // Debounce refetch to prevent infinite loops
    const debounceRef = useRef(null);
    const debouncedRefetch = useCallback(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            refetch();
        }, 500);
    }, [refetch]);

    // Only fetch owner offers if the user is actually the owner AND we have loaded the main data
    const { 
        loading: offersLoading, 
        offers: ownerOffers 
    } = useOwnerOffers(!loading && isOwner === true, userAddress);

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#f5f5f5'
            }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                    <Title level={3} style={{ marginTop: 24 }}>
                        Loading Offer Details...
                    </Title>
                    <Paragraph type="secondary">
                        Retrieving contract metadata from the blockchain
                    </Paragraph>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                padding: '40px 24px',
                background: '#f5f5f5'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <Logo />
                    </div>
                    <Alert
                        message="Error Loading Offer"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => router.push('/')}>
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!offerData) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                padding: '40px 24px',
                background: '#f5f5f5'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Alert
                        message="Offer Not Found"
                        description="The offer you're looking for doesn't exist or couldn't be loaded."
                        type="warning"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => router.push('/')}>
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 0 }}>
            {/* Hero Section */}
            <div style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ec348b 0%, #722ed1 100%)',
                color: 'white',
                padding: '72px 0 48px 0',
                marginBottom: 40,
                boxShadow: '0 4px 24px 0 rgba(114,46,209,0.08)'
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: 38, fontWeight: 700, margin: 0, color: 'white', letterSpacing: '-1px' }}>{offerData.title}</h1>
                            <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <Tag color="blue">{offerData.category}</Tag>
                                <Tag color="purple">{offerData.businessType}</Tag>
                                <Tag color={offerData.isActive ? 'green' : 'red'}>{offerData.isActive ? 'Active' : 'Inactive'}</Tag>
                                {isOwner && <Tag color="gold">Owner View</Tag>}
                            </div>
                        </div>
                        <div style={{ minWidth: 180, textAlign: 'right' }}>
                            <div style={{ fontSize: 22, fontWeight: 600, color: 'white' }}>{offerData.amount} PYUSD</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Offer Details Full Width */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 0 24px', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)' }}>
                <OfferDetailsCard offerData={offerData} onDeactivate={isOwner ? debouncedRefetch : undefined} />
            </div>

            {/* Offer & Requests Actions Full Width Below */}
            <div style={{ maxWidth: 1200, margin: '32px auto 0 auto', padding: '0 24px 48px 24px', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)' }}>
                {isOwner ? (
                    <OwnerActionsCard 
                        offerData={offerData} 
                        onUpdate={debouncedRefetch}
                    />
                ) : (
                    <ClientActionsCard 
                        offerData={offerData} 
                        onUpdate={debouncedRefetch}
                    />
                )}
            </div>

            {/* Created At Timestamp at Bottom */}
        </div>
    );
}
