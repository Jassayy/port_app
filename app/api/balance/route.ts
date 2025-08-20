import axios from "axios";
import { NextResponse } from "next/server";
import { formatEther } from "ethers";
import { prisma } from "@/lib/prisma";
import { Connection, PublicKey } from "@solana/web3.js";

export async function POST(req: Request) {
     const { address, type } = await req.json();

     if (!address)
          return NextResponse.json(
               { error: "Wallet address required." },
               { status: 400 }
          );

     try {
          let balance: number;
          let tokenSymbol: string;

          if (type === "ETHEREUM") {
               //Ethereum balance using etherscan
               const apiKey = process.env.ETHERSCAN_API_KEY;

               if (!apiKey)
                    return NextResponse.json(
                         { error: "Etherscan api key is required" },
                         { status: 400 }
                    );

               const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;

               const response = await axios.get(url);

               const data = response.data;

               if (data.status !== "1") {
                    return NextResponse.json(
                         { error: "Failed to fetch balance of wallet" },
                         { status: 500 }
                    );
               }

               const balanceInWei = data.result;
               //format balance
               balance = parseFloat(formatEther(BigInt(balanceInWei)));
               tokenSymbol = "ETH";
          } else if (type === "SOLANA") {
               const rpcUrl =
                    process.env.SOLANA_RPC_URL ||
                    "https://api.mainnet-beta.solana.com";

               const connection = new Connection(rpcUrl);

               const publicKey = new PublicKey(address);

               const lamports = await connection.getBalance(publicKey); //will return lamports

               balance = lamports / 1e9; //converts lamports -> sol
               tokenSymbol = "SOL";
          } else {
               return NextResponse.json(
                    {
                         error: "Unsupported wallet type",
                    },
                    {
                         status: 400,
                    }
               );
          }

          //find wallet in db
          const wallet = await prisma.wallet.findUnique({
               where: {
                    address,
               },
          });

          if (!wallet) {
               return NextResponse.json(
                    { error: "Wallet not found in database" },
                    { status: 404 }
               );
          }

          //save balance in db
          const savedBalance = await prisma.balance.create({
               data: {
                    walletId: wallet.id,
                    tokenSymbol,
                    amount: balance,
               },
          });

          return NextResponse.json({
               success: true,
               balance: savedBalance,
          });
     } catch (error) {
          console.error("Server error : (balance/route.ts) : -> ", error);
          return NextResponse.json(
               { error: "Server error (balance/route.ts)" },
               {
                    status: 500,
               }
          );
     }
}
