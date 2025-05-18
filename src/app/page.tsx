"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { FeaturedRecipes } from "@/components/featured-recipes";
import { TopContributors } from "@/components/top-contributors";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-white">
      <div className="absolute -top-16 right-0 w-32 h-32 bg-green-100 rounded-full opacity-50" />
      <Header />
      <Hero />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <FeaturedRecipes />
          </div>
          <div>
            <TopContributors />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}