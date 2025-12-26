import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-3xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was a problem signing you in. The magic link may have expired or
          already been used.
        </p>
        <Link href="/">
          <Button className="mt-6">Try signing in again</Button>
        </Link>
      </div>
    </div>
  );
}
