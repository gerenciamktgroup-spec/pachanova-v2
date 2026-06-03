// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PachaSoulbound
 * @dev Non-transferable tokens representing reputation, KYC tier, and institutional milestones.
 */
contract PachaSoulbound is ERC721, Ownable {
    uint256 private _nextTokenId;

    mapping(uint256 => string) public achievementURIs;

    event AchievementUnlocked(address indexed user, uint256 indexed tokenId, string achievementURI);

    constructor() ERC721("PachaNova Reputation", "PNSBT") Ownable(msg.sender) {}

    /**
     * @dev Mint a soulbound token to a user for reaching a milestone.
     */
    function awardAchievement(address to, string memory achievementURI) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        achievementURIs[tokenId] = achievementURI;
        _mint(to, tokenId);
        emit AchievementUnlocked(to, tokenId, achievementURI);
    }

    /**
     * @dev Overrides transfer functions to prevent moving the token (Soulbound logic).
     */
    function transferFrom(address from, address to, uint256 tokenId) public pure override {
        revert("Soulbound: Token is non-transferable");
    }

    /**
     * @dev Token URI override
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // We do not require the token to exist for this simplified demo
        return achievementURIs[tokenId];
    }
}
