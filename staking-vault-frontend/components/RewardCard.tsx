"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useWriteContract } from "wagmi";
import { getVaultContract } from "@/lib/contract";
import { toast } from "sonner";

export default function RewardCard({ user }: { user: string }) {
  const vault = getVaultContract();

  if (!vault) {
    return <div className="text-white text-center">Loading contract...</div>;
  }

  const { writeContractAsync, isPending: isClaiming } = useWriteContract();

  const handleClaim = async () => {
    try {
      await writeContractAsync({
        address: vault.address,
        abi: vault.abi,
        functionName: "claimReward",
      });
      toast.success("Rewards claimed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to claim rewards");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col justify-between h-full p-6 sm:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-center w-full transition-all duration-300 hover:scale-[1.015] font-sans"
    >
      <div className="relative mb-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-green-500/30 blur-3xl rounded-full" />
        </motion.div>

        {/* Token Icon */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="relative mx-auto mb-4"
        >
          <Coins className="w-10 h-10 text-green-400 mx-auto drop-shadow-lg" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-white mb-2"
        >
          Earn Rewards
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base text-gray-300 leading-relaxed"
        >
          Keep staking and watch your rewards grow!  
          When you're ready, click below to claim your hard-earned tokens.
        </motion.p>
      </div>

      {/* claiming rewards */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.03 }}
        onClick={handleClaim}
        disabled={isClaiming}
        className="mt-6 w-full bg-linear-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-medium py-3 rounded-xl transition-all duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        {isClaiming ? "Claiming..." : "Claim Rewards"}
      </motion.button>
    </motion.div>
  );
}


