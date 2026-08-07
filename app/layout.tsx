import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yihung Chen — Engineer, Investor & Entrepreneur",
  description:
    "The portfolio and investment philosophy of Yihung Chen, engineer, early-stage investor, and entrepreneur.",
  openGraph: {
    title: "Yihung Chen — Engineer, Investor & Entrepreneur",
    description:
      "Engineer, early-stage investor, and entrepreneur. Explore Yihung Chen's approach to founders, teams, and meaningful problems.",
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Yihung Chen portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yihung Chen — Engineer, Investor & Entrepreneur",
    description: "Engineer, early-stage investor, and entrepreneur.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
