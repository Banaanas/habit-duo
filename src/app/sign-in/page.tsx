import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { appNavLinks, appPageMetadata } from "@/data/app-data";
import { SignInView } from "@/features/sign-in/components/sign-in-view";

const SignInPage = () => {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage;

const SignInContent = async () => {
  const currentUser = await getUser();

  if (currentUser) {
    redirect(appNavLinks.home.href);
  }

  return <SignInView />;
};

export const metadata: Metadata = {
  title: appPageMetadata.signIn.title,
  description: appPageMetadata.signIn.description,
};
