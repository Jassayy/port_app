
"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface ConnectPhantomProps {
     onConnect?: () => void;
}

export default function ConnectPhantom({ onConnect }: ConnectPhantomProps) {
     const [isConnecting, setIsConnecting] = useState(false);
     const [walletAddress, setWalletAddress] = useState<string | null>(null);
     const [balance, setBalance] = useState<number | null>(null);

     const connectWallet = async () => {
          setIsConnecting(true);
          
          try {
               if (!window.solana) {
                    toast.error("Phantom wallet not found! Please install Phantom to continue. 👻");
                    return;
               }

               const response = await window.solana.connect();
               const address = response.publicKey.toString();
               setWalletAddress(address);

               // Save wallet to database
               const saveResponse = await fetch("/api/wallets", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                         address,
                         type: "SOLANA",
                    }),
               });

               if (!saveResponse.ok) {
                    const error = await saveResponse.json();
                    toast.error(error.error || "Failed to save wallet");
                    return;
               }

               // Fetch balance
               const balanceResponse = await fetch("/api/balance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                         address,
                         type: "SOLANA",
                    }),
               });

               if (balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    setBalance(balanceData.balance.amount);
               }

               toast.success("🎉 Phantom wallet connected successfully!");
               onConnect?.();
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
                                   Balance: {balance.toFixed(4)} SOL
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
               className="cartoon-button bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-black px-8 py-4 rounded-xl border-3 border-black shadow-lg w-full text-lg glow-effect"
          >
               {isConnecting ? (
                    <span className="flex items-center justify-center gap-2">
                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         Connecting...
                    </span>
               ) : (
                    "🔗 Connect Phantom"
               )}
          </button>
     );
}
