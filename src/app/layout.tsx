import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diego Bruno Pozo Abregu - Systems Architect",
  description: "Interdisciplinary systems architect connecting AI, robotics, XR and industrial software into robust, deployable solutions.",
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
