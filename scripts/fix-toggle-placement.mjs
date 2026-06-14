import fs from "fs";

const blogPattern =
  /<div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">\s*<button type="button" class="wp-theme-toggle"[^>]*>🌙<\/button>\s*<a href="\.\.\/index\.html" class="flex items-center gap-2"><span class="font-bold text-xl">WorkPilot<\/span><span class="text-gray-500">Blog<\/span><\/a>\s*<a href="\.\.\/index\.html" class="text-sm text-indigo-600 hover:underline">← Back to Tools<\/a>\s*<\/div>/g;

const blogReplacement = `<div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
<a href="../index.html" class="flex items-center gap-2"><span class="font-bold text-xl">WorkPilot</span><span class="text-gray-500">Blog</span></a>
<div class="flex items-center gap-3">
<button type="button" class="wp-theme-toggle" aria-label="Toggle dark mode" aria-pressed="false" title="Toggle dark mode">🌙</button>
<a href="../index.html" class="text-sm text-indigo-600 hover:underline">← Back to Tools</a>
</div>
</div>`;

let blogCount = 0;
for (const file of fs.readdirSync("blog")) {
  if (!file.endsWith(".html") || file === "index.html") continue;
  const p = `blog/${file}`;
  let html = fs.readFileSync(p, "utf8");
  const next = html.replace(blogPattern, blogReplacement);
  if (next !== html) {
    fs.writeFileSync(p, next);
    blogCount++;
  }
}

const toolSearch =
  '<nav class="hidden md:flex gap-6 text-sm"><button type="button" class="wp-theme-toggle" aria-label="Toggle dark mode" aria-pressed="false" title="Toggle dark mode">🌙</button>';
const toolReplace =
  '<button type="button" class="wp-theme-toggle" aria-label="Toggle dark mode" aria-pressed="false" title="Toggle dark mode">🌙</button><nav class="hidden md:flex gap-6 text-sm">';

let toolCount = 0;
for (const file of fs.readdirSync("tools")) {
  if (!file.endsWith(".html")) continue;
  const p = `tools/${file}`;
  let html = fs.readFileSync(p, "utf8");
  if (html.includes(toolSearch)) {
    fs.writeFileSync(p, html.replace(toolSearch, toolReplace));
    toolCount++;
  }
}

console.log(`Fixed ${blogCount} blog headers, ${toolCount} tool headers.`);
