// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error ZeroAmount();
error InsufficientBalance();
error Unauthorized();
error AlreadyInitialized();

contract StakingVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    IERC20 public immutable asset;        // token being staked
    IERC20 public immutable rewardToken;  // token used for rewards (can be same as asset)

    uint256 public totalShares; // total vault shares
    mapping(address => uint256) public sharesOf;

    // reward accounting
    
    uint256 public rewardPerShareStored; // (scaled by 1e18)
    mapping(address => uint256) public rewardPerSharePaid;
    mapping(address => uint256) public rewards;

    uint256 public rewardRate; // reward tokens per second
    uint256 public lastUpdateTime;
    uint256 public totalAssets; // cached total assets deposited (in asset units)

    uint256 private constant PRECISION = 1e18;

    event Deposited(address indexed who, uint256 amount, uint256 shares);
    event Withdrawn(address indexed who, uint256 amount, uint256 shares);
    event RewardAdded(uint256 amount, uint256 rewardRate);
    event RewardPaid(address indexed who, uint256 reward);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);

    constructor(IERC20 _asset, IERC20 _rewardToken, address manager) {
        asset = _asset;
        rewardToken = _rewardToken;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, manager);

        lastUpdateTime = block.timestamp;
    }

    modifier updateReward(address account) {
        _updateRewardPerShare();
        if (account != address(0)) {
            rewards[account] = earned(account);
            rewardPerSharePaid[account] = rewardPerShareStored;
        }
        _;
    }

    // View helpers

    function balanceOf(address account) public view returns (uint256) {
        if (totalShares == 0) return 0;
        return (sharesOf[account] * totalAssets) / totalShares;
    }

    function earned(address account) public view returns (uint256) {
        uint256 _rewardPerShare = rewardPerShareStored;
        if (block.timestamp > lastUpdateTime && totalShares > 0) {
            uint256 duration = block.timestamp - lastUpdateTime;
            uint256 add = (rewardRate * duration * PRECISION) / totalShares;
            _rewardPerShare += add;
        }
        return (sharesOf[account] * (_rewardPerShare - rewardPerSharePaid[account])) / PRECISION + rewards[account];
    }

    // Mutative functions

    function deposit(uint256 amount) external nonReentrant updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();

        asset.safeTransferFrom(msg.sender, address(this), amount);

        uint256 shares;
        if (totalShares == 0 || totalAssets == 0) {
            shares = amount;
        } else {
            shares = (amount * totalShares) / totalAssets;
            if (shares == 0) shares = 1;
        }

        sharesOf[msg.sender] += shares;
        totalShares += shares;
        totalAssets += amount;

        emit Deposited(msg.sender, amount, shares);
    }

    function withdraw(uint256 shares) external nonReentrant updateReward(msg.sender) {
        if (shares == 0) revert ZeroAmount();
        uint256 userShares = sharesOf[msg.sender];
        if (shares > userShares) revert InsufficientBalance();

        uint256 amount = (shares * totalAssets) / totalShares;
        sharesOf[msg.sender] = userShares - shares;
        totalShares -= shares;
        totalAssets -= amount;

        asset.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount, shares);
    }

    function claimReward() external nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward == 0) revert ZeroAmount();

        rewards[msg.sender] = 0;
        rewardToken.safeTransfer(msg.sender, reward);
        emit RewardPaid(msg.sender, reward);
    }

    /*Rewards admin*/

    function notifyRewardAmount(uint256 reward, uint256 duration)
        external
        onlyRole(MANAGER_ROLE)
        updateReward(address(0))
    {
        if (duration == 0) revert ZeroAmount();

        uint256 oldRate = rewardRate;
        rewardRate = reward / duration;
        lastUpdateTime = block.timestamp;

        emit RewardAdded(reward, rewardRate);
        emit RewardRateUpdated(oldRate, rewardRate);
    }

    /*Internal */

    function _updateRewardPerShare() internal {
        if (totalShares == 0) {
            lastUpdateTime = block.timestamp;
            return;
        }
        uint256 duration = block.timestamp - lastUpdateTime;
        if (duration == 0) return;

        uint256 add = (rewardRate * duration * PRECISION) / totalShares;
        rewardPerShareStored += add;
        lastUpdateTime = block.timestamp;
    }

    /* Admin */

    function rescueRewardTokens(address to, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        rewardToken.safeTransfer(to, amount);
    }

    //invariant tests
    function invariant_totalAssetsMatchesShares() external view returns (bool) {
        return (totalShares == 0) || (totalAssets > 0);
    }
}
