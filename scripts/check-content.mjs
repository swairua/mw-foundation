// Lists every placeholder (values starting with TODO, null impact numbers, missing
// partner logos) that the Foundation still needs to supply, and validates content.
// Exit code is 1 while anything is outstanding, so it can gate a production launch.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = path.join(root, "content");
const todos = [];
const errors = [];

function walk(value, where) {
  if (typeof value === "string" && /^TODO\b/i.test(value.trim())) todos.push(`${where}: ${value.replace(/^TODO:?\s*/i, "")}`);
  else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${where}[${i}]`));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) if (!k.startsWith("_")) walk(v, `${where}.${k}`);
}

for (const file of fs.readdirSync(content).filter((f) => f.endsWith(".json"))) {
  const data = JSON.parse(fs.readFileSync(path.join(content, file), "utf8"));
  walk(data, file.replace(".json", ""));
}

const impact = JSON.parse(fs.readFileSync(path.join(content, "impact.json"), "utf8"));
impact.stats.forEach((s) => s.value == null && todos.push(`impact: confirmed number for "${s.label}" (showing interim: ${s.interim.value} ${s.interim.label})`));

const partners = JSON.parse(fs.readFileSync(path.join(content, "partners.json"), "utf8"));
if (!partners.partners.length) todos.push("partners: partner/supporter logos (strip is hidden in production until supplied)");

const donate = JSON.parse(fs.readFileSync(path.join(content, "donate.json"), "utf8"));
if (!donate.card.url) todos.push("donate.card.url: card/PayPal donation link (shows 'coming soon' until set)");

const about = JSON.parse(fs.readFileSync(path.join(content, "about.json"), "utf8"));
about.governance.documents.forEach((d) => !d.file && todos.push(`about.governance: file for "${d.name}"`));
about.governance.policies.forEach((p) => !p.file && todos.push(`about.governance: file for "${p.name}"`));

const media = JSON.parse(fs.readFileSync(path.join(content, "media.json"), "utf8"));
const images = new Set(fs.readdirSync(path.join(content, "images")).map((f) => f.replace(/\.[^.]+$/, "").toLowerCase()));
const pillars = JSON.parse(fs.readFileSync(path.join(content, "pillars.json"), "utf8")).pillars;
const pillarSlugs = new Set(pillars.map((p) => p.slug));
const key = (v) => String(v).split("/").pop().replace(/\.[^.]+$/, "").toLowerCase();
pillars.forEach((p) => !images.has(key(p.image)) && errors.push(`pillars.${p.slug}: image "${p.image}" not found in content/images`));

for (const file of fs.readdirSync(path.join(content, "stories")).filter((f) => f.endsWith(".md"))) {
  const { data, content: body } = matter(fs.readFileSync(path.join(content, "stories", file), "utf8"));
  const where = `stories/${file}`;
  if (!data.title) errors.push(`${where}: missing title`);
  if (!data.date) errors.push(`${where}: missing date`);
  if (!data.excerpt) errors.push(`${where}: missing excerpt`);
  (data.pillars ?? []).forEach((p) => !pillarSlugs.has(p) && errors.push(`${where}: unknown pillar "${p}"`));
  if (data.image && !images.has(key(data.image))) errors.push(`${where}: image "${data.image}" not found`);
  (data.gallery ?? []).forEach((g) => !images.has(key(g)) && errors.push(`${where}: gallery image "${g}" not found`));
  for (const m of body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const key = m[1].split("/").pop().replace(/\.[^.]+$/, "").toLowerCase();
    if (!images.has(key)) errors.push(`${where}: inline image "${m[1]}" not found`);
  }
}
for (const key of images) if (!media[key]) errors.push(`media.json: no alt text for image "${key}"`);

if (errors.length) {
  console.log(`\n✖ ${errors.length} content error(s):`);
  errors.forEach((e) => console.log(`  - ${e}`));
}
if (todos.length) {
  console.log(`\n• ${todos.length} item(s) still to be supplied by the Foundation:`);
  todos.forEach((t) => console.log(`  - ${t}`));
}
if (!errors.length && !todos.length) console.log("✓ Content complete — ready for production.");
process.exit(errors.length || todos.length ? 1 : 0);
