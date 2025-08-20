"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import toast from "react-hot-toast";

interface Token {
     symbol: string;
     amount: number;
     usd: number;
     address?: string;
     mint?: string;
}

interface PortfolioData {
     native: {
          symbol: string;
          amount: number;
          usd: number;
     };
     tokens: Token[];
     totals: {
          usd: number;
     };
}

export default function Portfolio() {
     const [ethereumData, setEthereumData] = useState<PortfolioData | null>(null);
     const [solanaData, setSolanaData] = useState<PortfolioData | null>(null);
     const [loading, setLoading] = useState(false);
     const [connectedWallets, setConnectedWallets] = useState<string[]>([]);
     const [selectedChain, setSelectedChain] = useState<"all" | "ethereum" | "solana">("all");

     // Fetch connected wallets
     useEffect(() => {
          fetchConnectedWallets();
     }, []);

     const fetchConnectedWallets = async () => {
          try {
               const response = await fetch("/api/wallets");
               if (response.ok) {
                    const data = await response.json();
                    setConnectedWallets(data.wallets || []);

                    // Auto-fetch portfolio data for connected wallets
                    if (data.wallets && data.wallets.length > 0) {
                         fetchPortfolioData(data.wallets);
                    }
               }
          } catch (error) {
               console.error("Error fetching wallets:", error);
          }
     };

     const fetchPortfolioData = async (wallets: any[]) => {
          setLoading(true);

          try {
               for (const wallet of wallets) {
                    const response = await fetch("/api/portfolio", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({
                              address: wallet.address,
                              network: wallet.type,
                         }),
                    });

                    if (response.ok) {
                         const data = await response.json();
                         if (wallet.type === "ETHEREUM") {
                              setEthereumData(data);
                         } else if (wallet.type === "SOLANA") {
                              setSolanaData(data);
                         }
                    }
               }
          } catch (error) {
               console.error("Error fetching portfolio:", error);
               toast.error("Failed to fetch portfolio data");
          } finally {
               setLoading(false);
          }
     };

     // Calculate combined totals
     const getTotalBalance = () => {
          let total = 0;
          if (selectedChain === "all" || selectedChain === "ethereum") {
               total += ethereumData?.totals.usd || 0;
          }
          if (selectedChain === "all" || selectedChain === "solana") {
               total += solanaData?.totals.usd || 0;
          }
          return total;
     };

     // Prepare chart data
     const getChartData = () => {
          const chartData: any[] = [];

          if ((selectedChain === "all" || selectedChain === "ethereum") && ethereumData) {
               chartData.push({
                    name: ethereumData.native.symbol,
                    value: ethereumData.native.usd,
                    chain: "Ethereum",
               });

               ethereumData.tokens.forEach(token => {
                    if (token.usd > 1) { // Only show tokens worth more than $1
                         chartData.push({
                              name: token.symbol,
                              value: token.usd,
                              chain: "Ethereum",
                         });
                    }
               });
          }

          if ((selectedChain === "all" || selectedChain === "solana") && solanaData) {
               chartData.push({
                    name: solanaData.native.symbol,
                    value: solanaData.native.usd,
                    chain: "Solana",
               });

               solanaData.tokens.forEach(token => {
                    if (token.usd > 1) { // Only show tokens worth more than $1
                         chartData.push({
                              name: token.symbol.length > 10 ? token.symbol.slice(0, 10) + '...' : token.symbol,
                              value: token.usd,
                              chain: "Solana",
                         });
                    }
               });
          }

          return chartData.sort((a, b) => b.value - a.value);
     };

     const COLORS = [
          '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444',
          '#3B82F6', '#F97316', '#84CC16', '#06B6D4', '#8B5CF6'
     ];

     if (connectedWallets.length === 0) {
          return (
               <div className="text-center p-12 cartoon-card bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl border-3 border-yellow-200">
                    <div className="text-6xl mb-6">🔗</div>
                    <h3 className="text-3xl font-black text-gray-800 mb-4">No Wallets Connected</h3>
                    <p className="text-xl font-bold text-gray-600">Connect your wallets above to see your portfolio! 🚀</p>
               </div>
          );
     }

     const chartData = getChartData();

     return (
          <div className="space-y-8">
               {/* Chain Filter */}
               <div className="flex justify-center space-x-4">
                    <button
                         onClick={() => setSelectedChain("all")}
                         className={`cartoon-button px-6 py-3 rounded-xl border-3 border-black font-bold ${
                              selectedChain === "all"
                                   ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                   : "bg-white text-gray-800 hover:bg-gray-50"
                         }`}
                    >
                         🌐 All Chains
                    </button>
                    <button
                         onClick={() => setSelectedChain("ethereum")}
                         className={`cartoon-button px-6 py-3 rounded-xl border-3 border-black font-bold ${
                              selectedChain === "ethereum"
                                   ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                   : "bg-white text-gray-800 hover:bg-gray-50"
                         }`}
                    >
                         🦄 Ethereum
                    </button>
                    <button
                         onClick={() => setSelectedChain("solana")}
                         className={`cartoon-button px-6 py-3 rounded-xl border-3 border-black font-bold ${
                              selectedChain === "solana"
                                   ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                   : "bg-white text-gray-800 hover:bg-gray-50"
                         }`}
                    >
                         👻 Solana
                    </button>
               </div>

               {/* Total Balance */}
               <div className="text-center p-8 cartoon-card bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl border-3 border-green-200">
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Total Portfolio Value</h3>
                    <p className="text-5xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                         ${getTotalBalance().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
               </div>

               {loading ? (
                    <div className="text-center p-12">
                         <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                         <p className="text-xl font-bold text-gray-600">Loading portfolio data... 📊</p>
                    </div>
               ) : (
                    <div className="grid lg:grid-cols-2 gap-8">
                         {/* Pie Chart */}
                         <div className="cartoon-card bg-white p-6 rounded-3xl">
                              <h3 className="text-2xl font-black text-gray-800 mb-6 text-center">📊 Portfolio Distribution</h3>
                              {chartData.length > 0 ? (
                                   <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                             <Pie
                                                  data={chartData}
                                                  cx="50%"
                                                  cy="50%"
                                                  outerRadius={100}
                                                  dataKey="value"
                                                  strokeWidth={3}
                                                  stroke="#000"
                                             >
                                                  {chartData.map((entry, index) => (
                                                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                  ))}
                                             </Pie>
                                             <Tooltip
                                                  formatter={(value: any) => [`$${value.toFixed(2)}`, 'Value']}
                                                  contentStyle={{
                                                       backgroundColor: '#FFF',
                                                       border: '3px solid #000',
                                                       borderRadius: '12px',
                                                       fontWeight: 'bold'
                                                  }}
                                             />
                                             <Legend />
                                        </PieChart>
                                   </ResponsiveContainer>
                              ) : (
                                   <div className="text-center p-8 text-gray-500">
                                        <div className="text-4xl mb-4">📈</div>
                                        <p className="font-bold">No token data available</p>
                                   </div>
                              )}
                         </div>

                         {/* Bar Chart */}
                         <div className="cartoon-card bg-white p-6 rounded-3xl">
                              <h3 className="text-2xl font-black text-gray-800 mb-6 text-center">📈 Token Values</h3>
                              {chartData.length > 0 ? (
                                   <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData.slice(0, 8)}>
                                             <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeWidth={2} />
                                             <XAxis
                                                  dataKey="name"
                                                  tick={{ fontSize: 12, fontWeight: 'bold' }}
                                                  stroke="#374151"
                                                  strokeWidth={2}
                                             />
                                             <YAxis
                                                  tick={{ fontSize: 12, fontWeight: 'bold' }}
                                                  stroke="#374151"
                                                  strokeWidth={2}
                                             />
                                             <Tooltip
                                                  formatter={(value: any) => [`$${value.toFixed(2)}`, 'Value']}
                                                  contentStyle={{
                                                       backgroundColor: '#FFF',
                                                       border: '3px solid #000',
                                                       borderRadius: '12px',
                                                       fontWeight: 'bold'
                                                  }}
                                             />
                                             <Bar
                                                  dataKey="value"
                                                  fill="#8B5CF6"
                                                  stroke="#000"
                                                  strokeWidth={2}
                                                  radius={[4, 4, 0, 0]}
                                             />
                                        </BarChart>
                                   </ResponsiveContainer>
                              ) : (
                                   <div className="text-center p-8 text-gray-500">
                                        <div className="text-4xl mb-4">📊</div>
                                        <p className="font-bold">No token data available</p>
                                   </div>
                              )}
                         </div>
                    </div>
               )}

               {/* Detailed Balances */}
               {((selectedChain === "all" || selectedChain === "ethereum") && ethereumData) && (
                    <div className="cartoon-card bg-white p-6 rounded-3xl">
                         <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                              🦄 Ethereum Portfolio
                         </h3>
                         <div className="space-y-4">
                              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                                   <div>
                                        <p className="font-bold text-gray-800">{ethereumData.native.symbol}</p>
                                        <p className="text-sm text-gray-600">{ethereumData.native.amount.toFixed(4)}</p>
                                   </div>
                                   <p className="font-black text-blue-600 text-lg">
                                        ${ethereumData.native.usd.toFixed(2)}
                                   </p>
                              </div>

                              {ethereumData.tokens.map((token, index) => (
                                   <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                                        <div>
                                             <p className="font-bold text-gray-800">{token.symbol}</p>
                                             <p className="text-sm text-gray-600">{token.amount.toFixed(4)}</p>
                                        </div>
                                        <p className="font-black text-gray-600 text-lg">
                                             ${token.usd.toFixed(2)}
                                        </p>
                                   </div>
                              ))}
                         </div>
                    </div>
               )}

               {((selectedChain === "all" || selectedChain === "solana") && solanaData) && (
                    <div className="cartoon-card bg-white p-6 rounded-3xl">
                         <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                              👻 Solana Portfolio
                         </h3>
                         <div className="space-y-4">
                              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                                   <div>
                                        <p className="font-bold text-gray-800">{solanaData.native.symbol}</p>
                                        <p className="text-sm text-gray-600">{solanaData.native.amount.toFixed(4)}</p>
                                   </div>
                                   <p className="font-black text-purple-600 text-lg">
                                        ${solanaData.native.usd.toFixed(2)}
                                   </p>
                              </div>

                              {solanaData.tokens.map((token, index) => (
                                   <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                                        <div>
                                             <p className="font-bold text-gray-800">
                                                  {token.symbol.length > 20 ? token.symbol.slice(0, 20) + '...' : token.symbol}
                                             </p>
                                             <p className="text-sm text-gray-600">{token.amount.toFixed(4)}</p>
                                        </div>
                                        <p className="font-black text-gray-600 text-lg">
                                             ${token.usd.toFixed(2)}
                                        </p>
                                   </div>
                              ))}
                         </div>
                    </div>
               )}
          </div>
     );
}