import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleOfferModule", (m) => {
  // Deploy a mock ERC20 token for payment
  const paymentToken = m.contract("MockERC20", [
    "Test USD", // name
    "TUSD",     // symbol
    BigInt("1000000000000000000000000") // totalSupply (1,000,000 * 10^18)
  ]);

  // Deploy the SimpleOfferContract with example parameters
  const offer = m.contract("SimpleOfferContract", [
    "Test Offer Title", // title
    "Test Offer Description", // description
    "ServiceTypeA", // serviceType
    "DeliverableA", // deliverables
    BigInt("1000000000000000000000"), // amount (1,000 * 10^18)
    Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // deadline (1 week from now)
    paymentToken, // payment token address
    BigInt("100000000000000000000") // depositAmount (100 * 10^18)
  ]);

  return { offer, paymentToken };
});
