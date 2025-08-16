"use client";

import React from "react";
import { Typography, Spin } from "antd";
import OwnerOffersGrid from "../lib/offer/OwnerOffersGrid";
import useOwnerOffers from "../lib/offer/useOwnerOffers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const { Title, Paragraph } = Typography;

export default function MyOffersPage() {
  const { primaryWallet } = useDynamicContext();
  const userAddress = primaryWallet?.address || null;
  const { loading, offers } = useOwnerOffers(!!userAddress, userAddress);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2}>Recent Offers</Title>
          <Paragraph type="secondary">
            These are offers you have recently created on this device.
          </Paragraph>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : !userAddress ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Title level={4} type="secondary">Connect your wallet to view your offers.</Title>
            <Paragraph type="secondary">Once connected, your created offers will appear here.</Paragraph>
          </div>
        ) : (
          <OwnerOffersGrid offers={offers} loading={loading} showEmptyState={true} />
        )}
      </div>
    </div>
  );
}
