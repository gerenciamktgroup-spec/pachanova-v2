// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleCompliance
 * @dev ERC-3643 modular compliance rule engine for PachaNova real estate tokens.
 */
contract SimpleCompliance is Ownable {
    mapping(address => bool) private _blacklisted;
    uint256 public maxTokensPerInvestor = 100_000; // Max 20% of the total 500k supply per investor

    event InvestorBlacklisted(address indexed investor, bool status);
    event MaxTokensPerInvestorUpdated(uint256 newLimit);

    constructor() Ownable(msg.sender) {}

    function setBlacklist(address investor, bool status) external onlyOwner {
        _blacklisted[investor] = status;
        emit InvestorBlacklisted(investor, status);
    }

    function setMaxTokensPerInvestor(uint256 newLimit) external onlyOwner {
        maxTokensPerInvestor = newLimit;
        emit MaxTokensPerInvestorUpdated(newLimit);
    }

    function isBlacklisted(address investor) external view returns (bool) {
        return _blacklisted[investor];
    }

    function canTransfer(address from, address to, uint256 amount) external view returns (bool) {
        if (_blacklisted[from] || _blacklisted[to]) {
            return false;
        }
        if (amount == 0) {
            return false;
        }
        return true;
    }
}
