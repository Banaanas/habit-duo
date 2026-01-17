import { RefreshCwIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appPageMetadata } from "@/data/app-data";
import { AuthErrorViewSkeleton } from "@/features/auth/auth-error-view-skeleton";
import { RequireGuest } from "@/features/auth/require-guest";

const AuthErrorPage = () => {
  return (
    <Suspense fallback={<AuthErrorViewSkeleton />}>
      <RequireGuest>
        <AuthErrorView />
      </RequireGuest>
    </Suspense>
  );
};

export default AuthErrorPage;

const AuthErrorView = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-y-8">
        <ErrorHeader />
        <Card className="w-full shadow-lg">
          <CardContent className="py-6">
            <div className="flex w-full flex-col items-center gap-y-6">
              <ErrorMessage />
              <RetryButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ErrorHeader = () => {
  return (
    <div className="flex flex-col items-center gap-y-2 text-center">
      <h1 className="text-4xl font-bold text-pretty">Authentication Error</h1>
      <p className="text-muted-foreground">Something went wrong</p>
    </div>
  );
};

const ErrorMessage = () => {
  return (
    <div className="flex flex-col gap-y-3 text-center">
      <p className="text-muted-foreground">
        There was a problem signing you in. The magic link may have expired or
        already been used.
      </p>
      <p className="text-muted-foreground text-sm">
        Please request a new magic link to continue.
      </p>
    </div>
  );
};

const RetryButton = () => {
  return (
    <Link href="/">
      <Button className="flex w-full items-center gap-x-2">
        <RefreshCwIcon className="h-4 w-4" />
        Try signing in again
      </Button>
    </Link>
  );
};

export const metadata: Metadata = {
  title: appPageMetadata.authError.title,
  description: appPageMetadata.authError.description,
};
