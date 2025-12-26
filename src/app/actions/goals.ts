"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { appNavLinks } from "@/data/app-data";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  createGoal,
  deleteGoal,
  toggleCompletion,
} from "@/lib/supabase/queries";

export const createGoalAction = async (
  userId: string,
  weekId: string,
  title: string,
  description?: string,
  targetDays: number = 7
) => {
  try {
    await createGoal(userId, weekId, title, description, targetDays);
    revalidateTag(CACHE_TAGS.goals);
    revalidatePath(appNavLinks.home.href);
  } catch (error) {
    console.error("Failed to create goal:", error);
    throw error;
  }
};

export const toggleCompletionAction = async (goalId: string, date: string) => {
  try {
    await toggleCompletion(goalId, date);
    revalidateTag(CACHE_TAGS.completions);
    revalidatePath(appNavLinks.home.href);
  } catch (error) {
    console.error("Failed to toggle completion:", error);
    throw error;
  }
};

export const deleteGoalAction = async (goalId: string) => {
  try {
    await deleteGoal(goalId);
    revalidateTag(CACHE_TAGS.goals);
    revalidatePath(appNavLinks.home.href);
  } catch (error) {
    console.error("Failed to delete goal:", error);
    throw error;
  }
};
