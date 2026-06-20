import fs from "fs";
import path from "path";
import {
  SITE,
  CATEGORIES,
  EXISTING_BLOGS,
  TOOLS,
  articlesForTool,
  getRelatedTools,
} from "./seo-cluster-data.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG_DIR = path.join(ROOT, "blog");
const TOOLS_DIR = path.join(ROOT, "tools");

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function toolBySlug(slug) {
  return TOOLS.find((t) => t.slug === slug);
}

function buildExistingByTool() {
  const map = new Map();
  for (const [slug, meta] of Object.entries(EXISTING_BLOGS)) {
    const list = map.get(meta.tool) || [];
    list.push({ slug, title: meta.title });
    map.set(meta.tool, list);
  }
  return map;
}

function blogHtml(article, tool) {
  const cat = CATEGORIES[tool.category];
  const url = `${SITE}/blog/${article.slug}.html`;
  const toolUrl = `${SITE}/tools/${tool.slug}.html`;
  const kw = `${article.slug.replace(/-/g, " ")}, ${tool.name.toLowerCase()}, free online guide, ${tool.slug.replace(/-/g, " ")}, workpilot tools, workpilottools.biz`;
  const desc = `${article.title} — free step-by-step guide with online tools, tips, and no signup. Read on WorkPilot Tools blog.`;
  const topic = article.title.replace(/ Guide$/, "").replace(/ Explained$/, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
<link rel="stylesheet" href="../assets/theme.css">
<script defer src="../assets/theme.js"></script>
<title>${esc(article.title)} | WorkPilot Blog</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(kw)}">
<link rel="canonical" href="${url}">
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="robots" content="noindex, follow">
<link rel="stylesheet" href="../assets/tailwind.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.2.0/remixicon.min.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GMEBH16Y2M"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-GMEBH16Y2M');</script>
<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');body{font-family:'Inter',sans-serif} .prose h2{font-size:1.5rem;font-weight:700;margin-top:2rem;margin-bottom:1rem} .prose h3{font-size:1.25rem;font-weight:600;margin-top:1.5rem;margin-bottom:0.75rem} .prose p{margin-bottom:1rem;line-height:1.7} .prose ul,.prose ol{margin-bottom:1rem;padding-left:1.5rem} .prose li{margin-bottom:0.5rem}</style>
<meta property="og:title" content="${esc(article.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<meta property="og:image" content="${SITE}/assets/og-default.png">
<meta property="og:site_name" content="WorkPilot Tools">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog/` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  })}</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5121623665404680" crossorigin="anonymous"></script>
<meta name="google-adsense-account" content="ca-pub-5121623665404680">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: desc,
    url,
    author: { "@type": "Organization", name: "WorkPilot Tools" },
    publisher: {
      "@type": "Organization",
      name: "WorkPilot Tools",
      logo: { "@type": "ImageObject", url: `${SITE}/assets/og-default.png` },
    },
    mainEntityOfPage: url,
  })}</script>
</head>
<body class="bg-gray-50">
<header class="bg-white border-b sticky top-0 z-40">
<div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
<a href="../index.html" class="flex items-center gap-2"><span class="font-bold text-xl">WorkPilot</span><span class="text-gray-500">Blog</span></a>
<div class="flex items-center gap-3">
<button type="button" class="wp-theme-toggle" aria-label="Toggle dark mode" aria-pressed="false" title="Toggle dark mode">🌙</button>
<a href="../index.html" class="text-sm text-indigo-600 hover:underline">← Back to Tools</a>
</div>
</div>
</header>

<article class="max-w-4xl mx-auto px-4 py-8">
<div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
<div class="p-8 md:p-12">
<div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
<span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">${cat.tag}</span>
<span>•</span>
<span>6 min read</span>
<span>•</span>
<span>June 10, 2026</span>
</div>
<h1 class="text-3xl md:text-4xl font-bold mb-4 leading-tight">${esc(article.title)}</h1>
<p class="text-xl text-gray-600 mb-8">Everything you need to know about ${esc(topic.toLowerCase())} — with free online tools and expert tips.</p>

<div class="prose max-w-none">
<h2>Introduction</h2>
<p>${esc(article.title)} is one of the most searched topics for people using ${esc(tool.name)} and related ${esc(cat.label.toLowerCase())}. This guide walks you through concepts, practical steps, and free tools you can use today — no signup required.</p>

<h2>Why This Matters</h2>
<p>Whether you are a student, professional, or business owner, understanding ${esc(topic.toLowerCase())} helps you work faster and make better decisions. WorkPilot Tools offers a free <a href="../tools/${tool.slug}.html">${esc(tool.name)}</a> that runs entirely in your browser.</p>

<h2>Key Concepts</h2>
<ul>
<li><strong>Free and online:</strong> No software download or account needed</li>
<li><strong>Privacy-first:</strong> Processing happens in your browser when possible</li>
<li><strong>Mobile-friendly:</strong> Works on phone, tablet, and desktop</li>
<li><strong>Related tools:</strong> Browse all <a href="../${cat.page}">${esc(cat.label)}</a> on WorkPilot</li>
</ul>

<h2>Step-by-Step Guide</h2>
<ol>
<li><strong>Open the tool:</strong> Go to <a href="../tools/${tool.slug}.html">${esc(tool.name)}</a> on WorkPilot Tools</li>
<li><strong>Enter your data</strong> or upload files as required</li>
<li><strong>Review settings</strong> and adjust for your use case</li>
<li><strong>Process instantly</strong> — results appear in seconds</li>
<li><strong>Save or share</strong> your output before closing the tab</li>
</ol>

<h2>Pro Tips</h2>
<ul>
<li>Bookmark the tool page for quick access later</li>
<li>Combine with related WorkPilot tools for complete workflows</li>
<li>Read our other guides in the <a href="index.html">WorkPilot Blog</a></li>
<li>Use Chrome or Safari for best compatibility on mobile</li>
</ul>

<h2>Frequently Asked Questions</h2>
<h3>Is WorkPilot ${esc(tool.name)} free?</h3>
<p>Yes — completely free with no hidden charges, watermarks, or signup.</p>
<h3>Can I use this on mobile?</h3>
<p>Yes. All WorkPilot tools work in mobile browsers without installing an app.</p>
<h3>Where can I find related tools?</h3>
<p>Visit our <a href="../${cat.page}">${esc(cat.label)}</a> page for the full collection.</p>

<h2>Conclusion</h2>
<p>${esc(article.title)} does not have to be complicated. Use WorkPilot's free ${esc(tool.name)} and browse our blog for more guides. <a href="../tools/${tool.slug}.html">Try ${esc(tool.name)} now →</a></p>
</div>

<div class="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
<h3 class="font-bold text-lg mb-2">Try It Free Now</h3>
<p class="text-gray-700 mb-4">Use our free ${esc(tool.name)} — no signup required.</p>
<a href="../tools/${tool.slug}.html" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
<i class="ri-tools-fill"></i>
Open ${esc(tool.name)}
</a>
</div>
</div>
</div>

<div class="related-tool-cta" style="margin-top:32px;padding:18px;border:1px solid #c7d2fe;background:#eef2ff;border-radius:12px"><strong>Related tool:</strong> <a href="../tools/${tool.slug}.html" style="color:#4f46e5;font-weight:700">Open ${esc(tool.name)}</a> · <strong>Category:</strong> <a href="../${cat.page}" style="color:#4f46e5;font-weight:700">${esc(cat.label)}</a></div>
</article>

<footer class="border-t mt-16 py-8 bg-white">
<div class="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
<p>© 2026 WorkPilot Tools • <a href="../index.html" class="hover:underline">Free Tools</a> • <a href="index.html" class="hover:underline">Blog</a> • <a href="../${cat.page}" class="hover:underline">${esc(cat.label)}</a></p>
</div>
</footer>
</body>
</html>
`;
}

