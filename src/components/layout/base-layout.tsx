import { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header/header";
import { MaxWidthWrapper } from "@/components/shared/max-width-wrapper";
import { AppProviders } from "@/lib/providers/app-providers";
import { globalMaxWidth } from "@/styles/common-style";

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <AppProviders>
      <MaxWidthWrapper
        maxWidth={globalMaxWidth}
        className={`flex min-w-[320px] flex-col gap-y-4 p-2 sm:py-8`}
      >
        <Header />
        <main className="flex w-full flex-1 justify-center">{children}</main>
        <Footer />
      </MaxWidthWrapper>
    </AppProviders>
  );
};

interface BaseLayoutProps {
  children: ReactNode;
}
