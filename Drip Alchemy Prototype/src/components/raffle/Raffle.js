// src/components/raffle/Raffle.js
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useToasts } from '../common/ToastProvider';

function Raffle() {
    const { account } = useWeb3React();
    const { notifySuccess, notifyError, notifyLoading, dismissToast } = useToasts();
    // --- Mocked Data ---
    const [ticketPriceBNB, setTicketPriceBNB] = useState('0.05');
    const [ticketPriceDripBurn, setTicketPriceDripBurn] = useState('10.0'); // Example DRIP amount
    const [prizePool, setPrizePool] = useState('15.678');
    const [totalTickets, setTotalTickets] = useState(314);
    const [recentWinner, setRecentWinner] = useState("0x123...abc");
    const [raffleState, setRaffleState] = useState(0); // 0: Open
    const [raffleId, setRaffleId] = useState('5');
    const [dripAllowance, setDripAllowance] = useState('0'); // Simulate need for approval
    // --- ------------- ---
    const [loadingAction, setLoadingAction] = useState(null);
    const [status, setStatus] = useState(''); // Can display status text

    // Simulate prize pool increasing
    useEffect(() => {
       const interval = setInterval(() => {
           setPrizePool(prev => (parseFloat(prev) + Math.random() * 0.1).toFixed(3));
           setTotalTickets(prev => prev + Math.floor(Math.random() * 3));
       }, 8000);
       return () => clearInterval(interval);
    }, []);

    // --- Mocked Actions ---
    const simulateTx = (actionName, duration = 1500) => { /* ... as in Staking ... */
        return new Promise((resolve) => {
             setLoadingAction(actionName);
             const toastId = notifyLoading(`${actionName} pending...`);
             setTimeout(() => {
                 dismissToast(toastId);
                 setLoadingAction(null);
                 resolve(true);
             }, duration);
         });
    };

    const handleEnterRaffleBNB = async () => {
        const success = await simulateTx('bnbEntry');
        if(success) notifySuccess("Entered Raffle with BNB! (Simulated)");
    };

    const handleApproveDrip = async () => {
        const success = await simulateTx('dripApprove', 2000);
        if(success) {
            setDripAllowance(ticketPriceDripBurn); // Simulate approval
            notifySuccess("DRIP Approved for Raffle! (Simulated)");
        }
    };

    const handleEnterRaffleDripBurn = async () => {
         if (parseFloat(dripAllowance) < parseFloat(ticketPriceDripBurn)) {
             notifyError("Insufficient DRIP allowance. Approve first."); return;
         }
        const success = await simulateTx('dripEntry');
         if(success) {
            notifySuccess("Entered Raffle via DRIP Burn! (Simulated)");
            setDripAllowance('0'); // Reset allowance after use
         }
    };
    // --- End Mocked Actions ---

    const raffleStateText = { 0: 'Open', 1: 'Drawing Winner...', 2: 'Closed' };
    const needsDripApproval = parseFloat(dripAllowance) < parseFloat(ticketPriceDripBurn || '0');
    const isLoading = loadingAction !== null;
    const isOpen = raffleState === 0;
    const canInteract = !!account;

    return (
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-700/50 text-white mb-6">
            <h3 className="text-xl font-bold mb-4 text-center text-red-300">Alchemical Raffle #{raffleId}</h3>
             {/* Stats Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                 <div className="bg-gray-700/50 p-2 rounded"><p className="text-xs text-gray-400">Status</p><p className="font-semibold">{raffleStateText[raffleState] ?? '---'}</p></div>
                 <div className="bg-gray-700/50 p-2 rounded"><p className="text-xs text-gray-400">BNB Ticket</p><p className="font-semibold">{parseFloat(ticketPriceBNB).toFixed(3)}</p></div>
                 <div className="bg-gray-700/50 p-2 rounded"><p className="text-xs text-gray-400">Prize Pool</p><p className="font-semibold">{parseFloat(prizePool).toFixed(3)} BNB</p></div>
                 <div className="bg-gray-700/50 p-2 rounded"><p className="text-xs text-gray-400">Total Tickets</p><p className="font-semibold">{totalTickets}</p></div>
            </div>
             {recentWinner && <p className="...">Last Winner...</p>}
             {/* Entry Buttons */}
             <div className="flex flex-col md:flex-row justify-center items-start gap-6">
                <div className="flex-1 w-full md:w-auto text-center">
                    <button onClick={handleEnterRaffleBNB} disabled={isLoading || !isOpen || !canInteract} className="...">
                        {loadingAction === 'bnb' ? 'Processing...' : `Enter (${ticketPriceBNB} BNB)`}
                    </button>
                    <p className="text-xs text-gray-400 mt-1">(Standard Entry)</p>
                </div>
                <div className="flex-1 w-full md:w-auto text-center border-t md:border-t-0 md:border-l ...">
                    <p className="text-sm font-semibold mb-2">Get 1.5x Chance!</p>
                    {needsDripApproval ? (
                        <button onClick={handleApproveDrip} disabled={isLoading || !isOpen || !canInteract} className="...">
                            {loadingAction === 'approve' ? 'Approving...' : `Approve ${ticketPriceDripBurn} DRIP`}
                        </button>
                    ) : (
                        <button onClick={handleEnterRaffleDripBurn} disabled={isLoading || !isOpen || !canInteract} className="...">
                            {loadingAction === 'drip' ? 'Processing...' : `Burn ${ticketPriceDripBurn} DRIP for Entry`}
                        </button>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Allowance: {parseFloat(dripAllowance).toFixed(2)} DRIP</p>
                </div>
             </div>
        </div>
    );
}
export default Raffle;