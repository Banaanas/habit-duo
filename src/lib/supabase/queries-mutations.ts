import { appLimits } from "@/data/app-data";

import { createClient } from "./supabase-server";
import { transformGoal } from "./transformers";

import type { Goal } from "@/types/database-camel-case";

// ============= MUTATIONS =============
// These are NOT cached - they modify data
// IMPORTANT: Use server client for proper authentication and RLS

export const createGoal = async (
  userId: string,
  weekId: string,
  title: string,
  description?: string,
  targetDays: number = appLimits.maxDaysPerGoal
): Promise<Goal> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: userId,
      week_id: weekId,
      title,
      description,
      target_days: targetDays,
    })
    .select()
    .single();

  if (error) throw error;
  return transformGoal(data);
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase.from("goals").delete().eq("id", goalId);

  if (error) throw error;
};

export const toggleCompletion = async (
  goalId: string,
  date: string
): Promise<void> => {
  const supabase = await createClient();

  // Check if completion exists
  const { data: existing } = await supabase
    .from("completions")
    .select("id")
    .eq("goal_id", goalId)
    .eq("completion_date", date)
    .single();

  if (existing) {
    // Delete if exists
    const { error } = await supabase
      .from("completions")
      .delete()
      .eq("id", existing.id);

    if (error) throw error;
  } else {
    // Create if doesn't exist
    const { error } = await supabase.from("completions").insert({
      goal_id: goalId,
      completion_date: date,
    });

    if (error) throw error;
  }
};
