import Papa from "papaparse";

import { getByHeader } from "./helpers";

import {
  GOOGLE_SHEET_CSV_ROOT,
  GOOGLE_SHEET_ID,
  SHEETS,
  SheetKey,
} from "@/data/google-sheets.config";
import type { GoogleSheetItem } from "@/types/google-sheet";

type RawRow = Record<string, string | number | boolean | null | undefined>;

export const fetchSingleSheet = async (
  sheetKey: SheetKey
): Promise<GoogleSheetItem[]> => {
  const { gid, category } = SHEETS[sheetKey];

  const url = `${GOOGLE_SHEET_CSV_ROOT}/${GOOGLE_SHEET_ID}/pub?output=csv&gid=${gid}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    console.log(response.ok);

    if (!response.ok) {
      console.error(`Failed to fetch sheet ${sheetKey}: ${response.status}`);
      return [];
    }

    const csvText = await response.text();

    if (!csvText) {
      console.error(`Empty response for sheet ${sheetKey}`);
      return [];
    }

    const parsed = Papa.parse<RawRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    return parsed.data.map((row) => ({
      artist: getByHeader(row, [/artist/i, /band/i, /label/i]),
      country: getByHeader(row, [/country/i]),
      explanation: getByHeader(row, [/explanation/i, /notes?/i, /comment/i]),
      category,
    }));
  } catch (error) {
    console.error(`Error fetching sheet ${sheetKey}:`, error);
    return [];
  }
};
