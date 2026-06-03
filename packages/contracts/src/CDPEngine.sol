// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IPachaUSD {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

/**
 * @title CDPEngine
 * @dev Collateralized Debt Position engine allowing users to lock PACHA (Real Estate Token) 
 * to mint PachaUSD stablecoins. Includes over-collateralization and liquidation logic.
 */
contract CDPEngine is Ownable {
    IERC20 public collateralToken; // PACHA Token
    IPachaUSD public pUsdToken;
    
    uint256 public constant LIQUIDATION_THRESHOLD = 150; // 150% Over-collateralization required
    uint256 public constant PRECISION = 1e18;

    struct Vault {
        uint256 collateralAmount;
        uint256 debtAmount;
    }

    mapping(address => Vault) public vaults;

    // Mock Oracle Price
    uint256 public currentCollateralPriceUsd = 1.05 * 1e18; // $1.05 per PACHA

    event VaultOpened(address indexed user, uint256 collateralAmount, uint256 debtMinted);
    event Liquidated(address indexed user, uint256 debtRecovered);

    constructor(address _collateralToken, address _pUsdToken) Ownable(msg.sender) {
        collateralToken = IERC20(_collateralToken);
        pUsdToken = IPachaUSD(_pUsdToken);
    }

    function updateOraclePrice(uint256 newPrice) external onlyOwner {
        currentCollateralPriceUsd = newPrice;
    }

    function depositAndMint(uint256 collateralAmount, uint256 mintAmount) external {
        require(collateralAmount > 0, "Zero collateral");
        
        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        
        Vault storage v = vaults[msg.sender];
        v.collateralAmount += collateralAmount;
        v.debtAmount += mintAmount;

        require(_isHealthy(msg.sender), "Health factor too low");

        pUsdToken.mint(msg.sender, mintAmount);
        emit VaultOpened(msg.sender, collateralAmount, mintAmount);
    }

    function _isHealthy(address user) internal view returns (bool) {
        Vault memory v = vaults[user];
        if (v.debtAmount == 0) return true;

        uint256 collateralValueUsd = (v.collateralAmount * currentCollateralPriceUsd) / PRECISION;
        uint256 collateralRatio = (collateralValueUsd * 100) / v.debtAmount;

        return collateralRatio >= LIQUIDATION_THRESHOLD;
    }

    function liquidate(address user) external {
        require(!_isHealthy(user), "Vault is healthy");
        
        Vault storage v = vaults[user];
        uint256 debtToRecover = v.debtAmount;
        uint256 collateralToSeize = v.collateralAmount;

        // Simplistic liquidation: seizing all collateral for debt repayment
        // Keepers would normally pay down the debt to get the collateral at a discount (Dutch Auction)
        
        v.collateralAmount = 0;
        v.debtAmount = 0;

        pUsdToken.burn(msg.sender, debtToRecover);
        collateralToken.transfer(msg.sender, collateralToSeize);

        emit Liquidated(user, debtToRecover);
    }
}