function internalLinksAside(tool, relatedTools, blogLinks) {
  const cat = CATEGORIES[tool.category];
  const toolLinks = relatedTools
    .map((t) => `<a href="${t.slug}.html" class="block py-2 hover:text-indigo-600 border-b">${esc(t.name)}</a>`)
    .join("\n");
  const blogList = blogLinks
    .slice(0, 7)
    .map((b) => `<a href="../blog/${b.slug}.html" class="block py-2 hover:text-indigo-600 border-b text-gray-700">→ ${esc(b.title)}</a>`)
    .join("\n");

  return `<aside class="lg:col-span-1">
<div class="bg-white rounded-2xl shadow-sm border p-6 sticky top-24 space-y-6">
<div>
<h3 class="font-bold mb-3">Category</h3>
<a href="../${cat.page}" class="inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline">← All ${esc(cat.label)}</a>
</div>
<div>
<h3 class="font-bold mb-3">Related Tools</h3>
<div class="space-y-1 text-sm">${toolLinks}</div>
</div>
<div>
<h3 class="font-bold mb-3">Related Guides</h3>
<div class="space-y-1 text-sm">${blogList}</div>
</div>
<div class="mb-2"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5121623665404680" data-ad-slot="1234567891" data-ad-format="auto"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
</div>
</aside>`;
}

