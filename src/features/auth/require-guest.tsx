import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { getUser } from "@/actions/auth";
import { appNavLinks } from "@/data/app-data";

/**
 * Server component that requires NO authentication (guest only).
 * Redirects to home page if user is already authenticated.
 * Use this for pages like sign-in and auth-error that should only be accessible to non-authenticated users.
 */
export const RequireGuest = async ({ children }: RequireGuestProps) => {
  const currentUser = await getUser();

  if (currentUser) {
    redirect(appNavLinks.home.href);
  }

  return <>{children}</>;
};

interface RequireGuestProps {
  children: ReactNode;
}
