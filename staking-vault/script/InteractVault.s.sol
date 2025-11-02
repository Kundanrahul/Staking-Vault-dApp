// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/StakingVault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InteractVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Addresses
        address vaultAddr = address(0x6799a7e3BF1FAfdc7fA2fdd220f45A94c7df2295);
        address tokenAddr = address(0x1F5b4F9dB87945a000a86854658d87E4471A13CE);

        StakingVault vault = StakingVault(vaultAddr);
        IERC20 token = IERC20(tokenAddr);

        uint256 amount = 1000 ether;

        // Approve vault to spend tokens
        token.approve(vaultAddr, amount);
        console.log("Approved", amount, "tokens for vault");

        // Deposit tokens into vault
        vault.deposit(amount);
        console.log("Deposited", amount, "tokens into StakingVault");

        // Claim rewards
        vault.claimReward();
        console.log("Claimed rewards");

        // Withdraw tokens
        uint256 sharesToWithdraw = 500 ether;
        vault.withdraw(sharesToWithdraw);
        console.log("Withdrew", sharesToWithdraw, "shares");

        vm.stopBroadcast();
    }
}

