"use client";
import React, { useState } from "react";
import axios from "axios";
import { WalletType } from "@prisma/client";
import { Button } from "../ui/button";

const ConnectEthereum = () => {
     const [account, setAccount] = useState<string | null>(null);
     const [balance, setBalance] = useState<string | null>(null);

     const connectWallet = async () => {
          //Property 'ethereum' does not exist on type 'Window & typeof globalThis'. therefore we are making global.d.ts in root
          if (!window.ethereum) return alert("MetaMask not found");

          const accounts = await window.ethereum.request({
               method: "eth_requestAccounts",
          });

          const address = accounts[0];
          setAccount(address);

          try {
               await axios.post("/api/wallets", {
                    address,
                    type: WalletType.ETHEREUM,
               });
               console.log("Wallet connected successfully.");
               await fetchBalance(address);
          } catch (error) {
               console.error("Error connecting wallet: ", error);
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
               console.error("Error disconnecting wallet");
          }

          setAccount(null);
          setBalance(null);
     };

     const fetchBalance = async (addr?: string) => {
          const address = addr || account;
          if (!address) return;

          try {
               const res = await axios.post("/api/balance", {
                    address,
                    type: "ETHEREUM",
               });
               setBalance(res.data.balance.amount.toFixed(4)); // round to 4 decimals
               console.log("Balance : ", res.data.balance);
          } catch (error) {
               console.error("Error fetching Ethereum Balance : ", error);
          }
     };

     return (
          <div>
               {!account ? (
                    <Button onClick={connectWallet}>Connect MetaMask</Button>
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
                              {balance ? `${balance} ETH` : "Loading..."}
                         </p>
                    </div>
               )}
          </div>
     );
};

export default ConnectEthereum;
