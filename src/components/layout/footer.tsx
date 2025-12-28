import { Logo } from "@/components/shared/logo";
import { appSlogan } from "@/data/app-data";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/60 backdrop-blur-sm p-4">
      <div className="flex flex-col items-center gap-y-2">
        <div className="flex items-center justify-center gap-x-2">
          <Logo size={32} variant="gradient" />
          <p className="text-sm font-semibold text-muted-foreground">
            {appSlogan}
          </p>
        </div>
      </div>
    </footer>
  );
};
