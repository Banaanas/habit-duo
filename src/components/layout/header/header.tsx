import { AboutDialogButton } from "@/components/layout/header/about-dialog-button";
import { FlowerMetalBanner } from "@/components/layout/header/flower-metal-banner";
import GoogleSheetsLink from "@/components/layout/header/google-sheets-link";
import { ToggleThemeButton } from "@/components/layout/theme-button";
import { FlowerMetalIcon } from "@/components/shared/icons/flower-metal-icon";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm top-0 z-50">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <FlowerMetalIcon />

          <div className="flex flex-col">
            <FlowerMetalBanner />
            <HeaderText />
          </div>
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
    <p className="text-xs text-muted-foreground">
      Metal with flowers. Not hate.
    </p>
  );
};
