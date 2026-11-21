// Fails if any file that would be published to the public template contains
// personal details from content.js (name, email, phone, LinkedIn, employers).
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

if (!existsSync("content.js")) { console.log("No content.js here, nothing personal to check against."); process.exit(0); }
const { default: c } = await import(new URL("../content.js", import.meta.url));
const host = (c.site.url || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
const needles = [c.person.name, c.person.email, c.person.linkedin, host, host.split(".")[0], ...(c.stories || []).map((k) => k.where.split(" · ")[0])]
  .filter(Boolean).map((s) => s.toLowerCase());
const files = execSync("git ls-files --cached --others --exclude-standard", { encoding: "utf8" }).split("\n").filter(Boolean);
let bad = 0;
for (const f of files) {
  if (f === "content.js") continue;
  let text; try { text = readFileSync(f, "utf8").toLowerCase(); } catch { continue; }
  for (const n of needles) if (text.includes(n)) { console.error(`✗ ${f} contains "${n}"`); bad++; }
}
if (bad) { console.error(`\n${bad} personal detail(s) found. Remove them before publishing the template.`); process.exit(1); }
console.log(`✓ ${files.length} files checked, no personal details found.`);
