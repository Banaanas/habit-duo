export const appName = "Flower Metal";

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
