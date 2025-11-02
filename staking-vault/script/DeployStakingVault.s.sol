// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/StakingVault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployStakingVault is Script {
    function run() external {
        // Load deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Begin broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // ⚙️ Step 1: Set addresses (replace these with actual Sepolia test tokens)
        IERC20 asset = IERC20(0x1F5b4F9dB87945a000a86854658d87E4471A13CE); // staking token
        IERC20 rewardToken = IERC20(0x1F5b4F9dB87945a000a86854658d87E4471A13CE); // reward token
        address manager = address(0xbEDDB491255cc57e07Ae15acc1CAEAc1df1F0E39);

        // ⚙️ Step 2: Deploy the contract
        StakingVault vault = new StakingVault(asset, rewardToken, manager);

        vm.stopBroadcast();

        // 🧾 Log output
        console.log( "StakingVault deployed at:", address(vault));
    }
}
