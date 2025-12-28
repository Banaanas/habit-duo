"use client";

import { useActionState } from "react";

import { signInWithEmail } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SignInView = () => {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const email = formData.get("email") as string;
      const result = await signInWithEmail(email);

      if (result.error) {
        return { error: result.error, email: null };
      }

      return { error: null, email };
    },
    { error: null, email: null }
  );

  if (state.email && !state.error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent you a magic link to <strong>{state.email}</strong>. Click
            the link in the email to sign in.
          </p>
          <form action={formAction}>
            <Button type="submit" variant="ghost" className="mt-6">
              Try a different email
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Habit Duo</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to start tracking your habits
        </p>
      </div>

      <form action={formAction} className="w-full max-w-sm space-y-4">
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

        {state.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending magic link..." : "Send magic link"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          We'll send you a passwordless sign-in link
        </p>
      </form>
    </div>
  );
};

interface FormState {
  error: string | null;
  email: string | null;
}
