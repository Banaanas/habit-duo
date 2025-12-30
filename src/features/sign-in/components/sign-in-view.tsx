"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";

import { signInWithEmail } from "@/actions/auth";
import { SignInForm } from "@/features/sign-in/components/sign-in-form";
import { SignInSuccess } from "@/features/sign-in/components/sign-in-success";

export const SignInView = () => {
  const router = useRouter();
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

  const handleTryAgain = () => {
    // Refresh to reset form state
    router.refresh();
  };

  if (state.email && !state.error) {
    return (
      <div className="flex w-full flex-col items-center justify-center p-4">
        <SignInSuccess onTryAgain={handleTryAgain} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
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
