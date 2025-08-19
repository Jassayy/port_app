import { UserButton } from "@clerk/nextjs";
import React from "react";

const page = () => {
     return (
          <div>
               This is dashboard
               <UserButton />
          </div>
     );
};

export default page;
