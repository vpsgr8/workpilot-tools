import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const GA_ID = "G-R0HRTRJJFN";

const GA_BLOCK = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GA_ID}');
</script>`;

const SKIP_DIRS = new Set([".git", "node_modules", "structured", "toolkit-built", "scripts"]);

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function removeGtag(html) {
  html = html.replace(
    /<!-- Google tag \(gtag\.js\) -->[\s\S]*?gtag\('config', 'G-R0HRTRJJFN'\);\s*<\/script>\s*/g,
    ""
  );
  html = html.replace(
    /\n?<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+"><\/script>\s*\n?<script>[\s\S]*?gtag\('config',[^)]+\);[\s\S]*?<\/script>\s*/g,
    ""
  );
  return html;
}

function applyGtag(html) {
  if (html.includes(GA_ID)) return { html, changed: false, reason: "already-has-tag" };

  html = removeGtag(html);
  if (!/<head>/i.test(html)) return { html, changed: false, reason: "no-head" };

  const next = html.replace(/(<head>)/i, `$1\n${GA_BLOCK}\n`);
  return { html: next, changed: next !== html, reason: "inserted" };
}

const files = walkHtml(ROOT);
let updated = 0;
let skipped = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  html = removeGtag(html);
  if (html.includes(GA_ID)) {
    skipped++;
    continue;
  }

  if (!/<head>/i.test(html)) {
    skipped++;
    continue;
  }

  html = html.replace(/(<head>)/i, `$1\n${GA_BLOCK}\n`);
  if (html !== before) {
    fs.writeFileSync(file, html);
    updated++;
  }
}

console.log(`Updated ${updated} HTML files with Google tag ${GA_ID}. Skipped ${skipped}. Total scanned: ${files.length}.`);
