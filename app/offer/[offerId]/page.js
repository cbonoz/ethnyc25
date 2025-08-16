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

export default function OfferPage({ params }) {
    const router = useRouter();
    // Use React.use() to unwrap the params Promise
    const resolvedParams = React.use(params);
    const { offerId } = resolvedParams;
    const { loading, error, offerData, isOwner, refetch } = useOfferData(offerId);
    const { 
        loading: offersLoading, 
        offers: ownerOffers 
    } = useOwnerOffers();

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
                <Row gutter={[24, 24]}>
                    {/* Left Column - Offer Details */}
                    <Col xs={24} lg={16}>
                        <OfferDetailsCard offerData={offerData} />
                        <ContractInfoCard offerData={offerData} />
                    </Col>

                    {/* Right Column - Actions (Different for Owner vs Client) */}
                    <Col xs={24} lg={8}>
                        {isOwner ? (
                            <OwnerActionsCard 
                                offerData={offerData} 
                                onUpdate={refetch}
                            />
                        ) : (
                            <ClientActionsCard 
                                offerData={offerData} 
                                onUpdate={refetch}
                            />
                        )}
                    </Col>
                </Row>

                {/* Owner's Other Offers Section */}
                {isOwner && (
                    <div style={{ marginTop: 48, marginBottom: 24 }}>
                        <OwnerOffersGrid 
                            offers={ownerOffers.filter(offer => offer.contractAddress !== offerId)} 
                            loading={offersLoading}
                            showEmptyState={false}
                        />
                    </div>
                )}

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
