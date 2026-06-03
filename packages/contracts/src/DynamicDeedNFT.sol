// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title DynamicDeedNFT
 * @dev ERC-1155 representing fractional NFT deeds. Metadata updates dynamically as physical land develops.
 */
contract DynamicDeedNFT is ERC1155, Ownable {
    using Strings for uint256;

    mapping(uint256 => uint8) public landDevelopmentStage; // tokenId -> stage (0: Raw Land, 1: Zoned, 2: Infrastructure, 3: Completed)

    event LandStageUpgraded(uint256 indexed tokenId, uint8 newStage);

    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {}

    function mintFractionalDeed(address account, uint256 id, uint256 amount, bytes memory data) external onlyOwner {
        _mint(account, id, amount, data);
    }

    function upgradeLandStage(uint256 id, uint8 newStage) external onlyOwner {
        require(newStage > landDevelopmentStage[id], "Can only upgrade stage");
        landDevelopmentStage[id] = newStage;
        emit LandStageUpgraded(id, newStage);
    }

    /**
     * @dev Overrides URI to return dynamic metadata based on the current development stage.
     */
    function uri(uint256 id) public view override returns (string memory) {
        string memory baseURI = super.uri(id);
        uint8 stage = landDevelopmentStage[id];
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, id.toString(), "/stage", uint256(stage).toString(), ".json")) 
            : "";
    }
}
