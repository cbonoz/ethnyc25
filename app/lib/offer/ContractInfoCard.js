'use client';

import React from 'react';
import { 
    Card, 
    Typography, 
    Space,
    Button
} from 'antd';
import { ExternalLinkOutlined } from '@ant-design/icons';
import { getExplorerLink } from '../../constants';

const { Text, Link } = Typography;

export default function ContractInfoCard({ offerData }) {
    if (!offerData) return null;

    return (
        <Card title="Contract Information" style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                    <Text strong>Contract Address:</Text>
                    <br />
                    <Link 
                        href={getExplorerLink(offerData.contractAddress, 'address')}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '12px' }}
                    >
                        <Text code copyable style={{ fontSize: '12px' }}>
                            {offerData.contractAddress}
                        </Text>
                        <ExternalLinkOutlined style={{ marginLeft: 4 }} />
                    </Link>
                </div>
                <div>
                    <Text strong>Owner:</Text>
                    <br />
                    <Link 
                        href={getExplorerLink(offerData.owner, 'address')}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '12px' }}
                    >
                        <Text code copyable style={{ fontSize: '12px' }}>
                            {offerData.owner}
                        </Text>
                        <ExternalLinkOutlined style={{ marginLeft: 4 }} />
                    </Link>
                </div>
                <div>
                    <Text strong>Location:</Text>
                    <br />
                    <Text>{offerData.location}</Text>
                </div>
                <div>
                    <Text strong>Status:</Text>
                    <br />
                    <Text type={offerData.isActive ? 'success' : 'danger'}>
                        {offerData.isActive ? 'Active' : 'Inactive'}
                    </Text>
                </div>
            </Space>
        </Card>
    );
}
