"use client";

import { useState } from "react";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { SECRET_SIPS_ABI } from "@/utils/secret_sips_abi";
import { aptosClient } from "@/utils/aptosClient";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee } from "lucide-react";

interface CreatePostFormProps {
  onSuccess: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { client } = useWalletClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client || !title || !content) {
      return;
    }

    setIsSubmitting(true);

    try {
      const committedTransaction = await client.useABI(SECRET_SIPS_ABI).create_post({
        type_arguments: [],
        arguments: [title, content, imageUrl || ""],
      });
      
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      
      toast({
        title: "Recipe shared successfully!",
        description: `Transaction hash: ${executedTransaction.hash.substring(0, 8)}...`,
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setImageUrl("");
      
      // Notify parent
      onSuccess();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Failed to share recipe",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="h-5 w-5" />
          Share Your Starbucks Recipe
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Recipe Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!client || isSubmitting}
              className="mb-3"
            />
            <Textarea
              placeholder="Share your recipe ingredients and instructions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!client || isSubmitting}
              className="min-h-28"
            />
          </div>
          <Input
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={!client || isSubmitting}
          />
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={!client || !title || !content || isSubmitting}
            className="ml-auto"
          >
            {isSubmitting ? "Sharing..." : "Share Recipe"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
