import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { appNavLinks } from "@/data/app-data";
import { SignInViewClient } from "@/features/sign-in/components/sign-in-view-client";

export const SignInView = async () => {
  const currentUser = await getUser();

  if (currentUser) {
    redirect(appNavLinks.home.href);
  }

  return <SignInViewClient />;
};
