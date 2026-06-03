// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BridgedToken
 * @dev PACHA representation on the destination chain (e.g. Base or Arbitrum). Minted by the relayer/bridge.
 */
contract BridgedToken is ERC20, Ownable {
    address public bridge;

    event BridgeUpdated(address indexed oldBridge, address indexed newBridge);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {}

    modifier onlyBridge() {
        require(msg.sender == bridge, "Only bridge can mint/burn");
        _;
    }

    function setBridge(address _bridge) external onlyOwner {
        emit BridgeUpdated(bridge, _bridge);
        bridge = _bridge;
    }

    function mint(address to, uint256 amount) external onlyBridge {
        _mint(to, amount);
    }

    function burnFrom(address account, uint256 amount) external onlyBridge {
        _burn(account, amount);
    }
}
