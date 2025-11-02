# 🪙 Staking Vault dApp

A **staking platform** built with **Next.js, Solidity, Foundry, and Viem**, allowing users to **stake ERC20 tokens**, **earn time-based rewards**, and **claim/withdraw** seamlessly.

> Deployed on **Sepolia Testnet** — designed with **gas efficiency**, **security**, and **beautiful UX** in mind.

---

## Tech Stack

| Layer | Tools / Frameworks | Description |
|-------|--------------------|--------------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS |
| **Smart Contracts** | Solidity, Foundry (Forge, Cast, Anvil) | Core staking logic, reward mechanism |
| **Web3 Integration** | Viem, WalletConnect v2 | On-chain reads/writes, wallet connection |
| **Testing** | Foundry (`forge test`) | Unit and integration testing |
| **Security** | Slither | Static analysis and vulnerability checks |
| **Deployment** | Sepolia Testnet, Vercel (Frontend) | Publicly accessible demo |

---

## Features

### Smart Contract (StakingVault.sol)
- Stake and withdraw ERC20 tokens securely  
- Automatic reward accrual based on staking duration  
- Claim accumulated rewards anytime  
- Admin-controlled reward parameters  
- Gas-optimized using:
  - `unchecked` arithmetic where safe  
  - `immutable` variables for constants  
  - `events` for minimal on-chain logging  
  - compact storage layout for efficiency  

**Security Analysis:**  
- Performed **static analysis using Slither**  
- Checked for **reentrancy**, **integer overflow**, **uninitialized state**, and **unused return values**  
- Confirmed **no critical issues** in final contract version  

---

### Frontend (Next.js + Viem)
- Wallet connection via **WalletConnect v2**  
- **Stake / Withdraw / Claim Rewards** directly through contract functions  
- Real-time **on-chain data fetching** using Viem

---
#screenshots of foundry and slither testing




