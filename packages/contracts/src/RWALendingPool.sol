// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RWALendingPool
 * @dev Money market for lending and borrowing against tokenized real estate (ERC-3643).
 * Uses an algorithmic interest rate model based on utilization.
 */
contract RWALendingPool is Ownable {
    IERC20 public usdcToken;

    // Mapping of approved RWA token addresses to their max LTV (Loan-to-Value) in basis points
    mapping(address => uint256) public approvedRwaTokens;
    
    uint256 public totalBorrows;
    uint256 public totalReserves;
    uint256 public reserveFactor = 1000; // 10%
    
    uint256 public baseRatePerYear = 200; // 2%
    uint256 public multiplierPerYear = 1500; // 15%

    struct BorrowPosition {
        uint256 principal;
        uint256 interestIndex;
    }

    mapping(address => mapping(address => uint256)) public collateralBalances; // user -> rwaToken -> amount
    mapping(address => BorrowPosition) public userBorrows;

    event CollateralDeposited(address indexed user, address indexed rwaToken, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }

    function approveRwaToken(address rwaToken, uint256 maxLtv) external onlyOwner {
        approvedRwaTokens[rwaToken] = maxLtv;
    }

    function depositCollateral(address rwaToken, uint256 amount) external {
        require(approvedRwaTokens[rwaToken] > 0, "RWA not approved");
        require(amount > 0, "Zero amount");

        IERC20(rwaToken).transferFrom(msg.sender, address(this), amount);
        collateralBalances[msg.sender][rwaToken] += amount;

        emit CollateralDeposited(msg.sender, rwaToken, amount);
    }

    function borrow(uint256 amount) external {
        // Simple mock of borrow logic. In reality requires Oracle price feed and LTV checks
        require(amount > 0, "Zero amount");
        
        // Mock LTV check: Assume user has enough collateral
        userBorrows[msg.sender].principal += amount;
        totalBorrows += amount;
        
        usdcToken.transfer(msg.sender, amount);
        emit Borrowed(msg.sender, amount);
    }

    /**
     * @dev Calculates the current borrow rate based on utilization ratio.
     */
    function getBorrowRate() public view returns (uint256) {
        uint256 cash = usdcToken.balanceOf(address(this));
        if (totalBorrows == 0) return baseRatePerYear;

        uint256 utilization = (totalBorrows * 1e18) / (cash + totalBorrows - totalReserves);
        return baseRatePerYear + ((utilization * multiplierPerYear) / 1e18);
    }
}
