import { Metadata } from "next";
import { ReactNode } from "react";

import "../styles/globals.css";

import { BaseLayout } from "@/components/layout/base-layout";
import { appName, appSlogan } from "@/data/app-data";
import { roboto, robotoMono } from "@/lib/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
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
  description: appSlogan,
  openGraph: {
    title: appName,
    description: appSlogan,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: appName,
    description: appSlogan,
  },
};
