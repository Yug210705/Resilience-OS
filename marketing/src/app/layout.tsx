import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "LinqChain | Intelligence for the Physical Supply Chain",
  description: "See what breaks before it happens. Model dependencies, simulate disruptions, and recover faster with the supply chain intelligence layer.",
  openGraph: {
    title: "LinqChain",
    description: "Intelligence for the Physical Supply Chain.",
    url: "https://linqchain.com",
    siteName: "LinqChain",
    images: [
      {
        url: "https://linqchain.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(geistSans.variable, playfair.variable, "min-h-screen bg-background font-sans text-foreground antialiased relative selection:bg-brand/30")}>
        <div className="fixed inset-0 z-[-1]">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img src="/cinematic_bg.jpg" alt="Background" className="w-full h-full object-cover object-center blur-sm" />
        </div>
        <main className="relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}
