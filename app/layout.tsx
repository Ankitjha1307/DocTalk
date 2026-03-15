import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocTalk - Smarter Health, Faster Answers",
  description:
    "AI-powered health assistant platform. Understand medical reports, check medicine safety, track health trends, and manage healthcare records in one intelligent platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
