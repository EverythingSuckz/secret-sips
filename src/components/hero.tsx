"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Coffee, ChevronRight, Wallet } from "lucide-react"

export function Hero() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white -z-10 opacity-80" />
      <div className="absolute inset-0 bg-hero-pattern opacity-5 -z-10" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-emerald-200 opacity-20 blur-3xl -z-10" />
      <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-green-200 opacity-20 blur-3xl -z-10" />

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6 font-medium text-sm">
            <Coffee size={16} />
            <span>Starbucks Secret Menu</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-display">
            <span className="gradient-text">Share secrets.</span>
            <br />
            <span className="text-gray-800">Earn rewards.</span>
          </h1>
          <p className="text-gray-600 mb-8 text-lg max-w-lg leading-relaxed">
            Unlock the secrets behind your favorite Starbucks drinks and earn Aptos tokens for your contributions. Join
            our community of coffee enthusiasts sharing recipes and earning rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/create">
              <Button className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all text-lg">
                Share Your Secret Recipe
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/recipes">
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50 px-8 py-6 rounded-full text-lg"
              >
                Browse Recipes
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Already shared? Check your rewards on your profile page.</p>
        </div>
        <div className="relative animate-fadeIn">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
            <Image
              src="/hero.png"
              alt="Iced coffee drink"
              width={800}
              height={600}
              className="object-cover"
            />
            <div className="absolute top-4 right-4 glass-card rounded-xl p-4 shadow-lg">
              <h3 className="font-bold text-green-800 font-display">Top Secret Recipe</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                  50 APT reward
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>243 likes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-green-100 rounded-full z-[-1]" />
          <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 w-10 h-10 bg-emerald-200 rounded-full z-[-1]" />
        </div>
      </div>
    </section>
  )
}