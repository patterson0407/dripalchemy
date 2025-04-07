// src/components/staking/StakingDashboard.js
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useToasts } from '../common/ToastProvider';

function StakingDashboard() {
  const { account } = useWeb3React(); // Only need account to enable/disable buttons
  const { notifySuccess, notifyError, notifyLoading, dismissToast } = useToasts();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  // --- Mocked Data ---
  const [stakedBalance, setStakedBalance] = useState('1234.56');
  const [rewardsOwed, setRewardsOwed] = useState('78.9123');
  const [dripBalance, setDripBalance] = useState('9876.54');
  const [allowance, setAllowance] = useState('0'); // Simulate needing approval
  // --- ------------- ---
  const [loadingAction, setLoadingAction] = useState(null);

  // Simulate rewards increasing over time
  useEffect(() => {
    const interval = setInterval(() => {
        setRewardsOwed(prev => (parseFloat(prev) + Math.random() * 0.1).toFixed(4));
    }, 5000); // Increase every 5s
    return () => clearInterval(interval);
  }, []);


  // --- Mocked Actions ---
  const simulateTx = (actionName, duration = 1500) => {
    return new Promise((resolve) => {
        setLoadingAction(actionName);
        const toastId = notifyLoading(`${actionName} pending...`);
        setTimeout(() => {
            dismissToast(toastId);
            setLoadingAction(null);
            resolve(true); // Always succeed in prototype
        }, duration);
    });
  };

  const handleApprove = async () => {
     if (!stakeAmount || isNaN(parseFloat(stakeAmount)) || parseFloat(stakeAmount) <= 0) {
         notifyError("Please enter a valid amount."); return;
     }
     const success = await simulateTx('approve');
     if (success) {
         setAllowance(stakeAmount); // Simulate successful approval
         notifySuccess("DRIP Approved (Simulated)!");
     }
  };

  const handleStake = async () => {
    if (!stakeAmount || isNaN(parseFloat(stakeAmount)) || parseFloat(stakeAmount) <= 0) {
        notifyError("Please enter valid amount."); return;
    }
    if (parseFloat(allowance) < parseFloat(stakeAmount)) {
        notifyError("Insufficient allowance. Approve first."); return;
    }
    const success = await simulateTx('stake');
    if (success) {
        setStakedBalance(prev => (parseFloat(prev) + parseFloat(stakeAmount)).toFixed(2));
        setDripBalance(prev => (parseFloat(prev) - parseFloat(stakeAmount)).toFixed(2));
        setStakeAmount('');
        setAllowance('0'); // Reset allowance after use
        notifySuccess("Stake successful (Simulated)!");
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || isNaN(parseFloat(unstakeAmount)) || parseFloat(unstakeAmount) <= 0) {
        notifyError("Please enter valid amount."); return;
    }
    if (parseFloat(stakedBalance) < parseFloat(unstakeAmount)) {
        notifyError("Insufficient staked balance."); return;
    }
    const success = await simulateTx('unstake');
    if (success) {
        setStakedBalance(prev => (parseFloat(prev) - parseFloat(unstakeAmount)).toFixed(2));
        setDripBalance(prev => (parseFloat(prev) + parseFloat(unstakeAmount)).toFixed(2));
        setUnstakeAmount('');
        notifySuccess("Unstake successful (Simulated)!");
    }
  };

  const handleClaim = async () => {
    if (parseFloat(rewardsOwed) <= 0) {
        notifyError("No rewards to claim."); return;
    }
    const success = await simulateTx('claim', 1000);
    if (success) {
        setDripBalance(prev => (parseFloat(prev) + parseFloat(rewardsOwed)).toFixed(2));
        setRewardsOwed('0.0000');
        notifySuccess("Rewards claimed (Simulated)!");
    }
  };
  // --- End Mocked Actions ---

  const needsApproval = parseFloat(allowance) < parseFloat(stakeAmount || '0');
  const isLoading = loadingAction !== null;
  const canInteract = !!account; // Enable interactions if wallet is connected

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-700/50 text-white max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-300">DRIP Staking Vault</h2>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
            {/* ... (Display state variables: dripBalance, stakedBalance, rewardsOwed) ... */}
            <div className="bg-gray-700/50 p-3 rounded-md"><p className="text-xs text-gray-400 uppercase tracking-wider">DRIP Balance</p><p className="text-xl font-semibold">{parseFloat(dripBalance).toFixed(3)}</p></div>
            <div className="bg-gray-700/50 p-3 rounded-md"><p className="text-xs text-gray-400 uppercase tracking-wider">Staked</p><p className="text-xl font-semibold">{parseFloat(stakedBalance).toFixed(3)}</p></div>
            <div className="bg-gray-700/50 p-3 rounded-md"><p className="text-xs text-gray-400 uppercase tracking-wider">Claimable</p><p className="text-xl font-semibold">{parseFloat(rewardsOwed).toFixed(5)}</p>
                <button onClick={handleClaim} disabled={isLoading || parseFloat(rewardsOwed) <= 0 || !canInteract} className="...">
                    {loadingAction === 'claim' ? 'Claiming...' : 'Claim'}
                </button>
            </div>
        </div>
        {/* Input Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stake */}
            <div className="space-y-3">
                 <h3 className="text-lg font-semibold">Stake DRIP</h3>
                 <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} placeholder="Amount to stake" className="..." disabled={isLoading || !canInteract} />
                 {needsApproval ? (
                    <button onClick={handleApprove} disabled={isLoading || !stakeAmount || !canInteract} className="...">
                        {loadingAction === 'approve' ? 'Approving...' : 'Approve DRIP'}
                    </button>
                 ) : (
                    <button onClick={handleStake} disabled={isLoading || !stakeAmount || !canInteract} className="...">
                        {loadingAction === 'stake' ? 'Staking...' : 'Stake DRIP'}
                    </button>
                 )}
                 <p className="text-xs text-gray-400 mt-1">Allowance: {parseFloat(allowance).toFixed(3)} DRIP</p>
            </div>
            {/* Unstake */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Unstake DRIP</h3>
                <input type="number" value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} placeholder="Amount to unstake" className="..." disabled={isLoading || !canInteract}/>
                <button onClick={handleUnstake} disabled={isLoading || !unstakeAmount || !canInteract} className="...">
                    {loadingAction === 'unstake' ? 'Unstaking...' : 'Unstake DRIP'}
                </button>
            </div>
        </div>
    </div>
  );
}
export default StakingDashboard;