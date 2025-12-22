import Link from "next/link";

import { HabitDuo } from "@/components/layout/header/habit-duo";
import { ToggleThemeButton } from "@/components/layout/theme-button";
import { HabitDuoIcon } from "@/components/shared/icons/habit-duo-icon";
import { appNavLinks } from "@/data/app-data";

export const Header = () => {
  return (
    <header className="border-b border-border bg-muted backdrop-blur-sm top-0 z-50">
      <div className="mx-auto px-4 py-4 flex items-center justify-between flex-wrap">
        <Link
          href={appNavLinks.home.href}
          className="flex items-center gap-x-3"
          style={{ height: "clamp(32px, 10vw, 64px)" }}
        >
          <HabitDuoIcon />
          <HabitDuo />
        </Link>
        <div className="flex items-center gap-x-3">
          <ToggleThemeButton />
        </div>
      </div>
    </header>
  );
};
