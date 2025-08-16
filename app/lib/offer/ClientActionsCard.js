'use client';

import React from 'react';
import { 
    Card, 
    Typography, 
    Button, 
    Space, 
    Divider,
    message
} from 'antd';
import { 
    CheckCircleOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ClientActionsCard({ offerData }) {
    if (!offerData) return null;

    const handleAcceptOffer = () => {
        message.info('Accept offer functionality to be implemented');
        // TODO: Implement accept offer logic
    };

    const handleContactOwner = () => {
        message.info('Contact owner functionality to be implemented');
        // TODO: Implement contact owner logic
    };

    return (
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
    );
}
