#!/usr/bin/env node
"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATEGORIES, allTools, featuredTools } from "./finance-calculator-registry.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TOOLS_DIR = path.join(ROOT, "tools");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function faqBlock(title) {
  return `<div class="card fc-seo">
    <h2 style="margin:0 0 12px;font-size:1.1rem">How to use ${esc(title)}</h2>
    <ol style="margin:0;padding-left:20px;color:#5b6472;line-height:1.7">
      <li>Enter your numbers in the fields above.</li>
      <li>Click <strong>Calculate</strong> for instant results.</li>
      <li>Adjust inputs to compare scenarios — all processing stays in your browser.</li>
    </ol>
    <h2 style="margin:20px 0 12px;font-size:1.1rem">Why use WorkPilot finance tools?</h2>
    <p style="color:#5b6472;line-height:1.7;margin:0">Free, private, and optimized for India — no signup, no data sent to servers. Pair calculators with our <a href="../blog/index.html">finance guides</a> for deeper planning.</p>
  </div>`;
}

function seoKeywords(tool) {
  const base = tool.slug.replace(/-/g, " ");
  const india = "india, free online, no signup, workpilot tools, workpilottools.biz";
  const extra = {
    "sip-calculator": "mutual fund sip, sip returns, monthly sip",
    "emi-calculator": "loan emi, monthly emi, emi formula",
    "income-tax-calculator": "income tax india 2026, tax calculator, salary tax",
    "gst-calculator": "gst calculator india, add remove gst, gst rate",
    "fd-calculator": "fixed deposit calculator, fd interest, fd maturity",
    "home-loan-emi-calculator": "home loan emi, housing loan calculator",
    "ai-financial-planner": "ai financial planner, investment planning, retirement plan",
  };
  return `${base}, ${extra[tool.slug] || "finance calculator"}, ${india}`;
}

const BLOG_BY_TOOL = {
  "sip-calculator": ["sip-vs-fd-complete-comparison.html", "mutual-fund-sip-beginners-guide.html"],
  "emi-calculator": ["emi-calculator-explained.html", "reduce-emi-burden-tips.html"],
  "income-tax-calculator": ["income-tax-calculator-india-2026.html", "new-vs-old-tax-regime-guide.html"],
  "new-vs-old-tax-regime-calculator": ["new-vs-old-tax-regime-guide.html"],
  "gst-calculator": ["how-to-create-gst-invoice.html"],
  "fd-calculator": ["fd-calculator-guide-india.html"],
  "home-loan-emi-calculator": ["home-loan-emi-guide.html", "home-loan-vs-personal-loan-guide.html"],
  "personal-loan-emi-calculator": ["personal-loan-calculator-guide.html", "credit-card-emi-vs-personal-loan.html"],
  "loan-eligibility-calculator": ["loan-eligibility-complete-guide.html", "loan-eligibility-explained.html"],
  "brokerage-calculator": ["brokerage-charges-india-explained.html"],
  "retirement-corpus-calculator": ["retirement-planning-india-guide.html"],
  "compound-interest-calculator": ["compound-interest-formula-guide.html"],
  "in-hand-salary-calculator": ["in-hand-salary-india-guide.html"],
  "net-worth-calculator": ["net-worth-tracking-guide.html"],
  "credit-card-emi-calculator": ["credit-card-emi-vs-personal-loan.html"],
};

function blogGuidesBlock(slug) {
  const guides = BLOG_BY_TOOL[slug] || ["finance-calculators-complete-guide.html"];
  const links = guides
    .map((g) => `<a href="../blog/${g}" class="fc-related">${g.replace(/-/g, " ").replace(".html", "")}</a>`)
    .join("\n");
  return `<div class="card"><h2 style="margin:0 0 12px;font-size:1.1rem">Guides &amp; comparisons</h2>${links}<p style="margin:12px 0 0;font-size:13px;color:#5b6472"><a href="../finance-compare.html">Finance comparisons</a> · <a href="../blog/index.html">All blog guides</a></p></div>`;
}

