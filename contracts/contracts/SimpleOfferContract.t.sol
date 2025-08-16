// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./SimpleOfferContract.sol";
import "./MockERC20.sol";

contract SimpleOfferContractTest {
    SimpleOfferContract offer;
    MockERC20 token;
    address owner = address(0x1);
    address client = address(0x2);

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

    function testDeactivateOffer() public {
        offer.deactivateOffer();
        (, , , , , , bool isActive, , , ) = offer.getOfferDetails();
        assert(isActive == false);
    }

}
