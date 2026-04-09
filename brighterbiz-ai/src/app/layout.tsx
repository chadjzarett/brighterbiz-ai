import type { Metadata } from "next";
import { Inter, DM_Sans, Sora, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const sora = Sora({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "BrighterBiz.ai - Free AI Solutions for Small Businesses",
  description: "Get free AI recommendations for your small business in seconds. No account or credit card required. Discover how artificial intelligence can transform your business.",
  keywords: "free AI for small business, artificial intelligence, business recommendations, small business AI, AI tools, AI solutions, AI for SMBs, free AI recommendations",
  authors: [{ name: "BrighterBiz.ai" }],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "BrighterBiz.ai - Free AI Solutions for Small Businesses",
    description: "Get free AI recommendations for your small business in seconds. No account or credit card required.",
    url: "https://brighterbiz.ai",
    siteName: "BrighterBiz.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrighterBiz.ai - Free AI Solutions for Small Businesses",
    description: "Get free AI recommendations for your small business in seconds. No account or credit card required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${dmSans.variable} ${sora.variable} ${instrumentSerif.variable} antialiased font-sans`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
