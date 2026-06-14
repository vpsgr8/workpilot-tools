import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SKIP_DIRS = new Set([".git", "node_modules", "structured", "toolkit-built", "scripts"]);

const CSS = (p) => `<link rel="stylesheet" href="${p}site-brand.css">`;
const JS = (p) => `<script defer src="${p}site-brand.js"></script>`;

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function assetPrefix(relPath) {
  const depth = relPath.split(path.sep).length - 1;
  if (depth <= 0) return "assets/";
  return "../".repeat(depth) + "assets/";
}

function inject(html, prefix) {
  if (html.includes("site-brand.js")) return html;

  if (html.includes(`href="${prefix}monetization.css"`)) {
    html = html.replace(
      `<link rel="stylesheet" href="${prefix}monetization.css">`,
      `<link rel="stylesheet" href="${prefix}monetization.css">\n${CSS(prefix)}`
    );
  } else if (html.includes(`href="${prefix}theme.css"`)) {
    html = html.replace(
      `<link rel="stylesheet" href="${prefix}theme.css">`,
      `<link rel="stylesheet" href="${prefix}theme.css">\n${CSS(prefix)}`
    );
  } else if (/<head>/i.test(html)) {
    html = html.replace(/(<head>)/i, `$1\n${CSS(prefix)}`);
  }

  if (html.includes(`src="${prefix}monetization.js"`)) {
    html = html.replace(
      `<script defer src="${prefix}monetization.js"></script>`,
      `<script defer src="${prefix}monetization.js"></script>\n${JS(prefix)}`
    );
  } else if (html.includes(`src="${prefix}theme.js"`)) {
    html = html.replace(
      `<script defer src="${prefix}theme.js"></script>`,
      `<script defer src="${prefix}theme.js"></script>\n${JS(prefix)}`
    );
  } else if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `${JS(prefix)}\n</head>`);
  }

  return html;
}

const files = walkHtml(ROOT);
let updated = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const prefix = assetPrefix(rel);
  const before = fs.readFileSync(file, "utf8");
  const after = inject(before, prefix);
  if (after !== before) {
    fs.writeFileSync(file, after);
    updated++;
  }
}

console.log(`Injected site-brand assets into ${updated} HTML files.`);
