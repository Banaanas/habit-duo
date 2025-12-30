import { MailIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appName } from "@/data/app-data";

export const SignInForm = ({ onSubmit, isPending, error }: SignInFormProps) => {
  return (
    <div className="flex w-full max-w-sm flex-col items-center justify-center gap-y-8">
      <SignInHeader />

      <Card className="w-full shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col gap-y-6">
            <SignInFormHeader />
            <EmailForm
              onSubmit={onSubmit}
              isPending={isPending}
              error={error}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface SignInFormProps {
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  error: string | null;
}

const SignInHeader = () => {
  return (
    <div className="flex flex-col gap-y-2 text-center">
      <h1 className="from-primary to-accent bg-gradient-to-r bg-clip-text text-4xl font-bold text-pretty text-transparent">
        Welcome to {appName}
      </h1>
      <p className="text-muted-foreground text-pretty">
        Sign in to start tracking your habits with a friend
      </p>
    </div>
  );
};

const SignInFormHeader = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-3">
        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
          <MailIcon className="text-primary h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold">Sign in with email</h2>
      </div>

      <p className="text-muted-foreground">
        We&apos;ll send you a passwordless magic link
      </p>
    </div>
  );
};

const EmailForm = ({ onSubmit, isPending, error }: EmailFormProps) => {
  return (
    <form action={onSubmit} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
          className="placeholder:text-xs"
        />
      </div>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      <Button
        type="submit"
        className="from-primary to-accent flex w-full items-center gap-x-2 bg-gradient-to-r transition-opacity hover:opacity-90"
        disabled={isPending}
      >
        <MailIcon className="h-4 w-4" />
        {isPending ? "Sending magic link..." : "Send magic link"}
      </Button>

      <MagicLinkInfo />
    </form>
  );
};

interface EmailFormProps {
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  error: string | null;
}

const MagicLinkInfo = () => {
  return (
    <div className="flex items-start gap-x-3 border-t pt-2">
      <SparklesIcon className="text-primary h-5 w-5 shrink-0" />
      <p className="text-muted-foreground text-sm">
        Magic links are secure and convenient. No password needed—just click the
        link in your email to sign in.
      </p>
    </div>
  );
};
