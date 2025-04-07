// src/components/common/WalletConnectButton.js
// This version still uses Web3React to show connection state, but doesn't rely on it for data
import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../utils/connectors';
import { formatEther } from '@ethersproject/units';

function WalletConnectButton() {
  const { active, account, library, activate, deactivate, error, chainId } = useWeb3React();
  const [connecting, setConnecting] = useState(false);
  const [displayBalance, setDisplayBalance] = useState("?.???"); // Mock balance display

  // Simulate balance fetching
  useEffect(() => {
      if (active && account) {
          // Simulate fetching a balance
          const mockBalance = (Math.random() * 5).toFixed(3); // Random balance for demo
          setDisplayBalance(mockBalance);
      } else {
          setDisplayBalance("?.???");
      }
  }, [active, account]);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      await activate(injected);
      // In prototype, connection success visually enables dashboard via App.js logic
    } catch (ex) {
      console.error("Connection Error:", ex);
      alert(`Connection Failed: ${ex.message}`); // Simple alert for prototype
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    try { deactivate(); } catch (ex) { console.error(ex); }
  };

  return (
    <div className="relative">
      {active ? (
        <div className="flex items-center space-x-3 bg-gray-700/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-600/50 shadow-sm">
           <div className={`flex-shrink-0 h-2.5 w-2.5 rounded-full bg-green-400`}></div>
            <div className="text-sm font-medium text-gray-200">
                {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connecting...'}
                 {` | ${displayBalance} BNB`}
                 {chainId && ` | Chain: ${chainId}`}
            </div>
           <button onClick={disconnectWallet} title="Disconnect Wallet" className="...">X</button>
        </div>
      ) : (
        <button onClick={connectWallet} disabled={connecting} className="btn-primary">
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
       {/* Don't show underlying errors in prototype UI unless needed */}
       {/* {error && <p className="...">Error...</p>} */}
    </div>
  );
}

export default WalletConnectButton;