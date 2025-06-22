import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrighterBiz.ai - AI Use Case Recommender for Small Businesses",
  description: "Discover how artificial intelligence can transform your small business. Get personalized AI recommendations tailored to your industry and business model.",
  keywords: "AI for small business, artificial intelligence, business recommendations, small business AI, AI tools",
  authors: [{ name: "BrighterBiz.ai" }],
  openGraph: {
    title: "BrighterBiz.ai - AI Use Case Recommender",
    description: "Discover how artificial intelligence can transform your small business in seconds.",
    url: "https://brighterbiz.ai",
    siteName: "BrighterBiz.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrighterBiz.ai - AI Use Case Recommender",
    description: "Discover how artificial intelligence can transform your small business in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
