import { eachDayOfInterval, startOfWeek, subDays, subWeeks } from "date-fns";

import { Completion, Goal } from "@/types/database-camel-case";
import { formatDateToISO, parseLocalDate } from "@/utils/date";

export type HeatmapDay = {
  date: string;
  completedGoals: { id: string; title: string }[];
  totalGoals: number;
};

export function buildHeatmapData(
  goals: Goal[],
  completions: Completion[],
  weeks = 12
): HeatmapDay[] {
  const today = new Date();
  const startDate = startOfWeek(subWeeks(today, weeks - 1), {
    weekStartsOn: 1,
  });

  const goalById = new Map(goals.map((g) => [g.id, g]));

  const completionsByDate = new Map<string, Completion[]>();
  for (const c of completions) {
    const list = completionsByDate.get(c.completionDate) ?? [];
    list.push(c);
    completionsByDate.set(c.completionDate, list);
  }

  return eachDayOfInterval({ start: startDate, end: today }).map((date) => {
    const dateStr = formatDateToISO(date);
    const dayCmps = completionsByDate.get(dateStr) ?? [];
    const completedGoals = dayCmps
      .map((c) => goalById.get(c.goalId))
      .filter((g): g is Goal => g !== undefined)
      .map((g) => ({ id: g.id, title: g.title }));

    return {
      date: dateStr,
      completedGoals,
      totalGoals: goals.length,
    };
  });
}

export function calculateCurrentStreak(completionDates: string[]): number {
  if (completionDates.length === 0) return 0;

  const dateSet = new Set(completionDates);
  const today = new Date();
  const todayStr = formatDateToISO(today);
  const yesterdayStr = formatDateToISO(subDays(today, 1));

  let startStr: string;
  if (dateSet.has(todayStr)) {
    startStr = todayStr;
  } else if (dateSet.has(yesterdayStr)) {
    startStr = yesterdayStr;
  } else {
    return 0;
  }

  let streak = 0;
  let current = parseLocalDate(startStr);

  while (dateSet.has(formatDateToISO(current))) {
    streak++;
    current = subDays(current, 1);
  }

  return streak;
}
