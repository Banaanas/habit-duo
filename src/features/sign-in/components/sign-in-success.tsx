import { CheckCircle2Icon, MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const SignInSuccess = ({ onTryAgain }: SignInSuccessProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 w-full max-w-md">
      <SuccessHeader />

      <Card className="w-full shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col gap-y-6">
            <SuccessMessage />
            <RetrySection onTryAgain={onTryAgain} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface SignInSuccessProps {
  onTryAgain: (formData: FormData) => void;
}

const SuccessHeader = () => {
  return (
    <div className="flex flex-col gap-y-4 items-center text-center">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary shadow-lg">
        <MailIcon className="w-12 h-12 text-white" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-4xl font-bold">Check your inbox</h1>
        <p className="text-muted-foreground">We've sent you a magic link</p>
      </div>
    </div>
  );
};

const SuccessMessage = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center gap-x-3">
        <CheckCircle2Icon className="w-6 h-6 text-primary shrink-0" />
        <h2 className="text-xl font-bold">Email sent successfully</h2>
      </div>
      <p className="text-muted-foreground">
        Click the secure link in your email to sign in to your account. The
        link will expire in 15 minutes.
      </p>
    </div>
  );
};

const RetrySection = ({ onTryAgain }: RetrySectionProps) => {
  return (
    <div className="flex flex-col gap-y-4 pt-4 border-t">
      <p className="text-sm text-muted-foreground text-center">
        Didn't receive the email? Check your spam folder or try again.
      </p>
      <form action={onTryAgain}>
        <Button type="submit" variant="outline" className="w-full">
          Try a different email
        </Button>
      </form>
    </div>
  );
};

interface RetrySectionProps {
  onTryAgain: (formData: FormData) => void;
}
