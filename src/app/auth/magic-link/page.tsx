"use client";

import { useActionState } from "react";

import { signInWithEmail } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appName } from "@/data/app-data";

type FormState = {
  error: string | null;
  email: string | null;
};

export default function MagicLinkPage() {
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
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a magic link to <strong>{state.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Click the link in your email to sign in to {appName}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to {appName}</CardTitle>
          <CardDescription>
            Enter your email to get started with magic link sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
