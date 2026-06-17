#!/usr/bin/env node
"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { FINANCE_BLOGS } from "./finance-seo-blogs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "blog");
const SITE = "https://workpilottools.biz";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toolHref(tool) {
  return tool.isHub ? tool.slug : tool.slug.startsWith("../") ? tool.slug : `../tools/${tool.slug}.html`;
}

function blogHtml(post) {
  const url = `${SITE}/blog/${post.slug}.html`;
  const toolLink = toolHref(post.tool);
  const desc = `${post.title} — free guide with calculators, comparisons, and internal links. WorkPilot Tools blog.`;
  const sections = post.sections
    .map((s) => `<h2>${s.h2}</h2>\n<p>${s.body}</p>`)
    .join("\n");
  const compareLink = post.compare
    ? `<p>📊 <strong>Interactive comparison:</strong> <a href="${post.compare}">Open comparison page →</a></p>`
    : "";
  const extras = (post.extraLinks || [])
    .map((l) => `<a href="${l.href}" style="color:#4f46e5;font-weight:600;margin-right:12px">${esc(l.label)} →</a>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R0HRTRJJFN"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-R0HRTRJJFN');</script>
<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
<link rel="stylesheet" href="../assets/theme.css">
<link rel="stylesheet" href="../assets/monetization.css">
<link rel="stylesheet" href="../assets/site-brand.css">
<script defer src="../assets/theme.js"></script>
<script defer src="../assets/monetization.js"></script>
<script defer src="../assets/site-brand.js"></script>
<title>${esc(post.title)} | WorkPilot Blog</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(post.keywords)}">
<link rel="canonical" href="${url}">
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link rel="stylesheet" href="../assets/tailwind.css">
<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');body{font-family:'Inter',sans-serif}.prose h2{font-size:1.5rem;font-weight:700;margin-top:2rem;margin-bottom:1rem}.prose p{margin-bottom:1rem;line-height:1.7}.prose a{color:#4f46e5;font-weight:600}</style>
<meta property="og:title" content="${esc(post.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: desc, url, keywords: post.keywords, author: { "@type": "Organization", name: "WorkPilot Tools" }, publisher: { "@type": "Organization", name: "WorkPilot Tools" } })}</script>
</head>
<body class="bg-gray-50">
<header class="bg-white border-b sticky top-0 z-40"><div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center gap-3"><a href="../index.html" class="font-bold text-xl">WorkPilot <span class="text-gray-500 font-normal">Blog</span></a><div class="flex gap-3 items-center"><button type="button" class="wp-theme-toggle" aria-label="Toggle dark mode">🌙</button><a href="../finance-tools.html" class="text-sm text-indigo-600 font-semibold">Finance Tools</a></div></div></header>
<article class="max-w-4xl mx-auto px-4 py-8">
<div class="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
<span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">Finance</span>
<h1 class="text-3xl md:text-4xl font-bold mt-4 mb-4">${esc(post.title)}</h1>
<p class="text-xl text-gray-600 mb-6">${esc(post.intro)}</p>
<div class="prose max-w-none">
${compareLink}
${sections}
<h2>Free tools to use now</h2>
<p>Open the free <a href="${toolLink}">${esc(post.tool.name)}</a> on WorkPilot — no signup, runs in your browser. Browse all <a href="../finance-tools.html">100+ finance calculators</a>, <a href="../finance-compare.html">comparison guides</a>, and the <a href="../tools/ai-financial-planner.html">AI Financial Planner</a>.</p>
<h2>Related links</h2>
<p>${extras}</p>
</div>
<div class="mt-10 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
<h3 class="font-bold mb-2">Try the calculator</h3>
<a href="${toolLink}" class="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">Open ${esc(post.tool.name)} →</a>
</div>
</div>
</article>
<footer class="border-t py-8 bg-white text-center text-sm text-gray-600"><p>© 2026 WorkPilot Tools · <a href="../finance-tools.html">Finance</a> · <a href="index.html">Blog</a></p></footer>
</body>
</html>`;
}

function patchExistingFinanceBlogs() {
  const financePattern = /emi|sip|loan|tax|gst|salary|fd|finance|brokerage|retirement|mutual|credit-card|in-hand|net-worth|compound|cagr|prepayment|eligibility|home-loan|car-loan/i;
  let patched = 0;
  fs.readdirSync(BLOG_DIR).forEach((file) => {
    if (!file.endsWith(".html") || file === "index.html") return;
    if (!financePattern.test(file)) return;
    const fp = path.join(BLOG_DIR, file);
    let html = fs.readFileSync(fp, "utf8");
    const orig = html;
    html = html
      .replace(/href="\.\.\/business-tools\.html"/g, 'href="../finance-tools.html"')
      .replace(/>Business Tools</g, ">Finance Tools<")
      .replace(/"Business"/g, '"Finance"');
    if (!html.includes("finance-tools.html") && html.includes("../tools/")) {
      html = html.replace(
        "</footer>",
        '<div style="max-width:896px;margin:16px auto;padding:16px;border:1px solid #c7d2fe;background:#eef2ff;border-radius:12px;font-size:14px"><strong>Finance hub:</strong> <a href="../finance-tools.html" style="color:#4f46e5;font-weight:700">100+ Finance Calculators</a> · <a href="../finance-compare.html" style="color:#4f46e5;font-weight:700">Comparisons</a> · <a href="../tools/ai-financial-planner.html" style="color:#4f46e5;font-weight:700">AI Planner</a></div>\n</footer>'
      );
    }
    if (html !== orig) {
      fs.writeFileSync(fp, html);
      patched++;
    }
  });
  return patched;
}

function updateBlogIndex() {
  const indexPath = path.join(BLOG_DIR, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  const financeCards = FINANCE_BLOGS.map(
    (p) => `<a class="blog-card" href="${p.slug}.html"><span>${esc(p.title)}</span><small>Finance guide with calculators &amp; internal links.</small></a>`
  ).join("\n        ");
  const marker = '<section aria-label="Blog posts" class="grid">';
  const financeSection = `<section aria-label="Finance guides" style="max-width:1120px;margin:0 auto;padding:0 16px"><h2 style="font-size:1.25rem;margin:24px 0 12px">💰 Finance &amp; Money Guides</h2><div class="grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;padding-bottom:24px">${financeCards}</div></section>\n    `;
  if (!html.includes("Finance &amp; Money Guides")) {
    html = html.replace(marker, financeSection + marker);
  }
  html = html.replace(
    '<meta name="keywords" content="workpilot blog, pdf guides',
    '<meta name="keywords" content="finance calculator guide, sip calculator, emi calculator, income tax guide, workpilot blog, pdf guides'
  );
  html = html.replace(
    "Browse practical articles for PDF workflows",
    "Browse finance, SIP, EMI, tax, and investment guides plus PDF workflows"
  );
  if (!html.includes('href="../finance-tools.html"')) {
    html = html.replace(
      '<a class="nav-link" href="../index.html">Back to Tools</a>',
      '<a class="nav-link" href="../finance-tools.html">Finance</a>\n        <a class="nav-link" href="../index.html">Back to Tools</a>'
    );
  }
  fs.writeFileSync(indexPath, html);
}

function updateSitemap() {
  const smPath = path.join(ROOT, "sitemap.xml");
  let xml = fs.readFileSync(smPath, "utf8");
  FINANCE_BLOGS.forEach((p) => {
    const u = `  <url><loc>${SITE}/blog/${p.slug}.html</loc></url>`;
    if (!xml.includes(u.trim())) {
      const anchor = "  <url><loc>https://workpilottools.biz/blog/</loc></url>";
      xml = xml.replace(anchor, anchor + "\n" + u);
    }
  });
  fs.writeFileSync(smPath, xml);
}

FINANCE_BLOGS.forEach((post) => {
  fs.writeFileSync(path.join(BLOG_DIR, post.slug + ".html"), blogHtml(post));
});

const patched = patchExistingFinanceBlogs();
updateBlogIndex();
updateSitemap();
console.log("Generated", FINANCE_BLOGS.length, "finance SEO blogs; patched", patched, "existing finance posts");
