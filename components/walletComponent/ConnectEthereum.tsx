"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { WalletType } from "@prisma/client";
import { Button } from "../ui/button";

const ConnectEthereum = () => {
     const [account, setAccount] = useState<string | null>(null);
     const [balance, setBalance] = useState<string | null>(null);
     const [error, setError] = useState<string | null>(null);
     const [loading, setLoading] = useState(false);

     useEffect(() => {
          const stored = localStorage.getItem("connected_eth_address");
          if (stored) {
               setAccount(stored);
               void fetchBalance(stored);
          }
     }, []);

     const connectWallet = async () => {
          //Property 'ethereum' does not exist on type 'Window & typeof globalThis'. therefore we are making global.d.ts in root
          if (!window.ethereum) return alert("MetaMask not found");

          const accounts = await window.ethereum.request({
               method: "eth_requestAccounts",
          });

          const address = accounts[0];
          setAccount(address);
          localStorage.setItem("connected_eth_address", address);

          try {
               await axios.post("/api/wallets", {
                    address,
                    type: WalletType.ETHEREUM,
               });
               console.log("Wallet connected successfully.");
          } catch (err: any) {
               if (err?.response?.status !== 401) {
                    console.error("Error connecting wallet: ", err);
               }
          }
          await fetchBalance(address);
     };

     const disconnectWallet = async () => {
          if (!account) return;

          try {
               await axios.post("/api/wallets/disconnect", {
                    address: account,
               });
               console.log("Wallet disconnected successfully");
          } catch (err) {
               console.error("Error disconnecting wallet");
          }

          setAccount(null);
          setBalance(null);
          localStorage.removeItem("connected_eth_address");
     };

     const fetchBalance = async (addr?: string) => {
          const address = addr || account;
          if (!address) return;

          setLoading(true);
          setError(null);
          try {
               const res = await axios.post("/api/balance", {
                    address,
                    type: "ETHEREUM",
               });
               setBalance(res.data.balance.amount.toFixed(4));
          } catch (err: any) {
               console.error("Error fetching Ethereum Balance : ", err);
               setError("Failed to fetch ETH balance");
          } finally {
               setLoading(false);
          }
     };

     /* 
     Fetch ERC20 tokens for Ethereum wallet
          const fetchERC20 = async (address: string) => {
          try {
          const res = await axios.post("/api/balance", {
               address,
               type: "ERC20",
          });
          console.log("ERC20 Balances:", res.data.balances);
          } catch (err) {
          console.error("Error fetching ERC20 balances:", err);
          }
          };
     */

     return (
          <div className="space-y-2">
               <div className="flex gap-2">
                    <Button onClick={connectWallet} disabled={!!account}>
                         {account ? "Wallet Connected" : "Connect MetaMask"}
                    </Button>
                    {account && (
                         <Button onClick={disconnectWallet} variant="secondary">
                              Disconnect
                         </Button>
                    )}
               </div>
               {account && (
                    <div className="text-sm">
                         <div className="truncate">Connected: {account}</div>
                         <div>
                              {loading
                                   ? "Fetching balance..."
                                   : balance
                                   ? `${balance} ETH`
                                   : "—"}
                         </div>
                    </div>
               )}
               {error && <div className="text-xs text-red-600">{error}</div>}
          </div>
     );
};

export default ConnectEthereum;
