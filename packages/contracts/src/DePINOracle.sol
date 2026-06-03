// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DePINOracle
 * @dev Ingests data from IoT sensors deployed on physical PachaNova land parcels.
 * Data such as foot traffic, soil moisture, and weather are stored immutably to dynamically affect token valuation.
 */
contract DePINOracle is Ownable {
    
    struct SensorData {
        uint256 timestamp;
        uint256 footTraffic;
        uint256 soilMoisture; // percentage * 100
        int256 temperatureCelsius; // temp * 100
    }

    // landId -> SensorData
    mapping(uint256 => SensorData) public landSensorReadings;

    // Mapping of authorized DePIN gateways (Raspberry Pi/Arduino wallets)
    mapping(address => bool) public authorizedGateways;

    event DataIngested(uint256 indexed landId, uint256 timestamp, uint256 footTraffic);

    constructor() Ownable(msg.sender) {}

    modifier onlyGateway() {
        require(authorizedGateways[msg.sender], "Not an authorized DePIN gateway");
        _;
    }

    function addGateway(address gateway) external onlyOwner {
        authorizedGateways[gateway] = true;
    }

    function removeGateway(address gateway) external onlyOwner {
        authorizedGateways[gateway] = false;
    }

    /**
     * @dev Called by the hardware gateway to push new sensor data on-chain.
     */
    function ingestData(
        uint256 landId, 
        uint256 footTraffic, 
        uint256 soilMoisture, 
        int256 temperatureCelsius
    ) external onlyGateway {
        landSensorReadings[landId] = SensorData({
            timestamp: block.timestamp,
            footTraffic: footTraffic,
            soilMoisture: soilMoisture,
            temperatureCelsius: temperatureCelsius
        });

        emit DataIngested(landId, block.timestamp, footTraffic);
    }

    function getLatestReading(uint256 landId) external view returns (SensorData memory) {
        return landSensorReadings[landId];
    }
}
