import { surfClient } from "@/utils/surfClient";
import { SECRET_SIPS_ABI } from "@/utils/secret_sips_abi";
import { Post } from "./getPostFeed";

export const getLeaderboard = async (limit: number = 10): Promise<Post[]> => {
  try {
    const response = await surfClient()
      .useABI(SECRET_SIPS_ABI)
      .view.get_leaderboard({
        functionArguments: [limit.toString()],
        typeArguments: [],
      });

    // Response is an array with the first element containing the array of posts
    const posts = response[0].map((post: any) => ({
      id: post.id,
      owner: post.owner,
      title: post.title,
      content: post.content,
      image_url: post.image_url,
      upvotes: Number(post.upvotes),
      earned_tokens: Number(post.earned_tokens),
      redeemed_tokens: Number(post.redeemed_tokens),
      timestamp: Number(post.timestamp),
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};
