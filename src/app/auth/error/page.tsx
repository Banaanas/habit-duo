import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appNavLinks } from "@/data/app-data";

export default async function AuthErrorPage() {
  const currentUser = await getUser();

  if (currentUser) {
    redirect(appNavLinks.home.href);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-8 p-4">
      <ErrorHeader />

      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="py-6">
          <div className="flex flex-col gap-y-6">
            <ErrorMessage />
            <RetryButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const ErrorHeader = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 text-center">
      <div className="bg-destructive/10 flex size-24 items-center justify-center rounded-full">
        <AlertCircleIcon
          className="text-destructive h-12 w-12"
          strokeWidth={2}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-4xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">Something went wrong</p>
      </div>
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