function toolPage(tool) {
  const cfg = JSON.stringify({ ...(tool.config || {}), slug: tool.slug }).replace(/"/g, "&quot;");
  const related = (tool.related || [])
    .slice(0, 4)
    .map((s) => {
      const t = allTools().find((x) => x.slug === s);
      const label = t ? t.title : s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return `<a href="${s}.html" class="fc-related">${esc(label)}</a>`;
    })
    .join("\n");
  const formula = tool.formula
    ? `<p class="fc-formula"><strong>Formula:</strong> <code>${esc(tool.formula)}</code></p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R0HRTRJJFN"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-R0HRTRJJFN');</script>
<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Free ${esc(tool.title)} Online | WorkPilot Tools</title>
<meta name="description" content="${esc(tool.desc)} Free, private calculator — no signup, runs in your browser.">
<meta name="keywords" content="${esc(seoKeywords(tool))}">
<link rel="canonical" href="https://workpilottools.biz/tools/${tool.slug}.html">
<link rel="stylesheet" href="../assets/theme.css">
<link rel="stylesheet" href="../assets/monetization.css">
<link rel="stylesheet" href="../assets/site-brand.css">
<link rel="stylesheet" href="../assets/finance-calculators.css">
<script defer src="../assets/theme.js"></script>
<script defer src="../assets/monetization.js"></script>
<script defer src="../assets/site-brand.js"></script>
<script defer src="../assets/finance-calculators.js"></script>
<style>
body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f7f8fb;color:#111827}
.wrap{max-width:960px;margin:0 auto;padding:24px 20px 48px}
header{background:#fff;border-bottom:1px solid #e5e7eb;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
header a{color:#4f46e5;text-decoration:none;font-weight:600;font-size:14px}
header nav{display:flex;gap:14px;flex-wrap:wrap}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px;margin-bottom:20px}
h1{margin:0 0 8px;font-size:clamp(1.5rem,4vw,2rem)}
.lead{color:#5b6472;line-height:1.6;margin:0 0 16px}
.fc-related{display:inline-block;margin:4px 8px 4px 0;padding:6px 12px;background:#eef2ff;border-radius:8px;color:#4338ca;text-decoration:none;font-size:13px;font-weight:600}
.fc-formula code{background:#f1f5f9;padding:2px 8px;border-radius:6px;font-size:14px}
.fc-seo h2{color:#111827}
</style>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://workpilottools.biz/tools/${tool.slug}.html`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description: tool.desc,
  })}</script>
</head>
<body>
<header>
  <a href="../index.html">← WorkPilot Tools</a>
  <nav>
    <a href="../finance-tools.html">Finance Tools</a>
    <a href="../finance-compare.html">Compare</a>
    <a href="../blog/index.html">Blog</a>
  </nav>
</header>
<main class="wrap">
  <div class="card">
    <h1>${esc(tool.title)}</h1>
    <p class="lead">${esc(tool.desc)}</p>
    ${formula}
    <div data-finance-calc="${esc(tool.type)}" data-fc-config="${cfg}"></div>
  </div>
  <div class="card">
    <h2 style="margin:0 0 12px;font-size:1.1rem">Related calculators</h2>
    ${related || '<p style="color:#5b6472;margin:0">Browse all tools on the <a href="../finance-tools.html">finance hub</a>.</p>'}
  </div>
  ${blogGuidesBlock(tool.slug)}
  ${faqBlock(tool.title)}
  <p style="font-size:14px;color:#5b6472"><a href="../finance-tools.html">All finance calculators</a> · <a href="../tools/ai-financial-planner.html">AI Planner</a> · <a href="../our-products.html">Our Products</a></p>
</main>
</body>
</html>`;
}

function hubPage() {
  const featured = featuredTools();
  const sections = CATEGORIES.map((cat) => {
    const cards = cat.tools
      .map(
        (t) =>
          `<a class="card" href="tools/${t.slug}.html"><strong>${esc(t.title)}</strong><span>${esc(t.desc.slice(0, 90))}${t.desc.length > 90 ? "…" : ""}</span></a>`
      )
      .join("\n");
    return `<h2 class="section-label">${cat.icon} ${esc(cat.title)}</h2>\n<section class="grid">\n${cards}\n</section>`;
  }).join("\n");

  const featCards = featured
    .map(
      (t) =>
        `<a class="card card--feat" href="tools/${t.slug}.html"><strong>${esc(t.title)}</strong><span>${esc(t.desc.slice(0, 80))}…</span></a>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en"><head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R0HRTRJJFN"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-R0HRTRJJFN');</script>
