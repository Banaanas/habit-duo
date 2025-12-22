import { HabitDuoIcon } from "@/components/shared/icons/habit-duo-icon";
import { appSlogan } from "@/data/app-data";

export const Footer = () => {
  return (
    <footer className="border-b border-border bg-muted p-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-x-2">
          <HabitDuoIcon className="w-8" />
          <p className="text-sm font-semibold text-muted-foreground">
            {appSlogan}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          A visual exploration of community-made data.
        </p>
      </div>
    </footer>
  );
};
