import { LogOutIcon } from "lucide-react";

import { getUser, signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const HeaderUserButtons = async () => {
  const appUser = await getUser();

  if (!appUser) return null;
  const { name, avatarEmoji } = appUser;

  return (
    <>
      <div className="flex items-center gap-x-2 bg-background px-2 sm:px-4 py-1 rounded-md">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xl hidden sm:">
          {avatarEmoji}
        </span>{" "}
        <span className="font-bold hidden sm:inline-block">{name}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOutIcon className="w-4 h-4" />
      </Button>
    </>
  );
};

export const HeaderUserButtonsSkeleton = () => {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <Skeleton className="h-9 w-26 rounded-md" />
        <Skeleton className="size-7 rounded-sm" />
      </div>
    </>
  );
};
