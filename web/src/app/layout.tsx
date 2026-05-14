import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WIPER | Mobile Car Wash Qatar",
  description:
    "Book Quick Wipe, Wax Wipe, or Deep Wipe in Qatar — plus 4 in a row and 8 pool subscriptions — with WIPER mobile car wash.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-white text-[#1E3951]">{children}</body>
    </html>
  );
}
