export const appName = "Habit Duo";
export const appSlogan = "Friendship can be productive.";

export const appLimits = {
  maxGoalsPerWeek: 2,
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
