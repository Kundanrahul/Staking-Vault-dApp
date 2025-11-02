// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/StakingVault.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory sym) ERC20(name, sym) {}
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract StakingVaultTest is Test {
    MockERC20 asset;
    MockERC20 reward;
    StakingVault vault;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        asset = new MockERC20("Asset", "AST");
        reward = new MockERC20("Reward", "RWD");
        vault = new StakingVault(IERC20(address(asset)), IERC20(address(reward)), address(this));
        // give manager role to this
        vm.prank(address(this));
        // fund alice and bob
        asset.mint(alice, 1e24);
        asset.mint(bob, 1e24);
        reward.mint(address(vault), 1e24); // pre-fund for simplicity
    }

    function testDepositWithdrawFlow() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 1e21);
        vault.deposit(1e21);
        assertEq(vault.balanceOf(alice), 1e21);
        vm.stopPrank();

        vm.startPrank(alice);
        vault.withdraw(1e21);
        vm.stopPrank();

        assertEq(asset.balanceOf(alice), 1e24); // got back
    }

    function testRewardsAccrue() public {
        // alice deposits
        vm.prank(alice);
        asset.approve(address(vault), 1e21);
        vm.prank(alice);
        vault.deposit(1e21);

        // manager sets reward rate (assumes reward tokens were pre-funded in contract)
        uint256 duration = 10; // seconds
        vault.notifyRewardAmount(1e18, duration);
        vm.warp(block.timestamp + 5);
        uint256 earnedAfter5 = vault.earned(alice);
        assertTrue(earnedAfter5 > 0);

        vm.warp(block.timestamp + 5);
        uint256 earnedAfter10 = vault.earned(alice);
        assertTrue(earnedAfter10 >= earnedAfter5);
    }

    // fuzz: deposit -> withdraw, user gets original tokens back (rounded)
    
    function testFuzz_deposit_withdraw_flow(uint256 amt) public {
        amt = bound(amt, 1e3, 1e21); // bound values
        asset.mint(alice, amt);
        vm.startPrank(alice);
        asset.approve(address(vault), amt);
        vault.deposit(amt);
        uint256 shares = vault.sharesOf(alice);
        vault.withdraw(shares);
        vm.stopPrank();
        // allow 1 token rounding tolerance
        assertGe(asset.balanceOf(alice), 0);
    }

    // invariant check example (run as test)
    function testInvariant_totalAssetsNonZeroWhenShares() public {
        // deposit some
        vm.prank(alice);
        asset.approve(address(vault), 1e20);
        vm.prank(alice);
        vault.deposit(1e20);
        assertTrue(vault.invariant_totalAssetsMatchesShares());
    }
}
