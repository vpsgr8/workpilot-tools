import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const CATEGORIES = {
  pdf: {
    file: "pdf-tools.html",
    title: "PDF Tools",
    description: "Convert, compress, merge, split, rotate, protect, and export PDF files online.",
    breadcrumb: "PDF Tools",
    tools: [
      { slug: "pdf-compress", name: "Pdf Compress", desc: "Open tool", type: "html" },
      { slug: "pdf-merge", name: "Pdf Merge", desc: "Open tool", type: "html" },
      { slug: "pdf-protect", name: "Pdf Protect", desc: "Open tool", type: "html" },
      { slug: "pdf-rotate", name: "Pdf Rotate", desc: "Open tool", type: "html" },
      { slug: "pdf-split", name: "Pdf Split", desc: "Open tool", type: "html" },
      { slug: "pdf-to-jpg", name: "Pdf To Jpg", desc: "Open tool", type: "html" },
      { slug: "pdf-to-word", name: "Pdf To Word", desc: "Open tool", type: "html" },
      { slug: "jpg-to-pdf", name: "Jpg To Pdf", desc: "Open tool", type: "html" },
      { slug: "word-to-pdf", name: "Word To Pdf", desc: "Open tool", type: "html" },
      { slug: "excel-to-pdf", name: "Excel To Pdf", desc: "Open tool", type: "html" },
    ],
  },
  ai: {
    file: "ai-tools.html",
    title: "AI Tools",
    description: "Create AI images, avatars, captions, titles, and enhance photos in the browser.",
    breadcrumb: "AI Tools",
    tools: [
      { slug: "ai-image-generator", name: "Ai Image Generator", desc: "Open tool", type: "html" },
      { slug: "ai-avatar", name: "Ai Avatar", desc: "Open tool", type: "html" },
      { slug: "ai-upscaler", name: "Ai Upscaler", desc: "Open tool", type: "html" },
      { slug: "background-remover", name: "Background Remover", desc: "Open tool", type: "html" },
      { slug: "face-swap", name: "Face Swap", desc: "Open tool", type: "html" },
      { slug: "image-enhancer", name: "Image Enhancer", desc: "Open tool", type: "html" },
      { slug: "object-remover", name: "Object Remover", desc: "Open tool", type: "html" },
      { slug: "ai-headshots", name: "AI Headshots", desc: "Generate professional photos", type: "app", route: "/headshot" },
      { slug: "instagram-captions", name: "Instagram Captions", desc: "AI caption ideas for posts", type: "app", route: "/instagram" },
      { slug: "youtube-titles", name: "YouTube Titles", desc: "High-CTR title ideas", type: "app", route: "/youtube" },
      { slug: "hashtag-generator", name: "Hashtag Generator", desc: "Trending hashtags for posts", type: "app", route: "/hashtag" },
    ],
  },
  image: {
    file: "image-tools.html",
    title: "Image Tools",
    description: "Compress, convert, resize, crop, rotate, watermark, and create images online.",
    breadcrumb: "Image Tools",
    tools: [
      { slug: "image-compressor", name: "Image Compressor", desc: "Open tool", type: "html" },
      { slug: "image-converter", name: "Image Converter", desc: "Open tool", type: "html" },
      { slug: "image-cropper", name: "Image Cropper", desc: "Open tool", type: "html" },
      { slug: "image-resizer", name: "Image Resizer", desc: "Open tool", type: "html" },
      { slug: "image-rotator", name: "Image Rotator", desc: "Open tool", type: "html" },
      { slug: "collage-maker", name: "Collage Maker", desc: "Open tool", type: "html" },
      { slug: "gif-maker", name: "Gif Maker", desc: "Open tool", type: "html" },
      { slug: "meme-generator", name: "Meme Generator", desc: "Open tool", type: "html" },
      { slug: "watermark-adder", name: "Watermark Adder", desc: "Open tool", type: "html" },
    ],
  },
  audio: {
    file: "audio-tools.html",
    title: "Audio & Speech Tools",
    description: "Record, convert, trim, merge, speak, and transcribe audio with browser tools.",
    breadcrumb: "Audio & Speech Tools",
    tools: [
      { slug: "audio-converter", name: "Audio Converter", desc: "Open tool", type: "html" },
      { slug: "audio-merger", name: "Audio Merger", desc: "Open tool", type: "html" },
      { slug: "audio-trimmer", name: "Audio Trimmer", desc: "Open tool", type: "html" },
      { slug: "voice-recorder", name: "Voice Recorder", desc: "Open tool", type: "html" },
      { slug: "speech-to-text", name: "Speech To Text", desc: "Open tool", type: "html" },
      { slug: "text-to-speech", name: "Text To Speech", desc: "Open tool", type: "html" },
    ],
  },
  video: {
    file: "video-tools.html",
    title: "Video & Screen Tools",
    description: "Preview, record, and prepare video files with simple browser-based tools.",
    breadcrumb: "Video & Screen Tools",
    tools: [
      { slug: "video-compressor", name: "Video Compressor", desc: "Open tool", type: "html" },
      { slug: "video-converter", name: "Video Converter", desc: "Open tool", type: "html" },
      { slug: "video-trimmer", name: "Video Trimmer", desc: "Open tool", type: "html" },
      { slug: "screen-recorder", name: "Screen Recorder", desc: "Open tool", type: "html" },
    ],
  },
  business: {
    file: "business-tools.html",
    title: "Business & Utility Tools",
    description: "Invoices, QR codes, calculators, resume builder, and everyday productivity utilities.",
    breadcrumb: "Business & Utility Tools",
    tools: [
      { slug: "barcode-generator", name: "Barcode Generator", desc: "Open tool", type: "html" },
      { slug: "business-card", name: "Business Card", desc: "Open tool", type: "html" },
      { slug: "document-scanner", name: "Document Scanner", desc: "Open tool", type: "html" },
      { slug: "invoice-generator", name: "Invoice Generator", desc: "Open tool", type: "html" },
      { slug: "qr-generator", name: "Qr Generator", desc: "Open tool", type: "html" },
      { slug: "web-scraper", name: "Web Scraper", desc: "Extract links, tables, and data from HTML", type: "html" },
      { slug: "age-calculator", name: "Age Calculator", desc: "Exact age and birthday countdown", type: "app", route: "/age" },
      { slug: "emi-calculator", name: "EMI Calculator", desc: "Loan EMI and interest breakdown", type: "app", route: "/emi" },
      { slug: "sip-calculator", name: "SIP Calculator", desc: "Mutual fund SIP returns", type: "app", route: "/sip" },
      { slug: "gst-calculator", name: "GST Calculator", desc: "Add or remove GST from amounts", type: "app", route: "/gst" },
      { slug: "loan-calculator", name: "Loan Calculator", desc: "Monthly payments and amortization", type: "app", route: "/loan" },
      { slug: "qr-code-studio", name: "QR Code Studio", desc: "Generate and download QR codes", type: "app", route: "/qr" },
      { slug: "resume-builder", name: "Resume Builder", desc: "Build an ATS-friendly resume", type: "app", route: "/resume" },
    ],
  },
  pregnancy: {
    file: "pregnancy-tools.html",
    title: "Pregnancy Tools",
    description: "Due date, ovulation, fertility, weight gain, and pregnancy planning calculators.",
    breadcrumb: "Pregnancy Tools",
    tools: [
      { slug: "pregnancy-due-date", name: "Due Date Calculator", desc: "Estimated due date and trimester", type: "app", route: "/pregnancy-due-date" },
      { slug: "pregnancy-week", name: "Pregnancy Week Calculator", desc: "Week-by-week baby development", type: "app", route: "/pregnancy-week" },
      { slug: "ovulation-calculator", name: "Ovulation Calculator", desc: "Predict your fertile window", type: "app", route: "/ovulation" },
      { slug: "fertility-calculator", name: "Fertility Calculator", desc: "Multi-cycle fertility calendar", type: "app", route: "/fertility" },
      { slug: "pregnancy-weight-gain", name: "Pregnancy Weight Gain Guide", desc: "BMI-based weight recommendations", type: "app", route: "/pregnancy-weight" },
      { slug: "pregnancy-bmi", name: "Pregnancy BMI Calculator", desc: "Pre-pregnancy BMI and advice", type: "app", route: "/pregnancy-bmi" },
      { slug: "baby-gender-predictor", name: "Baby Gender Predictor", desc: "Fun Chinese gender chart", type: "app", route: "/baby-gender" },
      { slug: "baby-name-generator", name: "Baby Name Generator", desc: "Names with meanings and origins", type: "app", route: "/baby-name" },
      { slug: "conception-date", name: "Conception Date Calculator", desc: "Estimate conception from LMP", type: "app", route: "/conception-date" },
      { slug: "pregnancy-countdown", name: "Pregnancy Countdown", desc: "Countdown and milestone tracker", type: "app", route: "/pregnancy-countdown" },
    ],
  },
  baby: {
    file: "baby-parenting-tools.html",
    title: "Baby & Parenting Tools",
    description: "Growth percentiles, feeding, sleep, vaccination, and baby milestone trackers.",
    breadcrumb: "Baby & Parenting Tools",
    tools: [
      { slug: "baby-growth-percentile", name: "Baby Growth Percentile", desc: "WHO height and weight percentile", type: "app", route: "/baby-growth" },
      { slug: "baby-feeding-calculator", name: "Baby Feeding Calculator", desc: "Formula and breastfeeding guide", type: "app", route: "/baby-feeding" },
      { slug: "baby-sleep-calculator", name: "Baby Sleep Calculator", desc: "Age-based sleep schedule", type: "app", route: "/baby-sleep" },
      { slug: "vaccination-tracker", name: "Vaccination Schedule Tracker", desc: "India IAP immunization schedule", type: "app", route: "/vaccination" },
      { slug: "baby-age-calculator", name: "Baby Age Calculator", desc: "Age in days, weeks, and milestones", type: "app", route: "/baby-age" },
    ],
  },
};