function internalLinksMainSection(tool, relatedTools, blogLinks) {
  const cat = CATEGORIES[tool.category];
  const toolsGrid = relatedTools
    .map((t) => `<a href="${t.slug}.html" class="block p-3 border rounded-lg hover:border-indigo-400 text-sm font-medium">${esc(t.name)}</a>`)
    .join("\n");
  const blogsGrid = blogLinks
    .slice(0, 6)
    .map((b) => `<a href="../blog/${b.slug}.html" class="block p-3 border rounded-lg hover:border-indigo-400 text-sm">→ ${esc(b.title)}</a>`)
    .join("\n");

  return `
<section class="bg-white rounded-2xl shadow-sm border p-6 md:p-8 mt-8">
<h2 class="text-2xl font-bold mb-4">Explore More</h2>
<p class="text-gray-600 mb-6">Browse related tools, guides, and the full <a href="../${cat.page}" class="text-indigo-600 font-medium hover:underline">${esc(cat.label)}</a> collection.</p>
<h3 class="font-bold mb-3">Related Tools</h3>
<div class="grid sm:grid-cols-2 gap-3 mb-6">${toolsGrid}</div>
<h3 class="font-bold mb-3">Related Guides</h3>
<div class="grid sm:grid-cols-2 gap-3">${blogsGrid}</div>
</section>`;
}

function landingPageHtml(tool, relatedTools, blogLinks, appPath) {
  const cat = CATEGORIES[tool.category];
  const url = `${SITE}/tools/${tool.slug}.html`;
  const desc = `Free ${tool.name.toLowerCase()} online — fast, private, no signup. WorkPilot Tools runs in your browser on mobile and desktop.`;
  const aside = internalLinksAside(tool, relatedTools, blogLinks);
  const explore = internalLinksMainSection(tool, relatedTools, blogLinks);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
<link rel="stylesheet" href="../assets/theme.css">
<script defer src="../assets/theme.js"></script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5121623665404680" crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GMEBH16Y2M"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-GMEBH16Y2M');</script>
<title>Free ${esc(tool.name)} Online | WorkPilot Tools</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${tool.slug.replace(/-/g, " ")}, free ${tool.slug.replace(/-/g, " ")}, ${tool.name.toLowerCase()} online free, workpilot tools, workpilottools.biz">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(tool.name)} - Free Online Tool">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:image" content="${SITE}/assets/og-default.png">
<meta property="og:site_name" content="WorkPilot Tools">
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="robots" content="noindex, follow">
<link rel="stylesheet" href="../assets/tailwind.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.2.0/remixicon.min.css">
<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');body{font-family:'Inter',sans-serif}</style>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: cat.label, item: `${SITE}/${cat.page}` },
      { "@type": "ListItem", position: 3, name: tool.name, item: url },
    ],
  })}</script>
<meta name="google-adsense-account" content="ca-pub-5121623665404680">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: desc,
  })}</script>
