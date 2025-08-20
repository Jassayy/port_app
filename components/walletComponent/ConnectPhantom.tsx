"use client";

import { WalletType } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const ConnectPhantom = () => {
     const [account, setAccount] = useState<string | null>(null);
     const [balance, setBalance] = useState<string | null>(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
          const stored = localStorage.getItem("connected_sol_address");
          if (stored) {
               setAccount(stored);
               void fetchBalance(stored);
          }
     }, []);

     const connectWallet = async () => {
          const provider = (window as any).solana;
          if (!provider?.isPhantom) {
               return alert("Phantom Wallet not found.");
          }

          const resp = await provider.connect();

          const address = resp.publicKey.toString();
          setAccount(address);
          localStorage.setItem("connected_sol_address", address);

          try {
               await axios.post("/api/wallets", {
                    address,
                    type: WalletType.SOLANA,
               });

               console.log("Wallet Connected successfully.");
          } catch (err: any) {
               if (err?.response?.status !== 401) {
                    console.error(
                         "Error connecting your phantom wallet. : ",
                         err
                    );
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
          } catch (error) {
               console.error("Error disconnecting wallet. : ", error);
          }

          setAccount(null);
          setBalance(null);
          localStorage.removeItem("connected_sol_address");
     };

     const fetchBalance = async (addr?: String) => {
          const address = addr || account;

          if (!address) return;

          setLoading(true);
          setError(null);
          try {
               const res = await axios.post("/api/balance", {
                    address,
                    type: "SOLANA",
               });

               setBalance(res.data.balance.amount.toFixed(4));
          } catch (err: any) {
               console.error("Error fetching Solana Balance : ", err);
               setError("Failed to fetch SOL balance");
          } finally {
               setLoading(false);
          }
     };

     /*
      Fetch SPL tokens for Solana wallet
          const fetchSPL = async (address: string) => {
          try {
          const res = await axios.post("/api/balance", {
               address,
               type: "SPL",
          });
          console.log("SPL Balances:", res.data.balances);
          } catch (err) {
          console.error("Error fetching SPL balances:", err);
          }
          };

     */
     return (
          <div className="space-y-2">
               <div className="flex gap-2">
                    <Button onClick={connectWallet} disabled={!!account}>
                         {account ? "Wallet Connected" : "Connect Phantom"}
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
                                   ? `${balance} SOL`
                                   : "—"}
                         </div>
                    </div>
               )}
               {error && <div className="text-xs text-red-600">{error}</div>}
          </div>
     );
};

export default ConnectPhantom;
