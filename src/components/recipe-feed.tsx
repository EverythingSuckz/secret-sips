"use client"

import { useState, useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { RecipeCard } from "@/components/recipe-card"
import { RedeemDialog } from "@/components/redeem-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { getPostFeed, Post } from "@/view-functions/getPostFeed"
import { SECRET_SIPS_ABI } from "@/utils/secret_sips_abi"
import { aptosClient } from "@/utils/aptosClient"
import { Coffee, Loader2 } from "lucide-react"

export function RecipeFeed() {
  const { client } = useWalletClient()
  const { account } = useWallet()
  const queryClient = useQueryClient()
  const [redemptionState, setRedemptionState] = useState<{ postId: string; amount: number } | null>(null)
  const [upvotedPosts, setUpvotedPosts] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(0)
  const limit = 8

  const { 
    data: posts = [], 
    isLoading,
    error,
    isFetching
  } = useQuery({
    queryKey: ["recipe-feed", page],
    queryFn: () => getPostFeed(page * limit, limit),
    refetchInterval: 30000,
  })

  const isPostOwner = (post: Post) => {
    if (!account) return false
    return post.owner.toLowerCase() === account.address.toString().toLowerCase()
  }

  const isPostUpvoted = (postId: string) => {
    return upvotedPosts.has(postId)
  }

  const handleUpvote = async (postId: string) => {
    if (!client || !account) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to upvote recipes.",
      })
      return
    }

    if (upvotedPosts.has(postId)) {
      toast({
        variant: "default",
        title: "Already upvoted",
        description: "You've already upvoted this recipe.",
      })
      return
    }

    try {
      const committedTransaction = await client.useABI(SECRET_SIPS_ABI).upvote_post({
        type_arguments: [],
        arguments: [postId],
      })

      await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      })

      setUpvotedPosts(prev => new Set([...prev, postId]))

      queryClient.invalidateQueries({ queryKey: ["recipe-feed"] })

      toast({
        title: "Recipe upvoted!",
        description: "You've successfully upvoted this recipe and rewarded the creator.",
      })
    } catch (error) {
      console.error("Error upvoting post:", error)
      toast({
        variant: "destructive",
        title: "Failed to upvote recipe",
        description: "Please make sure you have enough APT and try again.",
      })
    }
  }

  const handleInitiateRedeem = (postId: string, amount: number) => {
    setRedemptionState({ postId, amount })
  }

  const handleRedemptionSuccess = useCallback(() => {
    setRedemptionState(null)
    queryClient.invalidateQueries({ queryKey: ["recipe-feed"] })
  }, [queryClient])

  // Load more posts
  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1)
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load recipes. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <RecipeCard
              key={post.id}
              post={post}
              onUpvote={handleUpvote}
              isOwner={isPostOwner(post)}
              isUpvoted={isPostUpvoted(post.id)}
              onRedeem={handleInitiateRedeem}
            />
          ))
        ) : isLoading ? (
          [...Array(4)].map((_, i) => (
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
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white/50 backdrop-blur-sm rounded-xl border border-green-100">
            <Coffee className="h-10 w-10 mx-auto text-green-300 mb-3" />
            <p className="text-gray-600 mb-2">No recipes shared yet.</p>
            <p className="text-green-700 font-medium">Be the first to share your perfect brew!</p>
          </div>
        )}
      </div>

      {posts.length >= limit && (
        <div className="flex justify-center">
          <Button
            onClick={loadMorePosts}
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50 rounded-full px-8 py-6 shadow-sm hover:shadow-md transition-all"
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Recipes"
            )}
          </Button>
        </div>
      )}

      {redemptionState && (
        <RedeemDialog
          postId={redemptionState.postId}
          availableTokens={redemptionState.amount}
          onSuccess={handleRedemptionSuccess}
        />
      )}
    </div>
  )
}
