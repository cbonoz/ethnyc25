'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    Card, 
    Typography, 
    Spin, 
    Alert, 
    Button, 
    Space, 
    Divider,
    Tag,
    Row,
    Col,
    Statistic,
    message
} from 'antd';
import { 
    DollarOutlined, 
    CalendarOutlined, 
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useEthersSigner } from '../../hooks/useEthersSigner';
import { getMetadata } from '../../util/appContract';
import Logo from '../../lib/Logo';

const { Title, Paragraph, Text } = Typography;

export default function OfferPage({ params }) {
    const router = useRouter();
    const signer = useEthersSigner();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offerData, setOfferData] = useState(null);
    const { offerId } = params;

    useEffect(() => {
        const fetchOfferData = async () => {
            if (!signer || !offerId) {
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                console.log('Fetching offer data for contract:', offerId);
                const metadata = await getMetadata(signer, offerId);
                
                setOfferData({
                    contractAddress: offerId,
                    title: metadata.name,
                    description: metadata.description,
                    category: metadata.policyParams.category,
                    amount: metadata.policyParams.maxAmount,
                    location: metadata.policyParams.location,
                    businessType: metadata.policyParams.businessType,
                    employeeCount: metadata.policyParams.employeeCount,
                    isActive: metadata.policyParams.isActive,
                    claimCount: metadata.claimCount,
                    createdAt: metadata.createdAt,
                    owner: metadata.owner
                });
                
            } catch (error) {
                console.error('Error fetching offer data:', error);
                setError(error.message || 'Failed to load offer data');
            } finally {
                setLoading(false);
            }
        };

        fetchOfferData();
    }, [signer, offerId]);

    const handleAcceptOffer = () => {
        message.info('Accept offer functionality to be implemented');
        // TODO: Implement accept offer logic
    };

    const handleContactOwner = () => {
        message.info('Contact owner functionality to be implemented');
        // TODO: Implement contact owner logic
    };

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#f5f5f5'
            }}>
                <Card style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                    <Title level={3} style={{ marginTop: 24 }}>
                        Loading Offer Details...
                    </Title>
                    <Paragraph type="secondary">
                        Retrieving contract metadata from the blockchain
                    </Paragraph>
                </Card>
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
                    <Tag color={offerData.isActive ? 'green' : 'red'} style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {offerData.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                </div>

                {/* Main Content */}
                <Row gutter={[24, 24]}>
                    {/* Left Column - Offer Details */}
                    <Col xs={24} lg={16}>
                        <Card style={{ marginBottom: 24 }}>
                            <div style={{ marginBottom: 24 }}>
                                <Title level={2}>{offerData.title}</Title>
                                <Space>
                                    <Tag color="blue">{offerData.category}</Tag>
                                    <Tag color="purple">{offerData.businessType}</Tag>
                                </Space>
                            </div>
                            
                            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                {offerData.description}
                            </Paragraph>

                            <Divider />

                            <Row gutter={[24, 16]}>
                                <Col xs={12} sm={6}>
                                    <Statistic
                                        title="Amount"
                                        value={offerData.amount}
                                        prefix={<DollarOutlined />}
                                        suffix="PYUSD"
                                        precision={2}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Statistic
                                        title="Claims"
                                        value={offerData.claimCount}
                                        prefix={<CheckCircleOutlined />}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Statistic
                                        title="Employees"
                                        value={offerData.employeeCount}
                                        prefix={<UserOutlined />}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>Created</Text>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                            <CalendarOutlined style={{ marginRight: 8 }} />
                                            {offerData.createdAt}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Contract Information */}
                        <Card title="Contract Information" style={{ marginBottom: 24 }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <Text strong>Contract Address:</Text>
                                    <br />
                                    <Text code copyable style={{ fontSize: '12px' }}>
                                        {offerData.contractAddress}
                                    </Text>
                                </div>
                                <div>
                                    <Text strong>Owner:</Text>
                                    <br />
                                    <Text code copyable style={{ fontSize: '12px' }}>
                                        {offerData.owner}
                                    </Text>
                                </div>
                                <div>
                                    <Text strong>Location:</Text>
                                    <br />
                                    <Text>{offerData.location}</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    {/* Right Column - Actions */}
                    <Col xs={24} lg={8}>
                        <Card title="Take Action" style={{ position: 'sticky', top: '24px' }}>
                            <Space direction="vertical" style={{ width: '100%' }} size="large">
                                <div style={{ textAlign: 'center' }}>
                                    <Title level={3} style={{ color: '#ec348b', margin: 0 }}>
                                        ${offerData.amount} PYUSD
                                    </Title>
                                    <Text type="secondary">Total offer amount</Text>
                                </div>

                                <Button 
                                    type="primary" 
                                    size="large" 
                                    block
                                    onClick={handleAcceptOffer}
                                    disabled={!offerData.isActive}
                                    icon={<CheckCircleOutlined />}
                                >
                                    {offerData.isActive ? 'Accept Offer' : 'Offer Inactive'}
                                </Button>

                                <Button 
                                    size="large" 
                                    block
                                    onClick={handleContactOwner}
                                    icon={<UserOutlined />}
                                >
                                    Contact Owner
                                </Button>

                                <Divider />

                                <div style={{ textAlign: 'center' }}>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        This is a decentralized offer powered by smart contracts on the blockchain.
                                    </Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

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
