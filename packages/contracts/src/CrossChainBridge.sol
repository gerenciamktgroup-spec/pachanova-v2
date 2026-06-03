// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IIdentityRegistry {
    function isVerified(address _userAddress) external view returns (bool);
}

/**
 * @title CrossChainBridge
 * @dev Locks tokens on the source chain (e.g. Polygon) and emits an event for the relayer to mint on the destination chain (e.g. Arbitrum).
 */
contract CrossChainBridge is Ownable, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public immutable pachaToken;
    IIdentityRegistry public immutable identityRegistry;

    uint256 public minimumBridgeAmount = 1 * 1e18; // 1 PACHA min
    uint256 public bridgeFee = 0.01 ether; // MATIC fee

    event TokensLocked(address indexed user, uint256 amount, uint256 destinationChainId, bytes32 indexed nonce);
    event TokensUnlocked(address indexed user, uint256 amount, bytes32 indexed receipt);

    mapping(bytes32 => bool) public processedReceipts;

    constructor(address _pachaToken, address _identityRegistry) Ownable(msg.sender) {
        pachaToken = IERC20(_pachaToken);
        identityRegistry = IIdentityRegistry(_identityRegistry);
    }

    function lockTokens(uint256 amount, uint256 destinationChainId) external payable whenNotPaused {
        require(msg.value >= bridgeFee, "Insufficient bridge fee");
        require(amount >= minimumBridgeAmount, "Amount below minimum");
        require(identityRegistry.isVerified(msg.sender), "Not KYC verified");

        bytes32 nonce = keccak256(abi.encodePacked(msg.sender, amount, destinationChainId, block.timestamp));

        pachaToken.safeTransferFrom(msg.sender, address(this), amount);

        emit TokensLocked(msg.sender, amount, destinationChainId, nonce);
    }

    function unlockTokens(address to, uint256 amount, bytes32 receipt) external onlyOwner {
        require(!processedReceipts[receipt], "Receipt already processed");
        processedReceipts[receipt] = true;

        pachaToken.safeTransfer(to, amount);

        emit TokensUnlocked(to, amount, receipt);
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
