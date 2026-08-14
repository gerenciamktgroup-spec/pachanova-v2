// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleIdentityRegistry
 * @dev ERC-3643 compliant identity registry mock/implementation for PachaNova.
 * Tracks verified investor wallet addresses and their country codes.
 */
contract SimpleIdentityRegistry is Ownable {
    mapping(address => bool) private _verified;
    mapping(address => uint16) private _countryCodes;

    event IdentityRegistered(address indexed investorAddress, uint16 country);
    event IdentityRemoved(address indexed investorAddress);

    constructor() Ownable(msg.sender) {
        // Owner is verified by default
        _verified[msg.sender] = true;
        _countryCodes[msg.sender] = 604; // Peru ISO-3166 code
    }

    function registerIdentity(address investorAddress, uint16 country) external onlyOwner {
        require(investorAddress != address(0), "Invalid address");
        _verified[investorAddress] = true;
        _countryCodes[investorAddress] = country;
        emit IdentityRegistered(investorAddress, country);
    }

    function removeIdentity(address investorAddress) external onlyOwner {
        _verified[investorAddress] = false;
        delete _countryCodes[investorAddress];
        emit IdentityRemoved(investorAddress);
    }

    function isVerified(address userAddress) external view returns (bool) {
        return _verified[userAddress];
    }

    function getInvestorCountry(address userAddress) external view returns (uint16) {
        return _countryCodes[userAddress];
    }
}
