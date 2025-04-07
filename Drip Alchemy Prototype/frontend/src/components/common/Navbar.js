// src/components/common/Navbar.js
import React from 'react';
import WalletConnectButton from './WalletConnectButton';

function Navbar() {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md shadow-lg p-4 sticky top-0 z-50 border-b border-gray-700/50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-3">
             <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Drip Alchemy (Prototype)
             </span>
        </div>
        <div> <WalletConnectButton /> </div>
      </div>
    </nav>
  );
}
export default Navbar;