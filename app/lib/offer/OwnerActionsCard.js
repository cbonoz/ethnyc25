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
import { completeOffer, withdrawFunds, getContractBalance } from '../../util/appContract';
import { useEthersSigner } from '../../hooks/useEthersSigner';
import { useEffect } from 'react';

const { Title, Text, Paragraph } = Typography;

export default function OwnerActionsCard({ offerData, onUpdate }) {
    const signer = useEthersSigner();
    const [loading, setLoading] = useState(false);
    const [contractBalance, setContractBalance] = useState('0');
    const [form] = Form.useForm();

    if (!offerData) return null;

    // Fetch contract balance
    useEffect(() => {
        const fetchBalance = async () => {
            if (signer && offerData.contractAddress) {
                try {
                    const balance = await getContractBalance(signer, offerData.contractAddress);
                    setContractBalance(balance);
                } catch (error) {
                    console.error('Error fetching contract balance:', error);
                }
            }
        };
        
        fetchBalance();
    }, [signer, offerData.contractAddress, offerData.isFunded]);

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
            return { text: 'Waiting for client acceptance', color: 'orange' };
        } else if (!offerData.isFunded) {
            return { text: 'Accepted - Waiting for payment', color: 'blue' };
        } else if (!offerData.isCompleted) {
            return { text: 'Funded - Ready to complete', color: 'green' };
        } else {
            return { text: 'Completed - Ready to withdraw', color: 'purple' };
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
                    {/* Contract Balance */}
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3} style={{ color: '#ec348b', margin: 0 }}>
                            Contract Balance
                        </Title>
                        <Paragraph type="secondary">
                            Available funds in the contract
                        </Paragraph>
                        {/* TODO: Fetch and display actual contract balance */}
                        <Text strong style={{ fontSize: '18px' }}>
                            Loading... PYUSD
                        </Text>
                    </div>

                    <Divider />

                    {/* Quick Stats */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic
                                title="Views"
                                value={0} // TODO: Implement view tracking
                                suffix="total"
                                valueStyle={{ fontSize: '16px' }}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title="Responses"
                                value={offerData.claimCount}
                                suffix="claims"
                                valueStyle={{ fontSize: '16px' }}
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

                        <Button 
                            size="large" 
                            block
                            icon={<WalletOutlined />}
                            onClick={() => setFundModalVisible(true)}
                        >
                            Fund Contract
                        </Button>

                        <Button 
                            size="large" 
                            block
                            icon={<DollarOutlined />}
                            onClick={() => setWithdrawModalVisible(true)}
                        >
                            Withdraw Funds
                        </Button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>Contract Status:</Text>
                            <Switch
                                checked={offerData.isActive}
                                onChange={handleToggleStatus}
                                checkedChildren={<PlayCircleOutlined />}
                                unCheckedChildren={<PauseCircleOutlined />}
                                loading={loading}
                            />
                        </div>
                    </Space>

                    <Divider />

                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            You are the owner of this contract. You can manage settings, fund the contract, and withdraw funds.
                        </Text>
                    </div>
                </Space>
            </Card>

            {/* Fund Contract Modal */}
            <Modal
                title="Fund Contract"
                open={fundModalVisible}
                onCancel={() => setFundModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleFundContract}
                    layout="vertical"
                >
                    <Form.Item
                        name="amount"
                        label="Amount (PYUSD)"
                        rules={[
                            { required: true, message: 'Please enter an amount' },
                            { type: 'number', min: 0.01, message: 'Amount must be greater than 0.01' }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Enter amount to fund"
                            precision={2}
                            min={0.01}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setFundModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Fund Contract
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Withdraw Funds Modal */}
            <Modal
                title="Withdraw Funds"
                open={withdrawModalVisible}
                onCancel={() => setWithdrawModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleWithdrawFunds}
                    layout="vertical"
                >
                    <Form.Item
                        name="amount"
                        label="Amount (PYUSD)"
                        rules={[
                            { required: true, message: 'Please enter an amount' },
                            { type: 'number', min: 0.01, message: 'Amount must be greater than 0.01' }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Enter amount to withdraw"
                            precision={2}
                            min={0.01}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setWithdrawModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Withdraw Funds
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
