// Read-only: generates SQL to restore Cyril's Yoga goal + completions.
// Writes the SQL to ./scripts/restore-yoga.sql. Does NOT touch the database.
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const s = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CUTOFF = "2026-05-27";
const YOGA_TITLE = "🧘🏾 - Yoga";
const YOGA_CREATED = "2026-02-16T00:00:00.000Z";

const { data: u } = await s.from("users").select("id, name");
const cyril = u.find((x) => x.name === "Cyril");
const { data: goals } = await s
  .from("goals")
  .select("id, title")
  .eq("user_id", cyril.id);
const ecriture = goals.find((g) => g.title.includes("Écriture"));
const existingYoga = goals.find((g) => g.title === YOGA_TITLE);
if (existingYoga) {
  console.error("ABORT: a yoga goal already exists. Nothing generated.");
  process.exit(1);
}

const { data: cmps } = await s
  .from("completions")
  .select("completion_date")
  .eq("goal_id", ecriture.id)
  .order("completion_date");
const dates = cmps.map((c) => c.completion_date).filter((d) => d <= CUTOFF);

const esc = (x) => x.replace(/'/g, "''");
const sql = `-- Restore Cyril's Yoga goal + ${dates.length} completions (16 Feb -> 27 May 2026)
-- Runs as postgres in the Supabase SQL Editor (bypasses RLS).
BEGIN;

WITH new_goal AS (
  INSERT INTO goals (user_id, title, description, target_days, created_at)
  VALUES ('${cyril.id}', '${esc(YOGA_TITLE)}', NULL, 7, '${YOGA_CREATED}')
  RETURNING id
)
INSERT INTO completions (goal_id, completion_date)
SELECT new_goal.id, v.d::date
FROM new_goal, (VALUES
${dates.map((d) => `  ('${d}')`).join(",\n")}
) AS v(d);

COMMIT;
`;

writeFileSync("scripts/restore-yoga.sql", sql);
console.log(`Generated scripts/restore-yoga.sql`);
console.log(`  goal: "${YOGA_TITLE}" (user ${cyril.id})`);
console.log(`  completions: ${dates.length}`);
console.log(`  first: ${dates[0]}   last: ${dates[dates.length - 1]}`);
