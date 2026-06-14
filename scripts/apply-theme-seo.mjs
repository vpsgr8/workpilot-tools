import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = "https://workpilottools.biz";

const THEME_INLINE = `<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>`;
const TOGGLE = `<button type="button" class="wp-theme-toggle" aria-label="Toggle dark mode" aria-pressed="false" title="Toggle dark mode">🌙</button>`;

const TOOL_KEYWORD_EXTRA = {
  "pdf-merge": "merge pdf online free, combine pdf files free, join pdf online, pdf merger no signup",
  "pdf-compress": "compress pdf online free, reduce pdf file size, pdf compressor free",
  "pdf-to-word": "pdf to word converter free, convert pdf to docx online",
  "word-to-pdf": "word to pdf converter free, docx to pdf online",
  "ai-image-generator": "free ai image generator, text to image ai online, ai art generator free",
  "background-remover": "remove background from image free, transparent background online",
  "qr-generator": "qr code generator free, create qr code online",
  "invoice-generator": "free invoice generator, gst invoice maker online india",
  "emi-calculator": "emi calculator online free, loan emi calculator india",
  "pregnancy-due-date": "pregnancy due date calculator, edd calculator free",
  "vaccination-tracker": "baby vaccination schedule india, iap immunization chart",
  "speech-to-text": "speech to text online free, voice to text converter",
};

const CATEGORY_SEO = {
  "pdf-tools.html": {
    keywords:
      "pdf tools online free, merge pdf, compress pdf, pdf to word, jpg to pdf, split pdf, rotate pdf, protect pdf, free pdf converter, workpilot tools",
    description:
      "Free PDF tools online — merge, compress, split, rotate, convert PDF to Word/JPG and more. No signup, 100% browser-based.",
  },
  "ai-tools.html": {
    keywords:
      "ai tools free online, ai image generator, background remover, face swap, ai avatar, image enhancer, ai upscaler, free ai tools, workpilot",
    description:
      "Free AI tools online — generate images, remove backgrounds, enhance photos, create avatars, and more. No signup required.",
  },
  "image-tools.html": {
    keywords:
      "image tools online free, compress image, resize image, crop image, convert jpg png webp, watermark photo, meme generator, collage maker",
    description:
      "Free image tools — compress, resize, crop, convert, watermark, and create collages or memes online in your browser.",
  },
  "audio-tools.html": {
    keywords:
      "audio tools online free, audio converter mp3 wav, speech to text free, text to speech online, voice recorder, trim audio",
    description:
      "Free audio and speech tools — convert, trim, record, transcribe, and text-to-speech online. No download needed.",
  },
  "video-tools.html": {
    keywords:
      "video tools online free, compress video, trim video, convert video, screen recorder online free",
    description:
      "Free video tools — compress, trim, convert videos and record your screen online in the browser.",
  },
  "business-tools.html": {
    keywords:
      "business tools online free, invoice generator, qr code generator, barcode generator, resume builder free, emi calculator, gst calculator",
    description:
      "Free business and utility tools — invoices, QR codes, calculators, resume builder, and document utilities online.",
  },
  "pregnancy-tools.html": {
    keywords:
      "pregnancy calculator free, due date calculator, ovulation calculator, fertility calculator, pregnancy week calculator, conception date",
    description:
      "Free pregnancy tools — due date, ovulation, fertility, weight gain, BMI, and countdown calculators online.",
  },
  "baby-parenting-tools.html": {
    keywords:
      "baby calculator free, baby growth percentile, feeding calculator, sleep calculator, vaccination schedule india, baby age calculator",
    description:
      "Free baby and parenting tools — growth charts, feeding guides, sleep schedules, vaccination tracker, and milestone calculators.",
  },
};

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function assetBase(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
  const depth = rel.split("/").length - 1;
  return depth === 0 ? "assets/" : "../".repeat(depth) + "assets/";
}

function slugFromPath(filePath) {
  return path.basename(filePath, ".html");
}

function titleFromHtml(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].trim() : slugFromPath("");
}

