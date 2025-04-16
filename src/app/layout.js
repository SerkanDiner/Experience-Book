// ❌ DO NOT use 'use client' here – this file must be a Server Component
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLayout from "./components/ClientLayout"; // New wrapper component

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Experience Book – Real Stories from Real Careers",
  description:
    "Discover and share real career experiences from professionals across industries like tech, education, healthcare, and more.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ClientLayout>
            {children}
            <Analytics />
            <SpeedInsights />
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
