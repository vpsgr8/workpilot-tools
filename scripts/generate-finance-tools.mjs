#!/usr/bin/env node
"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.join(__dirname, "..");
const TOOLS = [
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator",
    calc: "mortgage",
    desc: "Calculate mortgage EMI with down payment, total interest, and repayment schedule planning.",
    related: ["home-loan-calculator", "home-equity-calculator", "emi-calculator", "loan-calculator"],
    guides: ["home-loan-emi-guide", "home-loan-interest-rates-india", "loan-prepayment-calculator-guide"],
  },
  {
    slug: "home-loan-calculator",
    title: "Home Loan Calculator",
    calc: "home-loan",
    desc: "Free home loan EMI calculator for India — plan tenure, interest, and monthly payments.",
    related: ["mortgage-calculator", "car-loan-calculator", "emi-calculator", "reverse-mortgage-calculator"],
    guides: ["home-loan-emi-guide", "home-loan-interest-rates-india", "loan-eligibility-explained"],
  },
  {
    slug: "car-loan-calculator",
    title: "Car Loan Calculator",
    calc: "car-loan",
    desc: "Estimate car loan EMI with down payment — plan auto finance before you buy.",
    related: ["home-loan-calculator", "loan-calculator", "emi-calculator", "sip-calculator"],
    guides: ["car-loan-emi-guide", "personal-loan-calculator-guide", "loan-tenure-guide"],
  },
  {
    slug: "home-equity-calculator",
    title: "Home Equity Calculator",
    calc: "home-equity",
    desc: "Find your home equity and how much you may borrow against property value.",
    related: ["home-loan-calculator", "mortgage-calculator", "reverse-mortgage-calculator", "loan-calculator"],
    guides: ["home-loan-interest-rates-india", "loan-eligibility-explained", "loan-prepayment-calculator-guide"],
  },
  {
    slug: "reverse-mortgage-calculator",
    title: "Reverse Mortgage Calculator",
    calc: "reverse-mortgage",
    desc: "Estimate reverse mortgage loan amount and monthly payout for senior homeowners.",
    related: ["home-equity-calculator", "home-loan-calculator", "mortgage-calculator", "sip-calculator"],
    guides: ["home-loan-emi-guide", "loan-tenure-guide", "sip-vs-fd"],
  },
];

function relatedLinks(slugs) {
  return slugs
    .map(function (s) {
      if (s.endsWith("-guide") || s.includes("loan-") && s.includes("-india")) {
        return `<a href="../blog/${s}.html" class="fc-related">${s.replace(/-/g, " ")}</a>`;
      }
      const name = s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return `<a href="${s}.html" class="fc-related">${name}</a>`;
    })
    .join("\n");
}

function page(t) {
  const guides = t.guides
    .map(
      (g) =>
        `<a href="../blog/${g}.html" class="block py-2 text-indigo-600 hover:underline text-sm">→ ${g.replace(/-/g, " ")}</a>`
    )
    .join("\n");
  const related = t.related
    .map((s) => {
      const label = s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return `<a href="${s}.html" class="block p-3 border rounded-lg hover:border-indigo-400 text-sm font-medium">${label}</a>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R0HRTRJJFN"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-R0HRTRJJFN');</script>
<script>try{var t=localStorage.getItem('wp-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Free ${t.title} Online | WorkPilot Tools</title>
<meta name="description" content="${t.desc} Free, private, no signup — runs in your browser.">
<link rel="canonical" href="https://workpilottools.biz/tools/${t.slug}.html">
<link rel="stylesheet" href="../assets/theme.css">
<link rel="stylesheet" href="../assets/monetization.css">
<link rel="stylesheet" href="../assets/site-brand.css">
<link rel="stylesheet" href="../assets/finance-calculators.css">
<script defer src="../assets/theme.js"></script>
<script defer src="../assets/monetization.js"></script>
<script defer src="../assets/site-brand.js"></script>
<script defer src="../assets/finance-calculators.js"></script>
<style>body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f7f8fb;color:#111827}.wrap{max-width:960px;margin:0 auto;padding:24px 20px 48px}header{background:#fff;border-bottom:1px solid #e5e7eb;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}header a{color:#4f46e5;text-decoration:none;font-weight:600;font-size:14px}header nav{display:flex;gap:14px;flex-wrap:wrap}.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px;margin-bottom:20px}h1{margin:0 0 8px;font-size:clamp(1.5rem,4vw,2rem)}.lead{color:#5b6472;line-height:1.6;margin:0 0 20px}.fc-related{display:inline-block;margin:4px 8px 4px 0;padding:6px 12px;background:#eef2ff;border-radius:8px;color:#4338ca;text-decoration:none;font-size:13px;font-weight:600}</style>
</head>
<body>
<header>
  <a href="../index.html">← WorkPilot Tools</a>
  <nav>
    <a href="../finance-tools.html">Finance Tools</a>
    <a href="../business-tools.html">Business</a>
    <a href="../blog/index.html">Blog</a>
  </nav>
</header>
<main class="wrap">
  <div class="card">
    <h1>${t.title}</h1>
    <p class="lead">${t.desc}</p>
    <div data-finance-calc="${t.calc}"></div>
  </div>
  <div class="card">
    <h2 style="margin:0 0 12px;font-size:1.1rem">Related finance tools</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px">${related}</div>
  </div>
  <div class="card">
    <h2 style="margin:0 0 12px;font-size:1.1rem">Guides</h2>
    ${guides}
  </div>
  <p style="font-size:14px;color:#5b6472">Browse all <a href="../finance-tools.html">Finance &amp; Loan Calculators</a> · <a href="../our-products.html">Our Products</a></p>
</main>
</body>
</html>`;
}

TOOLS.forEach(function (t) {
  const out = path.join(ROOT, "tools", t.slug + ".html");
  fs.writeFileSync(out, page(t));
  console.log("Wrote", out);
});
