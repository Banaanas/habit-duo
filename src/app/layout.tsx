import { ReactNode } from "react";

import "../styles/globals.css";

import { BaseLayout } from "@/components/layout/base-layout";
import { siteMetadata } from "@/data/metadata";
import { roboto, robotoMono } from "@/lib/fonts";

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${robotoMono.variable}`}>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
