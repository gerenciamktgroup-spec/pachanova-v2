// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/PachaNovaToken.sol";
import "../src/FideicomisoTrustAnchor.sol";
import "../src/PachaNovaAuction.sol";

/**
 * @title DeployScript
 * @notice Deployment script for PachaNova contracts on Arbitrum Sepolia (testnet) or Arbitrum One (mainnet)
 * 
 * USAGE:
 *   Testnet (Arbitrum Sepolia):
 *     forge script script/Deploy.s.sol:DeployScript \
 *       --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
 *       --private-key $DEPLOYER_PRIVATE_KEY \
 *       --broadcast \
 *       --verify \
 *       --etherscan-api-key $ARBISCAN_API_KEY
 * 
 *   Mainnet (Arbitrum One):
 *     forge script script/Deploy.s.sol:DeployScript \
 *       --rpc-url $ARBITRUM_ONE_RPC_URL \
 *       --private-key $DEPLOYER_PRIVATE_KEY \
 *       --broadcast \
 *       --verify \
 *       --etherscan-api-key $ARBISCAN_API_KEY
 * 
 * REQUIRED ENV VARS:
 *   DEPLOYER_PRIVATE_KEY   — Private key of deployer wallet (funded with ETH)
 *   ARBITRUM_SEPOLIA_RPC_URL — e.g. https://sepolia-rollup.arbitrum.io/rpc
 *   ARBITRUM_ONE_RPC_URL   — e.g. https://arb1.arbitrum.io/rpc
 *   ARBISCAN_API_KEY       — For contract verification on Arbiscan
 *   FIDUCIARIO_ADDRESS     — Address of the fiduciario multisig wallet
 *   ADMIN_ADDRESS          — Address of the admin wallet
 *
 * FAUCET (testnet ETH):
 *   https://faucet.triangleplatform.com/arbitrum/sepolia
 *   https://www.alchemy.com/faucets/arbitrum-sepolia
 */

import "forge-std/Script.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address fiduciarioAddress = vm.envOr("FIDUCIARIO_ADDRESS", address(0));
        address adminAddress = vm.envOr("ADMIN_ADDRESS", msg.sender);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy FideicomisoTrustAnchor
        FideicomisoTrustAnchor trustAnchor = new FideicomisoTrustAnchor();
        console.log("FideicomisoTrustAnchor deployed at:", address(trustAnchor));

        // 2. Deploy PachaNovaToken
        PachaNovaToken token = new PachaNovaToken(address(trustAnchor));
        console.log("PachaNovaToken (PACHA) deployed at:", address(token));

        // 3. Deploy PachaNovaAuction
        PachaNovaAuction auction = new PachaNovaAuction(address(token));
        console.log("PachaNovaAuction deployed at:", address(auction));

        // 4. Transfer auction ownership to admin if specified
        if (adminAddress != address(0)) {
            auction.transferOwnership(adminAddress);
            console.log("Auction ownership transferred to:", adminAddress);
        }

        vm.stopBroadcast();

        // Log deployment summary for recording in DB
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network Chain ID:", block.chainid);
        console.log("FideicomisoTrustAnchor:", address(trustAnchor));
        console.log("PachaNovaToken (PACHA):", address(token));
        console.log("PachaNovaAuction:", address(auction));
        console.log("=========================\n");
        console.log("Next: Copy addresses above to .env.local as:");
        console.log("  NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=", address(token));
        console.log("  NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS=", address(auction));
        console.log("  NEXT_PUBLIC_TRUST_ANCHOR_ADDRESS=", address(trustAnchor));
    }
}
