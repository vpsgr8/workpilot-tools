import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://workpilottools.biz";
const OG_IMAGE = `${SITE}/assets/og-default.png`;

const PDF_EDITOR_TOOL = {
  href: "../tools/pdf-to-word.html",
  label: "Open Pdf To Word",
};

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function pageKind(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
  if (rel.startsWith("blog/") && rel !== "blog/index.html") return "blog-post";
  if (rel.startsWith("tools/")) return "tool";
  if (rel === "blog/index.html") return "blog-index";
  return "page";
}

function ogImageBlock() {
  return `<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:site_name" content="WorkPilot Tools">`;
}

function ensureOgBasics(content, filePath) {
  const canonical = content.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) return content;

  const kind = pageKind(filePath);
  const ogType = kind === "blog-post" ? "article" : "website";

  if (!content.includes('property="og:image"')) {
    if (content.includes('property="og:type"') && !content.includes('property="og:image"')) {
      content = content.replace(
        /(<meta property="og:type" content="(?:website|article)">)/,
        `$1\n${ogImageBlock()}`,
      );
      if (kind === "blog-post") {
        content = content.replace(
          '<meta property="og:type" content="website">',
          '<meta property="og:type" content="article">',
        );
      }
    } else if (content.includes('property="og:description"')) {
      content = content.replace(
        /(<meta property="og:description" content="[^"]*">)/,
        `$1\n<meta property="og:url" content="${canonical}">\n<meta property="og:type" content="${ogType}">\n${ogImageBlock()}`,
      );
    } else if (content.includes('property="og:title"')) {
      content = content.replace(
        /(<meta property="og:title" content="[^"]*">)/,
        `$1\n<meta property="og:url" content="${canonical}">\n<meta property="og:type" content="${ogType}">\n${ogImageBlock()}`,
      );
    }
  }

  if (!content.includes('property="og:url"') && content.includes('property="og:title"')) {
    const insert = `<meta property="og:url" content="${canonical}">\n<meta property="og:type" content="${ogType}">\n${ogImageBlock()}`;
    content = content.replace(
      /(<meta property="og:description" content="[^"]*">)/,
      `$1\n${insert}`,
    );
  }

  if (kind === "blog-post" && content.includes('property="og:type" content="website"')) {
    content = content.replace(
      '<meta property="og:type" content="website">',
      '<meta property="og:type" content="article">',
    );
  }

  return content;
}

function extractBlogTool(content, filename) {
  if (filename === "pdf-editor-free-online.html") return PDF_EDITOR_TOOL;
  const m = content.match(
    /related-tool-cta[\s\S]*?href="(\.\.\/tools\/[^"]+)"[^>]*>([^<]+)<\/a>/,
  );
  if (!m) return null;
  return { href: m[1], label: m[2].trim() };
}

function addPdfEditorCta(content) {
  if (content.includes("related-tool-cta")) return content;
  const tool = PDF_EDITOR_TOOL;
  const block = `<div class="related-tool-cta" style="margin-top:32px;padding:18px;border:1px solid #c7d2fe;background:#eef2ff;border-radius:12px"><strong>Related tool:</strong> <a href="${tool.href}" style="color:#4f46e5;font-weight:700">${tool.label}</a></div>`;
  return content.replace("</article>", `${block}\n</article>`);
}

function updateBlogInlineLinks(content, tool) {
  const { href, label } = tool;

  content = content.replace(
    /<li>Visit <a href="\.\.\/index\.html">WorkPilot Tools<\/a><\/li>/g,
    `<li>Open <a href="${href}">${label}</a></li>`,
  );

  content = content.replace(
    /<li>Select the appropriate tool from the menu<\/li>\s*<li>Upload your file\(s\)<\/li>/g,
    "<li>Upload your file(s)</li>",
  );

  content = content.replace(
    /<p><strong>Ready to try\?<\/strong> <a href="\.\.\/index\.html">Visit WorkPilot Tools<\/a>/g,
    `<p><strong>Ready to try?</strong> <a href="${href}">${label}</a>`,
  );

  content = content.replace(
    /(<div class="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">\s*<h3 class="font-bold text-lg mb-2">Try It Free Now<\/h3>\s*<p class="text-gray-700 mb-4">)[^<]*(<\/p>\s*)<a href="\.\.\/index\.html" class="inline-flex items-center gap-2 px-5 py-2\.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">\s*<i class="ri-tools-fill"><\/i>\s*Explore 40 Free Tools\s*<\/a>/g,
    `$1Use our free ${label.replace("Open ", "")} tool — no signup required.$2<a href="${href}" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">\n<i class="ri-tools-fill"></i>\n${label}\n</a>`,
  );

  return content;
}

function writeOgImage() {
  const w = 1200;
  const h = 630;
  const rows = [];
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(1 + w * 3);
    row[0] = 0;
    for (let x = 0; x < w; x++) {
      const i = 1 + x * 3;
      row[i] = 79;
      row[i + 1] = 70;
      row[i + 2] = 229;
    }
    rows.push(row);
  }
  const raw = Buffer.concat(rows);
  const compressed = zlib.deflateSync(raw, { level: 9 });

  const crc32 = (buf) => {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    return ~c >>> 0;
  };

  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);

  const out = path.join(ROOT, "assets", "og-default.png");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, png);
  console.log(`wrote ${out} (${png.length} bytes)`);
}

let updated = 0;
writeOgImage();

for (const filePath of walkHtml(ROOT)) {
  const original = fs.readFileSync(filePath, "utf8");
  let content = ensureOgBasics(original, filePath);
  const relName = path.basename(filePath);

  if (pageKind(filePath) === "blog-post") {
    content = addPdfEditorCta(content);
    const tool = extractBlogTool(content, relName);
    if (tool) content = updateBlogInlineLinks(content, tool);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    updated++;
    console.log(`updated: ${path.relative(ROOT, filePath)}`);
  }
}

console.log(`Done. ${updated} files updated.`);
