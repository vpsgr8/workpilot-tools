/** Slugs allowed in sitemap and blog index — quality editorial content only. */

import { EXISTING_BLOGS } from "./seo-cluster-data.mjs";
import { FINANCE_BLOGS } from "./finance-seo-blogs.mjs";

export const INDEXED_BLOG_SLUGS = new Set([
  ...Object.keys(EXISTING_BLOGS),
  ...FINANCE_BLOGS.map((b) => b.slug),
]);

export function isIndexedBlog(slug) {
  return INDEXED_BLOG_SLUGS.has(slug);
}

export function indexedBlogPosts() {
  const financeBySlug = new Map(FINANCE_BLOGS.map((b) => [b.slug, b]));
  const posts = [];

  for (const slug of INDEXED_BLOG_SLUGS) {
    if (financeBySlug.has(slug)) {
      const b = financeBySlug.get(slug);
      posts.push({
        slug,
        title: b.title,
        desc: b.intro.slice(0, 120) + (b.intro.length > 120 ? "…" : ""),
        category: "Finance",
      });
    } else if (EXISTING_BLOGS[slug]) {
      posts.push({
        slug,
        title: EXISTING_BLOGS[slug].title,
        desc: "In-depth guide with free tools and practical steps.",
        category: categorizeExisting(slug),
      });
    }
  }

  return posts.sort((a, b) => a.title.localeCompare(b.title));
}

function categorizeExisting(slug) {
  if (/pdf|word-to|jpg-to|excel-to|merge|compress|split|rotate|protect|invoice|gst|qr|barcode|resume|business-card|document-scanner|emi|sip|loan|gst|age-calculator/.test(slug)) {
    if (/sip|emi|loan|gst|invoice|age-calculator/.test(slug) && !/pdf|word|jpg|excel/.test(slug)) {
      if (/sip|emi|loan|gst/.test(slug)) return "Finance & Business";
    }
  }
  if (/pdf|word-to|jpg-to|excel-to|merge|compress|split|rotate|protect|scanned|batch-merge|reduce-pdf|protect-pdf|how-to-compress|how-to-split|how-to-rotate|pdf-/.test(slug)) return "PDF & Documents";
  if (/ai-|image|photo|avatar|upscaler|enhancer|background|face-swap|object-remover|meme|collage|gif|watermark|compress-image|webp|bulk-image|resize/.test(slug)) return "AI & Image";
  if (/audio|speech|voice|text-to-speech/.test(slug)) return "Audio";
  if (/video|screen-recorder|trim-video|compress-video/.test(slug)) return "Video";
  if (/pregnancy|ovulation|fertility|due-date|trimester|conception|baby-|vaccin|iap-/.test(slug)) return "Pregnancy & Baby";
  if (/resume|linkedin|invoice|barcode|qr-|business-card|document-scanner/.test(slug)) return "Business & Career";
  return "Guides";
}

export const FINANCE_BLOG_SLUGS = FINANCE_BLOGS.map((b) => b.slug);
