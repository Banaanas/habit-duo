export const appName = "Flower Metal";
export const appSlogan = "Metal with flowers. Not hate.";

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
