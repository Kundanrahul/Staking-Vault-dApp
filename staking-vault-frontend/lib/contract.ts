// lib/contract.ts
import { createPublicClient, http, getContract } from "viem";
import { sepolia } from "viem/chains";
import vaultABI from "./vaultABI.json";
import tokenABI from "./tokenABI.json";

export const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`;
export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;

//public client connected to Sepolia
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

//get Vault contract
export const getVaultContract = () =>
  getContract({
    address: VAULT_ADDRESS,
    abi: vaultABI,
    client: publicClient,
  });

// Helper: get Token contract
export const getTokenContract = () =>
  getContract({
    address: TOKEN_ADDRESS,
    abi: tokenABI,
    client: publicClient,
  });
