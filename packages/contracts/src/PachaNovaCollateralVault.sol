// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PachaNovaToken.sol";

/**
 * @title PachaNovaCollateralVault
 * @dev Bóveda de colateralización e hipoteca de tokens PACHA.
 * Permite a los co-propietarios obtener liquidez en moneda estable dejando sus m²
 * en garantía fiduciaria, sin desprenderse de la propiedad ni de la plusvalía futura.
 */
contract PachaNovaCollateralVault is Ownable, ReentrancyGuard {
    PachaNovaToken public immutable pachaToken;
    IERC20 public immutable loanToken; // e.g. USDT / USDC

    uint256 public constant LTV_BPS = 6000; // 60% Max Loan-To-Value (6000 / 10000)
    uint256 public constant BPS_DENOMINATOR = 10000;
    uint256 public constant ANNUAL_INTEREST_RATE_BPS = 800; // 8% APY
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    uint256 public oracleTokenPriceUsd = 840; // $8.40 USD (with 2 decimals: 840 = 8.40)

    struct LoanPosition {
        uint256 collateralPachaAmount;
        uint256 principalBorrowedUsd; // in loanToken decimals (e.g. 6 decimals for USDT)
        uint256 startTimestamp;
        bool active;
    }

    mapping(address => LoanPosition) public loans;

    event CollateralDepositedAndBorrowed(
        address indexed borrower,
        uint256 collateralPacha,
        uint256 borrowedUsd
    );
    event LoanRepaidAndCollateralReleased(
        address indexed borrower,
        uint256 principalRepaid,
        uint256 interestPaid,
        uint256 collateralReturned
    );
    event OraclePriceUpdated(uint256 newPriceUsd);
    event LiquiditySupplied(address indexed provider, uint256 amount);

    constructor(address _pachaToken, address _loanToken) Ownable(msg.sender) {
        require(_pachaToken != address(0), "Invalid PACHA");
        require(_loanToken != address(0), "Invalid Loan Token");
        pachaToken = PachaNovaToken(_pachaToken);
        loanToken = IERC20(_loanToken);
    }

    function setOracleTokenPrice(uint256 newPriceUsd) external onlyOwner {
        require(newPriceUsd > 0, "Price must be > 0");
        oracleTokenPriceUsd = newPriceUsd;
        emit OraclePriceUpdated(newPriceUsd);
    }

    /**
     * @dev Proveer liquidez a la bóveda para préstamos (ej. por parte del fondo fiduciario).
     */
    function supplyLiquidity(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount > 0");
        require(loanToken.transferFrom(msg.sender, address(this), amount), "Supply failed");
        emit LiquiditySupplied(msg.sender, amount);
    }

    /**
     * @dev Calcula el monto máximo que se puede pedir prestado con cierta cantidad de tokens.
     */
    function getMaxBorrowAmount(uint256 pachaAmount) public view returns (uint256) {
        // Valuation: pachaAmount * oracleTokenPriceUsd (price has 2 decimals)
        // With 6 decimals for USDT: (pachaAmount * price * 1e6 * 60%) / (100 * 10000)
        uint256 totalValuationUsd = pachaAmount * oracleTokenPriceUsd * 10000; // normalized
        return (totalValuationUsd * LTV_BPS) / (100 * BPS_DENOMINATOR);
    }

    /**
     * @dev Calcula los intereses devengados hasta el momento.
     */
    function getAccruedInterest(address borrower) public view returns (uint256) {
        LoanPosition memory loan = loans[borrower];
        if (!loan.active || loan.principalBorrowedUsd == 0) return 0;

        uint256 duration = block.timestamp - loan.startTimestamp;
        // Interest = Principal * Rate * (Duration / Year)
        return (loan.principalBorrowedUsd * ANNUAL_INTEREST_RATE_BPS * duration) / (BPS_DENOMINATOR * SECONDS_PER_YEAR);
    }

    /**
     * @dev Hipotecar tokens PACHA para obtener préstamo inmediato en USDT/USDC.
     */
    function borrowAgainstPacha(uint256 pachaAmount, uint256 borrowUsdAmount) external nonReentrant {
        require(pachaAmount > 0, "Pacha amount must be > 0");
        require(!loans[msg.sender].active, "Existing active loan must be repaid first");

        uint256 maxBorrow = getMaxBorrowAmount(pachaAmount);
        require(borrowUsdAmount <= maxBorrow, "Requested amount exceeds maximum LTV (60%)");
        require(loanToken.balanceOf(address(this)) >= borrowUsdAmount, "Insufficient vault liquidity");

        // Lock collateral tokens
        require(pachaToken.transferFrom(msg.sender, address(this), pachaAmount), "PACHA transfer failed");

        // Record loan
        loans[msg.sender] = LoanPosition({
            collateralPachaAmount: pachaAmount,
            principalBorrowedUsd: borrowUsdAmount,
            startTimestamp: block.timestamp,
            active: true
        });

        // Transfer funds to borrower
        require(loanToken.transfer(msg.sender, borrowUsdAmount), "USD transfer failed");

        emit CollateralDepositedAndBorrowed(msg.sender, pachaAmount, borrowUsdAmount);
    }

    /**
     * @dev Pagar el préstamo (capital + intereses) y liberar los tokens hipotecados.
     */
    function repayAndUnlockCollateral() external nonReentrant {
        LoanPosition memory loan = loans[msg.sender];
        require(loan.active, "No active loan found");

        uint256 interest = getAccruedInterest(msg.sender);
        uint256 totalRepayment = loan.principalBorrowedUsd + interest;
        uint256 collateralToReturn = loan.collateralPachaAmount;

        // Reset loan state before transfers
        delete loans[msg.sender];

        // Receive repayment in USD
        require(loanToken.transferFrom(msg.sender, address(this), totalRepayment), "Repayment failed");

        // Release locked PACHA tokens back to owner
        require(pachaToken.transfer(msg.sender, collateralToReturn), "PACHA release failed");

        emit LoanRepaidAndCollateralReleased(msg.sender, loan.principalBorrowedUsd, interest, collateralToReturn);
    }
}
