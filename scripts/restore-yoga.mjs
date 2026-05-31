// Reconstruct Cyril's "Yoga" goal + completions, mirroring his "Écriture"
// completions up to and including 2026-05-27 (last real yoga day before the
// switch to No Sugar). The 28-29 May gap is inherited naturally from Écriture.
//
// SAFETY: defaults to DRY RUN (writes nothing). Pass --apply to actually write.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const APPLY = process.argv.includes("--apply");

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CUTOFF = "2026-05-27"; // inclusive: last real yoga day
const YOGA_TITLE = "🧘🏾 - Yoga";
const YOGA_CREATED_AT = "2026-02-16T00:00:00.000Z";

// 1. Resolve Cyril + his Écriture goal (live, to be safe)
const { data: users, error: uErr } = await supabase
  .from("users")
  .select("id, name");
if (uErr) throw uErr;
const cyril = users.find((u) => u.name === "Cyril");
if (!cyril) throw new Error("Cyril not found");

const { data: goals, error: gErr } = await supabase
  .from("goals")
  .select("id, title, user_id")
  .eq("user_id", cyril.id);
if (gErr) throw gErr;

const ecriture = goals.find((g) => g.title.includes("Écriture"));
if (!ecriture) throw new Error("Écriture goal not found");

const existingYoga = goals.find((g) => g.title === YOGA_TITLE);

// 2. Read Écriture completions, filter to <= CUTOFF
const { data: ecrCompletions, error: cErr } = await supabase
  .from("completions")
  .select("completion_date")
  .eq("goal_id", ecriture.id)
  .order("completion_date");
if (cErr) throw cErr;

const yogaDates = ecrCompletions
  .map((c) => c.completion_date)
  .filter((d) => d <= CUTOFF);

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`Mode: ${APPLY ? "APPLY (will write)" : "DRY RUN (no writes)"}`);
console.log(`Cyril id:        ${cyril.id}`);
console.log(`Écriture goal:   ${ecriture.id}`);
console.log(`Écriture total:  ${ecrCompletions.length} completions`);
console.log(`Cutoff:          <= ${CUTOFF}`);
console.log("");
console.log(`Would create goal: "${YOGA_TITLE}"`);
console.log(`  user_id:    ${cyril.id}`);
console.log(`  created_at: ${YOGA_CREATED_AT}`);
console.log(`  archived_at: null (ACTIVE)`);
console.log(
  existingYoga
    ? `  ⚠️  A goal "${YOGA_TITLE}" ALREADY EXISTS (id=${existingYoga.id}) — would NOT duplicate.`
    : `  (no existing yoga goal — clean create)`
);
console.log("");
console.log(`Would insert ${yogaDates.length} yoga completions:`);
console.log(`  first: ${yogaDates[0]}`);
console.log(`  last:  ${yogaDates[yogaDates.length - 1]}`);

// gaps within the inserted range
const set = new Set(yogaDates);
const start = new Date(yogaDates[0]);
const end = new Date(yogaDates[yogaDates.length - 1]);
const gaps = [];
for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  const iso = d.toISOString().slice(0, 10);
  if (!set.has(iso)) gaps.push(iso);
}
console.log(`  gaps in range: ${gaps.length ? gaps.join(", ") : "none"}`);
const spanDays = Math.round((end - start) / 86400000) + 1;
console.log(`  span: ${spanDays} calendar days, ${yogaDates.length} completed`);
console.log("");
console.log("Excluded (after cutoff, NOT inserted):");
const excluded = ecrCompletions
  .map((c) => c.completion_date)
  .filter((d) => d > CUTOFF);
console.log(`  ${excluded.length ? excluded.join(", ") : "none"}`);

if (!APPLY) {
  console.log("\nDRY RUN complete. Nothing was written.");
  process.exit(0);
}

// ── APPLY ─────────────────────────────────────────────────────────────────────
if (existingYoga) {
  console.error(
    "\nAborting: yoga goal already exists. Refusing to duplicate. Review manually."
  );
  process.exit(1);
}

console.log("\nApplying...");
const { data: newGoal, error: insGoalErr } = await supabase
  .from("goals")
  .insert({
    user_id: cyril.id,
    title: YOGA_TITLE,
    description: null,
    target_days: 7,
    created_at: YOGA_CREATED_AT,
  })
  .select()
  .single();
if (insGoalErr) throw insGoalErr;
console.log(`Created yoga goal id=${newGoal.id}`);

const rows = yogaDates.map((d) => ({
  goal_id: newGoal.id,
  completion_date: d,
}));
const { error: insCmpErr } = await supabase.from("completions").insert(rows);
if (insCmpErr) throw insCmpErr;
console.log(`Inserted ${rows.length} completions.`);
console.log("Done.");
