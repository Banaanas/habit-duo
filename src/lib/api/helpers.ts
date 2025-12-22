export const getByHeader = (row: RawRow, patterns: RegExp[]): string | null => {
  const key = Object.keys(row).find((k) => patterns.some((p) => p.test(k)));

  const value = key ? row[key] : null;

  if (value === undefined || value === null) return null;
  return String(value).trim() || null;
};

type RawRow = Record<string, unknown>;