</head>
<body class="bg-gray-50">
<header class="bg-white border-b sticky top-0 z-40"><div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"><a href="../index.html" class="flex items-center gap-2"><span class="font-bold text-lg">WorkPilot</span></a><button type="button" class="wp-theme-toggle" aria-label="Toggle dark mode" aria-pressed="false" title="Toggle dark mode">🌙</button><nav class="hidden md:flex gap-6 text-sm"><a href="../index.html" class="hover:text-indigo-600">All Tools</a><a href="../${cat.page}" class="hover:text-indigo-600">${esc(cat.label)}</a><a href="../blog/index.html" class="hover:text-indigo-600">Blog</a></nav></div></header>
<div class="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
<main class="lg:col-span-2">
<div class="bg-white rounded-2xl shadow-sm border p-6 md:p-8 mb-8">
<div class="flex items-center gap-3 mb-6"><div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center"><i class="ri-tools-fill text-2xl text-indigo-600"></i></div><div><h1 class="text-2xl md:text-3xl font-bold">${esc(tool.name)}</h1><p class="text-gray-600">Free online ${esc(cat.label.toLowerCase())}</p></div></div>
<div class="mb-6 text-center"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5121623665404680" data-ad-slot="1234567890" data-ad-format="auto"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
<a href="${appPath}" class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 text-lg"><i class="ri-play-fill"></i> Open ${esc(tool.name)}</a>
<p class="text-sm text-gray-500 mt-3">Opens the interactive tool — no signup required.</p>
</div>
<article class="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
<h2 class="text-2xl font-bold mb-4">What is ${esc(tool.name)}?</h2>
<p class="text-gray-700 mb-4">${esc(tool.name)} helps you ${tool.slug.includes("calculator") || tool.slug.includes("calculator") ? "calculate and plan" : "get work done faster"} with a free browser-based tool. Part of WorkPilot's <a href="../${cat.page}" class="text-indigo-600 hover:underline">${esc(cat.label)}</a> collection.</p>
<h2 class="text-2xl font-bold mb-4 mt-8">How to Use</h2>
<ol class="list-decimal pl-5 space-y-2 mb-6 text-gray-700">
<li>Click <strong>Open ${esc(tool.name)}</strong> above</li>
<li>Enter your details or upload files</li>
<li>View instant results in your browser</li>
<li>Save, share, or print as needed</li>
</ol>
<h2 class="text-2xl font-bold mb-4 mt-8">Why WorkPilot?</h2>
<p class="text-gray-700 mb-4">100% free, no signup, works on mobile and desktop. Read our <a href="../blog/index.html" class="text-indigo-600 hover:underline">SEO guides and tutorials</a> for tips.</p>
</article>
${explore}
</main>
${aside}
</div>
<footer class="border-t mt-16 py-8 bg-white"><div class="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600"><p>© 2026 WorkPilot Tools • <a href="../privacy.html" class="hover:underline">Privacy</a> • <a href="../terms.html" class="hover:underline">Terms</a> • <a href="../${cat.page}" class="hover:underline">${esc(cat.label)}</a></p></div></footer>
</body>
</html>
`;
}

function patchFullToolPage(html, tool, relatedTools, blogLinks) {
  const aside = internalLinksAside(tool, relatedTools, blogLinks);
  const explore = internalLinksMainSection(tool, relatedTools, blogLinks);
  const cat = CATEGORIES[tool.category];

  // Replace aside block
  html = html.replace(/<aside class="lg:col-span-1">[\s\S]*?<\/aside>/, aside);

  // Add explore section before closing main if not present
  if (!html.includes("Explore More")) {
    html = html.replace(/<\/main>\s*<aside/, `${explore}\n</main>\n<aside`);
    // fix double close if replace went wrong - the explore already closes before </main>
  }

  // Fix header nav to include category link
  if (!html.includes(cat.page)) {
    html = html.replace(
      '<a href="../blog/index.html" class="hover:text-indigo-600">Blog</a>',
      `<a href="../${cat.page}" class="hover:text-indigo-600">${esc(cat.label)}</a><a href="../blog/index.html" class="hover:text-indigo-600">Blog</a>`
    );
  }

  // Remove broken sidebar if explore duplicated main close
  html = html.replace(/<\/main>\s*<\/main>/g, "</main>");

  return html;
}

function allBlogLinksForTool(toolSlug, existingByTool, newArticlesByTool) {
  const existing = (existingByTool.get(toolSlug) || []).map((a) => ({ slug: a.slug, title: a.title }));
  const created = (newArticlesByTool.get(toolSlug) || []).map((a) => ({ slug: a.slug, title: a.title }));
  return [...existing, ...created];
}

function rebuildBlogIndex(allPosts) {
  const cards = allPosts
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(
      (p) =>
        `        <a class="blog-card" href="${p.slug}.html"><span>${esc(p.title)}</span><small>${esc(p.desc || "Free guide with tools, tips, and step-by-step instructions.")}</small></a>`
    )
    .join("\n");

  let html = fs.readFileSync(path.join(BLOG_DIR, "index.html"), "utf8");
  html = html.replace(
    /<section aria-label="Blog posts" class="grid">[\s\S]*?<\/section>/,
    `<section aria-label="Blog posts" class="grid">\n${cards}\n    </section>`
  );
  html = html.replace(/View all \d+ posts/, `View all ${allPosts.length} posts`);
  fs.writeFileSync(path.join(BLOG_DIR, "index.html"), html);
}

function rebuildSitemap(allBlogSlugs) {
  const staticPages = [
    `${SITE}/`,
    ...Object.values(CATEGORIES).map((c) => `${SITE}/${c.page}`),
    `${SITE}/privacy.html`,
    `${SITE}/terms.html`,
    `${SITE}/blog/`,
    ...TOOLS.map((t) => `${SITE}/tools/${t.slug}.html`),
  ];
  const urls = [...new Set([...staticPages, ...allBlogSlugs.map((s) => `${SITE}/blog/${s}.html`)])];
  const body = urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n");
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
}

function updateHomepageBlogCount(total) {
  const indexPath = path.join(ROOT, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  html = html.replace(/View all \d+ posts/, `View all ${total} posts`);
  fs.writeFileSync(indexPath, html);
}

// --- Main ---
const existingByTool = buildExistingByTool();
const newArticlesByTool = new Map();
const allNewArticles = [];

for (const tool of TOOLS) {
  const newArts = articlesForTool(tool, existingByTool);
  if (newArts.length) {
    newArticlesByTool.set(tool.slug, newArts);
    allNewArticles.push(...newArts);
  }
}

let created = 0;
let skipped = 0;
for (const article of allNewArticles) {
  const filePath = path.join(BLOG_DIR, `${article.slug}.html`);
  if (fs.existsSync(filePath)) {
    skipped++;
    continue;
  }
  const tool = toolBySlug(article.tool);
  fs.writeFileSync(filePath, blogHtml(article, tool));
  created++;
}

// Merge new into existingByTool for linking
for (const [toolSlug, arts] of newArticlesByTool) {
  const list = existingByTool.get(toolSlug) || [];
  for (const a of arts) list.push({ slug: a.slug, title: a.title });
  existingByTool.set(toolSlug, list);
}

let toolsUpdated = 0;
for (const tool of TOOLS) {
  const relatedTools = getRelatedTools(tool, TOOLS);
  const blogLinks = allBlogLinksForTool(tool.slug, existingByTool, newArticlesByTool);
  const toolPath = path.join(TOOLS_DIR, `${tool.slug}.html`);

  if (tool.appPath) {
    fs.writeFileSync(toolPath, landingPageHtml(tool, relatedTools, blogLinks, tool.appPath));
    toolsUpdated++;
  } else if (fs.existsSync(toolPath)) {
    let html = fs.readFileSync(toolPath, "utf8");
    if (html.includes('data-tool="') || html.includes("workpilot-tool")) {
      html = patchFullToolPage(html, tool, relatedTools, blogLinks);
      fs.writeFileSync(toolPath, html);
      toolsUpdated++;
    }
  }
}

// Build blog index
const allPosts = [];
for (const [slug, meta] of Object.entries(EXISTING_BLOGS)) {
  allPosts.push({ slug, title: meta.title });
}
for (const a of allNewArticles) {
  if (!allPosts.some((p) => p.slug === a.slug)) allPosts.push({ slug: a.slug, title: a.title });
}

rebuildBlogIndex(allPosts);
rebuildSitemap(allPosts.map((p) => p.slug));
updateHomepageBlogCount(allPosts.length);

console.log(`Created ${created} new blog articles (${skipped} skipped existing files).`);
console.log(`Updated ${toolsUpdated} tool pages with internal linking.`);
console.log(`Total blog posts: ${allPosts.length}`);
