// Week queries that can CREATE data (not cached)
// Uses server client for proper authentication

import { createSupabaseServerClient } from "@/lib/supabase/clients/supabase-server";
import { transformWeek } from "@/lib/supabase/transformers";
import type { Week } from "@/types/database-camel-case";

/**
 * Get or create the current week
 * This calls get_or_create_current_week() which can INSERT, so it needs auth
 */
export async function getCurrentWeek(): Promise<Week | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("get_or_create_current_week");

  if (error) throw error;
  if (!data) return null;

  const { data: week, error: weekError } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", data)
    .single();

  if (weekError) throw weekError;
  return transformWeek(week);
}
