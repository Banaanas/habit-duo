export const GOOGLE_SHEET_ID =
  "2PACX-1vSfnVZGsyxn5eEacXKJZk3-_ql3bQAkPqzdc8p3fCdxtPS9BtvNlj0yjskUQyy3eDYBL9yYTqbba_5q";

export const SHEETS = {
  blackMetal: {
    title: "Black Metal",
    gid: "1141938115",
    slug: "black-metal",
  },
  otherGenres: {
    title: "Other Genres",
    gid: "846668971",
    slug: "other-genres",
  },
  recordLabels: {
    title: "Record Labels",
    gid: "867923480",
    slug: "labels",
  },
} as const;

export type SheetKey = keyof typeof SHEETS;
