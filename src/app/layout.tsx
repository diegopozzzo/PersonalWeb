import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Inter, Syne } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.diegopozo.website"),
  title: "Diego Bruno Pozo Abregu - Systems Architect",
  description: "Interdisciplinary systems architect connecting AI, robotics, XR and industrial software into robust, deployable solutions.",
  openGraph: {
    images: [{ url: "/og.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${syne.variable}`}>
        <style>{`:root{--font-inter:${inter.style.fontFamily};--font-syne:${syne.style.fontFamily};}`}</style>
        {children}
        <Script id="sw-register" strategy="afterInteractive">
          {`try{if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js');});}}catch(_e){}`}
        </Script>
      </body>
    </html>
  );
}
