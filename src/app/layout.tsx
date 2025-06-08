import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Suspense } from "react";
import { Metrika } from "@/components/metrika";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Analytics",
  description: "Lightweight analytics for your websites",
  keywords: [
    "developer",
    "ll-u",
    "art3m4ik3",
    "разработчик",
    "nextjs",
    "typescript",
    "react",
    "python",
    "minecraft",
    "fastapi",
    "mctool",
    "2ip",
    "codeapp",
    "shrtx",
    "bio-page",
    "filesharing",
    "lucy",
    "plugins",
    "websites",
    "sites",
    "scripts",
    "tools",
    "modules",
    "utils",
    "api",
    "frontend",
    "backend",
    "fullstack",
    "analytics",
  ],
  authors: [{ name: "art3m4ik3", url: "https://ll-u.pro" }],
  robots: { index: true, follow: true },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Analytics",
    description: "Lightweight analytics for your websites",
    url: "https://ll-u.pro",
    siteName: "ll-u.pro",
    images: [
      {
        url: "https://ll-u.pro/favicon.png",
        width: 1024,
        height: 1024,
        alt: "Lightweight analytics for your websites",
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
          <GoogleAnalytics gaId="G-L8J712K3Y5" />
          <Suspense>
            <Metrika />
            <Script async defer src="/api/script?id=bed606c8d3494e5d" />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
