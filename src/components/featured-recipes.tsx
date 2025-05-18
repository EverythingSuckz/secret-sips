"use client"

import { useState, useEffect } from "react"
import { RecipeCard } from "@/components/recipe-card"
import { getPostFeed } from "@/view-functions/getPostFeed"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function FeaturedRecipes() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await getPostFeed(0, 4)
        setRecipes(data)
      } catch (error) {
        console.error("Failed to load recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  return (
    <section className="animate-slideUp">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 font-display">Featured Secret Recipes</h2>
        <Link href="/recipes">
          <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50 group">
            View All
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="relative w-full h-48 overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-5">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              post={recipe}
              onUpvote={() => {}}
              isOwner={false}
              isUpvoted={false}
            />
          ))}
        </div>
      )}
    </section>
  )
}
