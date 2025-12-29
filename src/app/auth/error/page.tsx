import { Metadata } from "next";
import { Suspense } from "react";

import { appPageMetadata } from "@/data/app-data";
import { AuthErrorView } from "@/features/sign-in/components/auth-error-view";
import { AuthErrorViewSkeleton } from "@/features/sign-in/components/auth-error-view-skeleton";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorViewSkeleton />}>
      <AuthErrorView />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: appPageMetadata.authError.title,
  description: appPageMetadata.authError.description,
};
