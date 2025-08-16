'use client';

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClient, custom } from "viem";
import { ACTIVE_CHAIN } from "../constants";
import { useMemo } from "react";

export function useWalletClient() {
    const { primaryWallet } = useDynamicContext();
    
    const walletClient = useMemo(() => {
        // Don't log if no wallet to reduce console spam
        if (!primaryWallet) {
            return null;
        }
        
        console.log('useWalletClient: Creating wallet client', { 
            hasWallet: !!primaryWallet,
            hasConnector: !!primaryWallet?.connector,
            connectorKey: primaryWallet?.connector?.key,
            address: primaryWallet?.address,
            chainId: ACTIVE_CHAIN.id,
            chainName: ACTIVE_CHAIN.name
        });

        if (!primaryWallet?.connector) {
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
                account: primaryWallet.address, // Hoist the account
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
        primaryWallet?.address, 
        primaryWallet?.connector?.key,
        // Add chain dependency in case it changes
        ACTIVE_CHAIN.id
    ]);

    return walletClient;
}
