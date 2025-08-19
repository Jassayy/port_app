"use client";
import React, { useState } from "react";
import axios from "axios";
import { WalletType } from "@prisma/client";
import { Button } from "../ui/button";

const ConnectEthereum = () => {
     const [account, setAccount] = useState<string | null>(null);

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

               {account && <p>Connected: {account}</p>}
          </div>
     );
};

export default ConnectEthereum;
