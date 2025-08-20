import Link from "next/link";

export default function Home() {
     return (
          <main className="min-h-screen flex items-center justify-center p-6">
               <div className="max-w-3xl w-full text-center space-y-8">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                         Track your Crypto Portfolio
                    </h1>
                    <p className="text-muted-foreground">
                         Connect your Ethereum or Solana wallet to view
                         balances, token holdings, and live USD values. Simple.
                         Fast. Private.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                         <Link
                              href="/sign-in"
                              className="rounded-md px-4 py-2 bg-black text-white"
                         >
                              Sign In
                         </Link>
                         <Link
                              href="/sign-up"
                              className="rounded-md px-4 py-2 border"
                         >
                              Create account
                         </Link>
                         <Link
                              href="/dashboard"
                              className="rounded-md px-4 py-2 border"
                         >
                              Go to Dashboard
                         </Link>
                    </div>
               </div>
          </main>
     );
}
