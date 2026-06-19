#!/usr/bin/env node
/**
 * Extract first 7 pages of each full PDF into assets/ebooks/previews/
 * Run: node scripts/generate-ebook-previews.mjs
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { PDFDocument } = require(path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "server",
  "node_modules",
  "pdf-lib"
));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PREVIEW_PAGES = 7;

const BOOKS = [
  {
    id: "text-like-a-pro",
    source: path.join(ROOT, "server/ebooks/text-like-a-pro.pdf"),
    out: path.join(ROOT, "assets/ebooks/previews/text-like-a-pro-preview.pdf"),
  },
  {
    id: "unseen-india",
    source: path.join(ROOT, "server/ebooks/unseen-india.pdf"),
    out: path.join(ROOT, "assets/ebooks/previews/unseen-india-preview.pdf"),
  },
];

async function makePreview(book) {
  if (!fs.existsSync(book.source)) {
    console.warn("Skip (missing):", book.source);
    return;
  }
  const bytes = fs.readFileSync(book.source);
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();
  const count = Math.min(PREVIEW_PAGES, total);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(
    src,
    Array.from({ length: count }, (_, i) => i)
  );
  pages.forEach((p) => out.addPage(p));
  const pdfBytes = await out.save();
  fs.mkdirSync(path.dirname(book.out), { recursive: true });
  fs.writeFileSync(book.out, pdfBytes);
  console.log(`${book.id}: ${count}/${total} pages → ${book.out}`);
}

for (const book of BOOKS) {
  await makePreview(book);
}
