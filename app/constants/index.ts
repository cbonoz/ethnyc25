// Define sepolia chain object directly to avoid wagmi import issues in client components
const sepolia = {
    id: 11155111,
    name: 'Sepolia',
    network: 'sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'Sepolia Ether',
        symbol: 'SEP',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.sepolia.org'],
        },
        public: {
            http: ['https://rpc.sepolia.org'],
        },
    },
    blockExplorers: {
        default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    testnet: true,
};

export const siteConfig = {
    title: 'SimpleOffer | One-click On-chain Form + Payment',
    name: 'SimpleOffer',
    description: 'One-click, decentralized form + payment system for any business. Collect structured client info, generate offers, and manage payments—all on-chain, with wallet-based authentication and AI-assisted contract logic.',
    cta: {
        primary: 'Create Offer Link',
        secondary: 'Learn More'
    },
    logo: {
        url : '/logo.png',
        width: 180,
        height: 37,
        alt: 'SimpleOffer Logo'
    }
};

// Legacy exports for backward compatibility
export const APP_NAME = siteConfig.name;
export const APP_DESC = siteConfig.description;


// Example: Hedera testnet/mainnet (replace with actual chain objects as needed)
export const CHAIN_OPTIONS = [];
export const CHAIN_MAP = {};
export const ACTIVE_CHAIN = sepolia;

// PYUSD token address (replace with actual addresses)
export const PYUSD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
    ? '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8' // mainnet address
    : '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9'; // testnet address (default)

export const IPFS_BASE_URL = 'https://ipfs.example.com';

export const MAX_FILE_SIZE_BYTES = 5000000; // 5MB
// Dynamic, Nora, ENS, and other integrations (add more as needed)
export const DYNAMIC_AUTH_URL = 'https://dynamic.xyz'; // Example placeholder
export const NORA_AI_URL = 'https://nora.example.com'; // Example placeholder
export const ENS_RESOLVER_URL = 'https://app.ens.domains'; // Example placeholder
