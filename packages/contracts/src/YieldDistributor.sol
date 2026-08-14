// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PachaNovaToken.sol";

/**
 * @title YieldDistributor
 * @dev Distribución automatizada de rentas (alquileres, ventas de unidades o explotación)
 * para los co-propietarios del token PACHA.
 */
contract YieldDistributor is Ownable, ReentrancyGuard {
    PachaNovaToken public immutable pachaToken;
    IERC20 public immutable paymentToken; // e.g., USDT / USDC

    struct DistributionRound {
        uint256 roundId;
        uint256 totalAmount;
        uint256 snapshotTotalSupply;
        uint256 timestamp;
        string memo; // e.g., "Rentas Mensuales Edificio San Bartolo - Q1"
    }

    uint256 public currentRoundId;
    mapping(uint256 => DistributionRound) public rounds;
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    event DistributionDeposited(uint256 indexed roundId, uint256 totalAmount, string memo);
    event YieldClaimed(uint256 indexed roundId, address indexed investor, uint256 amount);

    constructor(address _pachaToken, address _paymentToken) Ownable(msg.sender) {
        require(_pachaToken != address(0), "Invalid PACHA token");
        require(_paymentToken != address(0), "Invalid payment token");
        pachaToken = PachaNovaToken(_pachaToken);
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @dev El Fideicomiso deposita los fondos recaudados por alquileres/ventas para distribución.
     */
    function depositDistribution(uint256 amount, string calldata memo) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be > 0");
        uint256 supply = pachaToken.totalSupply();
        require(supply > 0, "No PACHA tokens in circulation");

        require(paymentToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        currentRoundId++;
        rounds[currentRoundId] = DistributionRound({
            roundId: currentRoundId,
            totalAmount: amount,
            snapshotTotalSupply: supply,
            timestamp: block.timestamp,
            memo: memo
        });

        emit DistributionDeposited(currentRoundId, amount, memo);
    }

    /**
     * @dev Calcula el dividendo pendiente de un inversor en una ronda específica.
     */
    function calculateClaimable(uint256 roundId, address investor) public view returns (uint256) {
        if (hasClaimed[roundId][investor]) return 0;
        DistributionRound memory round = rounds[roundId];
        if (round.snapshotTotalSupply == 0) return 0;

        uint256 investorBalance = pachaToken.balanceOf(investor);
        if (investorBalance == 0) return 0;

        return (round.totalAmount * investorBalance) / round.snapshotTotalSupply;
    }

    /**
     * @dev El inversor reclama su rendimiento correspondiente.
     */
    function claimYield(uint256 roundId) external nonReentrant {
        require(roundId > 0 && roundId <= currentRoundId, "Invalid round ID");
        require(!hasClaimed[roundId][msg.sender], "Yield already claimed for this round");

        uint256 claimable = calculateClaimable(roundId, msg.sender);
        require(claimable > 0, "No yield claimable for this address");

        hasClaimed[roundId][msg.sender] = true;
        require(paymentToken.transfer(msg.sender, claimable), "Payment transfer failed");

        emit YieldClaimed(roundId, msg.sender, claimable);
    }

    /**
     * @dev Reclama múltiples rondas pendientes en una sola transacción.
     */
    function claimMultipleRounds(uint256[] calldata roundIds) external nonReentrant {
        uint256 totalClaimable = 0;

        for (uint256 i = 0; i < roundIds.length; i++) {
            uint256 rId = roundIds[i];
            if (rId > 0 && rId <= currentRoundId && !hasClaimed[rId][msg.sender]) {
                uint256 claimable = calculateClaimable(rId, msg.sender);
                if (claimable > 0) {
                    hasClaimed[rId][msg.sender] = true;
                    totalClaimable += claimable;
                    emit YieldClaimed(rId, msg.sender, claimable);
                }
            }
        }

        require(totalClaimable > 0, "Nothing to claim");
        require(paymentToken.transfer(msg.sender, totalClaimable), "Transfer failed");
    }
}
