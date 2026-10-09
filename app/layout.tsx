import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quella's Living Studio",
  description: "An interactive pixel world for visual journeys, working notes, and conversations.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
