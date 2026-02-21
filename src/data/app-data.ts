export const appName = "Habit Duo";
export const appSlogan = "Build habits together";
export const appDescription =
  "Track your habits with a friend and compete for the highest weekly score. Habit Duo makes accountability fun through friendly competition.";

export const appLimits = {
  maxGoals: 2,
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

export const appPageMetadata: AppPageMetadata = {
  home: {
    title: "Dashboard",
    description:
      "Track your weekly habits and compete with your friend for the highest score",
  },
  signIn: {
    title: "Sign In",
    description:
      "Sign in to Habit Duo to start tracking habits with your friend",
  },
  authError: {
    title: "Authentication Error",
    description: "There was a problem signing you in. Please try again.",
  },
};

interface PageMetadata {
  title: string;
  description: string;
}

interface AppPageMetadata {
  home: PageMetadata;
  signIn: PageMetadata;
  authError: PageMetadata;
}
