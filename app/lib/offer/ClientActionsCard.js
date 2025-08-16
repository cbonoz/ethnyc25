'use client';

import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Typography, 
    Button, 
    Space, 
    Divider,
    message,
    Modal,
    Form,
    Input
} from 'antd';
import { 
    CheckCircleOutlined,
    UserOutlined,
    WalletOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { requestOffer, acceptOffer, fundContract, getOfferRequests, requestAndFundOffer } from '../../util/appContractViem';
import { useWalletClient } from '../../hooks/useWalletClient';

const { Title, Text, Paragraph } = Typography;

export default function ClientActionsCard({ offerData, onUpdate }) {
    const walletClient = useWalletClient();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [userApplication, setUserApplication] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [form] = Form.useForm();
    
    // Transaction states
    const [isTransactionPending, setIsTransactionPending] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);
    const [transactionStep, setTransactionStep] = useState(''); // 'approval', 'funding', 'complete'
    const [showSuccess, setShowSuccess] = useState(false);

    if (!offerData) return null;

    // Check if user has already applied
    useEffect(() => {
        let isMounted = true;
        
        const checkUserApplication = async () => {
            if (!walletClient || !offerData?.contractAddress) {
                return;
            }

            try {
                const userAddress = walletClient.account.address;
                const applications = await getOfferRequests(walletClient, offerData.contractAddress);
                
                if (!isMounted) return; // Component unmounted
                
                const userApp = applications.find(app => 
                    app && app.clientAddress && 
                    app.clientAddress.toLowerCase() === userAddress.toLowerCase()
                );
                
                if (userApp) {
                    setUserApplication(userApp);
                    setHasApplied(true);
                    setIsApproved(userApp.isApproved);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error checking application status:', error);
                }
            }
        };

        // Debounce the call to prevent rapid fire requests
        const timeoutId = setTimeout(checkUserApplication, 300);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [walletClient, offerData?.contractAddress]);

    const handleApply = () => {
        if (!walletClient) {
            message.error('Please connect your wallet first');
            return;
        }
        setModalVisible(true);
    };

    const handleSubmitRequest = async (values) => {
        console.log('handleSubmitRequest called with values:', values);
        
        if (!walletClient) {
            message.error('Please connect your wallet first');
            return;
        }

        try {
            setLoading(true);
            setIsTransactionPending(true);
            setModalVisible(false); // Close the modal while transaction is processing
            
            setTransactionStep('approval');
            message.loading('Step 1: Approving PYUSD tokens...', 0);
            
            // Use the new combined method - request and fund in one transaction
            const txHash = await requestAndFundOffer(walletClient, offerData.contractAddress, values.message);
            
            setTransactionStep('complete');
            setTransactionHash(txHash);
            message.destroy(); // Clear the loading message
            
            // Show success state
            setShowSuccess(true);
            setHasApplied(true);
            setIsApproved(true);
            form.resetFields();
            
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error submitting request and payment:', error);
            message.destroy(); // Clear any loading messages
            message.error(`Failed to complete transaction: ${error.message}`);
            setModalVisible(true); // Reopen modal if there was an error
        } finally {
            setLoading(false);
            setIsTransactionPending(false);
        }
    };

    const handleContactOwner = () => {
        const subject = `Inquiry about: ${offerData.title}`;
        const body = `Hi,\n\nI'm interested in your offer: ${offerData.title}\n\nContract: ${offerData.contractAddress}\n\nBest regards`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);
    };

    const getApplicationStatus = () => {
        if (!hasApplied) {
            return { text: 'Not applied yet', color: 'default' };
        } else if (userApplication?.isRejected) {
            return { text: 'Application rejected', color: 'red' };
        } else if (isApproved && !offerData.isAccepted) {
            return { text: 'Approved - Ready to pay', color: 'green' };
        } else if (isApproved && offerData.isAccepted) {
            return { text: 'Paid - Work in progress', color: 'blue' };
        } else {
            return { text: 'Application pending review', color: 'orange' };
        }
    };

    const status = getApplicationStatus();

    return (
        <>
            {/* Transaction Pending State */}
            {isTransactionPending && (
                <Card title="Transaction in Progress" style={{ position: 'sticky', top: '24px', borderColor: '#1890ff' }}>
                    <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="large">
                        <div>
                            <div className="spinner" style={{ 
                                border: '4px solid #f3f3f3',
                                borderTop: '4px solid #1890ff',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 16px auto'
                            }} />
                            <Title level={4} style={{ color: '#1890ff', margin: 0 }}>
                                Processing Transaction
                            </Title>
                            <Text type="secondary">
                                {transactionStep === 'approval' && 'Approving PYUSD tokens...'}
                                {transactionStep === 'funding' && 'Submitting request and payment...'}
                                {transactionStep === 'complete' && 'Transaction complete!'}
                            </Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Please do not close this page. This may take a few minutes.
                        </Text>
                    </Space>
                </Card>
            )}

            {/* Success State */}
            {showSuccess && transactionHash && (
                <Card title="Payment Successful!" style={{ position: 'sticky', top: '24px', borderColor: '#52c41a' }}>
                    <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="large">
                        <div>
                            <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                            <Title level={4} style={{ color: '#52c41a', margin: 0 }}>
                                Request Submitted & Payment Sent!
                            </Title>
                            <Text type="secondary">
                                Your request has been submitted and ${offerData.amount} PYUSD has been sent to the contract.
                            </Text>
                        </div>
                        
                        <div style={{ backgroundColor: '#f6ffed', padding: '12px', borderRadius: '6px' }}>
                            <Text strong>Transaction Hash:</Text>
                            <br />
                            <a 
                                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '12px', wordBreak: 'break-all' }}
                            >
                                {transactionHash} ↗
                            </a>
                        </div>

                        <Button 
                            type="primary" 
                            size="large" 
                            block
                            onClick={() => {
                                setShowSuccess(false);
                                window.location.reload(); // Refresh to show updated state
                            }}
                        >
                            Back to Offer
                        </Button>
                    </Space>
                </Card>
            )}

            {/* Normal State - only show if not in transaction or success state */}
            {!isTransactionPending && !showSuccess && (
            <Card title="Take Action" style={{ position: 'sticky', top: '24px' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3} style={{ color: '#ec348b', margin: 0 }}>
                            ${offerData.amount} PYUSD
                        </Title>
                        <Text type="secondary">Price</Text>
                    </div>

                    {/* Application Status */}
                    <div style={{ textAlign: 'center' }}>
                        <Text strong style={{ color: status.color === 'default' ? '#666' : status.color }}>
                            Status: {status.text}
                        </Text>
                        {hasApplied && userApplication && (
                            <div style={{ marginTop: 8, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Applied: {userApplication.requestedAt || 'Recently'}
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Message: "{userApplication.message}"
                                </Text>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {!hasApplied && (
                        <Button 
                            type="primary" 
                            size="large" 
                            block
                            onClick={handleApply}
                            disabled={!offerData.isActive}
                            icon={<WalletOutlined />}
                        >
                            {offerData.isActive ? `Request & Pay ${offerData.amount} PYUSD` : 'Offer Inactive'}
                        </Button>
                    )}

                    {hasApplied && !isApproved && !userApplication?.isRejected && (
                        <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#fff7e6', borderRadius: 6 }}>
                            <Text style={{ color: '#d48806' }}>
                                ⏳ Your application is being reviewed by the owner
                            </Text>
                        </div>
                    )}

                    {userApplication?.isRejected && (
                        <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#fff2f0', borderRadius: 6 }}>
                            <Text style={{ color: '#cf1322' }}>
                                ❌ Your application was not selected for this offer
                            </Text>
                        </div>
                    )}

                    {offerData.isAccepted && offerData.isFunded && (
                        <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#f6ffed', borderRadius: 6 }}>
                            <Text style={{ color: '#52c41a' }}>
                                ✅ Payment sent! Work is now in progress
                            </Text>
                        </div>
                    )}

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
            )}

            {/* Request Modal - Simplified to just message */}
            <Modal
                title={`Request & Pay for This Offer (${offerData.amount} PYUSD)`}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={500}
            >
                <div style={{ marginBottom: 24 }}>
                    <Paragraph>
                        Submit your application message. Upon confirmation, you'll pay <strong>{offerData.amount} PYUSD</strong> which 
                        will be held in escrow until the work is completed.
                    </Paragraph>
                    <Paragraph type="secondary">
                        <strong>Important:</strong> Make sure you have at least {offerData.amount} PYUSD in your wallet. 
                        Include your contact details in the message below.
                    </Paragraph>
                </div>

                <Form
                    form={form}
                    onFinish={handleSubmitRequest}
                    layout="vertical"
                >
                    <Form.Item
                        name="message"
                        label="Request Message"
                        rules={[
                            { required: true, message: 'Please enter your request message' },
                            { min: 10, message: 'Please provide more details (at least 10 characters)' }
                        ]}
                    >
                        <Input.TextArea 
                            rows={6} 
                            placeholder="Hi! I'm interested in this offer.

My contact details:
- Name: [Your Name]
- Email: [your@email.com] 
- Phone: [Your Phone Number]

[Add any relevant experience, questions, or additional information...]"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            size="large"
                            loading={loading}
                            icon={<WalletOutlined />}
                            onClick={() => console.log('Submit button clicked')}
                        >
                            Submit Request & Pay {offerData.amount} PYUSD
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
