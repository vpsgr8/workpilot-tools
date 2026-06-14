import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SKIP_DIRS = new Set([".git", "node_modules", "structured", "toolkit-built", "scripts"]);

const CSS_LINK = (prefix) => `<link rel="stylesheet" href="${prefix}monetization.css">`;
const JS_SCRIPT = (prefix) => `<script defer src="${prefix}monetization.js"></script>`;

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

function injectMonetization(html, prefix) {
  if (html.includes("monetization.js")) return html;

  const css = CSS_LINK(prefix);
  const js = JS_SCRIPT(prefix);

  if (html.includes('href="' + prefix + 'theme.css"')) {
    html = html.replace(
      '<link rel="stylesheet" href="' + prefix + 'theme.css">',
      '<link rel="stylesheet" href="' + prefix + 'theme.css">\n' + css
    );
  } else if (/<head>/i.test(html)) {
    html = html.replace(/(<head>)/i, "$1\n" + css);
  }

  if (html.includes('src="' + prefix + 'theme.js"')) {
    html = html.replace(
      '<script defer src="' + prefix + 'theme.js"></script>',
      '<script defer src="' + prefix + 'theme.js"></script>\n' + js
    );
  } else if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, js + "\n</head>");
  }

  return html;
}

const files = walkHtml(ROOT);
let updated = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const prefix = assetPrefix(rel);
  const before = fs.readFileSync(file, "utf8");
  const after = injectMonetization(before, prefix);
  if (after !== before) {
    fs.writeFileSync(file, after);
    updated++;
  }
}

console.log(`Injected monetization assets into ${updated} HTML files (${files.length} scanned).`);
