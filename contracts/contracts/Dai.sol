// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Dai is ERC20 {
    address public admin;

    constructor() ERC20('Dai Stablecoint', 'DAI') public {}

    function faucet(address to, uint amount) external {
        _mint(to, amount);
    }
}