// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Interfaces for ERC-3643 compliance checking
interface IIdentityRegistry {
    function isVerified(address _userAddress) external view returns (bool);
}

/**
 * @title P2PEscrow
 * @dev Secure escrow contract for trustless peer-to-peer trades of PACHA tokens using Stablecoins.
 */
contract P2PEscrow is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable pachaToken;
    IERC20 public immutable stablecoin;
    IIdentityRegistry public immutable identityRegistry;

    enum EscrowState { Open, Funded, Completed, Disputed, Canceled }

    struct Trade {
        address seller;
        address buyer;
        uint256 tokenAmount;
        uint256 stablecoinAmount;
        EscrowState state;
    }

    mapping(uint256 => Trade) public trades;
    uint256 public nextTradeId;

    event TradeCreated(uint256 indexed tradeId, address indexed seller, uint256 tokenAmount, uint256 stablecoinAmount);
    event TradeFunded(uint256 indexed tradeId, address indexed buyer);
    event TradeCompleted(uint256 indexed tradeId);
    event TradeDisputed(uint256 indexed tradeId);
    event TradeResolved(uint256 indexed tradeId, EscrowState finalState);
    event TradeCanceled(uint256 indexed tradeId);

    constructor(address _pachaToken, address _stablecoin, address _identityRegistry) Ownable(msg.sender) {
        pachaToken = IERC20(_pachaToken);
        stablecoin = IERC20(_stablecoin);
        identityRegistry = IIdentityRegistry(_identityRegistry);
    }

    /**
     * @dev Seller deposits PACHA tokens and defines the stablecoin price.
     */
    function createTrade(uint256 _tokenAmount, uint256 _stablecoinAmount) external nonReentrant returns (uint256) {
        require(_tokenAmount > 0, "Invalid token amount");
        require(_stablecoinAmount > 0, "Invalid stablecoin amount");

        uint256 tradeId = nextTradeId++;
        
        trades[tradeId] = Trade({
            seller: msg.sender,
            buyer: address(0),
            tokenAmount: _tokenAmount,
            stablecoinAmount: _stablecoinAmount,
            state: EscrowState.Open
        });

        pachaToken.safeTransferFrom(msg.sender, address(this), _tokenAmount);

        emit TradeCreated(tradeId, msg.sender, _tokenAmount, _stablecoinAmount);
        return tradeId;
    }

    /**
     * @dev Buyer deposits stablecoins into the escrow, locking the trade.
     */
    function fundTrade(uint256 _tradeId) external nonReentrant {
        Trade storage trade = trades[_tradeId];
        require(trade.state == EscrowState.Open, "Trade not open");
        
        // Compliance check: Buyer must be verified
        require(identityRegistry.isVerified(msg.sender), "Buyer is not KYC verified");

        trade.buyer = msg.sender;
        trade.state = EscrowState.Funded;

        stablecoin.safeTransferFrom(msg.sender, address(this), trade.stablecoinAmount);

        emit TradeFunded(_tradeId, msg.sender);
    }

    /**
     * @dev Seller or Buyer confirms the trade, swapping the assets.
     */
    function completeTrade(uint256 _tradeId) external nonReentrant {
        Trade storage trade = trades[_tradeId];
        require(trade.state == EscrowState.Funded, "Trade not funded");
        require(msg.sender == trade.seller || msg.sender == trade.buyer, "Unauthorized");

        trade.state = EscrowState.Completed;

        // Swap
        pachaToken.safeTransfer(trade.buyer, trade.tokenAmount);
        stablecoin.safeTransfer(trade.seller, trade.stablecoinAmount);

        emit TradeCompleted(_tradeId);
    }

    /**
     * @dev Either party can dispute the trade if something goes wrong.
     */
    function disputeTrade(uint256 _tradeId) external {
        Trade storage trade = trades[_tradeId];
        require(trade.state == EscrowState.Funded, "Trade not funded");
        require(msg.sender == trade.seller || msg.sender == trade.buyer, "Unauthorized");

        trade.state = EscrowState.Disputed;

        emit TradeDisputed(_tradeId);
    }

    /**
     * @dev Admin resolves a disputed trade (refunds assets to original owners).
     */
    function resolveDispute(uint256 _tradeId, bool refundToOriginal) external onlyOwner nonReentrant {
        Trade storage trade = trades[_tradeId];
        require(trade.state == EscrowState.Disputed, "Trade not disputed");

        if (refundToOriginal) {
            trade.state = EscrowState.Canceled;
            pachaToken.safeTransfer(trade.seller, trade.tokenAmount);
            stablecoin.safeTransfer(trade.buyer, trade.stablecoinAmount);
        } else {
            trade.state = EscrowState.Completed;
            pachaToken.safeTransfer(trade.buyer, trade.tokenAmount);
            stablecoin.safeTransfer(trade.seller, trade.stablecoinAmount);
        }

        emit TradeResolved(_tradeId, trade.state);
    }

    /**
     * @dev Seller can cancel an open trade and withdraw their PACHA tokens.
     */
    function cancelTrade(uint256 _tradeId) external nonReentrant {
        Trade storage trade = trades[_tradeId];
        require(trade.state == EscrowState.Open, "Trade not open");
        require(msg.sender == trade.seller, "Only seller can cancel");

        trade.state = EscrowState.Canceled;

        pachaToken.safeTransfer(trade.seller, trade.tokenAmount);

        emit TradeCanceled(_tradeId);
    }
}
