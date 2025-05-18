"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getLeaderboard } from "@/view-functions/getLeaderboard"
import { Trophy, User } from "lucide-react"

export function TopContributors() {
  const [contributors, setContributors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContributors = async () => {
      try {
        // Get top 5 contributors
        const data = await getLeaderboard(5)
        setContributors(data)
      } catch (error) {
        console.error("Failed to load contributors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContributors()
  }, [])

  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-white to-green-50 overflow-hidden animate-slideUp">
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center gap-2 text-2xl text-gray-800 font-display">
          <Trophy className="text-yellow-500" />
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-sm text-gray-600 mb-6">
          Users with the most liked recipes and highest community recognition
        </p>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {contributors.map((contributor, index) => (
              <div
                key={contributor.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200"
                    : "hover:bg-green-50"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    index === 0
                      ? "bg-yellow-200 text-yellow-800"
                      : index === 1
                        ? "bg-gray-200 text-gray-700"
                        : index === 2
                          ? "bg-amber-200 text-amber-800"
                          : "bg-green-100 text-green-800"
                  }`}
                >
                  {index + 1}
                </div>
                <Avatar className="border border-green-100 h-10 w-10">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{contributor.owner.substring(0, 6)}...{contributor.owner.substring(contributor.owner.length - 4)}</p>
                  <p className="text-xs text-gray-500">{contributor.id ? "1" : "0"} recipes shared</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{contributor.upvotes || 0} upvotes</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
