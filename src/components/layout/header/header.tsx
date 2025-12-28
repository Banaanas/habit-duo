import Link from "next/link";
import { Suspense } from "react";

import { HeaderUserButtons, HeaderUserButtonsSkeleton } from "@/components/layout/header/header-user-buttons";
import { ToggleThemeButton } from "@/components/layout/theme-button";
import { Logo } from "@/components/shared/logo";
import { appNavLinks } from "@/data/app-data";

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md top-0 z-50 sticky">
      <div className="mx-auto px-4 py-4 flex items-center justify-between flex-wrap">
        <HeaderBranding />
        <div className="flex items-center">
          <Suspense fallback={<HeaderUserButtonsSkeleton />}>
            <HeaderUserButtons />
          </Suspense>
          <ToggleThemeButton />
        </div>
      </div>
    </header>
  );
};

const HeaderBranding = () => {
  return (
    <Link
      href={appNavLinks.home.href}
      className="flex items-center gap-x-3"
    >
      <div
        className="bg-background rounded-lg p-2 flex items-center justify-center border border-border/50"
        style={{
          width: "clamp(36px, 12vw, 48px)",
          height: "clamp(36px, 12vw, 48px)"
        }}
      >
        <Logo size={48} variant="gradient" className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-y-0">
        <div
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: "clamp(16px, 1vw + 1rem, 40px)" }}
        >
          HabitDuo
        </div>
        <div className="hidden sm:block text-sm text-muted-foreground">
          Build habits together
        </div>
      </div>
    </Link>
  );
};
