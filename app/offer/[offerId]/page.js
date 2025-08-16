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

    // Gradient background should cover the entire viewport, including under the footer
    return (
        <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #ec348b 0%, #722ed1 100%)', padding: 0, overflowX: 'hidden', margin: 0, position: 'relative', zIndex: 0 }}>
            {/* Owner View Tag at Top */}
            {isOwner && (
                <div style={{ width: '100%', background: 'rgba(255, 215, 0, 0.12)', padding: '12px 0', textAlign: 'center', zIndex: 10 }}>
                    <Tag color="gold" style={{ fontSize: 16, padding: '4px 18px' }}>Owner View</Tag>
                </div>
            )}
            {/* Hero Section */}
            <div style={{
                width: '100%',
                color: 'white',
                padding: '96px 0 64px 0',
                marginBottom: 0,
                boxShadow: '0 8px 32px 0 rgba(114,46,209,0.10)',
                background: 'linear-gradient(120deg, rgba(255,255,255,0.04) 0%, rgba(236,52,139,0.08) 100%)',
                transition: 'box-shadow 0.3s, background 0.3s'
            }}>
                <div style={{ width: '100%', margin: 0, padding: '0 32px' }}>
                    <div style={{
                        background: 'rgba(20, 20, 40, 0.85)',
                        borderRadius: 28,
                        boxShadow: '0 8px 40px 0 rgba(0,0,0,0.16)',
                        padding: '56px 48px',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 64,
                        backdropFilter: 'blur(6px)',
                        border: '1.5px solid rgba(255,255,255,0.10)',
                        transition: 'box-shadow 0.3s, background 0.3s, border 0.3s'
                    }}>
                        {/* Offer Details Left (wider, no price) */}
                        <div style={{ flex: 2.5, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ fontSize: 48, fontWeight: 800, margin: 0, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.08, textShadow: '0 2px 12px rgba(114,46,209,0.10)' }}>{offerData.title}</h1>
                                    <div style={{ marginTop: 18, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                        <Tag color="blue" style={{ fontSize: 16, padding: '2px 16px', borderRadius: 8 }}>{offerData.category}</Tag>
                                        {/* <Tag color="purple">{offerData.businessType}</Tag> */}
                                        <Tag color={offerData.isActive ? 'green' : 'red'} style={{ fontSize: 16, padding: '2px 16px', borderRadius: 8 }}>{offerData.isActive ? 'Active' : 'Inactive'}</Tag>
                                        {/* {isOwner && <Tag color="gold" style={{ fontSize: 16, padding: '2px 16px', borderRadius: 8 }}>Owner View</Tag>} */}
                                    </div>
                                    {/* Subtle contract link below tags */}
                                    {offerId && (
                                        <div style={{ marginTop: 10 }}>
                                            <a
                                                href={require('../../constants').getExplorerLink(offerId, 'address', require('../../constants').ACTIVE_CHAIN.id)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: 'rgba(255,255,255,0.7)',
                                                    fontSize: 14,
                                                    textDecoration: 'underline dotted',
                                                    wordBreak: 'break-all',
                                                    transition: 'color 0.2s',
                                                }}
                                                onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                                                onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                                            >
                                                View contract on Explorer
                                            </a>
                                        </div>
                                    )}
                                </div>
                                {/* Price removed from here, now only in action card */}
                            </div>
                            <div style={{ marginTop: 24 }}>
                                <Paragraph style={{ fontSize: '18px', lineHeight: '1.7', color: 'white', margin: 0, opacity: 0.96 }}>{offerData.description}</Paragraph>
                            </div>
                            <div style={{ marginTop: 32 }}>
                                <Row gutter={[32, 20]}>
                                    <Col xs={12} sm={6}>
                                        <div style={{ color: 'white' }}>
                                            <div style={{ fontSize: 15, opacity: 0.7 }}>Amount</div>
                                            <div style={{ fontSize: 22, fontWeight: 700 }}>{offerData.amount} PYUSD</div>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <div style={{ color: 'white' }}>
                                            <div style={{ fontSize: 15, opacity: 0.7 }}>Claims</div>
                                            <div style={{ fontSize: 22, fontWeight: 700 }}>{offerData.claimCount}</div>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <div style={{ color: 'white' }}>
                                            <div style={{ fontSize: 15, opacity: 0.7 }}>Created</div>
                                            <div style={{ fontSize: 22, fontWeight: 700 }}>{offerData.createdAt ? new Date(offerData.createdAt).toLocaleDateString() : ''}</div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        {/* Take Action Card Right */}
                        <div style={{ flex: 1, minWidth: 320, maxWidth: 420, alignSelf: 'flex-start' }}>
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
                    </div>
                </div>
            </div>

            {/* Main Content - Offer Details Full Width (removed, now in summary) */}

            {/* Offer & Requests Actions now integrated above */}

            {/* Created At Timestamp at Bottom */}
        </div>
    );
}
