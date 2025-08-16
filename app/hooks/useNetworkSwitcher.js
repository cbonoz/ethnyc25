'use client';

import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ACTIVE_CHAIN } from '../constants';

export const useNetworkSwitcher = () => {
  const { primaryWallet } = useDynamicContext();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkNetwork = async () => {
    if (!primaryWallet) {
      console.log('No primary wallet connected');
      return false;
    }
    
    try {
      const network = await primaryWallet.connector.getNetwork();
      console.log('Current network from wallet:', network);
      console.log('Required network:', ACTIVE_CHAIN);
      
      // Handle different network response formats
      let currentChainId;
      if (typeof network === 'number') {
        // If network is just a number (chain ID)
        currentChainId = network;
      } else if (network.chain?.id) {
        // If network has a chain object with id
        currentChainId = network.chain.id;
      } else if (network.chainId) {
        // If network has chainId property
        currentChainId = network.chainId;
      } else if (network.id) {
        // If network has id property
        currentChainId = network.id;
      } else {
        console.error('Unable to determine chain ID from network object:', network);
        return false;
      }
      
      console.log('Current chain ID:', currentChainId, 'Required chain ID:', ACTIVE_CHAIN.id);
      
      const isCorrect = currentChainId === ACTIVE_CHAIN.id;
      console.log('Network is correct:', isCorrect);
      
      setIsCorrectNetwork(isCorrect);
      return isCorrect;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  };

  const switchToRequiredNetwork = async () => {
    if (!primaryWallet) {
      throw new Error('No wallet connected');
    }

    setIsChecking(true);
    try {
      console.log('Attempting to switch to network:', ACTIVE_CHAIN.id);
      
      if (primaryWallet.connector.supportsNetworkSwitching()) {
        // Try different approaches for network switching
        try {
          await primaryWallet.switchNetwork(ACTIVE_CHAIN.id);
        } catch (switchError) {
          console.log('First switch attempt failed, trying alternative method:', switchError);
          // Alternative: try using the connector directly
          if (primaryWallet.connector.switchNetwork) {
            await primaryWallet.connector.switchNetwork(ACTIVE_CHAIN.id);
          } else {
            throw switchError;
          }
        }
        
        console.log(`Success! Network switched to ${ACTIVE_CHAIN.name} (${ACTIVE_CHAIN.id})`);
        // Wait a moment for the network to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkNetwork();
        return true;
      } else {
        throw new Error(`Your wallet doesn't support network switching. Please manually switch to ${ACTIVE_CHAIN.name}`);
      }
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    } finally {
      setIsChecking(false);
    }
  };

  const ensureCorrectNetwork = async () => {
    const isCorrect = await checkNetwork();
    if (!isCorrect) {
      console.log('Network is incorrect, attempting to switch...');
      try {
        await switchToRequiredNetwork();
        // Check again after switching
        const isNowCorrect = await checkNetwork();
        if (!isNowCorrect) {
          throw new Error(`Please manually switch your wallet to ${ACTIVE_CHAIN.name} (Chain ID: ${ACTIVE_CHAIN.id}) to continue.`);
        }
      } catch (switchError) {
        console.log('Auto-switch failed:', switchError);
        throw new Error(`Please switch your wallet to ${ACTIVE_CHAIN.name} (Chain ID: ${ACTIVE_CHAIN.id}) to continue. Auto-switch failed: ${switchError.message}`);
      }
    }
    return isCorrectNetwork;
  };

  useEffect(() => {
    if (primaryWallet) {
      checkNetwork();
    }
  }, [primaryWallet]);

  return {
    isCorrectNetwork,
    isChecking,
    switchToRequiredNetwork,
    ensureCorrectNetwork,
    checkNetwork,
    requiredNetwork: ACTIVE_CHAIN
  };
};
