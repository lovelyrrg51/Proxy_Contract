// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";

contract LogicV2 is Ownable {
    uint256 public magicValueV1;

    uint256 public magicValueV2;

    function initialize() public {
        magicValueV2 = 619;
    }

    function updateMagicValueV2(uint256 newMagicValue) public onlyOwner {
        magicValueV2 = newMagicValue;
    }

    function doMagicV1() public onlyOwner {
        magicValueV1 = magicValueV1 * 2;
    }
}