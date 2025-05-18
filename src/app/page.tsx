"use client";

import { AccountInfo } from "@/components/AccountInfo";
import { Header } from "@/components/Header";
import { RecipeFeed } from "@/components/RecipeFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

function App() {
  const { connected } = useWallet();

  return (
    <>
      <Header />
      <div className="container mx-auto pb-16">
        {connected ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <AccountInfo />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-9">
              <RecipeFeed />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center mt-16">
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Wallet to Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect your wallet to share and upvote Starbucks recipes, earn APT tokens, and participate in the Token Tap community.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
