import { LogOut, Users } from "lucide-react";
import Link from "next/link";

import { getUser, signOut } from "@/actions/auth";
import { ToggleThemeButton } from "@/components/layout/theme-button";
import { Button } from "@/components/ui/button";
import { appNavLinks } from "@/data/app-data";

export const Header = () => {
  return (
    <header className="border-b border-border bg-muted backdrop-blur-sm top-0 z-50">
      <div className="mx-auto px-4 py-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-x-2">
          <Link
            href={appNavLinks.home.href}
            className="flex items-center gap-x-3"
            style={{ height: "clamp(32px, 10vw, 64px)" }}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-chart-1 rounded-xl">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>{" "}
          </Link>

          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              HabitDuo
            </div>
            <div className="text-sm text-muted-foreground">
              Build habits together
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <UserButtons />
          <ToggleThemeButton />
        </div>
      </div>
    </header>
  );
};

const UserButtons = async () => {
  const appUser = await getUser();

  if (!appUser) return null;
  const { name, avatarEmoji } = appUser;

  return (
    <>
      <div className="flex items-center gap-x-1">
        <span className="text-xl">{avatarEmoji}</span>
        <span>{name}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOut className="w-4 h-4" />
      </Button>
    </>
  );
};

export default UserButtons;
