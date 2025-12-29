import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { getUser } from "@/actions/auth";
import { appNavLinks } from "@/data/app-data";

/**
 * Server component that requires authentication.
 * Redirects to the sign-in page if the user is not authenticated.
 * Use this to protect pages that require a logged-in user.
 */
export const RequireAuth = async ({ children }: RequireAuthProps) => {
  const currentUser = await getUser();

  if (!currentUser) {
    redirect(appNavLinks.signIn.href);
  }

  return <>{children}</>;
};

interface RequireAuthProps {
  children: ReactNode;
}
