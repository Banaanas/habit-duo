import { Metadata } from "next";

import { appDescription, appName } from "./app-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteMetadata: Metadata = {
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
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      {
        url: "/assets/favicons/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      { url: "/assets/favicons/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/assets/favicons/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: appName,
    title: appName,
    description: appDescription,
    images: [
      {
        url: "/assets/habitduo-meta-image.png",
        width: 1200,
        height: 630,
        alt: appName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: appDescription,
    images: ["/assets/habitduo-meta-image.png"],
  },
};
