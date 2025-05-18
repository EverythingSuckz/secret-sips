"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RecipeFeed } from "@/components/recipe-feed";

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-32 pb-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 font-display">Discover Secret Recipes</h1>
          <p className="text-gray-600 max-w-2xl">
            Browse through our community's collection of secret Starbucks recipes. Upvote your favorites to reward
            creators with APT tokens.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <RecipeFeed />
      </div>
      <Footer />
    </main>
  )
}
