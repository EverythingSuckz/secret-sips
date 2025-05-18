"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Heart, User } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Post } from "@/view-functions/getPostFeed"
import { formatDistanceToNow } from "date-fns"
import Image from 'next/image'

interface RecipeCardProps {
  post: Post
  onUpvote: (postId: string) => void
  isOwner: boolean
  isUpvoted: boolean
  onRedeem?: (postId: string, amount: number) => void
}

export function RecipeCard({ post, onUpvote, isOwner, isUpvoted, onRedeem }: RecipeCardProps) {
  const [isUpvoting, setIsUpvoting] = useState(false)
  const formattedTime = formatDistanceToNow(new Date(post.timestamp * 1000), { addSuffix: true })
  const availableToRedeem = post.earned_tokens - post.redeemed_tokens

  const handleUpvote = async () => {
    if (isUpvoted) {
      toast({
        title: "Already upvoted",
        description: "You've already upvoted this recipe",
      })
      return
    }

    setIsUpvoting(true)
    try {
      await onUpvote(post.id)
    } catch (error) {
      console.error("Failed to upvote:", error)
    } finally {
      setIsUpvoting(false)
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Card className="recipe-card group flex flex-col h-full">
      <div className="relative overflow-hidden h-48">
        {post.image_url ? (
          <Image
            width={500}
            height={200}
            src={post.image_url}
            alt={post.title}
            className="object-cover h-full w-full recipe-card-image"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-green-50">
            <User className="h-12 w-12 text-green-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-sm font-medium shadow-md">
            <Heart className={`h-4 w-4 ${isUpvoted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            <span className="text-gray-800">{post.upvotes}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-5 flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6 border border-green-100">
            <AvatarFallback>
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500">@{truncateAddress(post.owner)} • {formattedTime}</span>
        </div>
        <h3 className="font-bold text-lg text-gray-800 font-display">{post.title}</h3>
        <p className="mt-2 text-gray-600 line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto">
        {isOwner && availableToRedeem > 0 ? (
          <Button
            onClick={() => onRedeem && onRedeem(post.id, availableToRedeem)}
            className="w-full h-10 rounded-full transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-md hover:shadow-lg"
          >
            <Award className="mr-2 h-4 w-4" /> Redeem {availableToRedeem / 1000000} APT
          </Button>
        ) : (
          <Button
            onClick={handleUpvote}
            disabled={isUpvoting || isUpvoted}
            variant="outline"
            className={`w-full h-10 rounded-full transition-all duration-300 ${
              isUpvoted
                ? "bg-green-50 border-green-600 text-green-700"
                : "border-gray-200 hover:border-green-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <Heart className={`mr-2 h-4 w-4 transition-colors ${isUpvoted ? "fill-green-500 text-green-500" : ""}`} />
            {isUpvoting ? "Processing..." : isUpvoted ? "Upvoted" : "Upvote Recipe"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
