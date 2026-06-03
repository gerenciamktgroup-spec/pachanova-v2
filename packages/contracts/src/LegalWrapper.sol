// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LegalWrapper
 * @dev Maps the PachaDAO to real-world legal entities (e.g., Wyoming LLC or Swiss Foundation).
 * Stores IPFS hashes of the operating agreements, bylaws, and articles of incorporation.
 */
contract LegalWrapper is Ownable {
    
    struct LegalEntity {
        string jurisdiction;
        string entityType; // e.g., "LLC", "Foundation"
        string registrationNumber;
        string operatingAgreementIPFS;
        bool isActive;
    }

    mapping(uint256 => LegalEntity) public wrappedEntities;
    uint256 public nextEntityId;

    event EntityIncorporated(uint256 indexed entityId, string jurisdiction, string entityType);
    event OperatingAgreementUpdated(uint256 indexed entityId, string newIpfsHash);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Called by the On-Chain Incorporation Engine (LexDAO/Otoco integration) when an entity is formed.
     */
    function registerEntity(
        string memory jurisdiction,
        string memory entityType,
        string memory registrationNumber,
        string memory ipfsHash
    ) external onlyOwner returns (uint256) {
        uint256 entityId = nextEntityId++;
        
        wrappedEntities[entityId] = LegalEntity({
            jurisdiction: jurisdiction,
            entityType: entityType,
            registrationNumber: registrationNumber,
            operatingAgreementIPFS: ipfsHash,
            isActive: true
        });

        emit EntityIncorporated(entityId, jurisdiction, entityType);
        return entityId;
    }

    function updateOperatingAgreement(uint256 entityId, string memory newIpfsHash) external onlyOwner {
        require(wrappedEntities[entityId].isActive, "Entity inactive");
        wrappedEntities[entityId].operatingAgreementIPFS = newIpfsHash;
        emit OperatingAgreementUpdated(entityId, newIpfsHash);
    }
}
