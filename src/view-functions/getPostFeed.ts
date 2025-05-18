import { surfClient } from "@/utils/surfClient";
import { SECRET_SIPS_ABI } from "@/utils/secret_sips_abi";

export interface Post {
  id: string;
  owner: string;
  title: string;
  content: string;
  image_url: string;
  upvotes: number;
  earned_tokens: number;
  redeemed_tokens: number;
  timestamp: number;
}

export const getPostFeed = async (
  startIndex: number = 0,
  limit: number = 10
): Promise<Post[]> => {
  try {
    const response = await surfClient()
      .useABI(SECRET_SIPS_ABI)
      .view.get_feed({
        functionArguments: [startIndex.toString(), limit.toString()],
        typeArguments: [],
      });

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
    console.error("Error fetching post feed:", error);
    return [];
  }
};
