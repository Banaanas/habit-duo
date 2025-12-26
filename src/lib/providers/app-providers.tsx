"use client";

import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <NuqsAdapter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </NuqsAdapter>
  );
};

interface AppProvidersProps {
  children: ReactNode;
}
