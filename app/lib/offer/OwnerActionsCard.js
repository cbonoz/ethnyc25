'use client';

import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Typography, 
    Button, 
    Space, 
    Divider,
    message,
    Statistic,
    Row,
    Col
} from 'antd';
import { 
    DollarOutlined,
    ShareAltOutlined,
    SettingOutlined,
    WalletOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import { 
    completeOffer, 
    withdrawFunds, 
    getContractBalance,
    getOfferRequests,
    approveOfferRequest,
    rejectOfferRequest
} from '../../util/appContract';
import { useEthersSigner } from '../../hooks/useEthersSigner';

const { Title, Text, Paragraph } = Typography;

export default function OwnerActionsCard({ offerData, onUpdate }) {
    const signer = useEthersSigner();
    const [loading, setLoading] = useState(false);
    const [contractBalance, setContractBalance] = useState('0');
    const [offerRequests, setOfferRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    if (!offerData) return null;

    // Fetch contract balance and offer requests
    useEffect(() => {
        const fetchData = async () => {
            if (signer && offerData?.contractAddress) {
                try {
                    // Fetch balance
                    const balance = await getContractBalance(signer, offerData.contractAddress);
                    setContractBalance(balance);
                    
                    // Fetch offer requests
                    setLoadingRequests(true);
                    const requests = await getOfferRequests(signer, offerData.contractAddress);
                    setOfferRequests(requests);
                    setLoadingRequests(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoadingRequests(false);
                }
            }
        };

        fetchData();
    }, [signer, offerData?.contractAddress]);

    const handleApproveRequest = async (clientAddress) => {
        if (!signer) {
            message.error('Please connect your wallet');
            return;
        }

        try {
            setLoading(true);
            await approveOfferRequest(signer, offerData.contractAddress, clientAddress);
            message.success('Offer request approved!');
            if (onUpdate) onUpdate();
            
            // Refresh requests
            const requests = await getOfferRequests(signer, offerData.contractAddress);
            setOfferRequests(requests);
        } catch (error) {
            console.error('Error approving request:', error);
            message.error(`Failed to approve request: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async (clientAddress) => {
        if (!signer) {
            message.error('Please connect your wallet');
            return;
        }

        try {
            setLoading(true);
            await rejectOfferRequest(signer, offerData.contractAddress, clientAddress);
            message.success('Offer request rejected');
            if (onUpdate) onUpdate();
            
            // Refresh requests
            const requests = await getOfferRequests(signer, offerData.contractAddress);
            setOfferRequests(requests);
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

    const handleShareOffer = () => {
        const offerUrl = `${window.location.origin}/offer/${offerData.contractAddress}`;
        navigator.clipboard.writeText(offerUrl);
        message.success('Offer link copied to clipboard!');
    };

    // Helper function to get status info
    const getStatusInfo = () => {
        if (!offerData.isAccepted) {
            return { text: 'Waiting for client requests', color: 'orange' };
        } else if (offerData.isAccepted && !offerData.isFunded) {
            return { text: 'Accepted - waiting for payment', color: 'blue' };
        } else if (offerData.isFunded && !offerData.isCompleted) {
            return { text: 'Funded - complete the work', color: 'green' };
        } else if (offerData.isCompleted) {
            return { text: 'Work completed - ready to withdraw', color: 'purple' };
        } else {
            return { text: 'In progress', color: 'green' };
        }
    };

    const statusInfo = getStatusInfo();

    return (
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

                {/* Offer Requests */}
                <div>
                    <Title level={4} style={{ margin: 0, marginBottom: '12px' }}>
                        <UserOutlined style={{ marginRight: '8px' }} />
                        Offer Requests ({offerRequests.length})
                    </Title>
                    
                    {loadingRequests ? (
                        <Text type="secondary">Loading requests...</Text>
                    ) : offerRequests.length === 0 ? (
                        <div style={{ 
                            padding: '16px', 
                            backgroundColor: '#f6f6f6', 
                            borderRadius: '6px', 
                            textAlign: 'center' 
                        }}>
                            <Text type="secondary">No requests yet</Text>
                        </div>
                    ) : (
                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                            {offerRequests.map((request, index) => (
                                <Card 
                                    key={request.clientAddress} 
                                    size="small" 
                                    style={{ backgroundColor: '#fafafa' }}
                                    title={
                                        <Text strong>
                                            Request #{index + 1}
                                        </Text>
                                    }
                                    extra={
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {new Date(request.requestedAt).toLocaleDateString()}
                                        </Text>
                                    }
                                >
                                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                                        <div>
                                            <Text strong>Client: </Text>
                                            <Text code style={{ fontSize: '11px' }}>
                                                {request.clientAddress.slice(0, 8)}...{request.clientAddress.slice(-6)}
                                            </Text>
                                        </div>
                                        
                                        <div>
                                            <Text strong>Message: </Text>
                                            <Paragraph style={{ margin: 0, marginTop: '4px' }}>
                                                {request.message}
                                            </Paragraph>
                                        </div>

                                        {!request.isApproved && !request.isRejected && (
                                            <div style={{ marginTop: '8px' }}>
                                                <Space>
                                                    <Button 
                                                        type="primary"
                                                        size="small"
                                                        icon={<CheckCircleOutlined />}
                                                        onClick={() => handleApproveRequest(request.clientAddress)}
                                                        loading={loading}
                                                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button 
                                                        danger
                                                        size="small"
                                                        icon={<CloseCircleOutlined />}
                                                        onClick={() => handleRejectRequest(request.clientAddress)}
                                                        loading={loading}
                                                    >
                                                        Reject
                                                    </Button>
                                                </Space>
                                            </div>
                                        )}

                                        {request.isApproved && (
                                            <div style={{ 
                                                padding: '6px 12px', 
                                                backgroundColor: '#f6ffed', 
                                                borderRadius: '4px', 
                                                marginTop: '8px' 
                                            }}>
                                                <Text style={{ color: '#52c41a', fontSize: '12px' }}>
                                                    ✅ Approved
                                                </Text>
                                            </div>
                                        )}

                                        {request.isRejected && (
                                            <div style={{ 
                                                padding: '6px 12px', 
                                                backgroundColor: '#fff2f0', 
                                                borderRadius: '4px', 
                                                marginTop: '8px' 
                                            }}>
                                                <Text style={{ color: '#ff4d4f', fontSize: '12px' }}>
                                                    ❌ Rejected
                                                </Text>
                                            </div>
                                        )}
                                    </Space>
                                </Card>
                            ))}
                        </Space>
                    )}
                </div>

                <Divider />

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

                    {/* Complete Work Button */}
                    {offerData.isFunded && !offerData.isCompleted && (
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

                    {offerData.isAccepted && !offerData.isFunded && (
                        <div style={{ padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '6px', textAlign: 'center' }}>
                            <Text style={{ color: '#1890ff' }}>
                                ✅ Offer accepted! Waiting for client payment.
                            </Text>
                        </div>
                    )}

                    {offerData.isFunded && !offerData.isCompleted && (
                        <div style={{ padding: '16px', backgroundColor: '#f6ffed', borderRadius: '6px', textAlign: 'center' }}>
                            <Text style={{ color: '#52c41a' }}>
                                💰 Payment received! Complete the work and mark as finished to withdraw payment.
                            </Text>
                        </div>
                    )}
                </Space>

                <Divider />

                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Simplified workflow: Client requests → You approve → Client pays → Complete work → Withdraw funds
                    </Text>
                </div>
            </Space>
        </Card>
    );
}
