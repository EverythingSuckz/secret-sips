"use client";

import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { PostCard } from "@/components/PostCard";
import { CreatePostForm } from "@/components/CreatePostForm";
import { RedeemDialog } from "@/components/RedeemDialog";
import { getPostFeed, Post } from "@/view-functions/getPostFeed";
import { getLeaderboard } from "@/view-functions/getLeaderboard";
import { SECRET_SIPS_ABI } from "@/utils/secret_sips_abi";
import { aptosClient } from "@/utils/aptosClient";
import { Coffee, TrendingUp } from "lucide-react";

export function RecipeFeedContainer() {
  const { client } = useWalletClient();
  const { account } = useWallet();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedPost, setSelectedPost] = useState<{ id: string; tokens: number } | null>(null);

  // Keep track of which posts the user has upvoted in this session
  const [upvotedPosts, setUpvotedPosts] = useState<Set<string>>(new Set());

  // Post Feed Query
  const { 
    data: feedPosts = [], 
    isLoading: isLoadingFeed,
    error: feedError
  } = useQuery({
    queryKey: ["recipe-feed"],
    queryFn: () => getPostFeed(0, 50),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Leaderboard Query
  const { 
    data: leaderboardPosts = [], 
    isLoading: isLoadingLeaderboard,
    error: leaderboardError
  } = useQuery({
    queryKey: ["recipe-leaderboard"],
    queryFn: () => getLeaderboard(20),
    refetchInterval: 30000, 
  });

  // Check if the current user is the owner of a post
  const isPostOwner = (post: Post) => {
    if (!account) return false;
    return post.owner.toLowerCase() === account.address.toString().toLowerCase();
  };

  // Check if the current user has upvoted a post
  const isPostUpvoted = (postId: string) => {
    return upvotedPosts.has(postId);
  };

  // Handle post upvote
  const handleUpvote = async (postId: string) => {
    if (!client || !account) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to upvote recipes.",
      });
      return;
    }

    if (upvotedPosts.has(postId)) {
      toast({
        variant: "default",
        title: "Already upvoted",
        description: "You've already upvoted this recipe.",
      });
      return;
    }

    try {
      const committedTransaction = await client.useABI(SECRET_SIPS_ABI).upvote_post({
        type_arguments: [],
        arguments: [postId],
      });

      await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      // Add this post to the upvoted set
      setUpvotedPosts(prev => new Set([...prev, postId]));

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["recipe-feed"] });
      queryClient.invalidateQueries({ queryKey: ["recipe-leaderboard"] });

      toast({
        title: "Recipe upvoted!",
        description: "You've successfully upvoted this recipe and rewarded the creator.",
      });
    } catch (error) {
      console.error("Error upvoting post:", error);
      toast({
        variant: "destructive",
        title: "Failed to upvote recipe",
        description: "Please make sure you have enough APT and try again.",
      });
    }
  };

  // Handle initiating token redemption
  const handleInitiateRedeem = (postId: string, amount: number) => {
    setSelectedPost({ id: postId, tokens: amount });
  };

  // Handle form submission success
  const handlePostCreated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["recipe-feed"] });
    queryClient.invalidateQueries({ queryKey: ["recipe-leaderboard"] });
    
    toast({
      title: "Recipe created!",
      description: "Your recipe has been successfully shared.",
    });
  }, [queryClient]);

  // Handle token redemption success
  const handleRedemptionSuccess = useCallback(() => {
    setSelectedPost(null);
    queryClient.invalidateQueries({ queryKey: ["recipe-feed"] });
    queryClient.invalidateQueries({ queryKey: ["recipe-leaderboard"] });
  }, [queryClient]);

  if (feedError || leaderboardError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load recipes. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {account && (
        <CreatePostForm onSuccess={handlePostCreated} />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            <span>Latest Recipes</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Popular Recipes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-0">
          <div className="space-y-4">
            {isLoadingFeed ? (
              <div className="text-center py-10">Loading recipes...</div>
            ) : feedPosts.length > 0 ? (
              feedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpvote={handleUpvote}
                  isOwner={isPostOwner(post)}
                  isUpvoted={isPostUpvoted(post.id)}
                  onRedeem={handleInitiateRedeem}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No recipes yet. Be the first to share one!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-0">
          <div className="space-y-4">
            {isLoadingLeaderboard ? (
              <div className="text-center py-10">Loading popular recipes...</div>
            ) : leaderboardPosts.length > 0 ? (
              leaderboardPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpvote={handleUpvote}
                  isOwner={isPostOwner(post)}
                  isUpvoted={isPostUpvoted(post.id)}
                  onRedeem={handleInitiateRedeem}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No recipes in the leaderboard yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedPost && (
        <RedeemDialog
          postId={selectedPost.id}
          availableTokens={selectedPost.tokens}
          onSuccess={handleRedemptionSuccess}
        />
      )}
    </div>
  );
}
