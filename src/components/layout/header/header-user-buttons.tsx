import { LogOut } from "lucide-react";

import { getUser, signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const HeaderUserButtons = async () => {
  const appUser = await getUser();

  if (!appUser) return null;
  const { name, avatarEmoji } = appUser;

  return (
    <>
      <div className="flex items-center gap-x-1">
        <span className="text-xl">{avatarEmoji}</span>
        <span>{name}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOut className="w-4 h-4" />
      </Button>
    </>
  );
};

export const HeaderUserButtonsSkeleton = () => {
  return (
    <>
      <div className="flex items-center gap-x-1">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-9 w-9 rounded-md" />
    </>
  );
};
