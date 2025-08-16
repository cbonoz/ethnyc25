'use client';

import React from 'react';
import { 
    Card, 
    Typography, 
    Space, 
    Divider,
    Tag,
    Row,
    Col,
    Statistic
} from 'antd';
import { 
    DollarOutlined, 
    CalendarOutlined, 
    UserOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function OfferDetailsCard({ offerData }) {
    if (!offerData) return null;

    return (
        <Card style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>{offerData.title}</Title>
                <Space>
                    <Tag color="blue">{offerData.category}</Tag>
                    <Tag color="purple">{offerData.businessType}</Tag>
                    <Tag color={offerData.isActive ? "green" : "red"}>
                        {offerData.isActive ? "Active" : "Inactive"}
                    </Tag>
                </Space>
            </div>
            
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {offerData.description}
            </Paragraph>

            {!offerData.isActive && (
                <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#fff2f0', 
                    borderRadius: '6px', 
                    marginBottom: '16px',
                    border: '1px solid #ffccc7'
                }}>
                    <Text strong style={{ color: '#ff4d4f' }}>
                        ⚠️ This offer is no longer accepting new requests
                    </Text>
                </div>
            )}

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
    );
}
