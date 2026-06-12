import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/clients/supabase-server";
import { transformUser } from "@/lib/supabase/transformers";
import type { User } from "@/types/database-camel-case";

// Deduplicated per request with React cache(): the dashboard tree calls this
// from several server components, and without it each call would hit Supabase
// auth plus the users table.
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: appUser } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!appUser) return null;

  return transformUser(appUser);
});
