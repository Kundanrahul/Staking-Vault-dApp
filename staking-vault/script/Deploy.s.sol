// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TestToken.sol";

contract DeployTestToken is Script {
    function run() external {
        // Load private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        TestToken token = new TestToken("StakeToken", "STK");

        vm.stopBroadcast();

        // Log the deployed address
        console2.log("TestToken deployed at:", address(token));
    }
}
