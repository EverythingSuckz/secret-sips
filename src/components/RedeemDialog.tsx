"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { SECRET_SIPS_ABI } from "@/utils/secret_sips_abi";
import { aptosClient } from "@/utils/aptosClient";

interface RedeemDialogProps {
  postId: string;
  availableTokens: number;
  onSuccess: () => void;
}

export function RedeemDialog({ postId, availableTokens, onSuccess }: RedeemDialogProps) {
  const { client } = useWalletClient();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [amount, setAmount] = useState<number>(availableTokens);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRedeem = async () => {
    if (!client || !amount) return;
    
    setIsSubmitting(true);
    
    try {      const committedTransaction = await client.useABI(SECRET_SIPS_ABI).redeem_tokens({
        type_arguments: [],
        arguments: [postId, amount.toString()],
      });
      
      await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      
      toast({
        title: "Tokens redeemed successfully!",
        description: `You've redeemed ${amount / 1000000} APT.`,
      });
      
      setIsDialogOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error redeeming tokens:", error);
      toast({
        variant: "destructive",
        title: "Failed to redeem tokens",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedAmount = (availableTokens / 1000000).toFixed(2);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redeem Your APT Tokens</DialogTitle>
          <DialogDescription>
            You have {formattedAmount} APT available to redeem from this post.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">
            Amount to redeem (in APT):
          </label>
          <Input 
            type="number"
            max={availableTokens / 1000000}
            min={0.01}
            step={0.01}
            value={(amount / 1000000).toString()}
            onChange={(e) => setAmount(Math.min(Number(e.target.value) * 1000000, availableTokens))}
            disabled={isSubmitting}
          />
        </div>
          <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleRedeem} disabled={!amount || isSubmitting}>
            {isSubmitting ? "Processing..." : "Redeem Tokens"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
