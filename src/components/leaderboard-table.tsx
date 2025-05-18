"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getLeaderboard } from "@/view-functions/getLeaderboard"
import { Heart, Trophy, User } from "lucide-react"

export function LeaderboardTable() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await getLeaderboard(20)
        setRecipes(data)
      } catch (error) {
        console.error("Failed to load leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [])
  return (
    <Card className="border-none shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-6 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 md:h-8 md:w-8" />
            <h2 className="text-xl md:text-2xl font-bold font-display">Top Recipes Leaderboard</h2>
          </div>
        </div>

        {loading ? (
          <div className="p-4 md:p-8 space-y-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/* Desktop Header - Hidden on Mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-4 px-8 font-medium text-sm text-gray-500 border-b">
              <div className="col-span-1">Rank</div>
              <div className="col-span-7">Recipe</div>
              <div className="col-span-4 text-right">Upvotes</div>
            </div>

            <div className="p-2 md:p-4 space-y-2">
              {recipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className={`flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 py-3 px-3 md:px-4 rounded-xl items-start md:items-center transition-all hover:bg-green-50 ${
                    index < 3 ? "bg-gradient-to-r from-green-50 to-transparent border border-green-100" : ""
                  }`}
                >
                  {/* Mobile Layout */}
                  <div className="flex items-center w-full md:hidden">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 font-bold ${
                        index === 0
                          ? "bg-yellow-200 text-yellow-800"
                          : index === 1
                            ? "bg-gray-200 text-gray-700"
                            : index === 2
                              ? "bg-amber-200 text-amber-800"
                              : "text-gray-800"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 font-display">{recipe.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-5 w-5 border border-green-100">
                            <AvatarImage src={recipe.creatorAvatarUrl || "/placeholder.svg"} />
                            <AvatarFallback>
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs text-gray-500">by {recipe.creator}</p>
                        </div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 font-bold text-xs">
                          <Heart className="h-3 w-3 mr-1 fill-red-500 text-red-500" />
                          {recipe.upvotes}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex md:col-span-1 font-bold items-center justify-center w-8 h-8 rounded-full">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0
                          ? "bg-yellow-200 text-yellow-800"
                          : index === 1
                            ? "bg-gray-200 text-gray-700"
                            : index === 2
                              ? "bg-amber-200 text-amber-800"
                              : "text-gray-800"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="hidden md:flex md:col-span-7 items-center gap-3">
                    <Avatar className="h-10 w-10 border border-green-100">
                      <AvatarImage src={recipe.creatorAvatarUrl || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800 font-display">{recipe.title}</p>
                      <p className="text-xs text-gray-500">by {recipe.creator}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex md:col-span-4 md:justify-end">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-bold">
                      <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                      {recipe.upvotes} upvotes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}