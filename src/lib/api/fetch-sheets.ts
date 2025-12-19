import { cacheLife } from "next/cache";

import { SHEETS, SheetKey } from "@/data/google-sheets.config";
import { fetchSingleSheet } from "@/lib/api/fetch-single-sheet";
import type { GoogleSheetItem } from "@/types/google-sheet";

export const fetchGoogleSheets = async (): Promise<GoogleSheetItem[]> => {
  "use cache";
  cacheLife("hours");

  const allSheets = Object.keys(SHEETS) as SheetKey[];

  const results = await Promise.all(allSheets.map(fetchSingleSheet));

  return results.flat();
};
