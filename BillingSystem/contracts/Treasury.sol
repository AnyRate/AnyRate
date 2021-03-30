// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
  // Withdraw some value
  function transferTo(address payable to, uint256 value) public {
    require(msg.sender == this.owner(), 'Only the treasury owner can call this function');
    require(address(this).balance >= value, "You don't have enough liquidity to send");

    to.transfer(value);
  }

  // Withdraw all value
  function withdrawAll() public {
    require(msg.sender == this.owner(), 'Only the treasury owner can call this function');

    payable(msg.sender).transfer(address(this).balance);
  }
}