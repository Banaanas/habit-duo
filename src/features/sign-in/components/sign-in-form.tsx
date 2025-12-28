import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appName } from "@/data/app-data";

export const SignInForm = ({
  onSubmit,
  isPending,
  error,
}: SignInFormProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome to {appName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to start tracking your habits
        </p>
      </div>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Sign in with email</CardTitle>
          <CardDescription>
            We'll send you a passwordless magic link
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                className="placeholder:text-xs"
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending magic link..." : "Send magic link"}
            </Button>
          </form>
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
