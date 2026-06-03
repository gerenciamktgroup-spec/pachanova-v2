// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PachaUSD
 * @dev Algorithmic Stablecoin soft-pegged to USD. Minted exclusively by the CDPEngine.
 */
contract PachaUSD is ERC20, Ownable {
    address public cdpEngine;

    modifier onlyEngine() {
        require(msg.sender == cdpEngine, "Only CDP Engine can mint/burn");
        _;
    }

    constructor() ERC20("PachaNova USD", "pUSD") Ownable(msg.sender) {}

    function setCdpEngine(address _engine) external onlyOwner {
        cdpEngine = _engine;
    }

    function mint(address to, uint256 amount) external onlyEngine {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyEngine {
        _burn(from, amount);
    }
}
