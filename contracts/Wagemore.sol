// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title Wagemore
 * @dev Optimized for Backend Tracking (Supabase).
 * - Stores minimal state on-chain to save gas.
 * - Emits rich Events for the backend to index.
 * - Supports Binary (Yes/No) and Multiple Choice markets.
 */
contract Wagemore is Ownable, ReentrancyGuard, Pausable {
    // =====================================
    // CONFIGURATION
    // =====================================

    enum MarketType {
        Binary, // 0: Two Options (Yes/No)
        Multiple // 1: Many Options (A/B/C/D...)
    }

    // =====================================
    // EVENTS (The Data Feed)
    // =====================================

    event MarketCreated(
        uint64 indexed marketId,
        address indexed creator,
        string title, // Captured by Backend
        string imageUrl, // Captured by Backend
        string[] options, // Captured by Backend
        uint8 optionCount,
        MarketType marketType,
        uint64 endTime,
        uint64 timestamp
    );

    // Backend Action: INSERT INTO bets (...)
    event SharesPurchased(
        uint64 indexed marketId,
        address indexed buyer,
        uint8 optionIndex,
        uint64 amount,
        uint64 timestamp
    );

    // Backend Action: UPDATE markets SET status='Resolved', winner=...
    event MarketResolved(
        uint64 indexed marketId,
        uint8 winningOption,
        uint64 timestamp
    );

    // Backend Action: UPDATE bets SET claimed=true, payout=...
    event WinningsClaimed(
        uint64 indexed marketId,
        address indexed claimer,
        uint64 amount,
        uint64 timestamp
    );

    event PlatformFeesWithdrawn(address owner, uint64 amount);
    event CreationFeeUpdated(uint64 newFee);
    event PlatformFeeUpdated(uint64 newBps);

    // =====================================
    // STATE STORAGE
    // =====================================

    struct Market {
        uint64 id;
        uint64 endTime;
        uint64 totalPool;
        uint64[] totalSharesPerOption; // Tracks total liquidity per outcome
        bool resolved;
        uint8 winningOption;
        uint8 optionCount;
        MarketType marketType;
    }

    uint64 public nextMarketId = 1;
    uint64 public platformFeeBps = 1000; // 10.00% (Basis Points: 100 = 1%)
    uint64 public creationFee = 0.001 ether; // Anti-spam fee
    uint64 public accumulatedFees;

    // Core Market Data
    mapping(uint64 => Market) public markets;

    // User Balances: MarketID => OptionIndex => UserAddress => AmountWei
    mapping(uint64 => mapping(uint8 => mapping(address => uint256)))
        public bets;

    // =====================================
    // CONSTRUCTOR
    // =====================================
    constructor() Ownable(msg.sender) {}

    // =====================================
    // MAIN FUNCTIONS
    // =====================================

    /**
     * @dev Creates a new market.
     * @param title The question (e.g., "Will BTC hit 100k?"). Sent to Event only.
     * @param imageUrl URL for the cover image. Sent to Event only.
     * @param optionLabels List of outcomes. Sent to Event only.
     * @param endTime Unix timestamp when betting closes.
     * @param _marketType 0 for Binary, 1 for Multiple.
     */
    function createMarket(
        string calldata title,
        string calldata imageUrl,
        string[] calldata optionLabels,
        uint64 endTime,
        MarketType _marketType
    ) external payable whenNotPaused returns (uint64) {
        require(endTime > block.timestamp, "End time must be in future");
        require(bytes(title).length > 0, "Title required");

        // Validate Options based on Type
        if (_marketType == MarketType.Binary) {
            require(optionLabels.length == 2, "Binary must have 2 options");
        } else {
            require(optionLabels.length >= 2, "Multiple needs 2+ options");
            require(optionLabels.length <= 20, "Max 20 options");
        }

        // Handle Creation Fee
        if (msg.sender != owner()) {
            require(msg.value == creationFee, "Incorrect creation fee");
            accumulatedFees += uint64(msg.value);
        }

        uint64 marketId = nextMarketId++;
        uint8 count = uint8(optionLabels.length);

        // Store minimal data on-chain
        markets[marketId] = Market({
            id: marketId,
            endTime: endTime,
            totalPool: 0,
            totalSharesPerOption: new uint64[](count),
            resolved: false,
            winningOption: 0,
            optionCount: count,
            marketType: _marketType
        });

        // Emit rich data for the Backend
        emit MarketCreated(
            marketId,
            msg.sender,
            title,
            imageUrl,
            optionLabels,
            count,
            _marketType,
            endTime,
            uint64(block.timestamp)
        );

        return marketId;
    }

    /**
     * @dev Users buy shares (bet) on a specific outcome.
     */
    function purchaseShares(
        uint64 marketId,
        uint8 optionIndex
    ) external payable whenNotPaused {
        require(msg.value > 0, "Bet amount must be > 0");
        Market storage market = markets[marketId];

        require(market.id != 0, "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(block.timestamp < market.endTime, "Betting phase ended");
        require(optionIndex < market.optionCount, "Invalid option index");

        // Update Global Market State
        market.totalPool += uint64(msg.value);
        market.totalSharesPerOption[optionIndex] += uint64(msg.value);

        // Update User Ledger
        bets[marketId][optionIndex][msg.sender] += msg.value;

        emit SharesPurchased(
            marketId,
            msg.sender,
            optionIndex,
            uint64(msg.value),
            uint64(block.timestamp)
        );
    }

    /**
     * @dev Winners claim their ETH share + principal.
     */
    function claimWinnings(uint64 marketId) external nonReentrant {
        Market storage market = markets[marketId];
        require(market.resolved, "Market not resolved yet");

        uint8 winner = market.winningOption;
        uint256 userStake = bets[marketId][winner][msg.sender];

        require(userStake > 0, "No winning bets to claim");

        // CHECK-EFFECTS-INTERACTIONS Pattern

        // 1. Zero out balance (prevent reentrancy)
        bets[marketId][winner][msg.sender] = 0;

        // 2. Calculate Payout
        uint64 totalWinnerStakes = market.totalSharesPerOption[winner];
        uint64 marketPool = market.totalPool;

        // Safety check to prevent division by zero (though logically impossible if userStake > 0)
        require(totalWinnerStakes > 0, "Critical logic error");

        // Calculate Fee
        uint64 totalFee = (marketPool * platformFeeBps) / 10000;
        uint64 distributablePool = marketPool - totalFee;

        // Payout Ratio = UserStake / TotalWinnerStakes
        uint256 payout = (userStake * distributablePool) / totalWinnerStakes;

        // Track the fee portion for this specific claim
        uint256 feeShare = (userStake * totalFee) / totalWinnerStakes;
        accumulatedFees += uint64(feeShare);

        // 3. Transfer ETH
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "ETH transfer failed");

        emit WinningsClaimed(
            marketId,
            msg.sender,
            uint64(payout),
            uint64(block.timestamp)
        );
    }

    // =====================================
    // ADMIN / RESOLUTION
    // =====================================

    /**
     * @dev Resolves the market.
     * In a production app, this might be connected to an Oracle (Chainlink).
     * For this version, it is the Admin/Owner.
     */
    function resolveMarket(
        uint64 marketId,
        uint8 winningOption
    ) external onlyOwner {
        Market storage market = markets[marketId];
        require(market.id != 0, "Invalid market");
        require(!market.resolved, "Already resolved");
        require(winningOption < market.optionCount, "Invalid winning option");

        market.resolved = true;
        market.winningOption = winningOption;

        emit MarketResolved(marketId, winningOption, uint64(block.timestamp));
    }

    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = accumulatedFees;
        require(amount > 0, "No fees to withdraw");

        accumulatedFees = 0;

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Transfer failed");

        emit PlatformFeesWithdrawn(owner(), uint64(amount));
    }

    function setCreationFee(uint64 newFee) external onlyOwner {
        creationFee = newFee;
        emit CreationFeeUpdated(newFee);
    }

    function setPlatformFee(uint64 newBps) external onlyOwner {
        require(newBps <= 2000, "Fee cannot exceed 20%");
        platformFeeBps = newBps;
        emit PlatformFeeUpdated(newBps);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // =====================================
    // VIEW FUNCTIONS
    // =====================================

    /**
     * @dev Returns essential on-chain state for a market.
     * Note: Titles and Option Names are fetched from Backend/Events, not here.
     */
    function getMarketState(
        uint64 marketId
    )
        external
        view
        returns (
            uint64 endTime,
            uint64 totalPool,
            bool resolved,
            uint8 winningOption,
            uint8 optionCount,
            MarketType marketType
        )
    {
        Market storage m = markets[marketId];
        return (
            m.endTime,
            m.totalPool,
            m.resolved,
            m.winningOption,
            m.optionCount,
            m.marketType
        );
    }

    function getUserBet(
        uint64 marketId,
        uint8 optionIndex,
        address user
    ) external view returns (uint256) {
        return bets[marketId][optionIndex][user];
    }
}
