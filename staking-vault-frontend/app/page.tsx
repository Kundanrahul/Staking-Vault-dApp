"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import StakeForm from "@/components/StakeForm";
import WithdrawForm from "@/components/WithdrawForm";
import RewardCard from "@/components/RewardCard";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10 bg-linear-to-br from-[#0e0e1f] via-[#141428] to-[#1b1b33] text-white font-sans">
      
      {/* Header Section */}
      <header className="flex flex-col items-center gap-3 mb-10 text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
          STAKING VAULT DASHBOARD
        </h1>
        <p className="text-gray-400 max-w-lg text-sm">
          Securely stake your tokens, earn rewards, and withdraw anytime.
        </p>
        <div className="mt-4">
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </header>

      {/* Main Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl items-stretch">
        <div className="flex flex-col h-full backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-lg hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
          <StakeForm />
        </div>

        <div className="flex flex-col h-full backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-lg hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
          <RewardCard user={"0xYourWalletAddress"} />
        </div>

        <div className="flex flex-col h-full backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-lg hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
          <WithdrawForm />
        </div>
      </section>

      <footer className="mt-12 text-gray-500 text-sm text-center">
        <p>
          Built using Next.js, Wagmi, and RainbowKit — Powered by{" "}
          <span className="text-blue-400 font-semibold">Sepolia</span>
        </p>
        <p>
          Scripted and Tested with{" "}
          <span className="text-blue-300 font-semibold">Foundry</span>
        </p>
      </footer>
    </main>
  );
}





