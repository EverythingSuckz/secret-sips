import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LeaderboardTable } from "@/components/leaderboard-table";

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-32 pb-12 md:pb-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-display">Recipe Leaderboard</h1>
          <p className="text-gray-600 max-w-2xl">
            The most popular recipes ranked by community upvotes. Creators earn recognition for each upvote received.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <LeaderboardTable />
      </div>
      <Footer />
    </main>
  )
}