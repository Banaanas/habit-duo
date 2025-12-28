import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-8 p-4">
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
    <div className="flex flex-col gap-y-4 items-center text-center">
      <div className="flex items-center justify-center size-24 rounded-full bg-destructive/10">
        <AlertCircleIcon className="w-12 h-12 text-destructive" strokeWidth={2} />
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
      <p className="text-sm text-muted-foreground">
        Please request a new magic link to continue.
      </p>
    </div>
  );
};

const RetryButton = () => {
  return (
    <Link href="/">
      <Button className="w-full flex items-center gap-x-2">
        <RefreshCwIcon className="w-4 h-4" />
        Try signing in again
      </Button>
    </Link>
  );
};
