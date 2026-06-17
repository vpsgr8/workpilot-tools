#!/usr/bin/env node
"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { COMPARISONS } from "./finance-comparison-registry.mjs";

const BLOG_FOR_COMPARE = {
  "sip-vs-fd": "sip-vs-fd-complete-comparison.html",
  "sip-vs-lumpsum": "mutual-fund-sip-beginners-guide.html",
  "new-vs-old-tax-regime": "new-vs-old-tax-regime-guide.html",
  "home-loan-vs-personal-loan": "home-loan-vs-personal-loan-guide.html",
  "emi-vs-credit-card-emi": "credit-card-emi-vs-personal-loan.html",
  "compound-vs-simple-interest": "compound-interest-formula-guide.html",
  "rd-vs-sip": "mutual-fund-sip-beginners-guide.html",
  "delivery-vs-intraday": "brokerage-charges-india-explained.html",
  "ppf-vs-fd": "fd-calculator-guide-india.html",
  "mutual-fund-vs-stock": "mutual-fund-sip-beginners-guide.html",
  "retirement-sip-vs-fd": "retirement-planning-india-guide.html",
  "car-loan-vs-personal-loan": "home-loan-vs-personal-loan-guide.html",
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const COMPARE_DIR = path.join(ROOT, "compare");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tableRows(rows) {
  return rows
    .map(
      (r) =>
        `<tr><td>${esc(r.label)}</td><td>${esc(r.left)}</td><td>${esc(r.right)}</td></tr>`
    )
    .join("\n");
}

function comparePage(c) {
  const blogSlug = BLOG_FOR_COMPARE[c.slug];
  const blogBlock = blogSlug
    ? `<p style="margin-top:16px;font-size:14px">📖 Read the full guide: <a href="../blog/${blogSlug}">${esc(c.title)} — detailed blog</a> · <a href="../blog/finance-calculators-complete-guide.html">Finance calculators guide</a></p>`
    : `<p style="margin-top:16px;font-size:14px">📖 <a href="../blog/finance-calculators-complete-guide.html">100+ finance calculators guide</a> · <a href="../tools/ai-financial-planner.html">AI Financial Planner</a></p>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R0HRTRJJFN"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-R0HRTRJJFN');</script>
<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(c.title)} — Comparison Guide | WorkPilot Tools</title>
<meta name="description" content="${esc(c.desc)} Interactive comparison calculator and side-by-side guide.">
<link rel="canonical" href="https://workpilottools.biz/compare/${c.slug}.html">
<link rel="stylesheet" href="../assets/theme.css">
<link rel="stylesheet" href="../assets/monetization.css">
<link rel="stylesheet" href="../assets/site-brand.css">
<link rel="stylesheet" href="../assets/finance-calculators.css">
<script defer src="../assets/theme.js"></script>
<script defer src="../assets/monetization.js"></script>
<script defer src="../assets/site-brand.js"></script>
<script defer src="../assets/finance-comparisons.js"></script>
<style>
body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f7f8fb;color:#111827}
.wrap{max-width:960px;margin:0 auto;padding:24px 20px 48px}
header{background:#fff;border-bottom:1px solid #e5e7eb;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
header a{color:#4f46e5;text-decoration:none;font-weight:600;font-size:14px}
header nav{display:flex;gap:14px;flex-wrap:wrap}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px;margin-bottom:20px}
h1{margin:0 0 8px;font-size:clamp(1.5rem,4vw,2rem)}
.lead{color:#5b6472;line-height:1.6;margin:0 0 16px}
.fc-compare-table{width:100%;border-collapse:collapse;font-size:14px;margin:16px 0}
.fc-compare-table th,.fc-compare-table td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left}
.fc-compare-table th{background:#f8fafc;font-weight:700}
.fc-compare-table td:first-child{font-weight:600;color:#4338ca}
.fc-verdict{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin-top:16px;color:#166534;line-height:1.6}
.fc-tool-links{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.fc-tool-links a{padding:8px 14px;background:#eef2ff;border-radius:8px;color:#4338ca;text-decoration:none;font-weight:600;font-size:13px}
</style>
</head>
<body>
<header>
  <a href="../index.html">← WorkPilot Tools</a>
  <nav>
    <a href="../finance-tools.html">Finance</a>
    <a href="../finance-compare.html">Comparisons</a>
    <a href="../tools/ai-financial-planner.html">AI Planner</a>
  </nav>
</header>
<main class="wrap">
  <div class="card">
    <h1>${esc(c.title)}</h1>
    <p class="lead">${esc(c.desc)}</p>
    <table class="fc-compare-table">
      <thead><tr><th>Factor</th><th>${esc(c.left.name)}</th><th>${esc(c.right.name)}</th></tr></thead>
      <tbody>${tableRows(c.rows)}</tbody>
    </table>
    <div data-finance-compare="${esc(c.type)}"></div>
    <div class="fc-verdict"><strong>Verdict:</strong> ${esc(c.verdict)}</div>
    <div class="fc-tool-links">
      <a href="../tools/${c.left.slug}.html">${esc(c.left.name)} calculator →</a>
      <a href="../tools/${c.right.slug}.html">${esc(c.right.name)} calculator →</a>
    </div>
  </div>
  ${blogBlock}
  <p style="font-size:14px;color:#5b6472"><a href="../finance-compare.html">All finance comparisons</a> · <a href="../finance-tools.html">Finance calculators</a> · <a href="../blog/index.html">Blog</a></p>
</main>
</body>
</html>`;
}

function compareHub() {
  const cards = COMPARISONS.map(
    (c) =>
      `<a class="card" href="compare/${c.slug}.html"><strong>${esc(c.title)}</strong><span>${esc(c.desc.slice(0, 100))}…</span></a>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="en"><head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R0HRTRJJFN"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-R0HRTRJJFN');</script>
<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
<link rel="stylesheet" href="assets/theme.css">
<link rel="stylesheet" href="assets/site-brand.css">
<script defer src="assets/theme.js"></script>
<script defer src="assets/site-brand.js"></script>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Finance Comparison Guides — SIP vs FD, Tax Regime &amp; More | WorkPilot Tools</title>
<meta name="description" content="Compare SIP vs FD, new vs old tax regime, home loan vs personal loan, delivery vs intraday and more — with interactive calculators.">
<link rel="canonical" href="https://workpilottools.biz/finance-compare.html">
<style>
body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f7f8fb;color:#111827}
.wrap{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:48px 0}
h1{font-size:clamp(28px,5vw,48px);margin:0 0 12px}
.hero p{color:#5b6472;font-size:18px;max-width:720px;line-height:1.6}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:28px}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:18px;text-decoration:none;color:#111827;display:flex;flex-direction:column;gap:8px}
.card:hover{border-color:#4f46e5}
.card span{color:#5b6472;font-size:13px;line-height:1.5}
header{background:#fff;border-bottom:1px solid #e5e7eb;padding:12px 0}
.nav{width:min(1120px,calc(100% - 32px));margin:0 auto;display:flex;justify-content:space-between;align-items:center}
.nav a{color:#4f46e5;text-decoration:none;font-weight:600}
</style>
</head>
<body>
<header><nav class="nav"><a href="index.html">WorkPilot Tools</a><a href="finance-tools.html">Finance Calculators</a></nav></header>
<main class="wrap hero">
<h1>Finance Comparison Guides</h1>
<p>Side-by-side comparisons with interactive calculators — pick the right product for your money goals.</p>
<section class="grid">${cards}</section>
<p style="margin-top:24px;font-size:14px;color:#5b6472"><a href="tools/ai-financial-planner.html">AI Financial Planner</a> · <a href="finance-tools.html">All calculators</a></p>
</main>
</body></html>`;
}

function aiPlannerPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R0HRTRJJFN"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-R0HRTRJJFN');</script>
<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>AI Financial Planner — Free Investment Plan &amp; Projections | WorkPilot Tools</title>
<meta name="description" content="Free AI-powered financial planner — personalised SIP, emergency fund, retirement corpus, asset allocation and 10-year wealth projection. Private, browser-based.">
<link rel="canonical" href="https://workpilottools.biz/tools/ai-financial-planner.html">
<link rel="stylesheet" href="../assets/theme.css">
<link rel="stylesheet" href="../assets/monetization.css">
<link rel="stylesheet" href="../assets/site-brand.css">
<link rel="stylesheet" href="../assets/finance-calculators.css">
<script defer src="../assets/theme.js"></script>
<script defer src="../assets/monetization.js"></script>
<script defer src="../assets/site-brand.js"></script>
<script defer src="../assets/finance-ai-planner.js"></script>
<style>
body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f7f8fb;color:#111827}
.wrap{max-width:960px;margin:0 auto;padding:24px 20px 48px}
header{background:#fff;border-bottom:1px solid #e5e7eb;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
header a{color:#4f46e5;text-decoration:none;font-weight:600;font-size:14px}
header nav{display:flex;gap:14px;flex-wrap:wrap}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px;margin-bottom:20px}
h1{margin:0 0 8px;font-size:clamp(1.5rem,4vw,2rem)}
.lead{color:#5b6472;line-height:1.6;margin:0 0 16px}
.fc-ai-steps{margin:16px 0;padding-left:20px;color:#374151;line-height:1.7}
.fc-ai-table{width:100%;border-collapse:collapse;font-size:14px;margin-top:12px}
.fc-ai-table th,.fc-ai-table td{border:1px solid #e5e7eb;padding:8px 10px;text-align:left}
.fc-ai-table th{background:#f8fafc}
.fc-ai-summary h3{margin:0 0 8px}
.fc-ai-summary p{margin:0;color:#5b6472}
.section-title{margin:0 0 8px;font-size:1.1rem}
</style>
</head>
<body>
<header>
  <a href="../index.html">← WorkPilot Tools</a>
  <nav>
    <a href="../finance-tools.html">Finance</a>
    <a href="../finance-compare.html">Comparisons</a>
    <a href="../blog/index.html">Blog</a>
  </nav>
</header>
<main class="wrap">
  <div class="card">
    <h1>AI Financial Planner</h1>
    <p class="lead">Get a personalised financial plan — emergency fund, SIP amount, retirement corpus, asset allocation, and step-by-step actions. Powered by smart planning logic, 100% private in your browser.</p>
    <div data-finance-ai="planner"></div>
  </div>
  <div class="card">
    <h2 class="section-title">AI Investment Projection</h2>
    <p class="lead" style="margin-bottom:16px">Project SIP growth with annual step-up — see year-by-year corpus build-up.</p>
    <div data-finance-ai="projection"></div>
  </div>
  <p style="font-size:14px;color:#5b6472"><a href="../finance-compare.html">Comparison guides</a> · <a href="../finance-tools.html">100+ calculators</a> · <a href="sip-calculator.html">SIP Calculator</a></p>
</main>
</body>
</html>`;
}

function updateSitemap() {
  const smPath = path.join(ROOT, "sitemap.xml");
  let xml = fs.readFileSync(smPath, "utf8");
  const urls = [
    "  <url><loc>https://workpilottools.biz/finance-compare.html</loc></url>",
    "  <url><loc>https://workpilottools.biz/tools/ai-financial-planner.html</loc></url>",
    ...COMPARISONS.map((c) => `  <url><loc>https://workpilottools.biz/compare/${c.slug}.html</loc></url>`),
  ];
  urls.forEach((u) => {
    if (!xml.includes(u.trim())) {
      const anchor = "  <url><loc>https://workpilottools.biz/finance-tools.html</loc></url>";
      if (xml.includes(anchor)) xml = xml.replace(anchor, anchor + "\n" + u);
    }
  });
  fs.writeFileSync(smPath, xml);
}

if (!fs.existsSync(COMPARE_DIR)) fs.mkdirSync(COMPARE_DIR, { recursive: true });

COMPARISONS.forEach((c) => {
  fs.writeFileSync(path.join(COMPARE_DIR, c.slug + ".html"), comparePage(c));
});

fs.writeFileSync(path.join(ROOT, "finance-compare.html"), compareHub());
fs.writeFileSync(path.join(ROOT, "tools/ai-financial-planner.html"), aiPlannerPage());
updateSitemap();
console.log("Generated", COMPARISONS.length, "comparison pages + finance-compare hub + AI planner");
