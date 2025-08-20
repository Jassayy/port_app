"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";

type Network = "ETHEREUM" | "SOLANA";

type PortfolioData = {
     native: { symbol: string; amount: number; usd: number };
     tokens: Array<{ symbol: string; amount: number; usd: number }>;
     totals: { usd: number };
};

const numberFormat = (n: number) =>
     n.toLocaleString(undefined, { maximumFractionDigits: 6 });

const usdFormat = (n: number) =>
     n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const Portfolio: React.FC = () => {
     const [address, setAddress] = useState("");
     const [network, setNetwork] = useState<Network>("ETHEREUM");
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [data, setData] = useState<PortfolioData | null>(null);

     useEffect(() => {
          const storedEth = localStorage.getItem("connected_eth_address");
          const storedSol = localStorage.getItem("connected_sol_address");
          if (storedEth) {
               setNetwork("ETHEREUM");
               setAddress(storedEth);
               void fetchPortfolio(storedEth, "ETHEREUM");
          } else if (storedSol) {
               setNetwork("SOLANA");
               setAddress(storedSol);
               void fetchPortfolio(storedSol, "SOLANA");
          }
     }, []);

     const hasAddress = useMemo(() => address.trim().length > 0, [address]);

     const fetchPortfolio = async (addr?: string, net?: Network) => {
          const a = (addr ?? address).trim();
          const n = net ?? network;
          if (!a) return;
          setError(null);
          setLoading(true);
          try {
               const res = await axios.post("/api/portfolio", {
                    address: a,
                    network: n,
               });
               setData(res.data);
          } catch (err: any) {
               console.error(err);
               setError(
                    err?.response?.data?.error ||
                         "Failed to fetch portfolio. Please try again."
               );
               setData(null);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="w-full max-w-4xl mx-auto mt-6">
               <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                    <div className="flex-1">
                         <label className="block text-sm mb-1">
                              Wallet address
                         </label>
                         <input
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder={
                                   network === "ETHEREUM"
                                        ? "0x..."
                                        : "Solana address (base58)"
                              }
                              className="w-full rounded-md border px-3 py-2 bg-white text-black"
                         />
                    </div>
                    <div>
                         <label className="block text-sm mb-1">Network</label>
                         <select
                              value={network}
                              onChange={(e) =>
                                   setNetwork(e.target.value as Network)
                              }
                              className="rounded-md border px-3 py-2 bg-white text-black"
                         >
                              <option value="ETHEREUM">Ethereum</option>
                              <option value="SOLANA">Solana</option>
                         </select>
                    </div>
                    <div>
                         <Button
                              onClick={() => fetchPortfolio()}
                              disabled={!hasAddress || loading}
                         >
                              {loading ? "Loading..." : "Load Portfolio"}
                         </Button>
                    </div>
               </div>

               {error && (
                    <div className="mt-4 text-red-600 text-sm">{error}</div>
               )}

               {data && (
                    <div className="mt-6">
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="rounded-lg border p-4">
                                   <div className="text-sm text-muted-foreground">
                                        Native
                                   </div>
                                   <div className="text-xl font-semibold">
                                        {numberFormat(data.native.amount)}{" "}
                                        {data.native.symbol}
                                   </div>
                                   <div className="text-sm">
                                        {usdFormat(data.native.usd)}
                                   </div>
                              </div>
                              <div className="rounded-lg border p-4">
                                   <div className="text-sm text-muted-foreground">
                                        Tokens
                                   </div>
                                   <div className="text-xl font-semibold">
                                        {data.tokens.length}
                                   </div>
                              </div>
                              <div className="rounded-lg border p-4">
                                   <div className="text-sm text-muted-foreground">
                                        Total USD
                                   </div>
                                   <div className="text-xl font-semibold">
                                        {usdFormat(data.totals.usd)}
                                   </div>
                              </div>
                         </div>

                         <div className="mt-6 overflow-x-auto">
                              <table className="min-w-full border rounded-md overflow-hidden">
                                   <thead className="bg-gray-50">
                                        <tr>
                                             <th className="text-left px-3 py-2 border-b">
                                                  Token
                                             </th>
                                             <th className="text-left px-3 py-2 border-b">
                                                  Balance
                                             </th>
                                             <th className="text-left px-3 py-2 border-b">
                                                  USD Value
                                             </th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        <tr className="hover:bg-gray-50">
                                             <td className="px-3 py-2 border-b font-medium">
                                                  {data.native.symbol}
                                             </td>
                                             <td className="px-3 py-2 border-b">
                                                  {numberFormat(
                                                       data.native.amount
                                                  )}{" "}
                                                  {data.native.symbol}
                                             </td>
                                             <td className="px-3 py-2 border-b">
                                                  {usdFormat(data.native.usd)}
                                             </td>
                                        </tr>
                                        {data.tokens.map((t, idx) => (
                                             <tr
                                                  key={idx}
                                                  className="hover:bg-gray-50"
                                             >
                                                  <td className="px-3 py-2 border-b font-medium">
                                                       {t.symbol}
                                                  </td>
                                                  <td className="px-3 py-2 border-b">
                                                       {numberFormat(t.amount)}
                                                  </td>
                                                  <td className="px-3 py-2 border-b">
                                                       {usdFormat(t.usd)}
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default Portfolio;
