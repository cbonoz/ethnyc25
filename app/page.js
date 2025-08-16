'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Spin, Row, Col, Space } from 'antd';
import { APP_DESC, APP_NAME, siteConfig } from './constants';
import { CheckCircleTwoTone } from '@ant-design/icons';
import Logo from './lib/Logo';
import { useRouter } from 'next/navigation';

const CHECKLIST_ITEMS = [
	'One-click form collection and payments for any business',
	'Smart contracts built with Hardhat for transparent automation',
	'Decentralized, trustless payments using PYUSD stablecoin',
	'Wallet-based authentication via Dynamic - no accounts needed'
];

const HERO_IMAGE =
	'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif';

const Home = () => {
	const router = useRouter();

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)'
			}}
		>
			{/* Hero Section */}
			<div style={{ padding: '80px 48px' }}>
				<Row
					gutter={[64, 48]}
					align="middle"
					style={{ minHeight: '70vh', maxWidth: '1400px', margin: '0 auto' }}
				>
					<Col xs={24} lg={12}>
						<Space direction="vertical" size="large" style={{ width: '100%' }}>
							{/* Logo/Brand */}
							<div style={{ marginBottom: '32px' }}>
								<Logo />
							</div>

							{/* Hero Title */}
							<div>
								<h1
									style={{
										fontSize: '48px',
										fontWeight: 'bold',
										color: '#1f2937',
										lineHeight: '1.2',
										marginBottom: '24px',
										margin: 0
									}}
								>
									Decentralized Form + Payment
									<span style={{ color: '#1890ff' }}> for Any Business</span>
								</h1>
								<p
									style={{
										fontSize: '20px',
										color: '#6b7280',
										lineHeight: '1.6',
										marginBottom: '32px'
									}}
								>
									{APP_DESC}
								</p>
							</div>

							{/* Feature List */}
							<Space direction="vertical" size="middle">
								{CHECKLIST_ITEMS.map((item, i) => (
									<div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
										<CheckCircleTwoTone
											twoToneColor="#1890ff"
											style={{ fontSize: '20px', marginTop: '4px', marginRight: '12px' }}
										/>
										<span
											style={{
												color: '#4b5563',
												fontSize: '18px',
												lineHeight: '1.6'
											}}
										>
											{item}
										</span>
									</div>
								))}
							</Space>
							<br />

							{/* CTA Buttons */}
							<Space size="middle" style={{ marginTop: '64px' }}>
								<Button
									size="large"
									type="primary"
									onClick={() => router.push('/create')}
									style={{
										height: '48px',
										padding: '0 32px',
										fontSize: '18px',
										fontWeight: '600',
										borderRadius: '8px'
									}}
								>
									{siteConfig.cta.primary}
								</Button>
								<Button
									size="large"
									onClick={() => router.push('/about')}
									style={{
										height: '48px',
										padding: '0 32px',
										fontSize: '18px',
										fontWeight: '600',
										borderRadius: '8px'
									}}
								>
									Learn More
								</Button>
							</Space>
						</Space>
					</Col>

					<Col xs={24} lg={12}>
						<div style={{ textAlign: 'center' }}>
							<div style={{ position: 'relative', display: 'inline-block' }}>
								<Image
									width={400}
									height={500}
									style={{
										borderRadius: '24px',
										boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
									}}
									src={HERO_IMAGE}
									alt={APP_NAME}
								/>
							</div>
						</div>
					</Col>
				</Row>

				{/* Features Section */}
				<div style={{ padding: '80px 0', maxWidth: '1400px', margin: '0 auto' }}>
					<div style={{ textAlign: 'center', marginBottom: '64px' }}>
						<h2
							style={{
								fontSize: '36px',
								fontWeight: 'bold',
								color: '#1f2937',
								marginBottom: '16px'
							}}
						>
							Why Choose {APP_NAME}?
						</h2>
						<p
							style={{
								fontSize: '20px',
								color: '#6b7280',
								maxWidth: '900px',
								margin: '0 auto'
							}}
						>
							Streamline client onboarding and payments with blockchain technology and AI-assisted smart contracts
						</p>
					</div>

					<Row gutter={[48, 32]}>
						<Col xs={24} md={8}>
							<div
								style={{
									textAlign: 'center',
									padding: '32px',
									background: 'white',
									borderRadius: '16px',
									boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
									height: '100%'
								}}
							>
								<div
									style={{
										width: '64px',
										height: '64px',
										background: '#e6f7ff',
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '0 auto 24px'
									}}
								>
									<CheckCircleTwoTone twoToneColor="#1890ff" style={{ fontSize: '24px' }} />
								</div>
								<h3
									style={{
										fontSize: '20px',
										fontWeight: '600',
										color: '#1f2937',
										marginBottom: '16px'
									}}
								>
									Smart Contract Automation
								</h3>
								<p style={{ color: '#6b7280', lineHeight: '1.6' }}>
									Hardhat-powered smart contracts automate form submissions, offers, and payments with transparent on-chain logic
								</p>
							</div>
						</Col>

						<Col xs={24} md={8}>
							<div
								style={{
									textAlign: 'center',
									padding: '32px',
									background: 'white',
									borderRadius: '16px',
									boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
									height: '100%'
								}}
							>
								<div
									style={{
										width: '64px',
										height: '64px',
										background: '#f6ffed',
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '0 auto 24px'
									}}
								>
									<CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '24px' }} />
								</div>
								<h3
									style={{
										fontSize: '20px',
										fontWeight: '600',
										color: '#1f2937',
										marginBottom: '16px'
									}}
								>
									PYUSD Stablecoin Payments
								</h3>
								<p style={{ color: '#6b7280', lineHeight: '1.6' }}>
									Accept stable payments for deposits, milestones, or offers without volatility or banking fees
								</p>
							</div>
						</Col>

						<Col xs={24} md={8}>
							<div
								style={{
									textAlign: 'center',
									padding: '32px',
									background: 'white',
									borderRadius: '16px',
									boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
									height: '100%'
								}}
							>
								<div
									style={{
										width: '64px',
										height: '64px',
										background: '#f9f0ff',
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '0 auto 24px'
									}}
								>
									<CheckCircleTwoTone twoToneColor="#722ed1" style={{ fontSize: '24px' }} />
								</div>
								<h3
									style={{
										fontSize: '20px',
										fontWeight: '600',
										color: '#1f2937',
										marginBottom: '16px'
									}}
								>
									Wallet-Based Authentication
								</h3>
								<p style={{ color: '#6b7280', lineHeight: '1.6' }}>
									Dynamic authentication via wallet connection - no accounts, passwords, or vendor agreements required
								</p>
							</div>
						</Col>
					</Row>
				</div>

				{/* CTA Section */}
				<div
					style={{ textAlign: 'center', padding: '80px 0', maxWidth: '1400px', margin: '0 auto' }}
				>
					<div
						style={{
							background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
							borderRadius: '24px',
							padding: '48px',
							color: 'white'
						}}
					>
						<h2
							style={{
								fontSize: '32px',
								fontWeight: 'bold',
								marginBottom: '16px',
								color: 'white'
							}}
						>
							Ready to Transform Your Business?
						</h2>
						<p
							style={{
								fontSize: '20px',
								marginBottom: '32px',
								opacity: 0.9,
								color: 'white'
							}}
						>
							Create your first offer link in minutes
						</p>
						<Button
							size="large"
							style={{
								height: '48px',
								padding: '0 32px',
								fontSize: '18px',
								fontWeight: '600',
								background: 'white',
								color: '#1890ff',
								border: 'none',
								borderRadius: '8px'
							}}
							onClick={() => router.push('/create')}
						>
							Get Started Now
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
