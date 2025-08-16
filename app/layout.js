import UiLayoutWrapper from './lib/UiLayoutWrapper';
import ErrorBoundary from './lib/ErrorBoundary';

import './globals.css';
import { siteConfig } from './constants';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

export default function RootLayout({ children }) {
    return (
        <html>
            {/* <Script async src="https://saturn.tech/widget.js" /> */}
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <title>
                    {siteConfig.title}
                </title>
                <meta
                    name="description"
                    content={siteConfig.description}
                />
            </head>
            <body>
                <ErrorBoundary>
                    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || "17f8076d-1654-4b59-8745-c38137f5a7d1",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
                        <UiLayoutWrapper>{children}</UiLayoutWrapper>
    </DynamicContextProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
