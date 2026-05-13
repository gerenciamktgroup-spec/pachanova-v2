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

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    constructor(address _pachaToken, address _usdtToken, uint256 _biddingTime) Ownable(msg.sender) {
        pachaToken = IERC20(_pachaToken);
        usdtToken = IERC20(_usdtToken);
        auctionEndTime = block.timestamp + _biddingTime;
    }

    function bid(uint256 amount) external {
        require(block.timestamp <= auctionEndTime, "Subasta terminada");
        require(amount > highestBid, "La oferta debe ser mayor a la actual");

        // Reembolsar al postor anterior
        if (highestBid != 0) {
            usdtToken.transfer(highestBidder, highestBid);
        }

        // Bloquear nuevos fondos
        usdtToken.transferFrom(msg.sender, address(this), amount);

        highestBidder = msg.sender;
        highestBid = amount;

        emit HighestBidIncreased(msg.sender, amount);
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
