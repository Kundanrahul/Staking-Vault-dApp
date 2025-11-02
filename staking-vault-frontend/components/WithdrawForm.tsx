"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { getVaultContract } from "@/lib/contract";
import { toast } from "sonner";

export default function WithdrawForm() {
  const [amount, setAmount] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();

  const vault = getVaultContract();

  if (!vault) {
    return <div className="text-white text-center">Loading contract...</div>;
  }

  const handleWithdraw = async () => {
    try {
      if (!amount) {
        toast.error("Please enter an amount to withdraw.");
        return;
      }

      const parsed = parseEther(amount);

      await writeContractAsync({
        address: vault.address,
        abi: vault.abi,
        functionName: "withdraw",
        args: [parsed],
      });

      setAmount("");
      toast.success("Withdrawal successful!");
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-5 sm:p-6 lg:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-center w-full transition-all duration-300 hover:scale-[1.015] font-sans">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 tracking-tight">
          Withdraw Tokens
        </h2>

        {/* Input Field */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2.5 sm:p-3 lg:p-3.5 rounded-xl text-white placeholder-gray-300 bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300 text-sm sm:text-base font-medium"
        />
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={isPending}
        className="mt-5 w-full bg-linear-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-medium py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Processing..." : "Withdraw"}
      </button>
    </div>
  );
}



