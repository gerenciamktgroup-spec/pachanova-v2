// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PachaNovaToken.sol";
import "../src/DividendDistributor.sol";
import "../src/FideicomisoTrustAnchor.sol";

// Mocks simples para poder desplegar en testnet
contract MockIdentityRegistry is IIdentityRegistry {
    mapping(address => bool) public verified;
    function setVerified(address user, bool status) external { verified[user] = status; }
    function isVerified(address _userAddress) external view override returns (bool) { return verified[_userAddress]; }
}

contract MockCompliance is ICompliance {
    function canTransfer(address, address, uint256) external pure override returns (bool) { return true; }
}

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mocks & Base Contracts
        MockIdentityRegistry identity = new MockIdentityRegistry();
        MockCompliance compliance = new MockCompliance();
        MockERC20 usdc = new MockERC20();
        
        address[] memory signers = new address[](1);
        signers[0] = vm.addr(deployerPrivateKey);
        FideicomisoTrustAnchor trustAnchor = new FideicomisoTrustAnchor(signers);

        // 2. Deploy Token
        PachaNovaToken pachaToken = new PachaNovaToken(
            address(identity),
            address(compliance),
            address(trustAnchor)
        );

        // 3. Deploy Dividend Distributor
        DividendDistributor distributor = new DividendDistributor(
            address(pachaToken),
            address(usdc)
        );

        vm.stopBroadcast();

        // Logging
        console.log("PachaNovaToken deployed to:", address(pachaToken));
        console.log("DividendDistributor deployed to:", address(distributor));
        console.log("Mock USDC deployed to:", address(usdc));
    }
}
