"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { appNavLinks } from "@/data/app-data";
import { createSupabaseServerClient } from "@/lib/supabase/clients/supabase-server";

export async function signInWithEmail(email: string) {
  const supabase = await createSupabaseServerClient();

  // Check if email is authorized (exists in users table)
  const { data: authorizedUser } = await supabase
    .from("users")
    .select("email")
    .eq("email", email.toLowerCase())
    .single();

  if (!authorizedUser) {
    return {
      error:
        "This email is not authorized. Only the 2 registered users can sign in.",
    };
  }

  // Ensure NEXT_PUBLIC_SITE_URL is set (required for production)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error("NEXT_PUBLIC_SITE_URL is not set - cannot send magic link");
    return {
      error: "Server configuration error. Please contact support.",
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  // Clear cache so user sees sign-in page immediately
  revalidatePath(appNavLinks.home.href, "layout");
  redirect(appNavLinks.home.href);
}

export async function getUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch app user data
  const { data: appUser } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!appUser) return null;

  // Transform to camelCase
  return {
    id: appUser.id,
    name: appUser.name,
    email: appUser.email,
    avatarEmoji: appUser.avatar_emoji,
    authUserId: appUser.auth_user_id,
    createdAt: appUser.created_at,
  };
}
