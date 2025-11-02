"use client";

import { useState, useEffect } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import { getTokenContract, getVaultContract } from "@/lib/contract";

export default function StakeForm() {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const token = getTokenContract();
  const vault = getVaultContract();

  // Fetch user’s staked balance
  const {
    data: stakedBalance,
    refetch,
    isLoading,
    isFetching,
  } = useReadContract({
    address: vault?.address,
    abi: vault?.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  //Auto-refetch every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch?.();
    }, 15000);
    return () => clearInterval(interval);
  }, [refetch]);

  const formattedStaked =
    stakedBalance && typeof stakedBalance === "bigint"
      ? Number(formatEther(stakedBalance)).toFixed(4)
      : "0.0000";

  if (!token || !vault) {
    return (
      <div className="text-white text-center py-8">
        Loading contract details...
      </div>
    );
  }

  const handleStake = async () => {
    try {
      if (!amount || Number(amount) <= 0) {
        toast.warning("Please enter a valid amount.");
        return;
      }

      const parsed = parseEther(amount);

      toast.loading("Approving tokens...", { id: "stake-progress" });

      await writeContractAsync({
        address: token.address,
        abi: token.abi,
        functionName: "approve",
        args: [vault.address, parsed],
      });

      toast.loading("Staking tokens...", { id: "stake-progress" });

      await writeContractAsync({
        address: vault.address,
        abi: vault.abi,
        functionName: "deposit",
        args: [parsed],
      });

      setAmount("");
      await refetch?.();
      toast.success("Tokens staked successfully!", { id: "stake-progress" });
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed!", { id: "stake-progress" });
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-5 sm:p-6 lg:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-center w-full transition-all duration-300 hover:scale-[1.015] font-sans">
      <div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3 tracking-tight">
          Stake Tokens
        </h2>

        {/* ✅ Show staked balance */}
        <p className="text-sm text-gray-300 mb-4">
          You’ve staked:{" "}
          <span className="text-blue-400 font-semibold">
            {isLoading || isFetching ? "Loading..." : formattedStaked}
          </span>{" "}
          tokens
        </p>

        {/* Input Field */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2.5 sm:p-3 lg:p-3.5 rounded-xl text-white placeholder-gray-300 bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-sm sm:text-base font-medium"
        />
      </div>

      {/* Stake Button */}
      <button
        onClick={handleStake}
        disabled={isPending}
        className="mt-5 w-full bg-linear-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-medium py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Processing..." : "Stake"}
      </button>

      {/* Note */}
      <p className="text-gray-400 text-xs sm:text-sm text-center mt-3">
        You’ll earn rewards automatically while your tokens are staked.
      </p>
    </div>
  );
}





