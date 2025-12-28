"use client";

import { useActionState } from "react";

import { SignInForm } from "@/features/sign-in/components/sign-in-form";
import { SignInSuccess } from "@/features/sign-in/components/sign-in-success";
import { signInWithEmail } from "@/actions/auth";

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
      <div className="flex flex-col items-center justify-center w-full p-4">
        <SignInSuccess email={state.email} onTryAgain={formAction} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <SignInForm
        onSubmit={formAction}
        isPending={isPending}
        error={state.error}
      />
    </div>
  );
};

interface FormState {
  error: string | null;
  email: string | null;
}
