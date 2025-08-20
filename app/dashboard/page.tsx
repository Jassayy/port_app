import ConnectEthereum from "@/components/walletComponent/ConnectEthereum";
import ConnectPhantom from "@/components/walletComponent/ConnectPhantom";
import Portfolio from "@/components/walletComponent/Portfolio";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const page = () => {
     return (
          <div className="p-6 max-w-6xl mx-auto space-y-6">
               <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <UserButton />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                         <h2 className="font-medium mb-2">Ethereum</h2>
                         <ConnectEthereum />
                    </div>
                    <div className="rounded-lg border p-4">
                         <h2 className="font-medium mb-2">Solana</h2>
                         <ConnectPhantom />
                    </div>
               </div>
               <Portfolio />
          </div>
     );
};

export default page;
