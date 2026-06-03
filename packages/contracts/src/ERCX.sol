// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ERCX (Exo-Planet Asset Standard)
 * @dev Extension of ERC721 tailored for Interplanetary Land Registry (ILR).
 * Includes celestial body identification and 3D coordinate mapping (H3/S2 spatial index equivalents).
 */
contract ERCX is ERC721Enumerable, Ownable {
    
    struct CelestialCoordinate {
        string celestialBody; // e.g., "Mars", "Luna"
        int256 latitude;      // scaled * 1e6
        int256 longitude;     // scaled * 1e6
        uint256 areaSqm;
    }

    mapping(uint256 => CelestialCoordinate) public celestialAssets;
    uint256 public nextAssetId;

    event CelestialAssetClaimed(uint256 indexed assetId, string celestialBody, address indexed owner);

    constructor() ERC721("Interplanetary Land Registry", "ERCX-ILR") Ownable(msg.sender) {}

    /**
     * @dev Claim a tokenized coordinate on a celestial body. 
     * In a production environment, this would require verification from a Delay-Tolerant Network (DTN) oracle.
     */
    function claimCelestialAsset(
        address to, 
        string memory body, 
        int256 lat, 
        int256 lon, 
        uint256 area
    ) external onlyOwner {
        uint256 assetId = nextAssetId++;
        
        celestialAssets[assetId] = CelestialCoordinate({
            celestialBody: body,
            latitude: lat,
            longitude: lon,
            areaSqm: area
        });

        _mint(to, assetId);

        emit CelestialAssetClaimed(assetId, body, to);
    }

    function getCelestialData(uint256 assetId) external view returns (CelestialCoordinate memory) {
        require(_ownerOf(assetId) != address(0), "Asset does not exist");
        return celestialAssets[assetId];
    }
}
