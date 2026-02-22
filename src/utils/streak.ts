import { eachDayOfInterval, startOfWeek, subDays, subWeeks } from "date-fns";

import { Completion, Goal } from "@/types/database-camel-case";
import { formatDateToISO, parseLocalDate } from "@/utils/date";

export const buildHeatmapData = (
  goals: Goal[],
  completions: Completion[],
  weeks = 12
): HeatmapDay[] => {
  const today = new Date();
  const startDate = startOfWeek(subWeeks(today, weeks - 1), {
    weekStartsOn: 1,
  });

  const goalById = new Map(goals.map((g) => [g.id, g]));
  const completionsByDate = groupCompletionsByDate(completions);

  return eachDayOfInterval({ start: startDate, end: today }).map((date) =>
    mapDateToHeatmapDay(date, completionsByDate, goalById, goals.length)
  );
};

export interface HeatmapGoal {
  id: string;
  title: string;
}

export interface HeatmapDay {
  date: string;
  completedGoals: HeatmapGoal[];
  totalGoals: number;
}

export const calculateCurrentStreak = (completionDates: string[]): number => {
  if (completionDates.length === 0) return 0;

  const dateSet = new Set(completionDates);
  const startDate = findStreakStartDate(dateSet);

  if (startDate === null) return 0;

  let streak = 0;
  let current = parseLocalDate(startDate);

  while (dateSet.has(formatDateToISO(current))) {
    streak++;
    current = subDays(current, 1);
  }

  return streak;
};

const groupCompletionsByDate = (
  completions: Completion[]
): Map<string, Completion[]> => {
  const map = new Map<string, Completion[]>();

  for (const c of completions) {
    const list = map.get(c.completionDate) ?? [];
    list.push(c);
    map.set(c.completionDate, list);
  }

  return map;
};

const mapDateToHeatmapDay = (
  date: Date,
  completionsByDate: Map<string, Completion[]>,
  goalById: Map<string, Goal>,
  totalGoals: number
): HeatmapDay => {
  const dateStr = formatDateToISO(date);
  const completedGoals = getCompletedGoalsForDate(
    dateStr,
    completionsByDate,
    goalById
  );

  return { date: dateStr, completedGoals, totalGoals };
};

const getCompletedGoalsForDate = (
  dateStr: string,
  completionsByDate: Map<string, Completion[]>,
  goalById: Map<string, Goal>
): HeatmapGoal[] => {
  const dayCmps = completionsByDate.get(dateStr) ?? [];

  return dayCmps
    .map((c) => goalById.get(c.goalId))
    .filter((g): g is Goal => g !== undefined)
    .map((g) => ({ id: g.id, title: g.title }));
};

const findStreakStartDate = (dateSet: Set<string>): string | null => {
  const todayStr = formatDateToISO(new Date());
  const yesterdayStr = formatDateToISO(subDays(new Date(), 1));

  if (dateSet.has(todayStr)) return todayStr;
  if (dateSet.has(yesterdayStr)) return yesterdayStr;

  return null;
};
