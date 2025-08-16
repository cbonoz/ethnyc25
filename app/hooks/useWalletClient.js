'use client';

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClient, custom } from "viem";
import { ACTIVE_CHAIN } from "../constants";
import { useMemo } from "react";

export function useWalletClient() {
    const { primaryWallet } = useDynamicContext();
    
    // Extract stable values outside useMemo to prevent dependency issues
    const walletAddress = primaryWallet?.address;
    const connectorKey = primaryWallet?.connector?.key;
    const hasWallet = !!primaryWallet;
    const hasConnector = !!primaryWallet?.connector;
    
    const walletClient = useMemo(() => {
        // Don't log if no wallet to reduce console spam
        if (!hasWallet) {
            return null;
        }
        
        console.log('useWalletClient: Creating wallet client', { 
            hasWallet,
            hasConnector,
            connectorKey,
            address: walletAddress,
            chainId: ACTIVE_CHAIN.id,
            chainName: ACTIVE_CHAIN.name
        });

        if (!hasConnector) {
            console.log('useWalletClient: No wallet connector available');
            return null;
        }

        // For Dynamic Labs, get the provider from connector
        const provider = primaryWallet.connector.provider || primaryWallet.connector.getProvider?.();
        
        if (!provider) {
            console.log('useWalletClient: No provider available from connector');
            return null;
        }

        try {
            // Create wallet client following viem best practices
            const client = createWalletClient({
                account: walletAddress, // Hoist the account
                chain: ACTIVE_CHAIN,
                transport: custom(provider),
            });
            
            console.log('useWalletClient: Successfully created wallet client', { 
                hasAccount: !!client.account,
                accountAddress: client.account,
                chainId: client.chain?.id,
                chainName: client.chain?.name
            });
            
            return client;
        } catch (error) {
            console.error('useWalletClient: Error creating wallet client:', error);
            return null;
        }
    }, [
        // Use the stable extracted values
        walletAddress, 
        connectorKey,
        hasWallet,
        hasConnector
    ]);

    return walletClient;
}
