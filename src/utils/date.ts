import {
  addWeeks,
  eachDayOfInterval,
  format,
  isAfter,
  isToday as isTodayFn,
  startOfDay,
} from "date-fns";

/**
 * Parses a date string (YYYY-MM-DD) as a local date.
 *
 * This avoids timezone issues where `new Date("2026-01-12")` is interpreted
 * as UTC midnight, which can shift to a different day in other timezones.
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const getCurrentWeekDates = (
  startDate: string,
  endDate: string
): Date[] => {
  return eachDayOfInterval({
    start: parseLocalDate(startDate),
    end: parseLocalDate(endDate),
  });
};

export const isToday = (date: Date): boolean => {
  return isTodayFn(date);
};

export const getDayName = (date: Date): string => {
  return format(date, "EEE").toUpperCase();
};

export const formatDateToISO = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const normalizeDate = (date: Date): Date => {
  return startOfDay(date);
};

export const isPastOrToday = (date: Date): boolean => {
  const today = startOfDay(new Date());
  const compareDate = startOfDay(date);
  return !isAfter(compareDate, today);
};

export const isFutureDate = (date: Date): boolean => {
  const today = startOfDay(new Date());
  const compareDate = startOfDay(date);
  return isAfter(compareDate, today);
};

export const getOffsetWeekDates = (
  startDate: string,
  endDate: string,
  offset: number
): { startDate: string; endDate: string } => {
  const start = addWeeks(parseLocalDate(startDate), offset);
  const end = addWeeks(parseLocalDate(endDate), offset);
  return {
    startDate: formatDateToISO(start),
    endDate: formatDateToISO(end),
  };
};
