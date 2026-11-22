// Makes public/og.png (1200x630 link preview for LinkedIn, Slack, texts) and
// public/apple-touch-icon.png (180x180) from content.js, using headless Chrome.
// Run: npm run images   (set CHROME=/path/to/chrome if it isn't in the usual place)
import { existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const useOwn = existsSync(new URL("content.js", root));
const { default: c } = await import(new URL(useOwn ? "content.js" : "content.example.js", root));

const chrome = process.env.CHROME || [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find(existsSync);
if (!chrome) { console.error("Chrome not found. Set CHROME=/path/to/chrome."); process.exit(1); }

const esc = (s = "") => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
const p = c.person;
const host = (c.site.url || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const stats = (c.impact || []).slice(0, 3);
const fonts = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Public+Sans:wght@500;700&display=swap">`;

const og = `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#f4f6fa;font-family:"Public Sans",Arial,sans-serif;color:#14213a;position:relative;overflow:hidden}
.band{position:absolute;inset:auto 0 0 0;height:190px;background:#14213a;border-top:10px solid #b3261e}
.wrap{position:absolute;inset:56px 64px 0 64px}
.hello{font:700 34px/1 "Barlow Condensed";color:#4f5c74}
.name{display:inline-block;margin-top:12px;background:#14213a;color:#f4f6fa;font:800 92px/1 "Barlow Condensed";text-transform:uppercase;padding:12px 30px 8px;transform:skewX(-8deg);box-shadow:9px 9px 0 #b3261e}
.role{margin-top:26px;font:700 30px/1.2 "Public Sans";color:#1d3461;max-width:760px}
.line{margin-top:10px;font:700 46px/1.05 "Barlow Condensed";max-width:760px}
.ring{position:absolute;right:64px;top:56px;width:250px;height:250px;border-radius:50%;padding:10px;background:conic-gradient(from 200deg,#b3261e,#b8860b,#1d3461,#b3261e)}
.ring div{width:100%;height:100%;border-radius:50%;border:8px solid #f4f6fa;background:#14213a;display:grid;place-items:center;color:#f4f6fa;font:800 110px/1 "Barlow Condensed";overflow:hidden}
.ring img{width:100%;height:100%;object-fit:cover}
.stats{position:absolute;left:64px;right:64px;bottom:34px;display:flex;gap:56px;color:#f4f6fa}
.stats b{display:block;font:700 64px/1 "Barlow Condensed"}
.stats span{font:500 20px/1.3 "Public Sans";color:#c9d2e3}
.url{position:absolute;right:64px;top:345px;width:250px;text-align:center;font:700 24px/1 "Public Sans";color:#1d3461}
</style></head><body>
<div class="ring"><div>${p.photo ? `<img src="${new URL("public" + p.photo, root).href}">` : esc(c.site.monogram)}</div></div>
<div class="wrap"><p class="hello">${esc(p.hello)}</p><p class="name">${esc(p.name)}</p><p class="role">${esc(p.role)}</p><p class="line">${esc(p.headline)}</p></div>
<div class="band"></div>
<div class="stats">${stats.map((s) => `<p><b>${esc(s.value)}</b><span>${esc(s.label)}</span></p>`).join("")}</div>
<p class="url">${esc(host)}</p>
</body></html>`;

const icon = `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>
*{margin:0}body{width:180px;height:180px;background:#14213a;display:grid;place-items:center;position:relative}
p{color:#f4f6fa;font:800 92px/1 "Barlow Condensed";letter-spacing:2px;margin-top:-8px}
i{position:absolute;left:30px;right:30px;bottom:30px;height:10px;background:#b3261e}
</style></head><body><p>${esc(c.site.monogram)}</p><i></i></body></html>`;

const dir = mkdtempSync(join(tmpdir(), "og-"));
const shot = (html, out, w, h) => {
  const file = join(dir, `${w}x${h}.html`);
  writeFileSync(file, html);
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    `--window-size=${w},${h}`, "--virtual-time-budget=4000", `--screenshot=${new URL(out, root).pathname}`, `file://${file}`], { stdio: "ignore" });
  console.log(`wrote ${out}`);
};
shot(og, "public/og.png", 1200, 630);
shot(icon, "public/apple-touch-icon.png", 180, 180);
rmSync(dir, { recursive: true, force: true });
