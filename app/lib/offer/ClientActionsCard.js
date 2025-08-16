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
import { requestOffer, acceptOffer, fundContract } from '../../util/appContract';
import { useEthersSigner } from '../../hooks/useEthersSigner';

const { Title, Text, Paragraph } = Typography;

export default function ClientActionsCard({ offerData, onUpdate }) {
    const signer = useEthersSigner();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [userApplication, setUserApplication] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [form] = Form.useForm();

    if (!offerData) return null;

    // Check if user has already applied
    useEffect(() => {
        const checkUserApplication = async () => {
            if (signer && offerData.contractAddress) {
                try {
                    const userAddress = await signer.getAddress();
                    const applications = await getOfferApplications(signer, offerData.contractAddress);
                    const userApp = applications.find(app => app.clientAddress.toLowerCase() === userAddress.toLowerCase());
                    
                    if (userApp) {
                        setUserApplication(userApp);
                        setHasApplied(true);
                        setIsApproved(userApp.isApproved);
                    }
                } catch (error) {
                    console.error('Error checking application status:', error);
                }
            }
        };

        checkUserApplication();
    }, [signer, offerData.contractAddress]);

    const handleApply = () => {
        if (!signer) {
            message.error('Please connect your wallet first');
            return;
        }
        setModalVisible(true);
    };

    const handleSubmitRequest = async (values) => {
        if (!signer) {
            message.error('Please connect your wallet first');
            return;
        }

        try {
            setLoading(true);
            await requestOffer(signer, offerData.contractAddress, values.message);
            message.success('Offer request submitted! The owner will review your request.');
            setModalVisible(false);
            setHasApplied(true);
            form.resetFields();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error submitting request:', error);
            message.error(`Failed to submit request: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptAndPay = async () => {
        if (!signer) {
            message.error('Please connect your wallet');
            return;
        }

        try {
            setLoading(true);
            await acceptAndFundOffer(signer, offerData.contractAddress);
            message.success('Offer accepted and payment sent! Work can now begin.');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error accepting and funding offer:', error);
            message.error(`Failed to complete transaction: ${error.message}`);
        } finally {
            setLoading(false);
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
                                    Applied: {new Date(userApplication.appliedAt).toLocaleDateString()}
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
                            icon={<MessageOutlined />}
                        >
                            {offerData.isActive ? 'Request This Offer' : 'Offer Inactive'}
                        </Button>
                    )}

                    {isApproved && !offerData.isAccepted && (
                        <Button 
                            type="primary" 
                            size="large" 
                            block
                            onClick={handleAcceptAndPay}
                            loading={loading}
                            icon={<WalletOutlined />}
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        >
                            Accept & Pay {offerData.amount} PYUSD
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

            {/* Request Modal - Simplified to just message */}
            <Modal
                title="Request This Offer"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={500}
            >
                <div style={{ marginBottom: 24 }}>
                    <Paragraph>
                        Submit your application with a message including your contact information. 
                        The owner will review your application and approve or reject it.
                    </Paragraph>
                    <Paragraph type="secondary">
                        <strong>Important:</strong> Please include your contact details (name, email, etc.) 
                        in your message so the owner can reach you if necessary.
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
                            icon={<MessageOutlined />}
                        >
                            Submit Application
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
