export const appName = "Habit Duo";
export const appSlogan = "Build habits together";
export const appDescription =
  "Track your habits with a friend and compete for the highest weekly score. Habit Duo makes accountability fun through friendly competition.";

export const appLimits = {
  maxGoalsPerWeek: 2,
  maxDaysPerGoal: 7,
} as const;

export const appNavLinks: AppNavLinks = {
  home: {
    href: "/",
  },
  magicLink: {
    href: "/auth/magic-link",
  },
  signIn: {
    href: "/sign-in",
  },
};

export interface NavLink {
  href: string;
}

interface AppNavLinks {
  home: NavLink;
  magicLink: NavLink;
  signIn: NavLink;
}
