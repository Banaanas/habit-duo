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
      <div className="bg-background flex items-center gap-x-2 rounded-md px-2 py-1 sm:px-4">
        <span className="bg-accent sm: hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-xl">
          {avatarEmoji}
        </span>{" "}
        <span className="hidden font-bold sm:inline-block">{name}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOutIcon className="h-4 w-4" />
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
