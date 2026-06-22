import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://www.diegopozo.website";
const SITE_TITLE = "Diego Bruno Pozo Abregu - Systems Architect";
const SITE_DESCRIPTION =
  "Interdisciplinary systems architect connecting AI, robotics, XR and industrial software into robust, deployable solutions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "Diego Bruno Pozo Abregu",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Diego Bruno Pozo Abregu — Systems Architect portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
