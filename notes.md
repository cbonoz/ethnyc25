# EthNYC 25

SimpleOffer
---

One click form collection and payments backed by smart contracts for any business.

## Problem

Service providers, freelancers, and small businesses often struggle to:  

- Collect structured client information (quotes, offers, requests) quickly and reliably  
- Manage payments securely without relying on centralized escrow or third-party platforms  
- Verify approvals, deposits, or milestone completion in a trustless, transparent way  
- Handle authentication and identity verification without complex account setups  

This friction leads to slower response times, missed opportunities, and disputes between clients and service providers.  

---

## Where current solutions fall short
Existing solutions partially address these problems, but often have limitations or drawbacks:

| Existing Solution | Shortcomings |
|-----------------|--------------|
| **Google Forms + PayPal/Stripe** | Form submission and payment are separate; no trustless link between submission and payment; no automated verification |
| **Typeform + Stripe** | No on-chain verification; payments are off-chain; limited automation for approvals or milestone tracking |
| **Freelance marketplaces (Fiverr, Upwork)** | High fees; platform controls the workflow; limited transparency; providers can’t fully customize contract/payment logic |
| **Smart contract marketplaces (OpenLaw, Clause.io)** | Require technical knowledge; onboarding and wallet setup is a barrier; no simple one-click form collection for clients |

---

## Solution

**SimpleOffer** provides a **one-click, decentralized form + payment system** that uses:  

- **Dynamic** → wallet-based authentication for both clients and service providers.
- **Hardhat** → smart contracts to record form submissions, offers, and payments on-chain  .
- **PYUSD** → Businesses offer don't want volatile payment. stablecoin payments for deposits, milestone completion, or offers enable businesses to accept the payments at a fixed price without the banking fees.
<!-- - **Nora** → AI-assisted contract generation for offers or estimates, and automated verification logic  
- **ENS** → readable profiles for service providers and clients   -->

**How it works (high-level flow):**  


1. Connect wallet via Dynamic → authenticate client/pro.
2. Client submits a service request form → AI-assisted validation.
3. Smart contract is deployed via Hardhat/Hedera → PYUSD payment deposited.
4. Service provider reviews request → AI-assisted offer generation.
5. Client approves → contract releases payment automatically.
6. Optional ENS, NFT receipt, and document verification enhance usability and trust.

**Key differentiators:**  

- Fully **decentralized** and **trustless** payments  
- **AI-assisted smart contracts** that require no Solidity knowledge  
- **One-click form collection** reduces friction for clients  
- Optional **readable ENS profiles** for trust and reputation  

---

## Potential Future Work
- **Recurring subscriptions or retainers:** Automate recurring service payments using PYUSD smart contracts  
- **Cross-chain support:** Use LayerZero or Hyperlane to allow payments or contracts across multiple chains  
- **Document attachment verification:** Integrate decentralized storage (Walrus or IPFS) for attachments, photos, or contracts  
- **AI-driven pricing suggestions:** Nora could analyze past submissions to recommend optimized offer pricing  
- **Reputation & review system:** Track completed offers and release ratings as verifiable on-chain badges  
- **Integration with fiat on-ramps:** Via Dynamic’s Coinbase integration for clients who want to pay with fiat



### Potential tech / how it's built

Infra

<!-- * Walrus: for storage
    Best app using Walrus for storage - Try to focus on an app idea where decentralized storage solves a current pain point. For example, hosting for NFTs, democratization of AI models, or crowdsourced video streaming. -->
* Dynamic: authentication wrapper around metamask and retrieving providers. (no gambling or games of chance)
    Mix dynamic with other solutions
* Hardhat
    Smart contract development and deployment
    Demo with a test

* PyUSD: payment candidate and erc20
    Core payments. Businesses don't want to receive volatile currencies
<!-- * Nora: coding agent
    Not user facing
    Helps with the development process
    Want to show during the judge preesentation what discussion you
    Want to see how Nora was specifically helpful with web3 content -->
* Coinbase developer platform:
    Onboarding / on ramp
    Ledger query
* ENS: decentralized naming
    Wherever an address is shown, show an ENS profile and attached socials.
    Text records can be used to store application specific metadata attached to an ens name
    Proof of humanity could be stored here

Use case

Hosting on vercel (important for judging criteria and getting additional credit)
Open source

### Useful links
https://ethglobal.com/events/newyork2025/prizes

### Screenshots