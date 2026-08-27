import type { Metadata, Viewport } from "next";
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
  title: "Yihung Chen",
  description:
    "The portfolio and investment philosophy of Yihung Chen, engineer, early-stage investor, and entrepreneur.",
  openGraph: {
    title: "Yihung Chen",
    description:
      "Engineer, early-stage investor, and entrepreneur. Explore Yihung Chen's approach to founders, teams, and meaningful problems.",
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Yihung Chen portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yihung Chen",
    description: "Engineer, early-stage investor, and entrepreneur.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = window.localStorage.getItem('yihung-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved === 'dark' || (!saved && prefersDark) ? 'dark' : 'light';
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme;
                } catch (_) {
                  document.documentElement.dataset.theme = 'light';
                  document.documentElement.style.colorScheme = 'light';
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
