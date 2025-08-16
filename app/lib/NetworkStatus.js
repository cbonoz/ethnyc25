'use client';

import { Alert, Button, Spin } from 'antd';
import { useNetworkSwitcher } from '../hooks/useNetworkSwitcher';

const NetworkStatus = ({ showSwitcher = true, style = {} }) => {
  const { 
    isCorrectNetwork, 
    isChecking, 
    switchToRequiredNetwork, 
    requiredNetwork 
  } = useNetworkSwitcher();

  const handleSwitchNetwork = async () => {
    try {
      await switchToRequiredNetwork();
    } catch (error) {
      console.error('Network switch failed:', error);
      // Show user-friendly error message
      alert(`Unable to switch networks automatically. Please manually switch your wallet to ${requiredNetwork.name} (Chain ID: ${requiredNetwork.id})`);
    }
  };

  if (isCorrectNetwork) {
    return (
      <div style={style}>
        <Alert 
          message={`Connected to ${requiredNetwork.name}`}
          type="success" 
          showIcon 
          size="small"
        />
      </div>
    );
  }

  return (
    <div style={style}>
      <Alert 
        message={`Please switch to ${requiredNetwork.name} (Chain ID: ${requiredNetwork.id})`}
        description={showSwitcher ? "Click the button below to switch networks, or manually switch in your wallet." : "Please manually switch your wallet network."}
        type="warning" 
        showIcon
        action={showSwitcher && (
          <Button 
            size="small" 
            type="primary" 
            onClick={handleSwitchNetwork}
            loading={isChecking}
          >
            {isChecking ? 'Switching...' : 'Switch Network'}
          </Button>
        )}
      />
    </div>
  );
};

export default NetworkStatus;
