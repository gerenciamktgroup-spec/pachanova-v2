// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SovereignPassport
 * @dev Soulbound Token (SBT) representing citizenship in a PachaNova Micro-Nation.
 * Implements non-transferability and entitles the holder to DAO UBI (Universal Basic Income).
 */
contract SovereignPassport is ERC721, Ownable {
    
    uint256 public nextPassportId;

    // Mapping to store passport metadata URIs
    mapping(uint256 => string) private _passportURIs;

    // Mapping to track active citizenship
    mapping(uint256 => bool) public isActiveCitizen;

    event PassportIssued(address indexed citizen, uint256 indexed passportId);
    event CitizenshipRevoked(uint256 indexed passportId);

    constructor() ERC721("PachaNova Sovereign Passport", "PN-PASS") Ownable(msg.sender) {}

    /**
     * @dev Issues a non-transferable passport to a new citizen.
     */
    function issuePassport(address to, string memory tokenURI) external onlyOwner {
        require(balanceOf(to) == 0, "Address already holds a passport");
        
        uint256 passportId = nextPassportId++;
        _mint(to, passportId);
        _passportURIs[passportId] = tokenURI;
        isActiveCitizen[passportId] = true;

        emit PassportIssued(to, passportId);
    }

    /**
     * @dev Revoke citizenship, keeping the token but marking it inactive.
     */
    function revokeCitizenship(uint256 passportId) external onlyOwner {
        require(_ownerOf(passportId) != address(0), "Passport does not exist");
        isActiveCitizen[passportId] = false;
        emit CitizenshipRevoked(passportId);
    }

    /**
     * @dev Overrides transfer functions to enforce Soulbound (non-transferable) property.
     */
    function transferFrom(address, address, uint256) public virtual override {
        revert("Sovereign Passports are Soulbound and non-transferable");
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Passport does not exist");
        return _passportURIs[tokenId];
    }
}
