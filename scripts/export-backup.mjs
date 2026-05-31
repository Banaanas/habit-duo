// Read-only safety export of the Supabase data (users, goals, completions).
// Writes a timestamped JSON snapshot to ./backups/. Does NOT modify anything.
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

const [users, goals, completions] = await Promise.all([
  supabase.from("users").select("*").order("name"),
  supabase.from("goals").select("*").order("created_at"),
  supabase.from("completions").select("*").order("completion_date"),
]);

for (const [name, res] of [
  ["users", users],
  ["goals", goals],
  ["completions", completions],
]) {
  if (res.error) {
    console.error(`Error reading ${name}:`, res.error.message);
    process.exit(1);
  }
}

mkdirSync("backups", { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const file = `backups/snapshot-${stamp}.json`;
writeFileSync(
  file,
  JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      supabaseHost: new URL(url).host,
      users: users.data,
      goals: goals.data,
      completions: completions.data,
    },
    null,
    2
  )
);

console.log(`Snapshot written to ${file}`);
console.log("");
console.log(`Host: ${new URL(url).host}`);
console.log(`Users: ${users.data.length}`);
for (const u of users.data) {
  console.log(`  - ${u.name} (${u.avatar_emoji})  id=${u.id}`);
}
console.log(`Goals: ${goals.data.length}`);
for (const g of goals.data) {
  const owner = users.data.find((u) => u.id === g.user_id)?.name ?? "?";
  console.log(
    `  - [${owner}] "${g.title}"  created=${g.created_at?.slice(0, 10)}  id=${g.id}`
  );
}
console.log(`Completions: ${completions.data.length}`);
