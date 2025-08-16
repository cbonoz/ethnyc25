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
            {/* Owner View Tag at Top */}
            {isOwner && (
                <div style={{ width: '100%', background: 'rgba(255, 215, 0, 0.12)', padding: '12px 0', textAlign: 'center', zIndex: 10 }}>
                    <Tag color="gold" style={{ fontSize: 16, padding: '4px 18px' }}>Owner View</Tag>
                </div>
            )}
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
                    <div style={{
                        background: 'rgba(20, 20, 40, 0.72)',
                        borderRadius: 18,
                        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                        padding: '40px 32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 32,
                        backdropFilter: 'blur(2px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                            <div style={{ flex: 1 }}>
                                <h1 style={{ fontSize: 38, fontWeight: 700, margin: 0, color: 'white', letterSpacing: '-1px' }}>{offerData.title}</h1>
                                <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    <Tag color="blue">{offerData.category}</Tag>
                                    {/* <Tag color="purple">{offerData.businessType}</Tag> */}
                                    <Tag color={offerData.isActive ? 'green' : 'red'}>{offerData.isActive ? 'Active' : 'Inactive'}</Tag>
                                    {isOwner && <Tag color="gold">Owner View</Tag>}
                                </div>
                            </div>
                            <div style={{ minWidth: 180, textAlign: 'right' }}>
                                <div style={{ fontSize: 22, fontWeight: 600, color: 'white' }}>{offerData.amount} PYUSD</div>
                            </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: 'white', margin: 0 }}>{offerData.description}</Paragraph>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <Row gutter={[24, 16]}>
                                <Col xs={12} sm={6}>
                                    <div style={{ color: 'white' }}>
                                        <div style={{ fontSize: 13, opacity: 0.7 }}>Amount</div>
                                        <div style={{ fontSize: 20, fontWeight: 600 }}>{offerData.amount} PYUSD</div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div style={{ color: 'white' }}>
                                        <div style={{ fontSize: 13, opacity: 0.7 }}>Claims</div>
                                        <div style={{ fontSize: 20, fontWeight: 600 }}>{offerData.claimCount}</div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div style={{ color: 'white' }}>
                                        <div style={{ fontSize: 13, opacity: 0.7 }}>Created</div>
                                        <div style={{ fontSize: 20, fontWeight: 600 }}>{offerData.createdAt ? new Date(offerData.createdAt).toLocaleDateString() : ''}</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Offer Details Full Width (removed, now in summary) */}

            {/* Offer & Requests Actions Full Width Below */}
            <div style={{ maxWidth: 1200, margin: '32px auto 0 auto', padding: '0 24px 48px 24px', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)' }}>
                {isOwner ? (
                    <div>
                        <div style={{ height: 24 }}>
                            {/* <Title level={3} style={{ margin: 0 }}>Owner Dashboard</Title> */}
                        </div>
                        <OwnerActionsCard 
                            offerData={offerData} 
                            onUpdate={debouncedRefetch}
                        />
                    </div>
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
