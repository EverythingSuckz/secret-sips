import Link from "next/link"
import Image from "next/image"
import { Coffee, Heart, Github, Twitter } from "lucide-react"
export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-emerald-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Coffee className="text-white" />
              <span className="font-display">SecretSips</span>
            </div>
            <p className="text-green-100 max-w-md mb-6">
              Share your secret Starbucks recipes with the community and get recognized when others upvote your
              creations.
            </p>
            <div className="flex items-center">
              <span className="text-green-200 mr-3">Powered by</span>
              <Link href="https://aptosfoundation.org" target="_blank" rel="noopener noreferrer">
                <Image
                  src="https://aptosfoundation.org/brandbook/logotype/SVG/Aptos_Primary_WHT.svg"
                  alt="Aptos Foundation"
                  width={120}
                  height={40}
                  className="opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-green-100 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-green-100 hover:text-white transition-colors">
                  Recipes
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-green-100 hover:text-white transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-green-100 hover:text-white transition-colors">
                  Share Recipe
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://github.com/EverythingSuckz/secret-sips" className="text-green-100 hover:text-white transition-colors flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com/JyothisJayanth" className="text-green-100 hover:text-white transition-colors flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://github.com/sponsors/EverythingSuckz" className="text-green-100 hover:text-white transition-colors flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200 text-sm">
          <p>© {new Date().getFullYear()} SecretSips. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}