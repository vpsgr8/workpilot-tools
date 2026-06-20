#!/usr/bin/env node
/**
 * AdSense cleanup: noindex thin SEO-cluster posts, curate blog index & sitemap.
 * Run: node scripts/adsense-cleanup.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  INDEXED_BLOG_SLUGS,
  indexedBlogPosts,
  FINANCE_BLOG_SLUGS,
} from "./blog-quality-registry.mjs";
import { EXISTING_BLOGS } from "./seo-cluster-data.mjs";
import { FINANCE_BLOGS } from "./finance-seo-blogs.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DIR = path.join(ROOT, "blog");
const SITE = "https://workpilottools.biz";

const NOINDEX_META = '<meta name="robots" content="noindex, follow">';
const ROBOTS_RE = /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i;

function setRobots(html, noindex) {
  if (noindex) {
    if (ROBOTS_RE.test(html)) {
      return html.replace(ROBOTS_RE, NOINDEX_META);
    }
    return html.replace(/<head[^>]*>/i, (m) => m + "\n" + NOINDEX_META);
  }
  return html.replace(ROBOTS_RE, "");
}

function patchBlogFiles() {
  let noindexed = 0;
  let kept = 0;
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".html") && f !== "index.html");

  for (const file of files) {
    const slug = file.replace(/\.html$/, "");
    const filePath = path.join(BLOG_DIR, file);
    let html = fs.readFileSync(filePath, "utf8");
    const shouldIndex = INDEXED_BLOG_SLUGS.has(slug);
    const next = setRobots(html, !shouldIndex);
    if (next !== html) {
      fs.writeFileSync(filePath, next, "utf8");
    }
    if (shouldIndex) kept++;
    else noindexed++;
  }
  return { noindexed, kept, total: files.length };
}

function blogCard(slug, title, desc) {
  return (
    '        <a class="blog-card" href="' +
    slug +
    '.html"><span>' +
    title +
    "</span><small>" +
    desc +
    "</small></a>\n"
  );
}

function generateBlogIndex() {
  const financeCards = FINANCE_BLOGS.map((b) =>
    blogCard(b.slug, b.title, "Finance guide with calculators and examples.")
  ).join("");

  const existingSlugs = Object.keys(EXISTING_BLOGS).sort();
  const byCat = {};
  for (const slug of existingSlugs) {
    const post = indexedBlogPosts().find((p) => p.slug === slug);
    const cat = post ? post.category : "Guides";
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push({ slug, title: EXISTING_BLOGS[slug].title });
  }

  let sections = "";
  for (const [cat, items] of Object.entries(byCat).sort((a, b) => a[0].localeCompare(b[0]))) {
    const cards = items
      .map((i) => blogCard(i.slug, i.title, "Practical guide with free WorkPilot tools."))
      .join("");
    sections +=
      '    <section aria-label="' +
      cat +
      '">\n' +
      "      <h2 style=\"font-size:1.25rem;margin:28px 0 12px\">" +
      cat +
      "</h2>\n" +
      '      <div class="grid">\n' +
      cards +
      "      </div>\n    </section>\n";
  }

  const count = INDEXED_BLOG_SLUGS.size;
  const mainContent =
    '    <section class="hero">\n' +
    "      <h1>Curated guides for WorkPilot Tools</h1>\n" +
    "      <p>Hand-picked tutorials for PDF, finance, AI, image, audio, video, business, and parenting — quality over quantity.</p>\n" +
    '      <p style="color:var(--muted);margin:12px 0 0;max-width:720px;font-size:15px">' +
    count +
    " editorial guides indexed. Thin auto-generated pages are excluded from search.</p>\n" +
    "    </section>\n" +
    '    <section aria-label="Finance guides">\n' +
    '      <h2 style="font-size:1.25rem;margin:24px 0 12px">Finance &amp; Money Guides</h2>\n' +
    '      <div class="grid">\n' +
    financeCards +
    "      </div>\n    </section>\n" +
    sections;

  const templatePath = path.join(BLOG_DIR, "index.html");
  let html = fs.readFileSync(templatePath, "utf8");
  html = html.replace(/<main>[\s\S]*?<\/main>/, "<main>\n" + mainContent + "  </main>");
  fs.writeFileSync(templatePath, html, "utf8");
}

function patchHomeBlogSection() {
  const indexPath = path.join(ROOT, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  const count = INDEXED_BLOG_SLUGS.size;

  const featured = [
    ...FINANCE_BLOGS.slice(0, 4).map((b) => ({ slug: b.slug, title: b.title })),
    ...Object.entries(EXISTING_BLOGS)
      .slice(0, 8)
      .map(([slug, meta]) => ({ slug, title: meta.title })),
  ].slice(0, 12);

  const cards = featured
    .map((p) =>
      blogCard("blog/" + p.slug, p.title, "Editorial guide — free tools, practical steps.")
    )
    .join("")
    .replace(/        /g, "        ");

  const newSection =
    '    <section id="blogs" aria-labelledby="blogs-title">\n' +
    '      <div class="section-head">\n' +
    '        <h2 id="blogs-title">Guides</h2>\n' +
    '        <a class="view-all" href="blog/index.html">View all ' +
    count +
    " guides</a>\n" +
    "      </div>\n" +
    '      <div class="grid">\n' +
    cards +
    "      </div>\n" +
    "    </section>";

  html = html.replace(/<section id="blogs"[\s\S]*?<\/section>\s*\n\s*<\/main>/, newSection + "\n  </main>");
  fs.writeFileSync(indexPath, html, "utf8");
}

function rebuildSitemap() {
  const sitemapPath = path.join(ROOT, "sitemap.xml");
  let xml = fs.readFileSync(sitemapPath, "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const filtered = urls.filter((url) => {
    const m = url.match(/\/blog\/([^/]+)\.html$/);
    if (!m) return true;
    return INDEXED_BLOG_SLUGS.has(m[1]);
  });

  const blogIndex = SITE + "/blog/";
  if (!filtered.includes(blogIndex)) filtered.push(blogIndex);

  for (const slug of INDEXED_BLOG_SLUGS) {
    const u = SITE + "/blog/" + slug + ".html";
    if (!filtered.includes(u)) filtered.push(u);
  }

  const unique = [...new Set(filtered)];
  const nonBlog = unique.filter((u) => !u.includes("/blog/"));
  const blogUrls = unique
    .filter((u) => u.includes("/blog/"))
    .sort((a, b) => a.localeCompare(b));

  const out =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    [...nonBlog, ...blogUrls].map((u) => "  <url><loc>" + u + "</loc></url>").join("\n") +
    "\n</urlset>\n";

  fs.writeFileSync(sitemapPath, out, "utf8");
  return { before: urls.length, after: unique.length };
}

const stats = patchBlogFiles();
generateBlogIndex();
patchHomeBlogSection();
const sitemap = rebuildSitemap();

console.log("AdSense cleanup complete.");
console.log("  Blog posts total:", stats.total);
console.log("  Indexed (kept):", stats.kept);
console.log("  Noindex (thin):", stats.noindexed);
console.log("  Sitemap URLs:", sitemap.before, "→", sitemap.after);
