// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @dev Interfaz para consultar el Identity Registry (KYC Compliance)
 */
interface IIdentityRegistry {
    function isVerified(address _wallet) external view returns (bool);
}

/**
 * @dev Interfaz básica de ERC20 para interactuar con la stablecoin (USDC)
 */
interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title PachaNovaLandTrust
 * @dev Smart Contract para la tokenización de 50 Hectáreas en Paracas bajo la Fase 2.
 * Integra validación KYC on-chain (ERC-3643 style) y lógica de liquidación fiduciaria (Pull Pattern).
 */
contract PachaNovaLandTrust is ERC20, Ownable, Pausable {
    IIdentityRegistry public identityRegistry;
    IERC20 public usdcToken;
    address public treasuryWallet;

    bool public isLiquidated;
    uint256 public investorPool;
    uint256 public totalTokensAtLiquidation;

    mapping(address => bool) public hasClaimed;

    event TrustLiquidated(uint256 totalFiat, uint256 successFee, uint256 investorPool);
    event LiquidationClaimed(address indexed investor, uint256 usdcAmount, uint256 tokensBurned);

    constructor(
        address _identityRegistry,
        address _usdcToken,
        address _treasuryWallet,
        address _initialOwner
    ) 
        ERC20("Rutas del Sol - Paracas 50HA", "RSP") 
        Ownable(_initialOwner) 
    {
        require(_identityRegistry != address(0), "Invalid registry address");
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_treasuryWallet != address(0), "Invalid treasury address");
        
        identityRegistry = IIdentityRegistry(_identityRegistry);
        usdcToken = IERC20(_usdcToken);
        treasuryWallet = _treasuryWallet;
    }

    /**
     * @dev Sobrescribe _update (OpenZeppelin 5.x) para aplicar el control KYC (Compliance).
     * Recrea las barreras de protección de ERC-3643 a nivel de contrato.
     */
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        // Exigir KYC para el receptor de los tokens (excepto si se están quemando, address(0))
        if (to != address(0)) {
            require(identityRegistry.isVerified(to), "Compliance: Receiver wallet lacks valid KYC");
        }
        
        // Bloquear mercado secundario post-liquidación
        if (isLiquidated) {
            require(to == address(0), "Trust is liquidated, transfers disabled");
        }

        super._update(from, to, value);
    }

    /**
     * @dev Función exclusiva del propietario (PachaNova Fiduciario) para liquidar el Land Banking a 5 años.
     * Retiene un 15% de Success Fee y habilita a los inversores a reclamar su parte (Pull Pattern).
     * @param _totalFiatEnUSDC El monto total obtenido de la venta del terreno.
     * PRE-REQUISITO: PachaNova ya debió depositar `_totalFiatEnUSDC` en USDC a la address de este contrato.
     */
    function liquidateTrust(uint256 _totalFiatEnUSDC) external onlyOwner {
        require(!isLiquidated, "Trust already liquidated");
        require(_totalFiatEnUSDC > 0, "Amount must be greater than zero");
        
        uint256 currentBalance = usdcToken.balanceOf(address(this));
        require(currentBalance >= _totalFiatEnUSDC, "Insufficient USDC balance in contract");

        isLiquidated = true;
        totalTokensAtLiquidation = totalSupply();

        // Cálculo de liquidación (Success Fee 15%)
        uint256 successFee = (_totalFiatEnUSDC * 15) / 100;
        investorPool = _totalFiatEnUSDC - successFee;

        // Transferir el Success Fee a la Tesorería de PachaNova
        require(usdcToken.transfer(treasuryWallet, successFee), "USDC transfer to treasury failed");

        emit TrustLiquidated(_totalFiatEnUSDC, successFee, investorPool);
    }

    /**
     * @dev Patrón Pull: Inversores retiran sus fondos asíncronamente para evitar ataques Out-of-Gas en el backend.
     */
    function claimLiquidation() external {
        require(isLiquidated, "Trust is not liquidated yet");
        require(!hasClaimed[msg.sender], "Already claimed");
        
        uint256 userBalance = balanceOf(msg.sender);
        require(userBalance > 0, "No RWA tokens to claim");

        hasClaimed[msg.sender] = true;

        // Calcular la porción prorrateada del pool de inversores
        uint256 usdcShare = (userBalance * investorPool) / totalTokensAtLiquidation;

        // Quemar los tokens del inversor (destrucción de derechos fiduciarios liquidados)
        _burn(msg.sender, userBalance);

        // Transferir la liquidez al inversor
        require(usdcToken.transfer(msg.sender, usdcShare), "USDC claim transfer failed");

        emit LiquidationClaimed(msg.sender, usdcShare, userBalance);
    }

    // Funciones administrativas
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(!isLiquidated, "Cannot mint after liquidation");
        _mint(to, amount);
    }
}
