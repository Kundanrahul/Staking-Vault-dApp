import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import WalletProvider from "../src/providers/WalletProvider";

// Google fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Staking dApp",
  description: "Stake, withdraw, and earn rewards easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-br from-[#0f0f1a] via-[#12121f] to-[#1b1b2f] text-white min-h-screen`}
      >
        <WalletProvider>
          {children}
        </WalletProvider>
        
        <Toaster
          richColors
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              backdropFilter: "blur(12px)",
              background: "rgba(20, 20, 30, 0.6)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}


