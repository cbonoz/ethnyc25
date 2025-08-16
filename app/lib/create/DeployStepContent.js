'use client';

import React from 'react';
import { 
    Button, 
    Card, 
    Typography, 
    Divider, 
    Spin,
    Alert
} from 'antd';
import { PlusOutlined, WalletOutlined } from '@ant-design/icons';
import { useWalletAddress } from '../../hooks/useWalletAddress';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const { Title, Paragraph, Text } = Typography;

export default function DeployStepContent({ 
    loading, 
    offerData, 
    onDeploy 
}) {
    const { address: walletAddress } = useWalletAddress();
    const { setShowDynamicUserProfile } = useDynamicContext();

    const handleConnectWallet = () => {
        setShowDynamicUserProfile(true);
    };

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
            
            {/* Wallet Connection Check */}
            {!walletAddress ? (
                <div style={{ marginBottom: 24 }}>
                    <Alert
                        message="Wallet Required"
                        description="You need to connect your wallet to deploy the smart contract. Please connect your wallet to continue."
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <Button 
                        type="primary" 
                        size="large"
                        icon={<WalletOutlined />}
                        onClick={handleConnectWallet}
                    >
                        Connect Wallet
                    </Button>
                </div>
            ) : (
                <Button 
                    type="primary" 
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={onDeploy}
                    loading={loading}
                >
                    Deploy Offer Contract
                </Button>
            )}
        </div>
    );
}
