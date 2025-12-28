import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { appNavLinks } from "@/data/app-data";
import { SignInView } from "@/features/sign-in/components/sign-in-view";

const SignInPage = async () => {
  const currentUser = await getUser();

  if (currentUser) {
    redirect(appNavLinks.home.href);
  }

  return <SignInView />;
};

export default SignInPage;
