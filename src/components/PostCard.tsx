import { formatDistanceToNow } from "date-fns";
import { Heart, Coffee, Award } from "lucide-react";
import { Post } from "@/view-functions/getPostFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PostCardProps {
  post: Post;
  onUpvote: (postId: string) => void;
  isOwner: boolean;
  isUpvoted: boolean;
  onRedeem?: (postId: string, amount: number) => void;
}

export function PostCard({ post, onUpvote, isOwner, isUpvoted, onRedeem }: PostCardProps) {
  const formattedTime = formatDistanceToNow(new Date(post.timestamp * 1000), { addSuffix: true });
  const availableToRedeem = post.earned_tokens - post.redeemed_tokens;
  
  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Coffee className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold">{post.title}</h3>
              {post.upvotes > 0 && (
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1 text-yellow-400" />
                  <span className="text-sm font-medium">{post.upvotes}</span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-2">
              @{post.owner.substring(0, 6)}...{post.owner.substring(post.owner.length - 4)} • {formattedTime}
            </p>
            
            <p className="mb-3">{post.content}</p>
            
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="rounded-md w-full h-auto object-cover mb-3 max-h-72" 
              />
            )}
            
            <div className="flex items-center justify-between mt-2">
              <Button
                variant={isUpvoted ? "default" : "outline"}
                size="sm"
                onClick={() => onUpvote(post.id)}
                disabled={isUpvoted}
                className="flex items-center gap-1"
              >
                <Heart className={`h-4 w-4 ${isUpvoted ? "fill-white" : ""}`} />
                {isUpvoted ? "Upvoted" : "Upvote"}
              </Button>
              
              {isOwner && availableToRedeem > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRedeem && onRedeem(post.id, availableToRedeem)}
                  className="flex items-center gap-1"
                >
                  <span>Redeem {availableToRedeem / 1000000} APT</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
