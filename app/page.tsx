
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, auth } from "@clerk/nextjs";

export default async function Home() {
     const { userId } = await auth();

     return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
               {/* Header */}
               <header className="w-full px-8 py-6">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                         {/* Logo */}
                         <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-black flex items-center justify-center shadow-lg">
                                   <span className="text-white font-black text-xl">💎</span>
                              </div>
                              <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                   CryptoVault
                              </h1>
                         </div>

                         {/* Auth Buttons */}
                         <div className="flex items-center space-x-4">
                              {userId ? (
                                   <div className="flex items-center space-x-4">
                                        <Link href="/dashboard">
                                             <button className="cartoon-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-bold px-6 py-3 rounded-2xl border-3 border-black shadow-lg">
                                                  Dashboard
                                             </button>
                                        </Link>
                                        <UserButton />
                                   </div>
                              ) : (
                                   <div className="flex items-center space-x-4">
                                        <SignInButton>
                                             <button className="cartoon-button bg-white hover:bg-gray-50 text-black font-bold px-6 py-3 rounded-2xl border-3 border-black shadow-lg">
                                                  Sign In
                                             </button>
                                        </SignInButton>
                                        <SignUpButton>
                                             <button className="cartoon-button bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white font-bold px-6 py-3 rounded-2xl border-3 border-black shadow-lg">
                                                  Sign Up
                                             </button>
                                        </SignUpButton>
                                   </div>
                              )}
                         </div>
                    </div>
               </header>

               {/* Main Content */}
               <main className="flex flex-col items-center justify-center px-8 py-16">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                         {/* Hero Section */}
                         <div className="space-y-8">
                              <h2 className="text-6xl md:text-8xl font-black leading-tight">
                                   <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                        Your Crypto
                                   </span>
                                   <br />
                                   <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                                        Portfolio Hub
                                   </span>
                              </h2>
                              
                              <p className="text-2xl md:text-3xl font-bold text-gray-700 max-w-3xl mx-auto leading-relaxed">
                                   Connect your wallets, track balances across chains, and manage your crypto portfolio with style! 🚀
                              </p>
                         </div>

                         {/* Action Buttons */}
                         <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                              {userId ? (
                                   <Link href="/dashboard">
                                        <button className="cartoon-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black px-12 py-6 rounded-3xl border-4 border-black text-2xl shadow-2xl glow-effect">
                                             Go to Dashboard 🚀
                                        </button>
                                   </Link>
                              ) : (
                                   <>
                                        <SignUpButton>
                                             <button className="cartoon-button bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white font-black px-12 py-6 rounded-3xl border-4 border-black text-2xl shadow-2xl glow-effect">
                                                  Get Started Free! 🎉
                                             </button>
                                        </SignUpButton>
                                        <SignInButton>
                                             <button className="cartoon-button bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black px-12 py-6 rounded-3xl border-4 border-black text-2xl shadow-2xl glow-effect">
                                                  Sign In 👋
                                             </button>
                                        </SignInButton>
                                   </>
                              )}
                         </div>

                         {/* Features */}
                         <div className="grid md:grid-cols-3 gap-8 pt-16">
                              <div className="cartoon-card bg-white p-8 rounded-3xl">
                                   <div className="text-4xl mb-4">🔗</div>
                                   <h3 className="text-2xl font-black text-gray-800 mb-4">Connect Wallets</h3>
                                   <p className="text-gray-600 font-semibold">Link your Ethereum and Solana wallets seamlessly</p>
                              </div>
                              
                              <div className="cartoon-card bg-white p-8 rounded-3xl">
                                   <div className="text-4xl mb-4">📊</div>
                                   <h3 className="text-2xl font-black text-gray-800 mb-4">Track Balances</h3>
                                   <p className="text-gray-600 font-semibold">Monitor all your tokens and NFTs in real-time</p>
                              </div>
                              
                              <div className="cartoon-card bg-white p-8 rounded-3xl">
                                   <div className="text-4xl mb-4">📈</div>
                                   <h3 className="text-2xl font-black text-gray-800 mb-4">Portfolio Analytics</h3>
                                   <p className="text-gray-600 font-semibold">Visualize your crypto portfolio with beautiful charts</p>
                              </div>
                         </div>
                    </div>
               </main>
          </div>
     );
}
