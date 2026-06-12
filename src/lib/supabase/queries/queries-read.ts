"use cache";

import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { createSupabaseBrowserClient } from "@/lib/supabase/clients/supabase-client";
import {
  transformCompletion,
  transformGoal,
  transformUser,
  transformWeek,
  transformWeeklyScore,
} from "@/lib/supabase/transformers";
import type {
  Completion,
  Goal,
  User,
  Week,
  WeeklyScore,
} from "@/types/database-camel-case";

const supabase = createSupabaseBrowserClient();

// ============= USERS =============

export async function getUsers(): Promise<User[]> {
  cacheLife("hours");
  cacheTag(CACHE_TAGS.users);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name");

  if (error) throw error;

  return (data || []).map(transformUser);
}

// ============= WEEKS =============
// Note: getCurrentWeek() is in queries-weeks.ts (not cached, uses server client)

export async function getWeekById(weekId: string): Promise<Week | null> {
  cacheLife("hours");
  cacheTag(CACHE_TAGS.weeks);

  const { data, error } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", weekId)
    .single();

  if (error) throw error;
  return transformWeek(data);
}

export async function getAllWeeks(): Promise<Week[]> {
  cacheLife("hours");
  cacheTag(CACHE_TAGS.weeks);

  const { data, error } = await supabase
    .from("weeks")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return (data || []).map(transformWeek);
}

// Number of finalized weeks won, per user id (ties have no winner)
export async function getWeekWinCounts(): Promise<Record<string, number>> {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.weeks);

  const { data, error } = await supabase
    .from("weeks")
    .select("winner_id")
    .eq("is_finalized", true)
    .not("winner_id", "is", null);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data || []) {
    if (row.winner_id) {
      counts[row.winner_id] = (counts[row.winner_id] ?? 0) + 1;
    }
  }
  return counts;
}

// ============= GOALS =============

// Returns ALL goals including archived ones. Used by the activity heatmap and
// scoreboard, which need archived goals to render historical completions.
export async function getGoalsForUser(userId: string): Promise<Goal[]> {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.goals);

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at");

  if (error) throw error;
  return (data || []).map(transformGoal);
}

// Returns only active (non-archived) goals. Used by the goal list and goal
// count, which should ignore archived goals.
export async function getActiveGoalsForUser(userId: string): Promise<Goal[]> {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.goals);

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .is("archived_at", null)
    .order("created_at");

  if (error) throw error;
  return (data || []).map(transformGoal);
}

// ============= COMPLETIONS =============

export async function getCompletionsForGoal(
  goalId: string
): Promise<Completion[]> {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.completions);

  const { data, error } = await supabase
    .from("completions")
    .select("*")
    .eq("goal_id", goalId)
    .order("completion_date");

  if (error) throw error;
  return (data || []).map(transformCompletion);
}

export async function getCompletionsForGoals(
  goalIds: string[]
): Promise<Completion[]> {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.completions);

  if (goalIds.length === 0) return [];

  const { data, error } = await supabase
    .from("completions")
    .select("*")
    .in("goal_id", goalIds)
    .order("completion_date");

  if (error) throw error;
  return (data || []).map(transformCompletion);
}

// ============= SCORES =============

export async function getWeeklyScores(weekId: string): Promise<WeeklyScore[]> {
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.scores);

  const { data, error } = await supabase
    .from("weekly_scores")
    .select("*")
    .eq("week_id", weekId);

  if (error) throw error;
  return (data || []).map(transformWeeklyScore);
}
