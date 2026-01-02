import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  formatDateToISO,
  getCurrentWeekDates,
  getDayName,
  isFutureDate,
  isPastOrToday,
  isToday,
  normalizeDate,
} from "@/utils/date";

describe("getCurrentWeekDates", () => {
  it("should return array of dates for a 7-day week", () => {
    const dates = getCurrentWeekDates("2024-01-01", "2024-01-07");

    expect(dates).toHaveLength(7);
    expect(formatDateToISO(dates[0])).toBe("2024-01-01");
    expect(formatDateToISO(dates[6])).toBe("2024-01-07");
  });

  it("should return array of dates for a single day", () => {
    const dates = getCurrentWeekDates("2024-01-15", "2024-01-15");

    expect(dates).toHaveLength(1);
    expect(formatDateToISO(dates[0])).toBe("2024-01-15");
  });

  it("should handle dates spanning multiple months", () => {
    const dates = getCurrentWeekDates("2024-01-29", "2024-02-04");

    expect(dates).toHaveLength(7);
    expect(formatDateToISO(dates[0])).toBe("2024-01-29");
    expect(formatDateToISO(dates[6])).toBe("2024-02-04");
  });

  it("should handle leap year dates", () => {
    const dates = getCurrentWeekDates("2024-02-26", "2024-03-03");

    expect(dates).toHaveLength(7);
    expect(formatDateToISO(dates[3])).toBe("2024-02-29"); // Leap day
  });
});

describe("isToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return true for today's date", () => {
    const mockToday = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isToday(new Date("2024-01-15"));

    expect(result).toBe(true);
  });

  it("should return false for yesterday", () => {
    const mockToday = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isToday(new Date("2024-01-14"));

    expect(result).toBe(false);
  });

  it("should return false for tomorrow", () => {
    const mockToday = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isToday(new Date("2024-01-16"));

    expect(result).toBe(false);
  });
});

describe("getDayName", () => {
  it("should return uppercase day abbreviation for Monday", () => {
    const monday = new Date("2024-01-01"); // Jan 1, 2024 is a Monday

    const result = getDayName(monday);

    expect(result).toBe("MON");
  });

  it("should return uppercase day abbreviation for Sunday", () => {
    const sunday = new Date("2024-01-07"); // Jan 7, 2024 is a Sunday

    const result = getDayName(sunday);

    expect(result).toBe("SUN");
  });

  it("should return uppercase day abbreviation for Wednesday", () => {
    const wednesday = new Date("2024-01-03");

    const result = getDayName(wednesday);

    expect(result).toBe("WED");
  });
});

describe("formatDateToISO", () => {
  it("should format date to YYYY-MM-DD", () => {
    const date = new Date("2024-01-15T12:30:45Z");

    const result = formatDateToISO(date);

    expect(result).toBe("2024-01-15");
  });

  it("should format date with single-digit month and day", () => {
    const date = new Date("2024-03-05");

    const result = formatDateToISO(date);

    expect(result).toBe("2024-03-05");
  });

  it("should handle end of year dates", () => {
    const date = new Date("2024-12-31");

    const result = formatDateToISO(date);

    expect(result).toBe("2024-12-31");
  });
});

describe("normalizeDate", () => {
  it("should return start of day for date with time", () => {
    const date = new Date("2024-01-15T14:30:45Z");

    const result = normalizeDate(date);

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("should return same date if already at start of day", () => {
    const date = new Date("2024-01-15T00:00:00Z");

    const result = normalizeDate(date);

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });
});

describe("isPastOrToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return true for past date", () => {
    const mockToday = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isPastOrToday(new Date("2024-01-10"));

    expect(result).toBe(true);
  });

  it("should return true for today", () => {
    const mockToday = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isPastOrToday(new Date("2024-01-15"));

    expect(result).toBe(true);
  });

  it("should return false for future date", () => {
    const mockToday = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isPastOrToday(new Date("2024-01-20"));

    expect(result).toBe(false);
  });

  it("should normalize time when comparing", () => {
    const mockToday = new Date("2024-01-15T23:59:59Z");
    vi.setSystemTime(mockToday);

    const result = isPastOrToday(new Date("2024-01-15T00:00:00Z"));

    expect(result).toBe(true);
  });
});

describe("isFutureDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return true for future date", () => {
    const mockToday = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isFutureDate(new Date("2024-01-20"));

    expect(result).toBe(true);
  });

  it("should return false for today", () => {
    const mockToday = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isFutureDate(new Date("2024-01-15"));

    expect(result).toBe(false);
  });

  it("should return false for past date", () => {
    const mockToday = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isFutureDate(new Date("2024-01-10"));

    expect(result).toBe(false);
  });

  it("should return false for same day different time", () => {
    const mockToday = new Date("2024-01-15T10:00:00Z");
    vi.setSystemTime(mockToday);

    const result = isFutureDate(new Date("2024-01-15T20:00:00Z"));

    expect(result).toBe(false);
  });
});
