// Read-only simulation of the heatmap color logic against live data.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

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
  .select("id, title, created_at, archived_at")
  .eq("user_id", cyril.id);
const goalIds = goals.map((g) => g.id);
const { data: comps } = await s
  .from("completions")
  .select("goal_id, completion_date")
  .in("goal_id", goalIds);

const countActive = (dateStr) =>
  goals.filter(
    (g) =>
      g.created_at.slice(0, 10) <= dateStr &&
      (g.archived_at === null || g.archived_at.slice(0, 10) >= dateStr)
  ).length;

const completedOn = (dateStr) =>
  comps.filter((c) => c.completion_date === dateStr).length;

const colorOld = (done, totalNow) =>
  done === 0 ? "muted" : totalNow > 0 && done >= totalNow ? "DARK" : "light";
const colorNew = (done, totalDay) =>
  done === 0 ? "muted" : totalDay > 0 && done >= totalDay ? "DARK" : "light";

const totalNow = goals.length; // old buggy behaviour
const sample = [
  "2026-03-15",
  "2026-04-20",
  "2026-05-15",
  "2026-05-27",
  "2026-05-28",
  "2026-05-30",
  "2026-05-31",
];
console.log(`goals.length (today) = ${totalNow}\n`);
console.log("date        done  activeThatDay   OLD     NEW");
for (const d of sample) {
  const done = completedOn(d);
  const act = countActive(d);
  console.log(
    `${d}   ${done}     ${act}              ${colorOld(done, totalNow).padEnd(6)}  ${colorNew(done, act)}`
  );
}
