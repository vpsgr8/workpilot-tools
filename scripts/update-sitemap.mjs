/**
 * Regenerate sitemap.xml — preserve existing URLs, add missing tools & health pages.
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://workpilottools.biz";
const require = createRequire(import.meta.url);

const smPath = path.join(ROOT, "sitemap.xml");
let xml = fs.readFileSync(smPath, "utf8");
const urls = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

function add(url) {
  urls.add(url);
}

// Core pages
add(`${SITE}/health-tools.html`);

// All tool pages on disk
for (const file of fs.readdirSync(path.join(ROOT, "tools"))) {
  if (file.endsWith(".html")) {
    add(`${SITE}/tools/${file}`);
  }
}

// Disease detail pages
global.window = {};
require(path.join(ROOT, "assets/health-data.js"));
const diseases = global.window.WP_HEALTH?.diseases || [];
for (const d of diseases) {
  if (d.slug) {
    add(`${SITE}/disease.html?d=${encodeURIComponent(d.slug)}`);
  }
}

const sorted = [...urls].sort((a, b) => a.localeCompare(b));
const body = sorted.map((u) => `  <url><loc>${u}</loc></url>`).join("\n");
const out =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  body +
  "\n</urlset>\n";

fs.writeFileSync(smPath, out, "utf8");
console.log("Sitemap updated:", sorted.length, "URLs");
console.log("  Health hub:", diseases.length ? "yes" : "no");
console.log("  Disease pages:", diseases.length);