<meta name="keywords" content="finance calculator, SIP calculator, EMI calculator, income tax calculator, GST calculator, FD calculator, CAGR calculator, stock calculator, loan eligibility, retirement calculator, free finance tools india, workpilot tools">
<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
<link rel="stylesheet" href="assets/theme.css">
<link rel="stylesheet" href="assets/monetization.css">
<link rel="stylesheet" href="assets/site-brand.css">
<script defer src="assets/theme.js"></script>
<script defer src="assets/monetization.js"></script>
<script defer src="assets/site-brand.js"></script>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>100+ Free Finance Calculators — SIP, EMI, Tax, Stock &amp; More | WorkPilot Tools</title>
<meta name="description" content="100+ free finance calculators — SIP, EMI, income tax, GST, FD, CAGR, salary, loan eligibility, stock P&amp;L, brokerage, retirement, inflation and more. No signup.">
<link rel="canonical" href="https://workpilottools.biz/finance-tools.html">
<style>
body{margin:0;font-family:Inter,system-ui,Segoe UI,sans-serif;background:#f7f8fb;color:#111827}
.wrap{width:min(1120px,calc(100% - 32px));margin:0 auto}
header{background:#fff;border-bottom:1px solid #e5e7eb}
.nav{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:8px 0}
.brand{text-decoration:none;color:#111827;font-weight:800}
.hero{padding:48px 0 24px}
h1{font-size:clamp(32px,6vw,54px);line-height:1;margin:0 0 12px}
.hero p{max-width:760px;color:#5b6472;font-size:18px;line-height:1.6}
.section-label{margin:32px 0 14px;font-size:15px;font-weight:800;color:#111827}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;padding:0 0 8px}
.card{min-height:104px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:18px;text-decoration:none;color:#111827;display:flex;flex-direction:column;gap:8px}
.card:hover{border-color:#4f46e5}
.card span{color:#5b6472;font-size:13px;line-height:1.45}
.card--feat{border-color:#c7d2fe;background:linear-gradient(180deg,#fff,#f5f3ff)}
.feat-label{margin:8px 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#6366f1}
footer{border-top:1px solid #e5e7eb;color:#5b6472;padding:24px 0 36px}
.nav-links{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:13px}
.nav-links a{color:#5b6472;text-decoration:none}
.nav-links a:hover{color:#4f46e5}
</style>
</head>
<body>
<header><nav class="wrap nav"><a class="brand" href="index.html">WorkPilot Tools</a><div class="nav-links"><button type="button" class="wp-theme-toggle" aria-label="Toggle dark mode">🌙</button><a href="pdf-tools.html">PDF</a><a href="ai-tools.html">AI</a><a href="image-tools.html">Image</a><a href="audio-tools.html">Audio</a><a href="video-tools.html">Video</a><a href="business-tools.html">Business</a><a href="finance-tools.html">Finance</a><a href="pregnancy-tools.html">Pregnancy</a><a href="baby-parenting-tools.html">Baby</a><a href="blog/index.html">Blog</a></div></nav></header>
<main class="wrap">
<section class="hero">
<h1>100+ Finance Calculators</h1>
<p>Investment, loans, tax, salary, stocks, banking, and financial planning — free calculators built for India. Private, instant, no signup. <a href="finance-compare.html">Compare products</a> · <a href="tools/ai-financial-planner.html">AI planner</a></p>
</section>
<p class="feat-label">⭐ Top traffic calculators</p>
<section class="grid">${featCards}</section>
<h2 class="section-label">🤖 AI Financial Planning</h2>
<section class="grid">
<a class="card card--feat" href="tools/ai-financial-planner.html"><strong>AI Financial Planner</strong><span>Personalised SIP, emergency fund, retirement plan &amp; projections</span></a>
</section>
<h2 class="section-label">⚖️ Comparison Guides</h2>
<section class="grid">
<a class="card" href="finance-compare.html"><strong>All Finance Comparisons</strong><span>SIP vs FD, tax regime, loans, trading modes &amp; more</span></a>
<a class="card" href="compare/sip-vs-fd.html"><strong>SIP vs FD</strong><span>Which investment suits your goals?</span></a>
<a class="card" href="compare/new-vs-old-tax-regime.html"><strong>New vs Old Tax Regime</strong><span>Which saves more tax for you?</span></a>
<a class="card" href="compare/home-loan-vs-personal-loan.html"><strong>Home Loan vs Personal Loan</strong><span>Rate, tenure &amp; tax benefits</span></a>
</section>
${sections}
<p style="color:#5b6472;font-size:14px;padding:24px 0">Guides on the <a href="blog/index.html">WorkPilot blog</a> · <a href="our-products.html">Our Products</a> · <a href="bizbuilt-ai.html">BizBuilt AI</a></p>
</main>
<footer class="wrap">© 2026 WorkPilot Tools · MarketMind Labs</footer>
</body></html>`;
}

function updateSitemap(tools) {
  const smPath = path.join(ROOT, "sitemap.xml");
  let xml = fs.readFileSync(smPath, "utf8");
  const urls = tools.map((t) => `  <url><loc>https://workpilottools.biz/tools/${t.slug}.html</loc></url>`);
  const marker = "  <url><loc>https://workpilottools.biz/tools/reverse-mortgage-calculator.html</loc></url>";
  const block = urls.filter((u) => !xml.includes(u.trim())).join("\n");
  if (block && xml.includes(marker)) {
    xml = xml.replace(marker, marker + "\n" + block.split("\n").filter((line) => !xml.includes(line.trim())).join("\n"));
  } else if (block) {
    const insertAfter = "  <url><loc>https://workpilottools.biz/finance-tools.html</loc></url>";
    if (xml.includes(insertAfter) && !xml.includes("lumpsum-investment-calculator")) {
      xml = xml.replace(insertAfter, insertAfter + "\n" + block);
    }
  }
  fs.writeFileSync(smPath, xml);
}

// Generate pages
const tools = allTools();
let count = 0;
tools.forEach((tool) => {
  const out = path.join(TOOLS_DIR, tool.slug + ".html");
  fs.writeFileSync(out, toolPage(tool));
  count++;
});
fs.writeFileSync(path.join(ROOT, "finance-tools.html"), hubPage());
updateSitemap(tools);
console.log("Generated", count, "finance tool pages + finance-tools.html hub");
