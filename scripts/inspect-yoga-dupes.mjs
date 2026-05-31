// Read-only: inspect ALL Cyril goals + any yoga dupes. Writes JSON to a file.
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
  .select("id, user_id, title, description, created_at")
  .eq("user_id", cyril.id)
  .order("created_at");

const out = [];
for (const g of goals) {
  const { count } = await s
    .from("completions")
    .select("*", { count: "exact", head: true })
    .eq("goal_id", g.id);
  out.push({
    id: g.id,
    title: g.title,
    titleHex: [...g.title].map((c) => c.codePointAt(0).toString(16)).join(" "),
    description: g.description,
    created_at: g.created_at,
    completions: count,
  });
}

writeFileSync(
  "scripts/yoga-inspect.json",
  JSON.stringify({ cyrilId: cyril.id, goals: out }, null, 2)
);
console.log("written");
