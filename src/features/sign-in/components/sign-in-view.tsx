"use client";

import { useActionState } from "react";

import { type SignInFormState, signInWithEmail } from "@/actions/auth";
import { SignInForm } from "@/features/sign-in/components/sign-in-form";
import { SignInSuccess } from "@/features/sign-in/components/sign-in-success";

export const SignInView = () => {
  const [state, formAction, isPending] = useActionState<
    SignInFormState,
    FormData
  >(signInWithEmail, {
    error: null,
    email: null,
  });

  const handleTryAgain = () => {
    window.location.assign("/sign-in");
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
