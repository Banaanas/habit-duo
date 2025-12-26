import {
  eachDayOfInterval,
  format,
  isAfter,
  isToday as isTodayFn,
  startOfDay,
} from "date-fns";

export const getCurrentWeekDates = (
  startDate: string,
  endDate: string
): Date[] => {
  return eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
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
