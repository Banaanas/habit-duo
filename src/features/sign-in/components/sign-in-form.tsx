import { MailIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appName } from "@/data/app-data";

export const SignInForm = ({
  onSubmit,
  isPending,
  error,
}: SignInFormProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 w-full max-w-md">
      <div className="flex flex-col gap-y-2 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome to {appName}
        </h1>
        <p className="text-muted-foreground">
          Sign in to start tracking your habits with a friend
        </p>
      </div>

      <Card className="w-full shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-3">
                <div className="flex items-center justify-center size-12 rounded-full bg-primary/10">
                  <MailIcon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Sign in with email</h2>
              </div>

              <p className="text-muted-foreground">
                We'll send you a passwordless magic link
              </p>
            </div>

            <form action={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isPending}
                />
              </div>

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                disabled={isPending}
              >
                <MailIcon className="w-4 h-4 mr-2" />
                {isPending ? "Sending magic link..." : "Send magic link"}
              </Button>

              <div className="flex items-start gap-x-3 pt-2 border-t">
                <SparklesIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Magic links are secure and convenient. No password needed—just
                  click the link in your email to sign in.
                </p>
              </div>
            </form>
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
