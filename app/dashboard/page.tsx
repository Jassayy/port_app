import ConnectEthereum from "@/components/walletComponent/ConnectEthereum";
import ConnectPhantom from "@/components/walletComponent/ConnectPhantom";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const page = () => {
     return (
          <div>
               This is dashboard
               <UserButton />
               <ConnectEthereum />
               <ConnectPhantom />
          </div>
     );
};

export default page;
