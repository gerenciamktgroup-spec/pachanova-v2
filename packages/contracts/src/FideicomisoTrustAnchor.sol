// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title FideicomisoTrustAnchor
 * @dev Single Source of Truth para el respaldo en el mundo real (Partida SUNARP PROV-2025-08-11742).
 * Utiliza un sistema Multi-sig 2 de 3 para confirmar el respaldo patrimonial de PachaNova.
 */
contract FideicomisoTrustAnchor is AccessControl, Pausable {
    bytes32 public constant FIDUCIARIO_SBS_ROLE = keccak256("FIDUCIARIO_SBS_ROLE");
    bytes32 public constant ADMIN_PACHANOVA_ROLE = keccak256("ADMIN_PACHANOVA_ROLE");
    bytes32 public constant COMITE_ROLE = keccak256("COMITE_ROLE");

    uint256 public constant REQUIRED_SIGNATURES = 2;

    struct ConfirmationState {
        bool fiduciarioSigned;
        bool adminSigned;
        bool comiteSigned;
        uint8 signatureCount;
        bool executed;
    }

    // Mapping from a unique hash (e.g., SUNARP hash document) to its confirmation state
    mapping(bytes32 => ConfirmationState) public documentConfirmations;

    event RespaldoConfirmado(bytes32 indexed sunarpHash, uint256 timestamp);
    event RespaldoFirmaAgregada(bytes32 indexed sunarpHash, address signer, bytes32 role);

    constructor(address fiduciario, address admin, address comite) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
        _grantRole(FIDUCIARIO_SBS_ROLE, fiduciario);
        _grantRole(ADMIN_PACHANOVA_ROLE, admin);
        _grantRole(COMITE_ROLE, comite);
    }

    /**
     * @dev Función para firmar la confirmación de un respaldo (Multi-sig).
     * @param sunarpHash Hash del documento oficial de SUNARP.
     */
    function confirmarRespaldo(bytes32 sunarpHash) external whenNotPaused {
        require(!documentConfirmations[sunarpHash].executed, "El respaldo ya fue ejecutado");
        
        bool hasFiduciario = hasRole(FIDUCIARIO_SBS_ROLE, msg.sender);
        bool hasAdmin = hasRole(ADMIN_PACHANOVA_ROLE, msg.sender);
        bool hasComite = hasRole(COMITE_ROLE, msg.sender);

        require(hasFiduciario || hasAdmin || hasComite, "No tienes un rol autorizado para firmar");

        ConfirmationState storage state = documentConfirmations[sunarpHash];

        if (hasFiduciario && !state.fiduciarioSigned) {
            state.fiduciarioSigned = true;
            state.signatureCount++;
            emit RespaldoFirmaAgregada(sunarpHash, msg.sender, FIDUCIARIO_SBS_ROLE);
        } else if (hasAdmin && !state.adminSigned) {
            state.adminSigned = true;
            state.signatureCount++;
            emit RespaldoFirmaAgregada(sunarpHash, msg.sender, ADMIN_PACHANOVA_ROLE);
        } else if (hasComite && !state.comiteSigned) {
            state.comiteSigned = true;
            state.signatureCount++;
            emit RespaldoFirmaAgregada(sunarpHash, msg.sender, COMITE_ROLE);
        } else {
            revert("Ya firmaste esta confirmacion o rol invalido");
        }

        // Si se alcanzan las firmas requeridas (2 de 3), se confirma el respaldo
        if (state.signatureCount >= REQUIRED_SIGNATURES) {
            state.executed = true;
            emit RespaldoConfirmado(sunarpHash, block.timestamp);
        }
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
