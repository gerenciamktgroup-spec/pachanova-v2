// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./FideicomisoTrustAnchor.sol";

// Interfaces base de ERC-3643 (T-Rex)
interface IIdentityRegistry {
    function isVerified(address _userAddress) external view returns (bool);
}

interface ICompliance {
    function canTransfer(address _from, address _to, uint256 _amount) external view returns (bool);
}

/**
 * @title PachaNovaToken (PACHA)
 * @dev Implementación de token ERC-3643 T-Rex compatible.
 * Total supply: 500.000 PACHA (50.000 m2 / 0.1 m2 por token).
 */
contract PachaNovaToken is ERC20, Ownable {
    uint8 private constant _DECIMALS = 0; // 1 token = exactamente 0.1 m2 (indivisible o con decimales estándar si se requiere)
    uint256 public constant TOTAL_SUPPLY_CAP = 500_000 * (10 ** 0); // Ajustar si se requieren 18 decimales
    
    IIdentityRegistry public identityRegistry;
    ICompliance public complianceRegistry;
    FideicomisoTrustAnchor public trustAnchor;

    bool public isIssuanceReady = false;

    event IssuanceReady(bytes32 sunarpHash);

    constructor(
        address _identityRegistry,
        address _complianceRegistry,
        address _trustAnchor
    ) ERC20("PachaNova Real Estate Token", "PACHA") Ownable(msg.sender) {
        identityRegistry = IIdentityRegistry(_identityRegistry);
        complianceRegistry = ICompliance(_complianceRegistry);
        trustAnchor = FideicomisoTrustAnchor(_trustAnchor);
    }

    /**
     * @dev Verifica el estado del FideicomisoTrustAnchor para permitir emisión
     */
    function setIssuanceReady(bytes32 sunarpHash) external onlyOwner {
        (,,,, bool executed) = trustAnchor.documentConfirmations(sunarpHash);
        require(executed, "El respaldo SUNARP no ha sido confirmado por la multi-firma");
        
        isIssuanceReady = true;
        emit IssuanceReady(sunarpHash);
    }

    /**
     * @dev Mint de tokens institucionales. Requiere KYC y cumplimiento.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(isIssuanceReady, "La emision no esta autorizada por el Fideicomiso");
        require(totalSupply() + amount <= TOTAL_SUPPLY_CAP, "Cap superado");
        require(identityRegistry.isVerified(to), "Usuario no KYC (ERC-3643)");
        
        _mint(to, amount);
    }

    /**
     * @dev Override de transfer para inyectar validaciones ERC-3643
     */
    function transfer(address to, uint256 value) public override returns (bool) {
        require(identityRegistry.isVerified(to), "Receptor sin KYC (IdentityRegistry)");
        require(identityRegistry.isVerified(msg.sender), "Emisor sin KYC (IdentityRegistry)");
        require(complianceRegistry.canTransfer(msg.sender, to, value), "Transferencia rechazada por Compliance");
        
        return super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        require(identityRegistry.isVerified(to), "Receptor sin KYC");
        require(identityRegistry.isVerified(from), "Emisor sin KYC");
        require(complianceRegistry.canTransfer(from, to, value), "Transferencia rechazada por Compliance");
        
        return super.transferFrom(from, to, value);
    }

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }
}
