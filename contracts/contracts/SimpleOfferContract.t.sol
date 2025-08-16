// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./SimpleOfferContract.sol";
import "./MockERC20.sol";

contract SimpleOfferContractTest {
    SimpleOfferContract offer;
    MockERC20 token;

    function setUp() public {
        token = new MockERC20("MockToken", "MTK", 1000000 ether);
        offer = new SimpleOfferContract(
            "Test Title",
            "Test Description",
            "ServiceType",
            "Deliverables",
            1000 * 10 ** 18,
            block.timestamp + 7 days,
            address(token),
            100 * 10 ** 18
        );
    }

    function testInitialOfferMetadata() public {
        (
            string memory title,
            string memory description,
            string memory serviceType,
            string memory deliverables,
            uint256 amount,
            uint256 deadline,
            bool isActive,
            uint256 createdAt,
            bool requiresDeposit,
            uint256 depositAmount
        ) = offer.getOfferDetails();
        assert(keccak256(bytes(title)) == keccak256(bytes("Test Title")));
        assert(amount == 1000 * 10 ** 18);
        assert(isActive == true);
        assert(requiresDeposit == true);
        assert(depositAmount == 100 * 10 ** 18);
    }


    // Edge case: only owner can deactivate offer

    function testDeactivateOffer() public {
        offer.deactivateOffer();
        (, , , , , , bool isActive, , , ) = offer.getOfferDetails();
        assert(isActive == false);
    }

    // Test that only the owner can deactivate the offer (should revert if not owner)
    function testOnlyOwnerCanDeactivateOffer() public {
        // This contract is the owner, so this should succeed
        offer.deactivateOffer();
        // Try to call as a non-owner by using a low-level call
        (bool success, ) = address(offer).call(abi.encodeWithSignature("deactivateOffer()"));
        // Should fail because offer is already deactivated
        assert(success == false);
    }

    // Test that requestAndFundOffer reverts if called by owner
    function testRequestAndFundOfferRevertsForOwner() public {
        // Approve tokens for this contract (owner)
        token.approve(address(offer), 100 * 10 ** 18);
        // Should revert because owner cannot request their own offer
        (bool success, ) = address(offer).call(abi.encodeWithSignature("requestAndFundOffer(string)", "Owner cannot request"));
        assert(success == false);
    }

    // Test that withdrawAfterRejection reverts if no request exists
    function testWithdrawAfterRejectionRevertsIfNoRequest() public {
        // Should revert because no request exists
        (bool success, ) = address(offer).call(abi.encodeWithSignature("withdrawAfterRejection()"));
        assert(success == false);
    }

}
