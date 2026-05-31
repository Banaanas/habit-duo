// Read-only: verify yoga completion dates. Writes result to JSON.
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

const { data: users } = await s.from("users").select("id, name");
const cyril = users.find((u) => u.name === "Cyril");
const { data: goals } = await s
  .from("goals")
  .select("id, title, created_at")
  .eq("user_id", cyril.id);
const yoga = goals.find((g) => g.title.includes("Yoga"));

const { data: ycs } = await s
  .from("completions")
  .select("completion_date")
  .eq("goal_id", yoga.id)
  .order("completion_date");
const dates = ycs.map((c) => c.completion_date);
const set = new Set(dates);

const start = new Date(dates[0]);
const end = new Date(dates[dates.length - 1]);
const gaps = [];
for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  const iso = d.toISOString().slice(0, 10);
  if (!set.has(iso)) gaps.push(iso);
}

writeFileSync(
  "scripts/yoga-dates-check.json",
  JSON.stringify(
    {
      yogaGoalId: yoga.id,
      count: dates.length,
      first: dates[0],
      last: dates[dates.length - 1],
      gapsInRange: gaps,
      has30May: set.has("2026-05-30"),
      has31May: set.has("2026-05-31"),
    },
    null,
    2
  )
);
console.log("written");