function humanize(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toolKeywords(slug) {
  const extra = TOOL_KEYWORD_EXTRA[slug];
  const base = slug.replace(/-/g, " ");
  const generic = `${base} online free, free ${base}, ${base} tool, online ${base} no signup, ${base} calculator, workpilot tools, workpilottools.biz`;
  return extra ? `${extra}, ${generic}` : generic;
}

function toolDescription(slug) {
  const name = humanize(slug);
  return `Use ${name} online free — fast, private, no signup. WorkPilot Tools runs in your browser on mobile and desktop.`;
}

function blogKeywords(slug, title) {
  const topic = slug.replace(/-/g, " ");
  const short = title.split("|")[0].trim().toLowerCase();
  return `${topic}, ${short}, free ${topic}, how to ${topic}, best ${topic} online, free online tools guide, workpilot tools, workpilottools.biz`;
}

function blogDescription(title) {
  const topic = title.split("|")[0].trim();
  return `${topic} — free step-by-step guide with online tools, tips, and no signup. Read on WorkPilot Tools blog.`;
}

function ensureThemeHead(html, base) {
  if (html.includes("assets/theme.css") || html.includes("theme.css")) return html;
  const block = `${THEME_INLINE}\n<link rel="stylesheet" href="${base}theme.css">\n<script defer src="${base}theme.js"></script>\n`;
  return html.replace(/<head([^>]*)>/i, `<head$1>\n${block}`);
}

function ensureToggle(html) {
  if (html.includes("wp-theme-toggle")) return html;

  if (html.includes('class="links"')) {
    return html.replace(
      /(<div class="links">)/,
      `$1\n        ${TOGGLE}`,
    );
  }
  if (html.includes('class="nav-links"')) {
    return html.replace(
      /(<div class="nav-links">)/,
      `$1${TOGGLE}`,
    );
  }
  if (html.includes('class="nav-link" href="../index.html">Back to Tools"')) {
    return html.replace(
      /(<div style="display:flex[^"]*"[^>]*>)/,
      `$1\n        ${TOGGLE}`,
    );
  }
  if (html.includes("<nav class=\"hidden md:flex")) {
    return html.replace(
      /(<nav class="hidden md:flex[^"]*"[^>]*>)/,
      `$1${TOGGLE}`,
    );
  }
  if (html.includes("<header class=\"bg-white border-b sticky")) {
    return html.replace(
      /(<header class="bg-white border-b sticky top-0 z-40">\s*<div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">)/,
      `$1\n${TOGGLE}`,
    );
  }
  if (html.includes("<header><nav class=\"wrap nav\"")) {
    return html.replace(
      /(<header><nav class="wrap nav">)/,
      `<header><nav class="wrap nav">${TOGGLE}`,
    );
  }
  return html;
}

function upsertMeta(html, name, content) {
  const re = new RegExp(`<meta name="${name}" content="[^"]*">`, "i");
  const tag = `<meta name="${name}" content="${content.replace(/"/g, "&quot;")}">`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<head([^>]*)>/i, `<head$1>\n${tag}`);
}

function upsertMetaProp(html, prop, content) {
  const re = new RegExp(`<meta property="${prop}" content="[^"]*">`, "i");
  const tag = `<meta property="${prop}" content="${content.replace(/"/g, "&quot;")}">`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<meta name="viewport"[^>]*>/i, (m) => `${m}\n${tag}`);
}

function injectJsonLd(html, id, json) {
  const script = `<script type="application/ld+json">${JSON.stringify(json)}</script>`;
  const marker = `"@type":"${id}"`;
  if (html.includes(marker)) return html;
  return html.replace("</head>", `${script}\n</head>`);
}

