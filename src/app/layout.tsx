import { Metadata } from "next";
import { ReactNode } from "react";

import "../styles/globals.css";

import { BaseLayout } from "@/components/layout/base-layout";
import { appDescription, appName, appSlogan } from "@/data/app-data";
import { roboto, robotoMono } from "@/lib/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${robotoMono.variable} bg-background min-h-screen antialiased`}
      >
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  keywords: [
    "habit tracking",
    "accountability partner",
    "habit duo",
    "productivity",
    "goal tracking",
    "weekly goals",
    "friendship",
    "competition",
  ],
  authors: [{ name: appName }],
  creator: appName,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: appName,
    title: appName,
    description: appDescription,
  },
  twitter: {
    card: "summary",
    title: appName,
    description: appDescription,
  },
};
