import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://promptlibrary.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | PromptLibrary",
    default: "PromptLibrary — Free AI Prompts for Solopreneurs & Small Business",
  },
  description:
    "A free library of ready-to-use AI prompts for marketing, sales, content creation, and business operations. Built for solopreneurs and small business owners.",
  openGraph: {
    type: "website",
    siteName: "PromptLibrary",
    title: "PromptLibrary — Free AI Prompts for Solopreneurs & Small Business",
    description:
      "Copy-and-customize AI prompts for marketing, sales, content, and operations. Free, no account required.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "PromptLibrary — Free AI Prompts for Solopreneurs",
    description:
      "Ready-to-use AI prompts for your business. Marketing, sales, content, ops and more. Free.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased bg-stone-50 text-stone-900`}>
        {children}
      </body>
    </html>
  );
}
