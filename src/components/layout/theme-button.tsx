"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export const ToggleThemeButton = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const IconComponent = theme === "dark" ? Sun : Moon;

  const iconClassname = "h-5 w-5";
  const isDarkTheme = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {isDarkTheme ? <Moon className={iconClassname} /> : <Sun className={iconClassname} />}
    </Button>
  );
};