function processIndex(html) {
  html = upsertMeta(
    html,
    "keywords",
    "free online tools, pdf tools free, ai tools online, image editor online, pregnancy calculator, baby tools, merge pdf free, compress pdf, qr code generator, invoice generator, workpilot tools, workpilottools.biz",
  );
  html = upsertMeta(
    html,
    "description",
    "WorkPilot Tools — 67+ free online tools for PDF, AI, images, audio, video, business, pregnancy, and baby care. No signup. Fast, browser-based utilities.",
  );
  html = html.replace(
    /<title>[^<]+<\/title>/,
    "<title>WorkPilot Tools — 67+ Free Online PDF, AI, Image, Pregnancy &amp; Baby Tools</title>",
  );
  html = injectJsonLd(html, "WebSite", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WorkPilot Tools",
    url: SITE + "/",
    description: "Free online PDF, AI, image, audio, video, business, pregnancy, and baby tools.",
    potentialAction: {
      "@type": "SearchAction",
      target: SITE + "/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  });
  html = injectJsonLd(html, "Organization", {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WorkPilot Tools",
    url: SITE + "/",
    logo: SITE + "/assets/og-default.png",
  });
  return html;
}

function processCategory(html, filename) {
  const seo = CATEGORY_SEO[filename];
  if (!seo) return html;
  html = upsertMeta(html, "keywords", seo.keywords);
  html = upsertMeta(html, "description", seo.description);
  html = upsertMetaProp(html, "og:description", seo.description);
  return html;
}

function processTool(html, filePath) {
  const slug = slugFromPath(filePath);
  if (!html.includes('data-tool="') && !html.includes("SoftwareApplication")) {
    // app redirect stub
    html = upsertMeta(html, "keywords", toolKeywords(slug));
    return html;
  }
  const title = titleFromHtml(html);
  const name = title.split("-")[0].replace("Free ", "").trim() || humanize(slug);
  html = upsertMeta(html, "keywords", toolKeywords(slug));
  html = upsertMeta(html, "description", toolDescription(slug));
  html = upsertMetaProp(html, "og:description", toolDescription(slug));
  if (!html.includes('"FAQPage"')) {
    html = injectJsonLd(html, "WebApplication", {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: humanize(slug),
      url: `${SITE}/tools/${slug}.html`,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: toolDescription(slug),
    });
  }
  return html;
}

function processBlog(html, filePath) {
  if (filePath.endsWith(`${path.sep}blog${path.sep}index.html`)) {
    html = upsertMeta(
      html,
      "keywords",
      "workpilot blog, pdf guides, ai tools guide, image editing tips, free online tools tutorials, pregnancy tips, workpilottools.biz",
    );
    html = upsertMeta(
      html,
      "description",
      "WorkPilot blog — free guides for PDF, AI, image, audio, video, invoice, QR, pregnancy, and productivity tools.",
    );
    return html;
  }
  const slug = slugFromPath(filePath);
  const title = titleFromHtml(html);
  const desc = blogDescription(title);
  const keywords = blogKeywords(slug, title);
  html = upsertMeta(html, "keywords", keywords);
  html = upsertMeta(html, "description", desc);
  html = upsertMetaProp(html, "og:description", desc);
  html = upsertMetaProp(html, "og:type", "article");
  const articleTitle = title.split("|")[0].trim();
  if (!html.includes('"BlogPosting"')) {
    html = injectJsonLd(html, "BlogPosting", {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: articleTitle,
      description: desc,
      url: `${SITE}/blog/${slug}.html`,
      author: { "@type": "Organization", name: "WorkPilot Tools" },
      publisher: {
        "@type": "Organization",
        name: "WorkPilot Tools",
        logo: { "@type": "ImageObject", url: SITE + "/assets/og-default.png" },
      },
      mainEntityOfPage: `${SITE}/blog/${slug}.html`,
    });
  }
  return html;
}

function processFile(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
  if (rel.startsWith("app/") || rel === "404.html") return false;

  let html = fs.readFileSync(filePath, "utf8");
  const before = html;
  const base = assetBase(filePath);

  html = ensureThemeHead(html, base);
  html = ensureToggle(html);

  if (rel === "index.html") html = processIndex(html);
  else if (CATEGORY_SEO[rel]) html = processCategory(html, rel);
  else if (rel.startsWith("tools/")) html = processTool(html, filePath);
  else if (rel.startsWith("blog/")) html = processBlog(html, filePath);
  else if (rel === "privacy.html" || rel === "terms.html") {
    html = upsertMeta(html, "keywords", "workpilot tools, workpilottools.biz, free online tools");
  }

  if (html !== before) {
    fs.writeFileSync(filePath, html, "utf8");
    return true;
  }
  return false;
}

function cleanupStale() {
  for (const dir of ["structured", "toolkit-built"]) {
    const p = path.join(ROOT, dir);
    if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
  }
}

let count = 0;
cleanupStale();
for (const file of walkHtml(ROOT)) {
  if (processFile(file)) {
    count++;
    console.log("updated:", path.relative(ROOT, file));
  }
}
console.log(`Done. ${count} files updated.`);
