import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google"
import { ReactQueryProvider } from "@/components/react-query-provider";
import { WalletProvider } from "@/components/wallet-provider";
import { Toaster } from "@/components/ui/toaster";
import { WrongNetworkAlert } from "@/components/wrong-network-alert";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: "SecretSips",
  title: "SecretSips - Share Your Starbucks Secret Recipes",
  description: "Share and discover secret Starbucks recipes with the blockchain community",
  manifest: "/manifest.json",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <WalletProvider>
          <ReactQueryProvider>
            <div id="root">{children}</div>
            <WrongNetworkAlert />
            <Toaster />
          </ReactQueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
