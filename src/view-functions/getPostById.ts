import { surfClient } from "@/utils/surfClient";
import { SECRET_SIPS_ABI } from "@/utils/secret_sips_abi";
import { Post } from "./getPostFeed";

export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const response = await surfClient()
      .useABI(SECRET_SIPS_ABI)
      .view.get_post_by_id({
        functionArguments: [postId.toString()],
        typeArguments: [],
      });

    const post: Post = response[0] as Post;
      
    return {
      id: post.id,
      owner: post.owner,
      title: post.title,
      content: post.content,
      image_url: post.image_url,
      upvotes: Number(post.upvotes),
      earned_tokens: Number(post.earned_tokens),
      redeemed_tokens: Number(post.redeemed_tokens),
      timestamp: Number(post.timestamp),
    };
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    return null;
  }
};
