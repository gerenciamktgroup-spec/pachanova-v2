// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FideicomisoTrustAnchor.sol";
import "../src/PachaNovaToken.sol";

contract MockIdentityRegistry is IIdentityRegistry {
    function isVerified(address) external pure returns (bool) {
        return true;
    }
}

contract MockCompliance is ICompliance {
    function canTransfer(address, address, uint256) external pure returns (bool) {
        return true;
    }
}

contract FideicomisoTest is Test {
    FideicomisoTrustAnchor public anchor;
    PachaNovaToken public token;

    address fiduciario = address(0x1);
    address admin = address(0x2);
    address comite = address(0x3);

    bytes32 sunarpHash = keccak256("PROV-2025-08-11742");

    function setUp() public {
        anchor = new FideicomisoTrustAnchor(fiduciario, admin, comite);
        
        MockIdentityRegistry idReg = new MockIdentityRegistry();
        MockCompliance comp = new MockCompliance();

        token = new PachaNovaToken(address(idReg), address(comp), address(anchor));
    }

    function testMultiSigConfirmation() public {
        // Firma 1: Fiduciario
        vm.prank(fiduciario);
        anchor.confirmarRespaldo(sunarpHash);

        (, , , uint8 sigs1, bool executed1) = anchor.documentConfirmations(sunarpHash);
        assertEq(sigs1, 1);
        assertFalse(executed1);

        // Firma 2: Admin
        vm.prank(admin);
        anchor.confirmarRespaldo(sunarpHash);

        (, , , uint8 sigs2, bool executed2) = anchor.documentConfirmations(sunarpHash);
        assertEq(sigs2, 2);
        assertTrue(executed2); // 2 de 3 firmas = ejecutado
    }

    function testIssuanceRequiresTrustAnchor() public {
        // Fallar emision sin firmas
        vm.expectRevert("El respaldo SUNARP no ha sido confirmado por la multi-firma");
        token.setIssuanceReady(sunarpHash);

        // Obtener firmas
        vm.prank(fiduciario);
        anchor.confirmarRespaldo(sunarpHash);
        vm.prank(comite);
        anchor.confirmarRespaldo(sunarpHash);

        // Habilitar emision con exito
        token.setIssuanceReady(sunarpHash);
        assertTrue(token.isIssuanceReady());

        // Mint token
        token.mint(address(0x4), 100);
        assertEq(token.balanceOf(address(0x4)), 100);
    }
}
