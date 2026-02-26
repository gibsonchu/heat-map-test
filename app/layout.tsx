import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NYC Extreme Heat Risk Map",
  description:
    "Interactive map of New York City heat vulnerability by neighborhood, based on the NYC Department of Health Heat Vulnerability Index (HVI).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">{children}</body>
    </html>
  );
}
