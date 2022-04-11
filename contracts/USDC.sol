// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function faucet (address recipient , uint amount) external {
      _mint(recipient, amount);
    }

    function decimals() public pure override returns (uint8) { return 6; }

}
