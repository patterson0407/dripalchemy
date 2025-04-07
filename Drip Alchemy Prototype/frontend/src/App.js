import React from 'react';
import { useWeb3React } from '@web3-react/core';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ToastProvider from './components/common/ToastProvider'; // Using Toasts for feedback

function App() {
  const { active } = useWeb3React(); // Still use active state to switch views

  return (
    <ToastProvider> {/* Wrap with ToastProvider */}
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-4 pb-12">
          {/* Always show Dashboard for prototype visuals once "connected" */}
          {/* Or use active state: {active ? <Dashboard /> : <Home />} */}
           <Dashboard />
          {/* For initial view use: {active ? <Dashboard /> : <Home />} */}
        </main>
        <footer className="text-center py-6 text-xs text-gray-500 border-t border-gray-700/50 mt-auto">
            Drip Alchemy Prototype &copy; 2025
        </footer>
      </div>
    </ToastProvider>
  );
}

// To always show the dashboard for screenshots (even without connecting wallet):
// function App() {
//   return (
//     <ToastProvider>
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-grow pt-4 pb-12">
//           <Dashboard />
//         </main>
//         {/* ... footer ... */}
//       </div>
//     </ToastProvider>
//   );
// }


export default App;