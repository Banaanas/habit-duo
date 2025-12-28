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
        <div className="flex items-center gap-x-2">
          <Link
            href={appNavLinks.home.href}
            className="flex items-center gap-x-3"
            style={{ height: "clamp(32px, 10vw, 64px)" }}
          >
            <Logo size={48} variant="gradient" />
          </Link>

          <div>
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
        </div>
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
