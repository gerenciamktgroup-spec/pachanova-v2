// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PachaNovaAuction
 * @dev Contrato para gestionar la subasta de liquidación o desinversión en el año 5.
 */
contract PachaNovaAuction is Ownable {
    IERC20 public pachaToken;
    IERC20 public usdtToken;

    uint256 public auctionEndTime;
    address public highestBidder;
    uint256 public highestBid;

    bool public auctionEnded;

    mapping(address => uint256) public pendingReturns;

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    event RefundWithdrawn(address indexed bidder, uint256 amount);

    constructor(address _pachaToken, address _usdtToken, uint256 _biddingTime) Ownable(msg.sender) {
        pachaToken = IERC20(_pachaToken);
        usdtToken = IERC20(_usdtToken);
        auctionEndTime = block.timestamp + _biddingTime;
    }

    function bid(uint256 amount) external {
        require(block.timestamp <= auctionEndTime, "Subasta terminada");
        require(amount > highestBid, "La oferta debe ser mayor a la actual");

        // Registrar el reembolso del postor anterior en la lista de retiros
        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }

        // Bloquear nuevos fondos
        usdtToken.transferFrom(msg.sender, address(this), amount);

        highestBidder = msg.sender;
        highestBid = amount;

        emit HighestBidIncreased(msg.sender, amount);
    }

    /**
     * @dev Permite a los ofertantes retirar de forma segura sus fondos reembolsados.
     * Implementa protección contra reentrada modificando el balance antes de transferir.
     */
    function withdraw() external returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;

            if (!usdtToken.transfer(msg.sender, amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
            emit RefundWithdrawn(msg.sender, amount);
        }
        return true;
    }

    function endAuction() external onlyOwner {
        require(block.timestamp > auctionEndTime, "La subasta aun no termina");
        require(!auctionEnded, "La funcion ya fue llamada");

        auctionEnded = true;
        emit AuctionEnded(highestBidder, highestBid);

        // Lógica de transferencia de activos (Tokens PACHA o liquidación de Fideicomiso)
        // a ser desarrollada según reglas del fideicomiso.
    }
}
