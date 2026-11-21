// Builds dist/ from content.js (your details) or content.example.js (the template's sample).
// No dependencies: plain Node 18+.
import { existsSync, mkdirSync, rmSync, cpSync, writeFileSync } from "node:fs";
import { render } from "./render.mjs";

const root = new URL(".", import.meta.url);
const useOwn = existsSync(new URL("content.js", root));
const { default: c } = await import(new URL(useOwn ? "content.js" : "content.example.js", root));
const dist = new URL("dist/", root);

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
const hasOg = existsSync(new URL("public/og.png", root));
const { html, notFound, favicon, siteUrl } = render(c, { hasOg });

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(new URL("public/", root), dist, { recursive: true });
cpSync(new URL("src/styles.css", root), new URL("styles.css", dist));
cpSync(new URL("src/app.js", root), new URL("app.js", dist));
writeFileSync(new URL("index.html", dist), html);
writeFileSync(new URL("404.html", dist), notFound);
writeFileSync(new URL("favicon.svg", dist), favicon);
writeFileSync(new URL("robots.txt", dist), `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ""}`);
if (siteUrl)
  writeFileSync(
    new URL("sitemap.xml", dist),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${esc(siteUrl)}/</loc></url></urlset>\n`
  );
writeFileSync(
  new URL("_headers", dist),
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: DENY\n`
);

console.log(`Built dist/ from ${useOwn ? "content.js" : "content.example.js"}`);
