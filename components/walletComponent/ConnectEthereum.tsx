
"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface ConnectEthereumProps {
     onConnect?: () => void;
}

export default function ConnectEthereum({ onConnect }: ConnectEthereumProps) {
     const [isConnecting, setIsConnecting] = useState(false);
     const [walletAddress, setWalletAddress] = useState<string | null>(null);
     const [balance, setBalance] = useState<number | null>(null);

     const connectWallet = async () => {
          setIsConnecting(true);
          
          try {
               if (!window.ethereum) {
                    toast.error("MetaMask not found! Please install MetaMask to continue. 🦊");
                    return;
               }

               const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
               });

               if (accounts.length > 0) {
                    const address = accounts[0];
                    setWalletAddress(address);

                    // Save wallet to database
                    const response = await fetch("/api/wallets", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({
                              address,
                              type: "ETHEREUM",
                         }),
                    });

                    if (!response.ok) {
                         const error = await response.json();
                         toast.error(error.error || "Failed to save wallet");
                         return;
                    }

                    // Fetch balance
                    const balanceResponse = await fetch("/api/balance", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({
                              address,
                              type: "ETHEREUM",
                         }),
                    });

                    if (balanceResponse.ok) {
                         const balanceData = await balanceResponse.json();
                         setBalance(balanceData.balance.amount);
                    }

                    toast.success("🎉 Ethereum wallet connected successfully!");
                    onConnect?.();
               }
          } catch (error) {
               console.error("Error connecting wallet:", error);
               toast.error("Failed to connect wallet. Please try again! 😕");
          } finally {
               setIsConnecting(false);
          }
     };

     const disconnectWallet = () => {
          setWalletAddress(null);
          setBalance(null);
          toast.success("Wallet disconnected! 👋");
     };

     if (walletAddress) {
          return (
               <div className="space-y-4">
                    <div className="p-4 bg-green-50 border-3 border-green-200 rounded-xl">
                         <p className="text-lg font-bold text-gray-800 mb-2">✅ Connected!</p>
                         <p className="text-sm font-semibold text-gray-600 break-all">
                              Address: {walletAddress}
                         </p>
                         {balance !== null && (
                              <p className="text-lg font-bold text-green-600 mt-2">
                                   Balance: {balance.toFixed(4)} ETH
                              </p>
                         )}
                    </div>
                    
                    <button
                         onClick={disconnectWallet}
                         className="cartoon-button bg-red-500 hover:bg-red-400 text-white font-bold px-6 py-3 rounded-xl border-3 border-black shadow-lg w-full"
                    >
                         Disconnect Wallet
                    </button>
               </div>
          );
     }

     return (
          <button
               onClick={connectWallet}
               disabled={isConnecting}
               className="cartoon-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-black px-8 py-4 rounded-xl border-3 border-black shadow-lg w-full text-lg glow-effect"
          >
               {isConnecting ? (
                    <span className="flex items-center justify-center gap-2">
                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         Connecting...
                    </span>
               ) : (
                    "🔗 Connect MetaMask"
               )}
          </button>
     );
}
