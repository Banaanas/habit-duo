import { appLimits } from "@/data/app-data";
import { createSupabaseServerClient } from "@/lib/supabase/clients/supabase-server";
import { transformGoal } from "@/lib/supabase/transformers";
import type { Goal } from "@/types/database-camel-case";

// ============= MUTATIONS =============
// These are NOT cached - they modify data
// IMPORTANT: Use server client for proper authentication and RLS

const countActiveGoals = async (userId: string): Promise<number> => {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("goals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("archived_at", null);

  if (error) throw error;
  return count ?? 0;
};

export const createGoal = async (
  userId: string,
  title: string,
  description?: string,
  targetDays: number = appLimits.maxDaysPerGoal
): Promise<Goal> => {
  const supabase = await createSupabaseServerClient();

  // The UI disables the add button at the limit, but enforce it here too
  const activeCount = await countActiveGoals(userId);
  if (activeCount >= appLimits.maxGoals) {
    throw new Error(
      `You can only have ${appLimits.maxGoals} active goals at a time.`
    );
  }

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: userId,
      title,
      description,
      target_days: targetDays,
    })
    .select()
    .single();

  if (error) throw error;
  return transformGoal(data);
};

export const updateGoal = async (
  goalId: string,
  title: string,
  description: string | null
): Promise<Goal> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("goals")
    .update({ title, description })
    .eq("id", goalId)
    .select()
    .single();

  if (error) throw error;
  return transformGoal(data);
};

// Soft delete: archive the goal instead of deleting it, so its completions
// (and the history they represent) are preserved.
export const deleteGoal = async (goalId: string): Promise<void> => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("goals")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", goalId);

  if (error) throw error;
};

// Un-archive a goal, bringing it back into the active goals list
export const restoreGoal = async (goalId: string): Promise<void> => {
  const supabase = await createSupabaseServerClient();

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("user_id")
    .eq("id", goalId)
    .single();

  if (goalError) throw goalError;

  const activeCount = await countActiveGoals(goal.user_id);
  if (activeCount >= appLimits.maxGoals) {
    throw new Error(
      `You can only have ${appLimits.maxGoals} active goals at a time. Archive one first.`
    );
  }

  const { error } = await supabase
    .from("goals")
    .update({ archived_at: null })
    .eq("id", goalId);

  if (error) throw error;
};

export const toggleCompletion = async (
  goalId: string,
  date: string
): Promise<void> => {
  const supabase = await createSupabaseServerClient();

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
