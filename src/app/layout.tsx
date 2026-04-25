import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Certified Not Stupid™ | Official Certificates",
  description:
    "Get an official certificate proving you are, in fact, Not Stupid. Perfect for LinkedIn, TikTok, and framing above your desk.",
  openGraph: {
    title: "Certified Not Stupid™",
    description: "Finally prove what your mother always knew.",
    siteName: "Certified Not Stupid",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
      </body>
    </html>
  );
}
