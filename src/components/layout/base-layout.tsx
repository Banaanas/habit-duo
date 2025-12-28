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
        className={`flex flex-col gap-y-4 p-2 sm:py-8 min-w-[320px]`}
      >
        <Header />
        <main className="w-full flex justify-center flex-1">{children}</main>
        <Footer />
      </MaxWidthWrapper>
    </AppProviders>
  );
};

interface BaseLayoutProps {
  children: ReactNode;
}
