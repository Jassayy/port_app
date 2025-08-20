"use client";

import { WalletType } from "@prisma/client";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "../ui/button";

const ConnectPhantom = () => {
     const [account, setAccount] = useState<string | null>(null);
     const [balance, setBalance] = useState<string | null>(null);

     const connectWallet = async () => {
          const provider = (window as any).solana;
          if (!provider?.isPhantom) {
               return alert("Phantom Wallet not found.");
          }

          const resp = await provider.connect();

          const address = resp.publicKey.toString();
          setAccount(address);

          try {
               await axios.post("/api/wallets", {
                    address,
                    type: WalletType.SOLANA,
               });

               console.log("Wallet Connected successfully.");
               await fetchBalance(address);
          } catch (error) {
               console.error("Error connecting your phantom wallet. : ", error);
          }
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
     };

     const fetchBalance = async (addr?: String) => {
          const address = addr || account;

          if (!address) return;

          try {
               const res = await axios.post("/api/balance", {
                    address,
                    type: "SOLANA",
               });

               setBalance(res.data.balance.amount.toFixed(4));
               console.log("Balance : (sol) : ", res.data.balance);
          } catch (error) {
               console.error("Error fetching Solana Balance : ", error);
          }
     };

     return (
          <div>
               {!account ? (
                    <Button onClick={connectWallet}>Connect Phantom</Button>
               ) : (
                    <Button onClick={disconnectWallet}>
                         Disconnect Wallet
                    </Button>
               )}

               {account && (
                    <div className="mt-2">
                         <p>Connected: {account}</p>
                         <p>
                              Balance:{" "}
                              {balance ? `${balance} SOL` : "Loading..."}
                         </p>
                    </div>
               )}
          </div>
     );
};

export default ConnectPhantom;
