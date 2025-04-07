// src/components/games/Plinko.js
import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { motion } from 'framer-motion';
import { useToasts } from '../common/ToastProvider';

const GAME_NAME = "Plinko";
const ENTRY_FEE_BNB = "0.01";

function Plinko() {
  const { account } = useWeb3React();
  const { notifySuccess, notifyError, notifyLoading, dismissToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(`Play for ${ENTRY_FEE_BNB} BNB`);

  const handlePlay = async () => {
    setLoading(true);
    const toastId = notifyLoading("Dropping the chip...");
    setStatus("Processing...");

    // Simulate game delay and result
    setTimeout(() => {
        dismissToast(toastId);
        const won = Math.random() < 0.3; // Simulate ~30% win rate
        const multiplier = won ? (Math.random() * 4 + 1).toFixed(1) : '0'; // Random win multiplier
        const payout = won ? (parseFloat(ENTRY_FEE_BNB) * parseFloat(multiplier) * 0.95).toFixed(4) : '0'; // Simulate 5% house edge

        if (won) {
             setStatus(`🎉 Win! Payout: ${payout} BNB (${multiplier}x)`);
             notifySuccess("Plinko Win! (Simulated)");
        } else {
             setStatus(`😢 No win this time.`);
             notifyError("Plinko Loss (Simulated)");
        }
        setLoading(false);
    }, 2000); // Simulate 2 second game time
  };

  return (
     <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white text-center min-h-[200px] flex flex-col justify-between">
       <div>
         <h3 className="text-xl font-bold mb-4 text-purple-400">{GAME_NAME}</h3>
         <div className="h-10 my-4 flex items-center justify-center text-gray-500"> Plinko Board Area </div>
         <p className="text-xs text-gray-300 mb-2 h-8 overflow-hidden">{status}</p>
       </div>
       <motion.button
         whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
         onClick={handlePlay}
         disabled={loading || !account}
         className="w-full mt-auto px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
       >
         {loading ? 'Dropping...' : `Play (${ENTRY_FEE_BNB} BNB)`}
       </motion.button>
     </div>
   );
}

export default Plinko;