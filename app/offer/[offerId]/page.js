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
        <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px 24px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Logo style={{ marginBottom: 16 }} />
                    <div style={{ marginBottom: 16 }}>
                        {isOwner && (<div>
                               <Tag color={offerData.isActive ? 'green' : 'red'} style={{ fontSize: '14px', padding: '4px 12px' }}>
                            {offerData.isActive ? 'Active' : 'Inactive'}
                        </Tag>
                            <Tag color="gold" style={{ fontSize: '14px', padding: '4px 12px', marginLeft: 8 }}>
                                Owner View
                            </Tag>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                {isOwner ? (
                    <div>
                        <OfferDetailsCard offerData={offerData} onDeactivate={debouncedRefetch} />
                        <OwnerActionsCard 
                            offerData={offerData} 
                            onUpdate={debouncedRefetch}
                        />
                    </div>
                ) : (
                    <Row gutter={[24, 24]}>
                        {/* Left Column - Offer Details */}
                        <Col xs={24} lg={16}>
                            <OfferDetailsCard offerData={offerData} />
                        </Col>
                        {/* Right Column - Client Actions */}
                        <Col xs={24} lg={8}>
                            <ClientActionsCard 
                                offerData={offerData} 
                                onUpdate={debouncedRefetch}
                            />
                        </Col>
                    </Row>
                )}

                {/* Owner's Other Offers Section removed; now available at /my-offers */}

                {/* Back Button */}
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Button onClick={() => router.push('/')}>
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
