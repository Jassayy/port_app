
"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import ConnectEthereum from "@/components/walletComponent/ConnectEthereum";
import ConnectPhantom from "@/components/walletComponent/ConnectPhantom";
import Portfolio from "@/components/walletComponent/Portfolio";

export default function Dashboard() {
     const { user } = useUser();
     const [refreshTrigger, setRefreshTrigger] = useState(0);

     const triggerRefresh = () => {
          setRefreshTrigger(prev => prev + 1);
     };

     return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
               {/* Header */}
               <header className="w-full px-8 py-6 border-b-4 border-black bg-white shadow-xl">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                         <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-black flex items-center justify-center shadow-lg">
                                   <span className="text-white font-black text-xl">💎</span>
                              </div>
                              <div>
                                   <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Dashboard
                                   </h1>
                                   <p className="text-lg font-bold text-gray-600">Welcome back, {user?.firstName || 'Crypto Enthusiast'}! 👋</p>
                              </div>
                         </div>
                    </div>
               </header>

               {/* Main Content */}
               <main className="max-w-7xl mx-auto px-8 py-12">
                    <div className="space-y-12">
                         {/* Connect Wallets Section */}
                         <section className="cartoon-card bg-white p-8 rounded-3xl">
                              <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                   🔗 Connect Your Wallets
                              </h2>
                              
                              <div className="grid md:grid-cols-2 gap-8">
                                   <div className="space-y-6">
                                        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-3 border-blue-200">
                                             <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                                                  🦄 Ethereum Wallet
                                             </h3>
                                             <ConnectEthereum onConnect={triggerRefresh} />
                                        </div>
                                   </div>
                                   
                                   <div className="space-y-6">
                                        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-3 border-purple-200">
                                             <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                                                  👻 Solana Wallet
                                             </h3>
                                             <ConnectPhantom onConnect={triggerRefresh} />
                                        </div>
                                   </div>
                              </div>
                         </section>

                         {/* Portfolio Section */}
                         <section className="cartoon-card bg-white p-8 rounded-3xl">
                              <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                   📊 Your Portfolio
                              </h2>
                              
                              <Portfolio key={refreshTrigger} />
                         </section>
                    </div>
               </main>
          </div>
     );
}
