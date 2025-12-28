import { MailCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SignInSuccess = ({ email, onTryAgain }: SignInSuccessProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-primary to-accent">
            <MailCheckIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Check your email</h1>
      </div>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Magic link sent!</CardTitle>
          <CardDescription>
            We've sent you a sign-in link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Click the link we sent to{" "}
            <span className="font-semibold text-foreground">{email}</span> to
            sign in to your account.
          </p>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <form action={onTryAgain}>
              <Button type="submit" variant="outline" className="w-full">
                Try a different email
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface SignInSuccessProps {
  email: string;
  onTryAgain: (formData: FormData) => void;
}
