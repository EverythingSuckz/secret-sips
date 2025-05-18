"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { ArrowRight, Coins, Loader2 } from "lucide-react"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { SECRET_SIPS_ABI } from "@/utils/secret_sips_abi"
import { aptosClient } from "@/utils/aptosClient"

interface RedeemDialogProps {
  postId: string
  availableTokens: number
  onSuccess: () => void
}

export function RedeemDialog({ postId, availableTokens, onSuccess }: RedeemDialogProps) {
  const { client } = useWalletClient()
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [amount, setAmount] = useState<number>(availableTokens)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRedeem = async () => {
    if (!client || !amount) return
    
    setIsSubmitting(true)
    
    try {
      const committedTransaction = await client.useABI(SECRET_SIPS_ABI).redeem_tokens({
        type_arguments: [],
        arguments: [postId, amount.toString()],
      })
      
      await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      })
      
      toast({
        title: "Tokens redeemed successfully!",
        description: `You've redeemed ${amount / 1000000} APT.`,
      })
      
      setIsDialogOpen(false)
      onSuccess()
    } catch (error) {
      console.error("Error redeeming tokens:", error)
      toast({
        variant: "destructive",
        title: "Failed to redeem tokens",
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formattedAmount = (availableTokens / 1000000).toFixed(2)
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md border-none shadow-xl overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-green-300 rounded-full opacity-20"></div>
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-emerald-400 rounded-full opacity-20"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-bold font-display gradient-text flex items-center gap-2">
            <Coins className="h-6 w-6 text-green-600" /> Redeem Your APT Tokens
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Your recipes have earned you {formattedAmount} APT. Ready to cash in?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 relative z-10">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-green-100 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Available balance:</span>
              <span className="font-bold text-lg text-green-700">{formattedAmount} APT</span>
            </div>
          </div>
          
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Amount to redeem:
          </label>
          <div className="relative">
            <Input 
              type="number"
              max={availableTokens / 1000000}
              min={0.01}
              step={0.01}
              value={(amount / 1000000).toString()}
              onChange={(e) => setAmount(Math.min(Number(e.target.value) * 1000000, availableTokens))}
              disabled={isSubmitting}
              className="pr-12 rounded-md border-gray-200 focus:border-green-500 focus:ring-green-500"
            />
            <div className="absolute right-3 top-2.5 text-gray-500 font-medium">APT</div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 relative z-10">
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(false)} 
            disabled={isSubmitting}
            className="w-full sm:w-auto border-gray-200 hover:bg-gray-50 hover:text-gray-700 rounded-full"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRedeem} 
            disabled={!amount || isSubmitting}
            className="w-full sm:w-auto group relative overflow-hidden rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Redeem Tokens
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </span>
            <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20"></span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
