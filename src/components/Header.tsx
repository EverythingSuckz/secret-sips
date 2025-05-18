"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "./wallet-selector";
import { usePathname } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-green-800 font-bold text-xl z-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" x2="6" y1="2" y2="4" />
            <line x1="10" x2="10" y1="2" y2="4" />
            <line x1="14" x2="14" y1="2" y2="4" />
          </svg>
          <span className="font-display">SecretSips</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/recipes"
            className={cn(
              "text-gray-700 hover:text-green-700 font-medium transition-colors",
              pathname === "/recipes" && "text-green-700 font-semibold",
            )}
          >
            Recipes
          </Link>
          <Link
            href="/leaderboard"
            className={cn(
              "text-gray-700 hover:text-green-700 font-medium transition-colors",
              pathname === "/leaderboard" && "text-green-700 font-semibold",
            )}
          >
            Leaderboard
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {connected ? (
            <Link href="/create">
              <Button className="bg-green-700 hover:bg-green-800 rounded-full shadow-md hover:shadow-lg transition-all">
                <PlusCircle className="mr-2 h-4 w-4" /> Share Recipe
              </Button>
            </Link>
          ) : (
            <Button 
              className="bg-green-700 hover:bg-green-800 rounded-full shadow-md hover:shadow-lg transition-all"
              disabled
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Share Recipe
            </Button>
          )}
          <WalletSelector />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden z-20">
          <WalletSelector />
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 h-9 w-9 p-0 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-10 flex flex-col transition-transform duration-300 ease-in-out md:hidden pt-20",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <nav className="flex flex-col items-center gap-6 p-8">
            <Link
              href="/recipes"
              className={cn(
                "text-xl font-medium text-gray-800 hover:text-green-700 transition-colors",
                pathname === "/recipes" && "text-green-700 font-semibold",
              )}
            >
              Recipes
            </Link>
            <Link
              href="/leaderboard"
              className={cn(
                "text-xl font-medium text-gray-800 hover:text-green-700 transition-colors",
                pathname === "/leaderboard" && "text-green-700 font-semibold",
              )}
            >
              Leaderboard
            </Link>
            <div className="h-px w-24 bg-gray-200 my-2"></div>
            <Link href="/create" className="w-full">
              <Button className="bg-green-700 hover:bg-green-800 rounded-full shadow-md hover:shadow-lg transition-all w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Share Recipe
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}