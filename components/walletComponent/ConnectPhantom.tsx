"use client";

import { WalletType } from "@prisma/client";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "../ui/button";

const ConnectPhantom = () => {
     const [account, setAccount] = useState<string | null>(null);

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
          } catch (error) {
               console.error("Error connecting your phantom wallet. : ", error);
          }
     };

     return (
          <div>
               <Button onClick={connectWallet}>Connect Phantom</Button>
               {account && <p>Connected: {account}</p>}
          </div>
     );
};

export default ConnectPhantom;
