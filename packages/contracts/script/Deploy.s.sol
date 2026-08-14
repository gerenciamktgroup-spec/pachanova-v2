// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/PachaNovaToken.sol";
import "../src/FideicomisoTrustAnchor.sol";
import "../src/PachaNovaAuction.sol";
import "../src/SimpleIdentityRegistry.sol";
import "../src/SimpleCompliance.sol";
import "../src/YieldDistributor.sol";
import "../src/PachaNovaCollateralVault.sol";

import "forge-std/Script.sol";

/**
 * @title DeployScript
 * @notice Complete deployment suite for PachaNova RWA infrastructure on Arbitrum Sepolia / Arbitrum One
 */
contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        address fiduciarioAddress = vm.envOr("FIDUCIARIO_ADDRESS", deployerAddress);
        address adminAddress = vm.envOr("ADMIN_ADDRESS", deployerAddress);
        address comiteAddress = vm.envOr("COMITE_ADDRESS", deployerAddress);
        address usdtTokenAddress = vm.envOr("USDT_TOKEN_ADDRESS", address(0));
        uint256 biddingTime = vm.envOr("AUCTION_BIDDING_TIME", uint256(30 days));

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy FideicomisoTrustAnchor (Multi-sig 2/3)
        FideicomisoTrustAnchor trustAnchor = new FideicomisoTrustAnchor(
            fiduciarioAddress,
            adminAddress,
            comiteAddress
        );
        console.log("FideicomisoTrustAnchor deployed at:", address(trustAnchor));

        // 2. Deploy Identity & Compliance Registries (ERC-3643 Standard)
        SimpleIdentityRegistry identityRegistry = new SimpleIdentityRegistry();
        console.log("SimpleIdentityRegistry deployed at:", address(identityRegistry));

        SimpleCompliance complianceRegistry = new SimpleCompliance();
        console.log("SimpleCompliance deployed at:", address(complianceRegistry));

        // 3. Deploy PachaNovaToken (ERC-3643 T-REX Compatible)
        PachaNovaToken token = new PachaNovaToken(
            address(identityRegistry),
            address(complianceRegistry),
            address(trustAnchor)
        );
        console.log("PachaNovaToken (PACHA) deployed at:", address(token));

        // 4. Deploy YieldDistributor & Collateral Vault if payment token specified
        if (usdtTokenAddress != address(0)) {
            // Auction
            PachaNovaAuction auction = new PachaNovaAuction(address(token), usdtTokenAddress, biddingTime);
            console.log("PachaNovaAuction deployed at:", address(auction));

            // Yield Distributor (Rentas)
            YieldDistributor yieldDistributor = new YieldDistributor(address(token), usdtTokenAddress);
            console.log("YieldDistributor deployed at:", address(yieldDistributor));

            // Collateral Vault (Hipotecar Tokens)
            PachaNovaCollateralVault collateralVault = new PachaNovaCollateralVault(address(token), usdtTokenAddress);
            console.log("PachaNovaCollateralVault deployed at:", address(collateralVault));
        }

        // 5. Transfer Ownership to Admin if specified
        if (adminAddress != deployerAddress) {
            token.transferOwnership(adminAddress);
            identityRegistry.transferOwnership(adminAddress);
            complianceRegistry.transferOwnership(adminAddress);
            console.log("Ownership transferred to:", adminAddress);
        }

        vm.stopBroadcast();

        console.log("\n=== PACHANOVA RWA FULL DEPLOYMENT SUMMARY ===");
        console.log("Network Chain ID:", block.chainid);
        console.log("FideicomisoTrustAnchor:", address(trustAnchor));
        console.log("SimpleIdentityRegistry:", address(identityRegistry));
        console.log("SimpleCompliance:", address(complianceRegistry));
        console.log("PachaNovaToken (PACHA):", address(token));
        console.log("=============================================\n");
    }
}
