'use client';

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClient, custom } from "viem";
import { ACTIVE_CHAIN } from "../constants";
import { useMemo } from "react";

export function useWalletClient() {
    const { primaryWallet } = useDynamicContext();
    
    const walletClient = useMemo(() => {
        console.log('useWalletClient memoization check:', { 
            primaryWallet: !!primaryWallet,
            hasConnector: !!primaryWallet?.connector,
            connectorKey: primaryWallet?.connector?.key,
            address: primaryWallet?.address
        });

        if (!primaryWallet?.connector) {
            console.log('No wallet connector available');
            return null;
        }

        // For Dynamic Labs v4+, try to get the provider directly
        const provider = primaryWallet.connector.provider || primaryWallet.connector.getProvider?.();
        
        if (!provider) {
            console.log('No provider available from connector');
            return null;
        }

        try {
            const client = createWalletClient({
                chain: ACTIVE_CHAIN,
                transport: custom(provider),
                account: primaryWallet.address, // Add the account from primaryWallet
            });
            
            console.log('Created wallet client:', { 
                hasAccount: !!client.account,
                address: client.account?.address || primaryWallet.address,
                chain: client.chain?.name
            });
            
            return client;
        } catch (error) {
            console.error('Error creating wallet client:', error);
            return null;
        }
    }, [primaryWallet?.address, primaryWallet?.connector?.key]);

    return walletClient;
}
