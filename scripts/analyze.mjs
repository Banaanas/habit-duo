// Read-only analysis of the latest snapshot. Modifies nothing.
import { readFileSync, readdirSync } from "node:fs";

const dir = "backups";
const latest = readdirSync(dir)
  .filter((f) => f.startsWith("snapshot-"))
  .sort()
  .pop();
const snap = JSON.parse(readFileSync(`${dir}/${latest}`, "utf8"));
console.log(`Using snapshot: ${latest}\n`);

const CYRIL = snap.users.find((u) => u.name === "Cyril");
const ecriture = snap.goals.find(
  (g) => g.user_id === CYRIL.id && g.title.includes("Écriture")
);
const noSugar = snap.goals.find(
  (g) => g.user_id === CYRIL.id && g.title.includes("Sugar")
);

const datesFor = (goalId) =>
  snap.completions
    .filter((c) => c.goal_id === goalId)
    .map((c) => c.completion_date)
    .sort();

const ecrDates = datesFor(ecriture.id);
const sugarDates = datesFor(noSugar.id);

console.log(`Écriture (id=${ecriture.id})`);
console.log(`  created_at: ${ecriture.created_at}`);
console.log(`  completions: ${ecrDates.length}`);
console.log(`  first: ${ecrDates[0]}   last: ${ecrDates[ecrDates.length - 1]}`);

console.log(`\nNo Sugar (id=${noSugar.id})`);
console.log(`  created_at: ${noSugar.created_at}`);
console.log(`  completions: ${sugarDates.length}  -> ${sugarDates.join(", ")}`);

// Find gaps in écriture (the "pause" days)
console.log(`\nGaps in Écriture streak (missing days between first and last):`);
const set = new Set(ecrDates);
const start = new Date(ecrDates[0]);
const end = new Date(ecrDates[ecrDates.length - 1]);
const gaps = [];
for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  const iso = d.toISOString().slice(0, 10);
  if (!set.has(iso)) gaps.push(iso);
}
console.log(gaps.length ? "  " + gaps.join(", ") : "  none (unbroken)");

console.log(`\nTotal span: ${ecrDates[0]} -> ${ecrDates[ecrDates.length - 1]}`);
const days = Math.round((end - start) / 86400000) + 1;
console.log(`  ${days} calendar days, ${ecrDates.length} completed`);
