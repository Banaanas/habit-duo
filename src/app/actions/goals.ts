"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { appLimits, appNavLinks } from "@/data/app-data";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  createGoal,
  deleteGoal,
  restoreGoal,
  toggleCompletion,
  updateGoal,
} from "@/lib/supabase/queries/queries";

// Thrown errors are masked by Next.js in production, so actions return a
// result object to surface meaningful messages in the UI.
export type GoalActionResult = { ok: true } | { ok: false; error: string };

const toErrorMessage = (error: unknown, fallback: string): string => {
  // Postgres unique violation (one active goal per title)
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  ) {
    return "You already have an active goal with this title.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const revalidateGoals = () => {
  revalidateTag(CACHE_TAGS.goals, "max");
  revalidatePath(appNavLinks.home.href, "page");
};

export const createGoalAction = async (
  userId: string,
  title: string,
  description?: string,
  targetDays: number = appLimits.maxDaysPerGoal
): Promise<GoalActionResult> => {
  try {
    await createGoal(userId, title, description, targetDays);
    revalidateGoals();
    return { ok: true };
  } catch (error) {
    console.error("Failed to create goal:", error);
    return {
      ok: false,
      error: toErrorMessage(error, "Failed to create goal. Please try again."),
    };
  }
};

export const updateGoalAction = async (
  goalId: string,
  title: string,
  description: string | null
): Promise<GoalActionResult> => {
  try {
    await updateGoal(goalId, title, description);
    revalidateGoals();
    return { ok: true };
  } catch (error) {
    console.error("Failed to update goal:", error);
    return {
      ok: false,
      error: toErrorMessage(error, "Failed to update goal. Please try again."),
    };
  }
};

export const deleteGoalAction = async (
  goalId: string
): Promise<GoalActionResult> => {
  try {
    await deleteGoal(goalId);
    revalidateGoals();
    return { ok: true };
  } catch (error) {
    console.error("Failed to archive goal:", error);
    return {
      ok: false,
      error: toErrorMessage(error, "Failed to archive goal. Please try again."),
    };
  }
};

export const restoreGoalAction = async (
  goalId: string
): Promise<GoalActionResult> => {
  try {
    await restoreGoal(goalId);
    revalidateGoals();
    return { ok: true };
  } catch (error) {
    console.error("Failed to restore goal:", error);
    return {
      ok: false,
      error: toErrorMessage(error, "Failed to restore goal. Please try again."),
    };
  }
};

export const toggleCompletionAction = async (
  goalId: string,
  date: string
): Promise<GoalActionResult> => {
  try {
    await toggleCompletion(goalId, date);
    revalidateTag(CACHE_TAGS.completions, "max");
    revalidateTag(CACHE_TAGS.scores, "max");
    revalidatePath(appNavLinks.home.href, "page");
    return { ok: true };
  } catch (error) {
    console.error("Failed to toggle completion:", error);
    return {
      ok: false,
      error: toErrorMessage(error, "Failed to save. Please try again."),
    };
  }
};
