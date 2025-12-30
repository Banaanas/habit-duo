import Link from "next/link";
import { Suspense } from "react";

import {
  HeaderUserButtons,
  HeaderUserButtonsSkeleton,
} from "@/components/layout/header/header-user-buttons";
import { ToggleThemeButton } from "@/components/layout/theme-button";
import { Logo } from "@/components/shared/logo";
import { appNavLinks } from "@/data/app-data";

export const Header = () => {
  return (
    <header className="border-border/30 bg-background sticky top-0 z-50 rounded-lg border-b">
      <div className="mx-auto flex flex-wrap items-center justify-between px-4 py-4">
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
    <Link href={appNavLinks.home.href} className="flex items-center gap-x-3">
      <div
        className="bg-primary/10 flex items-center justify-center rounded-lg p-2"
        style={{
          width: "clamp(36px, 12vw, 48px)",
          height: "clamp(36px, 12vw, 48px)",
        }}
      >
        <Logo size={48} variant="gradient" className="h-full w-full" />
      </div>
      <div className="flex flex-col gap-y-0">
        <div
          className="text-foreground font-bold tracking-tight"
          style={{ fontSize: "clamp(16px, 1vw + 1rem, 40px)" }}
        >
          HabitDuo
        </div>
        <div className="text-muted-foreground hidden text-sm sm:block">
          Build habits together
        </div>
      </div>
    </Link>
  );
};
