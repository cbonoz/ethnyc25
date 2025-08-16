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
          <Title level={2}>My Offers</Title>
          <Paragraph type="secondary">
            View and manage all offers you have created as an owner.
          </Paragraph>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <OwnerOffersGrid offers={offers} loading={loading} showEmptyState={true} />
        )}
      </div>
    </div>
  );
}