const NAV = `
.nav-links{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:13px}
.nav-links a{color:#5b6472;text-decoration:none;white-space:nowrap}
.nav-links a:hover{color:#4f46e5}`;

function toolHref(tool) {
  if (tool.type === "app") return `tools/${tool.slug}.html`;
  return `tools/${tool.slug}.html`;
}

function cardsHtml(tools, prefix = "") {
  return tools
    .map((tool) => {
      const href = prefix + toolHref(tool);
      return `<a class="card" href="${href}"><strong>${tool.name}</strong><span>${tool.desc}</span></a>`;
    })
    .join("");
}

function categoryPage(cat) {
  const url = `https://workpilottools.biz/${cat.file}`;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${cat.title} - WorkPilot Tools</title><meta name="description" content="${cat.description}"><link rel="canonical" href="${url}"><style>body{margin:0;font-family:Inter,system-ui,Segoe UI,sans-serif;background:#f7f8fb;color:#111827}.wrap{width:min(1120px,calc(100% - 32px));margin:0 auto}header{background:#fff;border-bottom:1px solid #e5e7eb}.nav{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:8px 0}.brand{text-decoration:none;color:#111827;font-weight:800;white-space:nowrap}.hero{padding:48px 0 20px}h1{font-size:clamp(32px,6vw,54px);line-height:1;margin:0 0 12px}.hero p{max-width:720px;color:#5b6472;font-size:18px;line-height:1.6}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;padding:18px 0 54px}.card{min-height:104px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:18px;text-decoration:none;color:#111827;display:flex;flex-direction:column;justify-content:center;gap:8px}.card:hover{border-color:#4f46e5}.card span{color:#5b6472}footer{border-top:1px solid #e5e7eb;color:#5b6472;padding:24px 0 36px}${NAV}</style><meta property="og:title" content="${cat.title}">
<meta property="og:description" content="${cat.description}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://workpilottools.biz/assets/og-default.png">
<meta property="og:site_name" content="WorkPilot Tools">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://workpilottools.biz/"},{"@type":"ListItem","position":2,"name":"${cat.breadcrumb}","item":"${url}"}]}</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5121623665404680" crossorigin="anonymous"></script>
<meta name="google-adsense-account" content="ca-pub-5121623665404680">
</head><body><header><nav class="wrap nav"><a class="brand" href="index.html">WorkPilot Tools</a><div class="nav-links"><a href="pdf-tools.html">PDF</a><a href="ai-tools.html">AI</a><a href="image-tools.html">Image</a><a href="audio-tools.html">Audio</a><a href="video-tools.html">Video</a><a href="business-tools.html">Business</a><a href="pregnancy-tools.html">Pregnancy</a><a href="baby-parenting-tools.html">Baby</a><a href="blog/index.html">Blog</a></div></nav></header><main class="wrap"><section class="hero"><h1>${cat.title}</h1><p>${cat.description}</p></section><section class="grid">${cardsHtml(cat.tools)}</section></main><footer class="wrap">© 2026 WorkPilot Tools</footer></body></html>`;
}

function appToolPage(tool, categoryTitle) {
  const title = `${tool.name} - Free Online | WorkPilot Tools`;
  const url = `https://workpilottools.biz/tools/${tool.slug}.html`;
  const appUrl = `/app${tool.route}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="Free ${tool.name.toLowerCase()} — ${tool.desc}. No signup required.">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${tool.name}">
<meta property="og:description" content="${tool.desc}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://workpilottools.biz/assets/og-default.png">
<meta property="og:site_name" content="WorkPilot Tools">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://workpilottools.biz/"},{"@type":"ListItem","position":2,"name":"${categoryTitle}","item":"https://workpilottools.biz/"},{"@type":"ListItem","position":3,"name":"${tool.name}","item":"${url}"}]}</script>
<meta http-equiv="refresh" content="0;url=${appUrl}">
<script>location.replace("${appUrl}");</script>
<style>body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f7f8fb;color:#111827;display:flex;align-items:center;justify-content:center;min-height:100vh}.box{text-align:center;padding:24px}a{color:#4f46e5}</style>
</head>
<body><div class="box"><p>Opening ${tool.name}…</p><p><a href="${appUrl}">Continue if you are not redirected</a></p></div></body>
</html>`;
}

function setupAppFolder() {
  const structured = path.join(ROOT, "structured");
  const app = path.join(ROOT, "app");
  if (fs.existsSync(structured) && !fs.existsSync(app)) {
    fs.renameSync(structured, app);
  }

  const jsPath = path.join(app, "assets", "index-BuXGMVcM.js");
  let js = fs.readFileSync(jsPath, "utf8");
  js = js.replace('base:"/".replace(/\\/\\/$/,"")', 'base:"/app".replace(/\\/\\/$/,"")');
  fs.writeFileSync(jsPath, js);

  const indexPath = path.join(app, "index.html");
  let index = fs.readFileSync(indexPath, "utf8");
  index = index.replace(
    "<script type=\"module\"",
    `<script>
(function () {
  var route = new URLSearchParams(location.search).get("__path");
  if (route) {
    var target = "/app" + (route.startsWith("/") ? route : "/" + route);
    history.replaceState(null, "", target);
  }
})();
</script>
<script type="module"`,
  );
  index = index.replace(/structured/g, "app");
  index = index.replace("Multi-Tool App", "WorkPilot ToolKit");
  fs.writeFileSync(indexPath, index);

  fs.writeFileSync(
    path.join(ROOT, "404.html"),
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>WorkPilot Tools</title>
<script>
(function () {
  var path = location.pathname;
  if (path.indexOf("/app/") === 0 && path !== "/app/index.html") {
    var route = path.slice(4) || "/";
    location.replace("/app/index.html?__path=" + encodeURIComponent(route));
    return;
  }
  location.replace("/");
})();
</script>
</head>
<body></body>
</html>`,
  );
}

function updateIndexHtml() {
  let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

  const nav = `<a href="pdf-tools.html">PDF Tools</a>
        <a href="ai-tools.html">AI Tools</a>
        <a href="image-tools.html">Image Tools</a>
        <a href="audio-tools.html">Audio Tools</a>
        <a href="video-tools.html">Video Tools</a>
        <a href="business-tools.html">Business</a>
        <a href="pregnancy-tools.html">Pregnancy</a>
        <a href="baby-parenting-tools.html">Baby</a>
        <a href="#blogs">Blogs</a>`;

  html = html.replace(
    /<a href="pdf-tools\.html">PDF Tools<\/a>[\s\S]*?<a href="#blogs">Blogs<\/a>/,
    nav,
  );

  html = html.replace(/<span class="count">41 tools<\/span>/, `<span class="count">67 tools</span>`);

  const groups = {
    "ai-tools": CATEGORIES.ai,
    "business-and-utility-tools": CATEGORIES.business,
  };

  for (const [id, cat] of Object.entries(groups)) {
    const grid = cat.tools
      .map((t) => `<a class="tool-card" href="${toolHref(t)}"><span>${t.name}</span><small>${t.desc}</small></a>`)
      .join("\n          ");
    const count = cat.tools.length;
    html = html.replace(
      new RegExp(`(<h3 id="${id}">[^<]+</h3>\\s*<span>)\\d+ tools(</span>[\\s\\S]*?<div class="grid">)[\\s\\S]*?(</div>\\s*</section>)`),
      `$1${count} tools$2\n          ${grid}\n        $3`,
    );
  }

  const pregnancySection = `
      <section class="tool-group" aria-labelledby="pregnancy-tools">
        <div class="group-title">
          <h3 id="pregnancy-tools">Pregnancy Tools</h3>
          <span>${CATEGORIES.pregnancy.tools.length} tools</span>
        </div>
        <div class="grid">
          ${CATEGORIES.pregnancy.tools.map((t) => `<a class="tool-card" href="${toolHref(t)}"><span>${t.name}</span><small>${t.desc}</small></a>`).join("\n          ")}
        </div>
      </section>
      <section class="tool-group" aria-labelledby="baby-parenting-tools">
        <div class="group-title">
          <h3 id="baby-parenting-tools">Baby & Parenting Tools</h3>
          <span>${CATEGORIES.baby.tools.length} tools</span>
        </div>
        <div class="grid">
          ${CATEGORIES.baby.tools.map((t) => `<a class="tool-card" href="${toolHref(t)}"><span>${t.name}</span><small>${t.desc}</small></a>`).join("\n          ")}
        </div>
      </section>`;

  html = html.replace(
    /\s*<section id="structured"[\s\S]*?<\/section>\s*/,
    pregnancySection,
  );

  html = html.replace(/\s*<a href="structured\/index\.html">Structured<\/a>\s*/g, "\n    ");
  html = html.replace(
    "Browse by PDF, AI, image, audio, video, business utilities, or read practical guides in the blog.",
    "Browse by PDF, AI, image, audio, video, business, pregnancy, baby and parenting tools, or read practical guides in the blog.",
  );

  fs.writeFileSync(path.join(ROOT, "index.html"), html);
}

function updateBlogIndex() {
  const file = path.join(ROOT, "blog", "index.html");
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(
    `<div style="display:flex;gap:16px;align-items:center;">
        <a class="nav-link" href="../structured/index.html">Structured</a>
        <a class="nav-link" href="../index.html">Back to Tools</a>
      </div>`,
    `<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;font-size:13px">
        <a class="nav-link" href="../pdf-tools.html">PDF</a>
        <a class="nav-link" href="../pregnancy-tools.html">Pregnancy</a>
        <a class="nav-link" href="../baby-parenting-tools.html">Baby</a>
        <a class="nav-link" href="../index.html">Back to Tools</a>
      </div>`,
  );
  fs.writeFileSync(file, html);
}

function updateSitemap() {
  const file = path.join(ROOT, "sitemap.xml");
  let xml = fs.readFileSync(file, "utf8");
  xml = xml.replace(/\s*<url><loc>https:\/\/workpilottools\.biz\/structured\/<\/loc><\/url>\s*/g, "\n");
  if (!xml.includes("pregnancy-tools.html")) {
    xml = xml.replace(
      "<url><loc>https://workpilottools.biz/privacy.html</loc></url>",
      "<url><loc>https://workpilottools.biz/privacy.html</loc></url>\n  <url><loc>https://workpilottools.biz/pregnancy-tools.html</loc></url>\n  <url><loc>https://workpilottools.biz/baby-parenting-tools.html</loc></url>",
    );
  }
  const appTools = Object.values(CATEGORIES).flatMap((c) =>
    c.tools.filter((t) => t.type === "app").map((t) => t.slug),
  );
  for (const slug of appTools) {
    const entry = `<url><loc>https://workpilottools.biz/tools/${slug}.html</loc></url>`;
    if (!xml.includes(entry)) {
      xml = xml.replace("</urlset>", `  ${entry}\n</urlset>`);
    }
  }
  fs.writeFileSync(file, xml);
}

function main() {
  setupAppFolder();

  for (const cat of Object.values(CATEGORIES)) {
    fs.writeFileSync(path.join(ROOT, cat.file), categoryPage(cat));
    for (const tool of cat.tools.filter((t) => t.type === "app")) {
      fs.writeFileSync(path.join(ROOT, "tools", `${tool.slug}.html`), appToolPage(tool, cat.breadcrumb));
    }
  }

  updateIndexHtml();
  updateBlogIndex();
  updateSitemap();

  if (fs.existsSync(path.join(ROOT, "structured"))) {
    fs.rmSync(path.join(ROOT, "structured"), { recursive: true, force: true });
  }

  console.log("Integration complete.");
}

main();
