'use client';

import React from 'react';
import { 
    Button, 
    Card, 
    Typography, 
    Divider, 
    Spin 
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function DeployStepContent({ 
    loading, 
    offerData, 
    onDeploy 
}) {
    if (loading) {
        return (
            <div style={{ textAlign: 'center' }}>
                <Spin size="large" />
                <Title level={3} style={{ marginTop: 24 }}>
                    Deploying Smart Contract...
                </Title>
                <Paragraph type="secondary">
                    Creating your decentralized offer on-chain. This may take a moment.
                </Paragraph>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <Title level={3}>Review & Deploy</Title>
            <Paragraph type="secondary">
                Review your offer details and deploy the smart contract.
            </Paragraph>
            
            <Card style={{ textAlign: 'left', marginBottom: 24 }}>
                <Title level={4}>{offerData.title}</Title>
                <Text type="secondary">{offerData.category}</Text>
                <Divider />
                <Paragraph>{offerData.description}</Paragraph>
                <Text strong>Amount: ${offerData.amount} PYUSD</Text>
                <br />
                <Text strong>Payment Type: {offerData.paymentType}</Text>
            </Card>
            
            <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                onClick={onDeploy}
                loading={loading}
            >
                Deploy Offer Contract
            </Button>
        </div>
    );
}
