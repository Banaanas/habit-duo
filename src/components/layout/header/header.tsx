import Image from "next/image";

import { AboutDialogButton } from "@/components/layout/header/about-dialog-button";
import GoogleSheetsLink from "@/components/layout/header/google-sheets-link";
import { ToggleThemeButton } from "@/components/layout/theme-button";
import flowerMetalLogoSVG from "@/public/assets/flower-metal.png";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm top-0 z-50">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <HeaderImage />
          <HeaderText />
        </div>
        <div className="flex items-center gap-x-3">
          <AboutDialogButton />
          <GoogleSheetsLink />
          <ToggleThemeButton />
        </div>
      </div>
    </header>
  );
};

const HeaderText = () => {
  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">Flower metal</h1>
      <p className="text-xs text-muted-foreground">
        Because we do like clean metal.
      </p>
    </div>
  );
};

const HeaderImage = () => {
  return (
    <Image
      src={flowerMetalLogoSVG}
      alt="FlowerMetalLogo"
      width={32}
      height={32}
    />
  );
};
