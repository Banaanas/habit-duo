import { Logo } from "@/components/shared/logo";
import { appSlogan } from "@/data/app-data";

export const Footer = () => {
  return (
    <footer className="border-border/50 bg-background/60 border-t p-4 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-y-2">
        <div className="flex items-center justify-center gap-x-2">
          <Logo size={32} variant="gradient" />
          <p className="text-muted-foreground text-sm font-semibold">
            {appSlogan}
          </p>
        </div>
      </div>
    </footer>
  );
};
