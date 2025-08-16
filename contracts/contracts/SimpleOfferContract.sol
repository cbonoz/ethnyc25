// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;



contract SimpleOfferContract {

    // basic
    struct Offer {
        uint256 id;
        address creator;
        address client;
        uint256 amount;
        bool isAccepted;
    }

    mapping(uint256 => Offer) public offers;
    uint256 public offerCount;

    function createOffer(address _client, uint256 _amount) external {
        offerCount++;
        offers[offerCount] = Offer(offerCount, msg.sender, _client, _amount, false);
    }

}
