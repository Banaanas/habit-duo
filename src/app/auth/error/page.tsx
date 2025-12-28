import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-6 p-4">
      <div className="max-w-md flex flex-col gap-y-4 text-center">
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was a problem signing you in. The magic link may have expired or
          already been used.
        </p>
        <div className="flex justify-center pt-2">
          <Link href="/">
            <Button>Try signing in again</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
