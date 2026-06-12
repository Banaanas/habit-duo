import type { MetadataRoute } from "next";

import { appDescription, appName } from "@/data/app-data";

const manifest = (): MetadataRoute.Manifest => ({
  name: appName,
  short_name: appName,
  description: appDescription,
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#7c5cf0",
  icons: [
    {
      src: "/assets/favicons/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    {
      src: "/assets/favicons/icon.svg",
      sizes: "any",
      type: "image/svg+xml",
    },
  ],
});

export default manifest;
