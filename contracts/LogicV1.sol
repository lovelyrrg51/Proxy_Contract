// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";

contract LogicV1 is Ownable {
    uint256 public magicValueV1;

    function initialize() public {
        magicValueV1 = 619;
    }

    function updateMagicValueV1(uint256 newMagicValue) public onlyOwner {
        magicValueV1 = newMagicValue;
    }
}