"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CreateRecipeForm } from "@/components/create-recipe-form";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@/components/wallet-selector";
import { Wallet } from "lucide-react";

export default function CreatePage() {
  const { connected } = useWallet()

  if (!connected) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-16 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Wallet className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-display">Connect Your Wallet</h1>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              You need to connect your wallet to create a recipe and share it with the community.
            </p>
            <WalletSelector />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-32 pb-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 font-display">Share Your Secret Recipe</h1>
          <p className="text-gray-600 max-w-2xl">
            Share your secret Starbucks recipe with the community and get recognized when others upvote your creation.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <CreateRecipeForm />
      </div>
      <Footer />
    </main>
  )
}
