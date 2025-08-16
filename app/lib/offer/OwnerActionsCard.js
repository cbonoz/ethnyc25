'use client';

import React, { useState } from 'react';
import { 
    Card, 
    Typography, 
    Button, 
    Space, 
    Divider,
    message,
    Switch,
    Statistic,
    Row,
    Col,
    Modal,
    InputNumber,
    Form
} from 'antd';
import { 
    EditOutlined,
    DollarOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    ShareAltOutlined,
    SettingOutlined,
    WalletOutlined
} from '@ant-design/icons';
import { completeOffer, withdrawFunds, getContractBalance, getOfferApplications, approveApplication, rejectApplication } from '../../util/appContract';
import { useEthersSigner } from '../../hooks/useEthersSigner';
import { useEffect } from 'react';

const { Title, Text, Paragraph } = Typography;

export default function OwnerActionsCard({ offerData, onUpdate }) {
    const signer = useEthersSigner();
    const [loading, setLoading] = useState(false);
    const [contractBalance, setContractBalance] = useState('0');
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [form] = Form.useForm();

    if (!offerData) return null;

    // Fetch contract balance and applications
    useEffect(() => {
        const fetchData = async () => {
            if (signer && offerData.contractAddress) {
                try {
                    const balance = await getContractBalance(signer, offerData.contractAddress);
                    setContractBalance(balance);
                    
                    setLoadingApps(true);
                    const apps = await getOfferApplications(signer, offerData.contractAddress);
                    setApplications(apps);
                    setLoadingApps(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoadingApps(false);
                }
            }
        };
        
        fetchData();
    }, [signer, offerData.contractAddress, offerData.isFunded, offerData.isAccepted]);

    const handleApproveRequest = async () => {
        if (!signer) {
            message.error('Please connect your wallet');
            return;
        }

        try {
            setLoading(true);
            await approveRequest(signer, offerData.contractAddress);
            message.success('Request approved! You can now begin the work.');
            if (onUpdate) onUpdate();
            // Refresh client request data
            const request = getClientRequest(offerData.contractAddress);
            setClientRequest(request);
        } catch (error) {
            console.error('Error approving request:', error);
            message.error(`Failed to approve request: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async () => {
        if (!signer) {
            message.error('Please connect your wallet');
            return;
        }

        try {
            setLoading(true);
            await rejectRequest(signer, offerData.contractAddress);
            message.success('Request rejected and payment returned to client.');
            if (onUpdate) onUpdate();
            // Refresh balance and client request data
            const balance = await getContractBalance(signer, offerData.contractAddress);
            setContractBalance(balance);
            const request = getClientRequest(offerData.contractAddress);
            setClientRequest(request);
        } catch (error) {
            console.error('Error rejecting request:', error);
            message.error(`Failed to reject request: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteOffer = async () => {
        if (!signer) {
            message.error('Please connect your wallet');
            return;
        }

        try {
            setLoading(true);
            await completeOffer(signer, offerData.contractAddress);
            message.success('Offer marked as completed!');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error completing offer:', error);
            message.error(`Failed to complete offer: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdrawFunds = async () => {
        if (!signer) {
            message.error('Please connect your wallet');
            return;
        }

        if (!offerData.isCompleted) {
            message.warning('You can only withdraw funds after completing the offer');
            return;
        }

        try {
            setLoading(true);
            await withdrawFunds(signer, offerData.contractAddress);
            message.success('Funds withdrawn successfully!');
            if (onUpdate) onUpdate();
            // Update balance
            const newBalance = await getContractBalance(signer, offerData.contractAddress);
            setContractBalance(newBalance);
        } catch (error) {
            console.error('Error withdrawing funds:', error);
            message.error(`Failed to withdraw funds: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        message.info('Toggle status functionality to be implemented');
        // TODO: Implement toggle contract status
    };

    const handleShareOffer = () => {
        const offerUrl = `${window.location.origin}/offer/${offerData.contractAddress}`;
        navigator.clipboard.writeText(offerUrl);
        message.success('Offer link copied to clipboard!');
    };

    // Helper function to get status info
    const getStatusInfo = () => {
        if (!offerData.isAccepted) {
            return { text: 'Waiting for client requests', color: 'orange' };
        } else if (clientRequest?.status === 'pending_approval') {
            return { text: 'Client request pending your approval', color: 'blue' };
        } else if (clientRequest?.status === 'rejected') {
            return { text: 'Request rejected - funds returned', color: 'red' };
        } else if (clientRequest?.status === 'approved' && !offerData.isCompleted) {
            return { text: 'Request approved - complete the work', color: 'green' };
        } else if (offerData.isCompleted) {
            return { text: 'Work completed - ready to withdraw', color: 'purple' };
        } else {
            return { text: 'In progress', color: 'green' };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <>
            <Card 
                title={
                    <Space>
                        <SettingOutlined />
                        Owner Dashboard
                    </Space>
                } 
                style={{ position: 'sticky', top: '24px' }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {/* Contract Status */}
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3} style={{ color: '#ec348b', margin: 0 }}>
                            Offer Status
                        </Title>
                        <Paragraph type="secondary">
                            Current state of your offer
                        </Paragraph>
                        <Text strong style={{ fontSize: '16px', color: statusInfo.color }}>
                            {statusInfo.text}
                        </Text>
                    </div>

                    {/* Contract Balance */}
                    <div style={{ textAlign: 'center' }}>
                        <Title level={4} style={{ margin: 0 }}>
                            Contract Balance
                        </Title>
                        <Text strong style={{ fontSize: '18px' }}>
                            {contractBalance} PYUSD
                        </Text>
                    </div>

                    <Divider />

                    {/* Client Information */}
                    {clientRequest && (
                        <>
                            <div style={{ textAlign: 'center' }}>
                                <Title level={4} style={{ margin: 0 }}>
                                    Client Information
                                </Title>
                                <div style={{ 
                                    padding: '12px', 
                                    backgroundColor: '#f6f6f6', 
                                    borderRadius: '6px', 
                                    marginTop: '8px',
                                    textAlign: 'left'
                                }}>
                                    <Text strong>Name:</Text> {clientRequest.contactInfo?.name || 'Not provided'}<br />
                                    <Text strong>Email:</Text> {clientRequest.contactInfo?.email || 'Not provided'}<br />
                                    {clientRequest.contactInfo?.phone && (
                                        <>
                                            <Text strong>Phone:</Text> {clientRequest.contactInfo.phone}<br />
                                        </>
                                    )}
                                    <Text strong>Wallet:</Text> {clientRequest.clientAddress}<br />
                                    <Text strong>Accepted:</Text> {new Date(clientRequest.acceptedAt).toLocaleDateString()}<br />
                                    {clientRequest.contactInfo?.message && (
                                        <>
                                            <Text strong>Message:</Text><br />
                                            <Text type="secondary">{clientRequest.contactInfo.message}</Text>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Divider />
                        </>
                    )}

                    {/* Quick Stats */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic
                                title="Accepted"
                                value={offerData.isAccepted ? 'Yes' : 'No'}
                                valueStyle={{ fontSize: '14px', color: offerData.isAccepted ? 'green' : 'orange' }}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="Funded"
                                value={offerData.isFunded ? 'Yes' : 'No'}
                                valueStyle={{ fontSize: '14px', color: offerData.isFunded ? 'green' : 'orange' }}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="Completed"
                                value={offerData.isCompleted ? 'Yes' : 'No'}
                                valueStyle={{ fontSize: '14px', color: offerData.isCompleted ? 'green' : 'orange' }}
                            />
                        </Col>
                    </Row>

                    <Divider />

                    {/* Action Buttons */}
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Button 
                            type="primary" 
                            size="large" 
                            block
                            icon={<ShareAltOutlined />}
                            onClick={handleShareOffer}
                        >
                            Share Offer Link
                        </Button>

                        {/* Approve/Reject Buttons for Pending Requests */}
                        {clientRequest?.status === 'pending_approval' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button 
                                    type="primary"
                                    size="large" 
                                    style={{ 
                                        flex: 1, 
                                        backgroundColor: '#52c41a', 
                                        borderColor: '#52c41a' 
                                    }}
                                    onClick={handleApproveRequest}
                                    loading={loading}
                                    icon={<CheckCircleOutlined />}
                                >
                                    Approve Request
                                </Button>
                                <Button 
                                    danger
                                    size="large" 
                                    style={{ flex: 1 }}
                                    onClick={handleRejectRequest}
                                    loading={loading}
                                    icon={<PauseCircleOutlined />}
                                >
                                    Reject & Refund
                                </Button>
                            </div>
                        )}

                        {/* Complete Work Button */}
                        {clientRequest?.status === 'approved' && !offerData.isCompleted && (
                            <Button 
                                type="primary"
                                size="large" 
                                block
                                icon={<DollarOutlined />}
                                onClick={handleCompleteOffer}
                                loading={loading}
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            >
                                Mark as Completed
                            </Button>
                        )}

                        {offerData.isCompleted && parseFloat(contractBalance) > 0 && (
                            <Button 
                                size="large" 
                                block
                                icon={<WalletOutlined />}
                                onClick={handleWithdrawFunds}
                                loading={loading}
                                style={{ backgroundColor: '#722ed1', borderColor: '#722ed1', color: 'white' }}
                            >
                                Withdraw Funds ({contractBalance} PYUSD)
                            </Button>
                        )}

                        {!offerData.isAccepted && (
                            <div style={{ padding: '16px', backgroundColor: '#f6f6f6', borderRadius: '6px', textAlign: 'center' }}>
                                <Text type="secondary">
                                    Waiting for client requests. Share the link to get started!
                                </Text>
                            </div>
                        )}

                        {clientRequest?.status === 'pending_approval' && (
                            <div style={{ padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '6px', textAlign: 'center' }}>
                                <Text style={{ color: '#1890ff' }}>
                                    📧 New request from {clientRequest.contactInfo?.name || 'a client'}! 
                                    Review their information above and approve or reject.
                                </Text>
                            </div>
                        )}

                        {clientRequest?.status === 'approved' && !offerData.isCompleted && (
                            <div style={{ padding: '16px', backgroundColor: '#f6ffed', borderRadius: '6px', textAlign: 'center' }}>
                                <Text style={{ color: '#52c41a' }}>
                                    ✅ Request approved! Complete the work and mark as finished to withdraw payment.
                                </Text>
                            </div>
                        )}

                        {clientRequest?.status === 'rejected' && (
                            <div style={{ padding: '16px', backgroundColor: '#fff2f0', borderRadius: '6px', textAlign: 'center' }}>
                                <Text style={{ color: '#ff4d4f' }}>
                                    ❌ Request was rejected and payment returned to client.
                                </Text>
                            </div>
                        )}
                    </Space>

                    <Divider />

                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Simplified workflow: Client pays upfront → You approve/reject → Complete work → Withdraw funds
                        </Text>
                    </div>
                </Space>
            </Card>
        </>
    );
}
