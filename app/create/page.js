
'use client';

import React from 'react';
import { 
    Form, 
    Card, 
    Space, 
    Button, 
    Typography,
    Alert
} from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import Logo from '../lib/Logo';
import NetworkStatus from '../lib/NetworkStatus';
import { APP_NAME } from '../constants';
import { useWalletAddress } from '../hooks/useWalletAddress';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import {
    CreateSteps,
    ServiceDetailsForm,
    PaymentTermsForm,
    DeployStepContent,
    SuccessStepContent,
    useCreateOffer
} from '../lib/create';

const { Title, Paragraph } = Typography;

export default function CreateOffer() {
    const { address: walletAddress } = useWalletAddress();
    const { setShowDynamicUserProfile } = useDynamicContext();
    const {
        form,
        loading,
        currentStep,
        offerData,
        contractAddress,
        handleNext,
        handlePrevious,
        handleCreateOffer,
        handleCreateAnother,
        handleViewDashboard
    } = useCreateOffer();

    const handleConnectWallet = () => {
        setShowDynamicUserProfile(true);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <ServiceDetailsForm />;
            case 1:
                return <PaymentTermsForm />;
            case 2:
                return (
                    <DeployStepContent
                        loading={loading}
                        offerData={offerData}
                        onDeploy={handleCreateOffer}
                    />
                );
            case 3:
                return (
                    <SuccessStepContent
                        contractAddress={contractAddress}
                        onCreateAnother={handleCreateAnother}
                        onViewDashboard={handleViewDashboard}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px 24px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <Logo style={{ marginBottom: 24 }} />
                    <Title level={1}>Create Your Offer</Title>
                    <Paragraph type="secondary" style={{ fontSize: '18px' }}>
                        Set up a decentralized service offer with smart contract automation
                    </Paragraph>
                    
                    {/* Wallet Connection Alert */}
                    {!walletAddress && (
                        <div style={{ marginTop: 24, maxWidth: '500px', margin: '24px auto 0' }}>
                            <Alert
                                message="Wallet Required"
                                description="To create an offer, you'll need to connect your wallet to deploy the smart contract."
                                type="info"
                                showIcon
                                action={
                                    <Button 
                                        size="small" 
                                        type="primary"
                                        icon={<WalletOutlined />}
                                        onClick={handleConnectWallet}
                                    >
                                        Connect Wallet
                                    </Button>
                                }
                                style={{ marginBottom: 16 }}
                            />
                        </div>
                    )}
                    
                    {/* Network Status */}
                    <div style={{ marginTop: 24, maxWidth: '500px', margin: '24px auto 0' }}>
                        <NetworkStatus />
                    </div>
                </div>

                {/* Steps */}
                <CreateSteps currentStep={currentStep} />

                {/* Main Content */}
                <Card style={{ marginBottom: 24 }}>
                    <Form
                        form={form}
                        layout="vertical"
                        size="large"
                    >
                        {renderStepContent()}
                    </Form>
                </Card>

                {/* Navigation */}
                {currentStep < 3 && (
                    <div style={{ textAlign: 'center' }}>
                        <Space>
                            {currentStep > 0 && (
                                <Button onClick={handlePrevious}>
                                    Previous
                                </Button>
                            )}
                            {currentStep < 2 && (
                                <Button type="primary" onClick={handleNext}>
                                    Next
                                </Button>
                            )}
                        </Space>
                    </div>
                )}
            </div>
        </div>
    );
}
