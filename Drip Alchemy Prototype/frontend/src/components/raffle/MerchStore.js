// src/components/marketplace/MerchStore.js
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useToasts } from '../common/ToastProvider';
import { ethers } from 'ethers'; // Keep for formatting maybe
import { formatUnits } from '@ethersproject/units'; // Keep for formatting

// --- Mocked Item Data ---
const mockItems = [
    { id: 1, name: "DRIP Alchemist Tee", description: "Premium cotton tee with unique alchemy design.", priceBNB_s: "0.2", priceDRIP_s: "150.0", isActive: true },
    { id: 2, name: "Alchemy Lab Mug", description: "Ceramic mug, changes color with hot liquids!", priceBNB_s: "0.1", priceDRIP_s: "75.0", isActive: true },
    { id: 3, name: "VRF Randomness Poster", description: "Limited edition print celebrating Chainlink VRF.", priceBNB_s: "0.05", priceDRIP_s: "0", isActive: true }, // BNB only example
    { id: 4, name: "Staker's Hoodie", description: "Comfortable hoodie for dedicated DRIP stakers.", priceBNB_s: "0", priceDRIP_s: "300.0", isActive: true }, // DRIP only example
];

// --- Helper: Merch Item Card (Simplified) ---
function MerchItemCard({ item, onBuyBNB, onBuyDRIP, onApproveDRIP, dripAllowance, loadingItemId, account }) {
    const [isApproving, setIsApproving] = useState(false);
    const priceDRIP = parseFloat(item.priceDRIP_s);
    const needsDripApproval = priceDRIP > 0 && parseFloat(dripAllowance) < priceDRIP;
    const isLoadingThis = loadingItemId === item.id;
    const isLoadingAny = loadingItemId !== null;

    const handleApprove = async () => {
        setIsApproving(true);
        await onApproveDRIP(item.priceDRIP_s); // Pass string amount
        setIsApproving(false);
    };

    return (
        <div className="bg-gray-700/60 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-700/50 flex flex-col justify-between min-h-[300px]">
            {/* ... (Card Display Logic as before) ... */}
             <div>
                <div className="h-32 bg-gray-600 rounded mb-3 flex items-center justify-center text-gray-400 text-sm">{item.name} Image</div>
                <h4 className="text-lg font-semibold mb-1 truncate">{item.name}</h4>
                <p className="text-sm text-gray-300 mb-3 h-10 overflow-hidden line-clamp-2">{item.description}</p>
            </div>
            <div className="mt-auto space-y-2">
                {parseFloat(item.priceBNB_s) > 0 && (
                    <button onClick={() => onBuyBNB(item.id, item.priceBNB_s)} disabled={!account || isLoadingAny} className="...">
                        {isLoadingThis ? 'Processing...' : `Buy (${item.priceBNB_s} BNB)`}
                    </button>
                )}
                 {parseFloat(item.priceDRIP_s) > 0 && (
                    needsDripApproval ? (
                         <button onClick={handleApprove} disabled={!account || isLoadingAny || isApproving} className="...">
                             {isApproving ? 'Approving...' : `Approve ${item.priceDRIP_s} DRIP`}
                         </button>
                    ) : (
                         <button onClick={() => onBuyDRIP(item.id, item.priceDRIP_s)} disabled={!account || isLoadingAny || isApproving} className="...">
                             {isLoadingThis ? 'Processing...' : `Buy (${item.priceDRIP_s} DRIP)`}
                         </button>
                    )
                 )}
                  {parseFloat(item.priceDRIP_s) > 0 && <p className="text-xs text-gray-500 text-center mt-1">Allowance: {parseFloat(dripAllowance).toFixed(2)} DRIP</p>}
            </div>
        </div>
    );
}

// --- Main Component (Simplified) ---
function MerchStore() {
    const { account } = useWeb3React();
    const { notifySuccess, notifyError, notifyLoading, dismissToast } = useToasts();
    const [items, setItems] = useState([]);
    const [dripAllowance, setDripAllowance] = useState('0'); // Simulate allowance
    const [loadingItemId, setLoadingItemId] = useState(null);
    const [isLoadingItems, setIsLoadingItems] = useState(true);

    // Load mock items on mount
    useEffect(() => {
        setIsLoadingItems(true);
        setTimeout(() => { // Simulate loading delay
            setItems(mockItems.filter(item => item.isActive));
            setIsLoadingItems(false);
        }, 500);
    }, []);

    // --- Mocked Actions ---
    const simulateTx = (actionName, itemId, duration = 1500) => {
         return new Promise((resolve) => {
             setLoadingItemId(itemId); // Set specific item loading
             const toastId = notifyLoading(`${actionName} pending...`);
             setTimeout(() => {
                 dismissToast(toastId);
                 setLoadingItemId(null);
                 resolve(true);
             }, duration);
         });
    };

    const handleApproveDRIP = async (dripAmountString) => {
         const success = await simulateTx('approveDRIP', -1, 2000); // Use -1 for generic loading
         if (success) {
             setDripAllowance(dripAmountString); // Simulate setting allowance
             notifySuccess("DRIP Approved! (Simulated)");
         }
    };

    const handleBuyBNB = async (itemId, priceBNB_s) => {
         const success = await simulateTx('buyBNB', itemId);
         if (success) notifySuccess(`Item ${itemId} purchased with BNB! (Simulated)`);
    };

    const handleBuyDRIP = async (itemId, priceDRIP_s) => {
         if (parseFloat(dripAllowance) < parseFloat(priceDRIP_s)) {
             notifyError("Insufficient DRIP allowance. Approve first."); return;
         }
        const success = await simulateTx('buyDRIP', itemId);
         if (success) {
             notifySuccess(`Item ${itemId} purchased with DRIP! (Simulated)`);
             setDripAllowance('0'); // Reset allowance
         }
    };
    // --- End Mocked Actions ---

     const canInteract = !!account;

    return (
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-700/50 text-white mb-6">
            <h3 className="text-xl font-bold mb-6 text-center text-yellow-300">Marketplace</h3>
             {isLoadingItems && <p className="text-center text-gray-400">Loading items...</p>}
             {!isLoadingItems && items.length === 0 && <p className="text-center text-gray-400">No active items found.</p>}
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => (
                    <MerchItemCard
                        key={item.id}
                        item={item}
                        onBuyBNB={handleBuyBNB}
                        onBuyDRIP={handleBuyDRIP}
                        onApproveDRIP={handleApproveDRIP}
                        dripAllowance={dripAllowance} // Pass simulated allowance string
                        loadingItemId={loadingItemId}
                        account={account}
                        canInteract={canInteract}
                    />
                ))}
            </div>
        </div>
    );
}
export default MerchStore;