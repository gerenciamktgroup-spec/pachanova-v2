// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LandLending
 * @dev Allows users to use PACHA land tokens as collateral to borrow stablecoins.
 */
contract LandLending is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable pachaToken;
    IERC20 public immutable stablecoin; // USDC or USDT

    uint256 public collateralFactor = 50; // 50% max LTV
    uint256 public borrowRate = 5; // 5% APR
    uint256 public liquidationThreshold = 70; // Liquidate at 70% LTV
    uint256 public liquidationPenalty = 10; // 10% penalty goes to liquidator
    uint256 public pachaPrice; // Simulated oracle price, e.g., 1 PACHA = 100 USDC

    struct Loan {
        uint256 collateral;
        uint256 borrowedAmount;
        uint256 lastInteractionTime;
    }

    mapping(address => Loan) public loans;

    event Deposited(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Liquidated(address indexed user, address indexed liquidator, uint256 seizedCollateral, uint256 repaidAmount);

    constructor(address _pachaToken, address _stablecoin) Ownable(msg.sender) {
        pachaToken = IERC20(_pachaToken);
        stablecoin = IERC20(_stablecoin);
        pachaPrice = 100 * 1e6; // Default to 100 USDC (6 decimals)
    }

    // Mock oracle update
    function setPachaPrice(uint256 _price) external onlyOwner {
        pachaPrice = _price;
    }

    function depositCollateral(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        loans[msg.sender].collateral += amount;
        pachaToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit Deposited(msg.sender, amount);
    }

    function calculateDebt(address user) public view returns (uint256) {
        Loan memory loan = loans[user];
        if (loan.borrowedAmount == 0) return 0;

        uint256 timeElapsed = block.timestamp - loan.lastInteractionTime;
        uint256 interest = (loan.borrowedAmount * borrowRate * timeElapsed) / (365 days * 100);
        return loan.borrowedAmount + interest;
    }

    function borrow(uint256 amount) external nonReentrant {
        uint256 totalDebt = calculateDebt(msg.sender) + amount;
        uint256 maxBorrowable = (loans[msg.sender].collateral * pachaPrice * collateralFactor) / (100 * 1e18); // assuming PACHA has 18 decimals
        
        require(totalDebt <= maxBorrowable, "Insufficient collateral");

        loans[msg.sender].borrowedAmount = totalDebt;
        loans[msg.sender].lastInteractionTime = block.timestamp;

        stablecoin.safeTransfer(msg.sender, amount);
        
        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external nonReentrant {
        uint256 totalDebt = calculateDebt(msg.sender);
        require(amount <= totalDebt, "Amount exceeds debt");

        loans[msg.sender].borrowedAmount = totalDebt - amount;
        loans[msg.sender].lastInteractionTime = block.timestamp;

        stablecoin.safeTransferFrom(msg.sender, address(this), amount);

        emit Repaid(msg.sender, amount);
    }

    function liquidate(address user) external nonReentrant {
        uint256 totalDebt = calculateDebt(user);
        require(totalDebt > 0, "No debt to liquidate");

        uint256 collateralValue = (loans[user].collateral * pachaPrice) / 1e18;
        uint256 currentLtv = (totalDebt * 100) / collateralValue;

        require(currentLtv >= liquidationThreshold, "Position is healthy");

        // Calculate collateral to seize
        uint256 seizeAmount = (totalDebt * 1e18) / pachaPrice;
        uint256 penaltyAmount = (seizeAmount * liquidationPenalty) / 100;
        uint256 totalSeize = seizeAmount + penaltyAmount;

        require(loans[user].collateral >= totalSeize, "Not enough collateral for penalty");

        // Repay debt
        stablecoin.safeTransferFrom(msg.sender, address(this), totalDebt);
        
        // Seize collateral
        loans[user].collateral -= totalSeize;
        loans[user].borrowedAmount = 0;

        // Pay liquidator
        pachaToken.safeTransfer(msg.sender, totalSeize);

        emit Liquidated(user, msg.sender, totalSeize, totalDebt);
    }
}
