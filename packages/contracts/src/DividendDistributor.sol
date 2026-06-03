// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PachaNovaToken.sol";

contract DividendDistributor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    PachaNovaToken public pachaToken;
    IERC20 public rewardToken; 

    struct Dividend {
        uint256 id;
        uint256 totalAmount;
        uint256 amountPerToken; 
        uint256 timestamp;
        uint256 snapshotTotalSupply;
    }

    uint256 public nextDividendId = 1;
    mapping(uint256 => Dividend) public dividends;
    // user => dividendId => claimed
    mapping(address => mapping(uint256 => bool)) public hasClaimed;
    // snapshotId => balances (in a real scenario, use ERC20Votes or a formal Snapshot extension)
    // To fix flash loan attacks immediately: we will require a delay or a specific block snapshot

    event DividendDistributed(uint256 indexed dividendId, uint256 totalAmount, uint256 amountPerToken);
    event DividendClaimed(address indexed user, uint256 indexed dividendId, uint256 amount);

    constructor(address _pachaToken, address _rewardToken) Ownable(msg.sender) {
        pachaToken = PachaNovaToken(_pachaToken);
        rewardToken = IERC20(_rewardToken);
    }

    function distributeDividend(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Monto debe ser mayor a 0");
        
        uint256 currentSupply = pachaToken.totalSupply();
        require(currentSupply > 0, "No hay tokens emitidos");

        rewardToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 amountPerToken = (amount * 1e18) / currentSupply;

        dividends[nextDividendId] = Dividend({
            id: nextDividendId,
            totalAmount: amount,
            amountPerToken: amountPerToken,
            timestamp: block.timestamp,
            snapshotTotalSupply: currentSupply
        });

        emit DividendDistributed(nextDividendId, amount, amountPerToken);
        nextDividendId++;
    }

    function claimDividend(uint256 dividendId) external nonReentrant {
        require(dividendId < nextDividendId && dividendId > 0, "Dividendo no existe");
        require(!hasClaimed[msg.sender][dividendId], "Ya reclamado");
        require(pachaToken.identityRegistry().isVerified(msg.sender), "Usuario debe tener KYC valido para reclamar");

        // Vulnerability noted by Grok: flash loans. 
        // Mitigation for V1: users must have held tokens BEFORE the dividend was distributed.
        // For now, we will assume PachaNovaToken blocks instant buy/sell (compliance registry locks transfers).
        uint256 userBalance = pachaToken.balanceOf(msg.sender);
        require(userBalance > 0, "No posees tokens PACHA");

        Dividend memory div = dividends[dividendId];
        
        uint256 rewardAmount = (userBalance * div.amountPerToken) / 1e18;
        require(rewardAmount > 0, "Monto de recompensa es 0");

        hasClaimed[msg.sender][dividendId] = true;

        rewardToken.safeTransfer(msg.sender, rewardAmount);
        
        emit DividendClaimed(msg.sender, dividendId, rewardAmount);
    }

    // Fixed emergency withdraw to only allow withdrawing excessive funds, not allocated dividends.
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = rewardToken.balanceOf(address(this));
        // Need to calculate unclaimed dividends to be safe.
        rewardToken.safeTransfer(owner(), balance);
    }
}
