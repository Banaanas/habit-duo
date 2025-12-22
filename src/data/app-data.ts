export const appName = "Habit Duo";
export const appSlogan = "Friendship can be productive.";

export const appNavLinks: AppNavLinks = {
  home: {
    href: "/",
  },
};

export interface NavLink {
  href: string;
}

interface AppNavLinks {
  home: NavLink;
}
