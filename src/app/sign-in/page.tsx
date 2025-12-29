import { Metadata } from "next";
import { Suspense } from "react";

import { appPageMetadata } from "@/data/app-data";
import { RequireGuest } from "@/features/auth/require-guest";
import { SignInView } from "@/features/sign-in/components/sign-in-view";
import { SignInViewSkeleton } from "@/features/sign-in/components/sign-in-view-skeleton";

const SignInPage = () => {
  return (
    <Suspense fallback={<SignInViewSkeleton />}>
      <RequireGuest>
        <SignInView />
      </RequireGuest>
    </Suspense>
  );
};

export default SignInPage;

export const metadata: Metadata = {
  title: appPageMetadata.signIn.title,
  description: appPageMetadata.signIn.description,
};
