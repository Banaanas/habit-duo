"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { appNavLinks } from "@/data/app-data";
import { createClient } from "@/lib/supabase/supabase-server";

export async function signInWithEmail(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Clear cache so user sees sign-in page immediately
  revalidatePath(appNavLinks.home.href, "layout");
  redirect(appNavLinks.home.href);
}

export async function getUser() {
  const supabase = await createClient();

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
    avatarEmoji: appUser.avatar_emoji,
    authUserId: appUser.auth_user_id,
    createdAt: appUser.created_at,
  };
}
