// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LandValuationOracle
 * @dev Simulated Chainlink-style oracle for fetching real-world real estate valuations.
 */
contract LandValuationOracle is Ownable {
    mapping(string => uint256) public projectNavs; // project code -> Net Asset Value in USD
    mapping(string => uint256) public lastUpdateTimes;
    
    event NavUpdated(string projectCode, uint256 newNav, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Called by authorized nodes (e.g. Chainlink Keepers or backend) to update NAV.
     */
    function updateNav(string memory projectCode, uint256 newNav) external onlyOwner {
        require(newNav > 0, "NAV must be greater than zero");
        projectNavs[projectCode] = newNav;
        lastUpdateTimes[projectCode] = block.timestamp;
        
        emit NavUpdated(projectCode, newNav, block.timestamp);
    }

    /**
     * @dev Returns the latest NAV for a given project code.
     */
    function getLatestNav(string memory projectCode) external view returns (uint256 nav, uint256 timestamp) {
        nav = projectNavs[projectCode];
        timestamp = lastUpdateTimes[projectCode];
        require(nav > 0, "NAV not initialized");
    }
}
