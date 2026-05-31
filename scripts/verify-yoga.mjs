// Read-only verification of the yoga restoration. Writes nothing.
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
  .eq("user_id", cyril.id)
  .order("created_at");

console.log("Cyril's goals:");
for (const g of goals) {
  const { count } = await s
    .from("completions")
    .select("*", { count: "exact", head: true })
    .eq("goal_id", g.id);
  console.log(
    `  "${g.title}"  created=${g.created_at.slice(0, 10)}  archived=${g.archived_at ?? "no"}  completions=${count}`
  );
}

const yoga = goals.find((g) => g.title.includes("Yoga"));
if (!yoga) {
  console.log("\n⚠️  No yoga goal found!");
  process.exit(1);
}
const { data: ycs } = await s
  .from("completions")
  .select("completion_date")
  .eq("goal_id", yoga.id)
  .order("completion_date");
const dates = ycs.map((c) => c.completion_date);
console.log(`\nYoga goal id: ${yoga.id}`);
console.log(`Yoga completions: ${dates.length}`);
console.log(`  first=${dates[0]}  last=${dates[dates.length - 1]}`);
console.log(`  has 2026-05-30? ${dates.includes("2026-05-30")} (expect false)`);
console.log(`  has 2026-05-31? ${dates.includes("2026-05-31")} (expect false)`);

// check for gaps in range
const set = new Set(dates);
const start = new Date(dates[0]);
const end = new Date(dates[dates.length - 1]);
const gaps = [];
for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  const iso = d.toISOString().slice(0, 10);
  if (!set.has(iso)) gaps.push(iso);
}
console.log(`  gaps in range: ${gaps.length ? gaps.join(", ") : "none"}`);
