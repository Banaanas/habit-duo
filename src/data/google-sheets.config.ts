export const GOOGLE_SHEET_ROOT = "https://docs.google.com/spreadsheets/u/0/d/e";

export const GOOGLE_SHEET_ID =
  "2PACX-1vSfnVZGsyxn5eEacXKJZk3-_ql3bQAkPqzdc8p3fCdxtPS9BtvNlj0yjskUQyy3eDYBL9yYTqbba_5q";

export const GOOGLE_SHEET_CSV_ROOT = "https://docs.google.com/spreadsheets/d/e";

export const SHEETS = {
  blackMetal: {
    label: "Black Metal",
    gid: "1141938115",
    category: "black-metal",
  },
  otherGenres: {
    label: "Other Genres",
    gid: "846668971",
    category: "other-genres",
  },
  recordLabels: {
    label: "Record Labels",
    gid: "867923480",
    category: "record-labels",
  },
} as const;

export type SheetKey = keyof typeof SHEETS;
export type SheetCategory = (typeof SHEETS)[SheetKey]["category"] | "all";

export const CATEGORY_FILTERS = [
  SHEETS.blackMetal,
  SHEETS.otherGenres,
  SHEETS.recordLabels,
  {
    label: "All Categories",
    category: "all" as const,
  },
] as const;
