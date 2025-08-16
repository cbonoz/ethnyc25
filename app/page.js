'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Spin, Row, Col, Space } from 'antd';
import { APP_DESC, APP_NAME, siteConfig } from './constants';
import { CheckCircleTwoTone } from '@ant-design/icons';
import Logo from './lib/Logo';
import { useRouter } from 'next/navigation';
import { colors } from './theme/colors';

const CHECKLIST_ITEMS = [
	'One-click form collection and payments for anyone',
	'Smart contracts built with Hardhat for transparent automation',
	'Decentralized, trustless payments using PYUSD stablecoin',
	'Wallet-based authentication via Dynamic - no accounts needed'
];

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
				{/* Logo Section */}
				{/* <div style={{ textAlign: 'center', marginBottom: '64px' }}>
					<Logo />
				</div> */}

				<Row
					gutter={[64, 48]}
					align="middle"
					justify="center"
					style={{ minHeight: '60vh', maxWidth: '1800px', margin: '0 auto' }}
				>
					{/* Left Side - Content */}
					<Col xs={24} lg={12}>
						<div style={{ textAlign: 'left' }}>
							<Space direction="vertical" size="large" style={{ width: '100%' }}>
								{/* Hero Title */}
								<div>
									<h1
										style={{
											fontSize: '52px',
											fontWeight: 'bold',
											color: '#1f2937',
											lineHeight: '1.1',
											marginBottom: '24px',
											margin: 0
										}}
									>
										Decentralized payment pages
										<span style={{ color: '#ec348b', display: 'block' }}> for any service</span>
									</h1>
									<p
										style={{
											fontSize: '22px',
											color: '#6b7280',
											lineHeight: '1.6',
											marginBottom: '32px',
											maxWidth: '500px'
										}}
									>
										{APP_DESC}
									</p>
								</div>

								{/* Feature List */}
								<div style={{ marginBottom: '32px' }}>
									{CHECKLIST_ITEMS.map((item, i) => (
										<div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
											<CheckCircleTwoTone
												twoToneColor="#ec348b"
												style={{ fontSize: '20px', marginTop: '4px', marginRight: '12px' }}
											/>
											<span
												style={{
													color: '#4b5563',
													fontSize: '16px',
													lineHeight: '1.6'
												}}
											>
												{item}
											</span>
										</div>
									))}
								</div>

								{/* CTA Buttons */}
								<Space size="middle" style={{ marginTop: '32px' }}>
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
						</div>
					</Col>

					{/* Right Side - Visual */}
					<Col xs={24} lg={12}>
						<div style={{ textAlign: 'center', position: 'relative' }}>
							{/* Animated Visual Container */}
							<div
								style={{
									background: 'linear-gradient(135deg, #ec348b 0%, #722ed1 100%)',
									borderRadius: '24px',
									padding: '48px',
									position: 'relative',
									overflow: 'hidden',
									minHeight: '500px',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								{/* Background Pattern */}
								<div
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
										opacity: 0.2
									}}
								/>
								
								{/* Main Visual Content */}
								<div style={{ position: 'relative', zIndex: 1, color: 'white', textAlign: 'center' }}>
									{/* Central Animation */}
									<div style={{ marginBottom: '40px' }}>
										{/* Animated Contract */}
										<div
											style={{
												width: '140px',
												height: '140px',
												background: 'rgba(255, 255, 255, 0.15)',
												borderRadius: '20px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												margin: '0 auto 24px',
												animation: 'pulse 2s ease-in-out infinite',
												border: '2px solid rgba(255, 255, 255, 0.3)'
											}}
										>
											<svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M16 13H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M16 17H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												<path d="M10 9H9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>

										{/* Floating Elements */}
										<div style={{ position: 'relative', height: '80px' }}>
											<div
												style={{
													position: 'absolute',
													top: '10px',
													left: '20%',
													background: 'rgba(255, 255, 255, 0.2)',
													padding: '8px 12px',
													borderRadius: '15px',
													fontSize: '12px',
													animation: 'float 3s ease-in-out infinite',
													animationDelay: '0s'
												}}
											>
												📝 Smart Form
											</div>
											<div
												style={{
													position: 'absolute',
													top: '40px',
													right: '20%',
													background: 'rgba(255, 255, 255, 0.2)',
													padding: '8px 12px',
													borderRadius: '15px',
													fontSize: '12px',
													animation: 'float 3s ease-in-out infinite',
													animationDelay: '1s'
												}}
											>
												💰 PYUSD
											</div>
											<div
												style={{
													position: 'absolute',
													top: '0px',
													right: '10%',
													background: 'rgba(255, 255, 255, 0.2)',
													padding: '8px 12px',
													borderRadius: '15px',
													fontSize: '12px',
													animation: 'float 3s ease-in-out infinite',
													animationDelay: '2s'
												}}
											>
												🔗 Blockchain
											</div>
										</div>
									</div>

									{/* Process Flow */}
									<div style={{ marginBottom: '32px' }}>
										<h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
											Simple 3-Step Process
										</h3>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '300px', margin: '0 auto' }}>
											<div style={{ textAlign: 'center', opacity: 0.9 }}>
												<div
													style={{
														width: '50px',
														height: '50px',
														background: 'rgba(255, 255, 255, 0.2)',
														borderRadius: '50%',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														margin: '0 auto 8px',
														fontSize: '20px'
													}}
												>
													�
												</div>
												<div style={{ fontSize: '11px', fontWeight: '500' }}>Create</div>
											</div>
											<div style={{ color: 'white', fontSize: '16px', animation: 'slideRight 2s ease-in-out infinite' }}>→</div>
											<div style={{ textAlign: 'center', opacity: 0.9 }}>
												<div
													style={{
														width: '50px',
														height: '50px',
														background: 'rgba(255, 255, 255, 0.2)',
														borderRadius: '50%',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														margin: '0 auto 8px',
														fontSize: '20px'
													}}
												>
													🤝
												</div>
												<div style={{ fontSize: '11px', fontWeight: '500' }}>Submit</div>
											</div>
											<div style={{ color: 'white', fontSize: '16px', animation: 'slideRight 2s ease-in-out infinite', animationDelay: '0.5s' }}>→</div>
											<div style={{ textAlign: 'center', opacity: 0.9 }}>
												<div
													style={{
														width: '50px',
														height: '50px',
														background: 'rgba(255, 255, 255, 0.2)',
														borderRadius: '50%',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														margin: '0 auto 8px',
														fontSize: '20px'
													}}
												>
													✅
												</div>
												<div style={{ fontSize: '11px', fontWeight: '500' }}>Pay</div>
											</div>
										</div>
									</div>

									{/* Feature Badges */}
									<div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
										<div
											style={{
												background: 'rgba(255, 255, 255, 0.15)',
												padding: '6px 12px',
												borderRadius: '15px',
												fontSize: '12px',
												fontWeight: '500',
												animation: 'glow 2s ease-in-out infinite alternate'
											}}
										>
											🔐 Secure
										</div>
										<div
											style={{
												background: 'rgba(255, 255, 255, 0.15)',
												padding: '6px 12px',
												borderRadius: '15px',
												fontSize: '12px',
												fontWeight: '500',
												animation: 'glow 2s ease-in-out infinite alternate',
												animationDelay: '0.5s'
											}}
										>
											⚡ Fast
										</div>
										<div
											style={{
												background: 'rgba(255, 255, 255, 0.15)',
												padding: '6px 12px',
												borderRadius: '15px',
												fontSize: '12px',
												fontWeight: '500',
												animation: 'glow 2s ease-in-out infinite alternate',
												animationDelay: '1s'
											}}
										>
											🌐 Decentralized
										</div>
									</div>
								</div>
							</div>
						</div>
					</Col>
				</Row>

				<style jsx>{`
					@keyframes float {
						0%, 100% { transform: translateY(0px); }
						50% { transform: translateY(-15px); }
					}
					@keyframes pulse {
						0%, 100% { transform: scale(1); }
						50% { transform: scale(1.05); }
					}
					@keyframes slideRight {
						0%, 100% { transform: translateX(0px); opacity: 1; }
						50% { transform: translateX(5px); opacity: 0.7; }
					}
					@keyframes glow {
						0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
						100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.4); }
					}
				`}</style>

				{/* Features Section */}
				<div style={{ padding: '80px 0', maxWidth: '1800px', margin: '0 auto' }}>
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
										background: '#fde7f3',
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '0 auto 24px'
									}}
								>
									<CheckCircleTwoTone twoToneColor="#ec348b" style={{ fontSize: '24px' }} />
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

				{/* Use Cases Section */}
				<div style={{ padding: '80px 0', maxWidth: '1800px', margin: '0 auto', backgroundColor: '#f8fafc' }}>
					<div style={{ textAlign: 'center', marginBottom: '64px' }}>
						<h2
							style={{
								fontSize: '36px',
								fontWeight: 'bold',
								color: '#1f2937',
								marginBottom: '16px'
							}}
						>
							Perfect for any service
						</h2>
						<p
							style={{
								fontSize: '20px',
								color: '#6b7280',
								maxWidth: '900px',
								margin: '0 auto'
							}}
						>
							From creative work to home services, SimpleOffer streamlines client onboarding and payments
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
									height: '100%',
									border: '1px solid #e5e7eb'
								}}
							>
								<div
									style={{
										fontSize: '48px',
										marginBottom: '24px'
									}}
								>
									🎨
								</div>
								<h3
									style={{
										fontSize: '20px',
										fontWeight: '600',
										color: '#1f2937',
										marginBottom: '16px'
									}}
								>
									Creative Services
								</h3>
								<p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '20px' }}>
									Graphic designers, web developers, photographers, and content creators can collect project requirements and secure deposits before starting work.
								</p>
								<div style={{ fontSize: '14px', color: '#ec348b', fontWeight: '500' }}>
									"Logo Design - $500 PYUSD" → Client pays upfront → Work begins
								</div>
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
									height: '100%',
									border: '1px solid #e5e7eb'
								}}
							>
								<div
									style={{
										fontSize: '48px',
										marginBottom: '24px'
									}}
								>
									🌿
								</div>
								<h3
									style={{
										fontSize: '20px',
										fontWeight: '600',
										color: '#1f2937',
										marginBottom: '16px'
									}}
								>
									Home & Landscaping
								</h3>
								<p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '20px' }}>
									Landscapers, contractors, and home service providers can collect site details, photos, and secure project deposits through smart contracts.
								</p>
								<div style={{ fontSize: '14px', color: '#ec348b', fontWeight: '500' }}>
									"Garden Redesign - $2000 PYUSD" → Site survey paid → Project starts
								</div>
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
									height: '100%',
									border: '1px solid #e5e7eb'
								}}
							>
								<div
									style={{
										fontSize: '48px',
										marginBottom: '24px'
									}}
								>
									🤝
								</div>
								<h3
									style={{
										fontSize: '20px',
										fontWeight: '600',
										color: '#1f2937',
										marginBottom: '16px'
									}}
								>
									Peer-to-Peer Services
								</h3>
								<p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '20px' }}>
									Tutoring, consulting, coaching, and personal services can collect client info and secure session payments without platform fees.
								</p>
								<div style={{ fontSize: '14px', color: '#ec348b', fontWeight: '500' }}>
									"Math Tutoring Package - $300 PYUSD" → Student pays → Sessions begin
								</div>
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
							background: 'linear-gradient(135deg, #ec348b 0%, #722ed1 100%)',
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
							Ready to Transform Your Service?
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
								color: '#ec348b',
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
