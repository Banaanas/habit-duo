import { UsersIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { HeaderUserButtons, HeaderUserButtonsSkeleton } from "@/components/layout/header/header-user-buttons";
import { ToggleThemeButton } from "@/components/layout/theme-button";
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
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-chart-1 rounded-xl">
              <UsersIcon className="w-6 h-6 text-primary-foreground" />
            </div>{" "}
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
