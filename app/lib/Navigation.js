'use client';

import React from 'react';
import { Button, Space, Typography } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { 
    HomeOutlined, 
    PlusOutlined, 
    InfoCircleOutlined 
} from '@ant-design/icons';
import Logo from './Logo';

const { Text } = Typography;

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        {
            key: 'home',
            label: 'Home',
            icon: <HomeOutlined />,
            path: '/'
        },
        {
            key: 'create',
            label: 'Create Offer',
            icon: <PlusOutlined />,
            path: '/create'
        },
        {
            key: 'about',
            label: 'About',
            icon: <InfoCircleOutlined />,
            path: '/about'
        }
    ];

    // Don't show navigation on the home page or offer pages to keep them clean
    if (pathname === '/' || pathname?.startsWith('/offer/')) {
        return null;
    }

    return (
        <div style={{ 
            background: '#fff', 
            padding: '16px 24px', 
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <div 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => router.push('/')}
                >
                    '<Logo size="small" />
                </div>
                
                <Space size="middle">
                    {navItems.map(item => (
                        <Button
                            key={item.key}
                            type={pathname === item.path ? 'primary' : 'text'}
                            icon={item.icon}
                            onClick={() => router.push(item.path)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Space>
            </div>
        </div>
    );
}
