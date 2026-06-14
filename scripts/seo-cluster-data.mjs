/** Tool registry + article clusters for SEO content generation */

export const SITE = "https://workpilottools.biz";

export const CATEGORIES = {
  pdf: { page: "pdf-tools.html", label: "PDF Tools", tag: "PDF" },
  ai: { page: "ai-tools.html", label: "AI Tools", tag: "AI" },
  image: { page: "image-tools.html", label: "Image Tools", tag: "Image" },
  audio: { page: "audio-tools.html", label: "Audio Tools", tag: "Audio" },
  video: { page: "video-tools.html", label: "Video Tools", tag: "Video" },
  business: { page: "business-tools.html", label: "Business Tools", tag: "Business" },
  pregnancy: { page: "pregnancy-tools.html", label: "Pregnancy Tools", tag: "Pregnancy" },
  baby: { page: "baby-parenting-tools.html", label: "Baby & Parenting Tools", tag: "Baby" },
};

/** Existing blog posts mapped to primary tool slug */
export const EXISTING_BLOGS = {
  "add-watermark-to-photos": { tool: "watermark-adder", title: "Add Watermark to Photos: Protect Your Images" },
  "ai-art-prompts-guide": { tool: "ai-image-generator", title: "100 Best AI Art Prompts for Stunning Images" },
  "ai-avatar-generator-free": { tool: "ai-avatar", title: "Create AI Avatars Free: 7 Best Tools" },
  "ai-image-upscaler-guide": { tool: "ai-upscaler", title: "AI Image Upscaler: Enhance Photos 4x (Free)" },
  "ai-photo-enhancer-free": { tool: "image-enhancer", title: "AI Photo Enhancer: Improve Quality Free" },
  "audio-converter-mp3-wav": { tool: "audio-converter", title: "Audio Converter: MP3, WAV, FLAC Free" },
  "barcode-generator-free-online": { tool: "barcode-generator", title: "Free Barcode Generator Online (All Types)" },
  "batch-merge-pdf-files": { tool: "pdf-merge", title: "How to Batch Merge Multiple PDF Files" },
  "best-ai-image-generators-free": { tool: "ai-image-generator", title: "10 Best Free AI Image Generators (2024)" },
  "bulk-image-resizer": { tool: "image-resizer", title: "Bulk Resize Images: Free Tools & Methods" },
  "business-card-maker-free": { tool: "business-card", title: "Free Business Card Maker: Design Online" },
  "compress-images-without-losing-quality": { tool: "image-compressor", title: "Compress Images Without Losing Quality (Guide)" },
  "compress-video-online-free": { tool: "video-compressor", title: "Compress Video Online Free: Reduce Size 80%" },
  "convert-scanned-pdf-to-word": { tool: "pdf-to-word", title: "Convert Scanned PDF to Word (OCR Guide)" },
  "convert-webp-to-jpg": { tool: "image-converter", title: "WEBP to JPG Converter: Free Online Tools" },
  "document-scanner-app": { tool: "document-scanner", title: "Best Document Scanner Apps (Free)" },
  "excel-to-pdf-converter": { tool: "excel-to-pdf", title: "Excel to PDF Converter: Free Online Tools" },
  "face-swap-online-free": { tool: "face-swap", title: "Face Swap Online Free: Complete Guide" },
  "free-invoice-generator-india": { tool: "invoice-generator", title: "Free Invoice Generator India (GST Ready)" },
  "how-to-compress-pdf-without-losing-quality": { tool: "pdf-compress", title: "How to Compress PDF Without Losing Quality" },
  "how-to-create-gst-invoice": { tool: "gst-calculator", title: "How to Create GST Invoice (Step by Step)" },
  "how-to-crop-images-perfectly": { tool: "image-cropper", title: "How to Crop Images Perfectly (Free Tools)" },
  "how-to-remove-background-free": { tool: "background-remover", title: "How to Remove Background Free (No Photoshop)" },
  "how-to-rotate-pdf-pages": { tool: "pdf-rotate", title: "How to Rotate PDF Pages Free Online" },
  "how-to-split-pdf-pages-free": { tool: "pdf-split", title: "How to Split PDF Pages Free" },
  "image-converter-jpg-png-webp": { tool: "image-converter", title: "Image Converter: JPG, PNG, WEBP Guide" },
  "image-optimization-seo": { tool: "image-compressor", title: "Image Optimization for SEO (Complete Guide)" },
  "invoice-template-download": { tool: "invoice-generator", title: "Free Invoice Template Download (2026)" },
  "jpg-to-pdf-converter-guide": { tool: "jpg-to-pdf", title: "JPG to PDF Converter: Free Online Guide" },
  "meme-generator-free-online": { tool: "meme-generator", title: "Meme Generator Free Online: Create Memes" },
  "merge-pdf-on-mobile": { tool: "pdf-merge", title: "How to Merge PDF on Mobile (Free)" },
  "pdf-compression-tips": { tool: "pdf-compress", title: "PDF Compression Tips: Reduce Size Fast" },
  "pdf-editor-free-online": { tool: "pdf-merge", title: "PDF Editor Free Online: Best Options" },
  "pdf-to-jpg-high-quality": { tool: "pdf-to-jpg", title: "PDF to JPG High Quality Converter Guide" },
  "pdf-to-word-converter-free-online": { tool: "pdf-to-word", title: "PDF to Word Converter Free Online" },
  "photo-collage-maker-free": { tool: "collage-maker", title: "Photo Collage Maker Free Online" },
  "protect-pdf-with-password": { tool: "pdf-protect", title: "Protect PDF with Password (Free Guide)" },
  "qr-code-generator-free": { tool: "qr-generator", title: "QR Code Generator Free: Complete Guide" },
  "reduce-pdf-file-size": { tool: "pdf-compress", title: "Reduce PDF File Size Without Quality Loss" },
  "remove-object-from-photo": { tool: "object-remover", title: "Remove Object from Photo Free (AI Guide)" },
  "resize-image-online-free": { tool: "image-resizer", title: "Resize Image Online Free (All Formats)" },
  "screen-recorder-free-online": { tool: "screen-recorder", title: "Screen Recorder Free Online (No Download)" },
  "stable-diffusion-vs-midjourney": { tool: "ai-image-generator", title: "Stable Diffusion vs Midjourney: Comparison" },
  "text-to-speech-free-online": { tool: "text-to-speech", title: "Text to Speech Free Online Guide" },
  "trim-video-online-free": { tool: "video-trimmer", title: "Trim Video Online Free (No Watermark)" },
  "video-to-gif-converter": { tool: "gif-maker", title: "Video to GIF Converter Free Online" },
  "word-to-pdf-free-converter": { tool: "word-to-pdf", title: "Word to PDF: 5 Free Converters Compared" },
};

export const TOOLS = [
  // PDF
  { slug: "pdf-compress", name: "PDF Compress", category: "pdf", appPath: null },
  { slug: "pdf-merge", name: "PDF Merge", category: "pdf", appPath: null },
  { slug: "pdf-protect", name: "PDF Protect", category: "pdf", appPath: null },
  { slug: "pdf-rotate", name: "PDF Rotate", category: "pdf", appPath: null },
  { slug: "pdf-split", name: "PDF Split", category: "pdf", appPath: null },
  { slug: "pdf-to-jpg", name: "PDF to JPG", category: "pdf", appPath: null },
  { slug: "pdf-to-word", name: "PDF to Word", category: "pdf", appPath: null },
  { slug: "jpg-to-pdf", name: "JPG to PDF", category: "pdf", appPath: null },
  { slug: "word-to-pdf", name: "Word to PDF", category: "pdf", appPath: null },
  { slug: "excel-to-pdf", name: "Excel to PDF", category: "pdf", appPath: null },
  // AI
  { slug: "ai-image-generator", name: "AI Image Generator", category: "ai", appPath: null },
  { slug: "ai-avatar", name: "AI Avatar", category: "ai", appPath: null },
  { slug: "ai-upscaler", name: "AI Upscaler", category: "ai", appPath: null },
  { slug: "background-remover", name: "Background Remover", category: "ai", appPath: null },
  { slug: "face-swap", name: "Face Swap", category: "ai", appPath: null },
  { slug: "image-enhancer", name: "Image Enhancer", category: "ai", appPath: null },
  { slug: "object-remover", name: "Object Remover", category: "ai", appPath: null },
  { slug: "ai-headshots", name: "AI Headshots", category: "ai", appPath: "/app/headshot" },
  { slug: "instagram-captions", name: "Instagram Captions", category: "ai", appPath: "/app/instagram" },
  { slug: "youtube-titles", name: "YouTube Titles", category: "ai", appPath: "/app/youtube" },
  { slug: "hashtag-generator", name: "Hashtag Generator", category: "ai", appPath: "/app/hashtag" },
  // Image
  { slug: "image-compressor", name: "Image Compressor", category: "image", appPath: null },
  { slug: "image-converter", name: "Image Converter", category: "image", appPath: null },
  { slug: "image-cropper", name: "Image Cropper", category: "image", appPath: null },
  { slug: "image-resizer", name: "Image Resizer", category: "image", appPath: null },
  { slug: "image-rotator", name: "Image Rotator", category: "image", appPath: null },
  { slug: "collage-maker", name: "Collage Maker", category: "image", appPath: null },
  { slug: "gif-maker", name: "GIF Maker", category: "image", appPath: null },
  { slug: "meme-generator", name: "Meme Generator", category: "image", appPath: null },
  { slug: "watermark-adder", name: "Watermark Adder", category: "image", appPath: null },
  // Audio
  { slug: "audio-converter", name: "Audio Converter", category: "audio", appPath: null },
  { slug: "audio-merger", name: "Audio Merger", category: "audio", appPath: null },
  { slug: "audio-trimmer", name: "Audio Trimmer", category: "audio", appPath: null },
  { slug: "voice-recorder", name: "Voice Recorder", category: "audio", appPath: null },
  { slug: "speech-to-text", name: "Speech to Text", category: "audio", appPath: null },
  { slug: "text-to-speech", name: "Text to Speech", category: "audio", appPath: null },
  // Video
  { slug: "video-compressor", name: "Video Compressor", category: "video", appPath: null },
  { slug: "video-converter", name: "Video Converter", category: "video", appPath: null },
  { slug: "video-trimmer", name: "Video Trimmer", category: "video", appPath: null },
  { slug: "screen-recorder", name: "Screen Recorder", category: "video", appPath: null },
  // Business
  { slug: "barcode-generator", name: "Barcode Generator", category: "business", appPath: null },
  { slug: "business-card", name: "Business Card Maker", category: "business", appPath: null },
  { slug: "document-scanner", name: "Document Scanner", category: "business", appPath: null },
  { slug: "invoice-generator", name: "Invoice Generator", category: "business", appPath: null },
  { slug: "qr-generator", name: "QR Generator", category: "business", appPath: null },
  { slug: "age-calculator", name: "Age Calculator", category: "business", appPath: "/app/age" },
  { slug: "emi-calculator", name: "EMI Calculator", category: "business", appPath: "/app/emi" },
  { slug: "sip-calculator", name: "SIP Calculator", category: "business", appPath: "/app/sip" },
  { slug: "gst-calculator", name: "GST Calculator", category: "business", appPath: "/app/gst" },
  { slug: "loan-calculator", name: "Loan Calculator", category: "business", appPath: "/app/loan" },
  { slug: "qr-code-studio", name: "QR Code Studio", category: "business", appPath: "/app/qr" },
  { slug: "resume-builder", name: "Resume Builder", category: "business", appPath: "/app/resume" },
  // Pregnancy
  { slug: "pregnancy-due-date", name: "Due Date Calculator", category: "pregnancy", appPath: "/app/pregnancy-due-date" },
  { slug: "pregnancy-week", name: "Pregnancy Week Calculator", category: "pregnancy", appPath: "/app/pregnancy-week" },
  { slug: "ovulation-calculator", name: "Ovulation Calculator", category: "pregnancy", appPath: "/app/ovulation" },
  { slug: "fertility-calculator", name: "Fertility Calculator", category: "pregnancy", appPath: "/app/fertility" },
  { slug: "pregnancy-weight-gain", name: "Pregnancy Weight Gain Guide", category: "pregnancy", appPath: "/app/pregnancy-weight" },
  { slug: "pregnancy-bmi", name: "Pregnancy BMI Calculator", category: "pregnancy", appPath: "/app/pregnancy-bmi" },
  { slug: "baby-gender-predictor", name: "Baby Gender Predictor", category: "pregnancy", appPath: "/app/baby-gender" },
  { slug: "baby-name-generator", name: "Baby Name Generator", category: "pregnancy", appPath: "/app/baby-name" },
  { slug: "conception-date", name: "Conception Date Calculator", category: "pregnancy", appPath: "/app/conception-date" },
  { slug: "pregnancy-countdown", name: "Pregnancy Countdown", category: "pregnancy", appPath: "/app/pregnancy-countdown" },
  // Baby
  { slug: "baby-growth-percentile", name: "Baby Growth Percentile", category: "baby", appPath: "/app/baby-growth" },
  { slug: "baby-feeding-calculator", name: "Baby Feeding Calculator", category: "baby", appPath: "/app/baby-feeding" },
  { slug: "baby-sleep-calculator", name: "Baby Sleep Calculator", category: "baby", appPath: "/app/baby-sleep" },
  { slug: "vaccination-tracker", name: "Vaccination Schedule Tracker", category: "baby", appPath: "/app/vaccination" },
  { slug: "baby-age-calculator", name: "Baby Age Calculator", category: "baby", appPath: "/app/baby-age" },
];

/** Cluster-specific article topics (slug without .html, title) */
export const CLUSTER_ARTICLES = {
  "sip-calculator": [
    ["what-is-sip", "What is SIP? Systematic Investment Plan Explained"],
    ["sip-vs-fd", "SIP vs FD: Which Investment Is Better in 2026?"],
    ["sip-calculator-guide", "SIP Calculator Guide: Plan Your Mutual Fund Returns"],
    ["best-sip-strategies", "Best SIP Strategies for Long-Term Wealth"],
    ["sip-vs-lump-sum", "SIP vs Lump Sum: Which Gives Better Returns?"],
    ["how-to-start-sip", "How to Start SIP: Beginner's Step-by-Step Guide"],
    ["sip-returns-explained", "SIP Returns Explained: CAGR, XIRR and More"],
  ],
  "emi-calculator": [
    ["home-loan-emi-guide", "Home Loan EMI Guide: Calculate and Plan Payments"],
    ["personal-loan-interest-guide", "Personal Loan Interest Guide: Rates and EMI Tips"],
    ["how-banks-calculate-emi", "How Banks Calculate EMI: Formula Explained"],
    ["reduce-emi-burden-tips", "10 Ways to Reduce Your EMI Burden"],
    ["emi-vs-prepayment", "EMI vs Prepayment: What Saves More Interest?"],
    ["car-loan-emi-guide", "Car Loan EMI Guide: Plan Your Auto Loan"],
    ["emi-calculator-explained", "EMI Calculator Explained: Use It Like a Pro"],
  ],
  "loan-calculator": [
    ["personal-loan-calculator-guide", "Personal Loan Calculator Guide (Free Online)"],
    ["home-loan-interest-rates-india", "Home Loan Interest Rates in India: 2026 Guide"],
    ["loan-eligibility-explained", "Loan Eligibility Explained: How Banks Decide"],
    ["loan-tenure-guide", "Loan Tenure Guide: Short vs Long Term Loans"],
    ["loan-prepayment-calculator-guide", "Loan Prepayment Calculator: Save on Interest"],
    ["education-loan-emi-guide", "Education Loan EMI Guide for Students"],
    ["business-loan-calculator-guide", "Business Loan Calculator: Plan SME Financing"],
  ],
  "resume-builder": [
    ["ats-resume-guide", "ATS Resume Guide: Pass Applicant Tracking Systems"],
    ["resume-mistakes-to-avoid", "Resume Mistakes That Cost You the Interview"],
    ["linkedin-optimization-guide", "LinkedIn Optimization Guide for Job Seekers"],
    ["resume-keywords-guide", "Resume Keywords Guide: Get Past ATS Filters"],
    ["resume-format-2026", "Best Resume Format for 2026 (Free Templates)"],
    ["one-page-resume-guide", "One Page Resume Guide: When and How to Use It"],
    ["resume-for-freshers", "Resume for Freshers: Complete Writing Guide"],
  ],
  "gst-calculator": [
    ["gst-rates-india-2026", "GST Rates in India 2026: Complete List"],
    ["how-to-calculate-gst", "How to Calculate GST: CGST, SGST, IGST Explained"],
    ["gst-vs-vat-difference", "GST vs VAT: Key Differences Explained"],
    ["gst-invoice-format-guide", "GST Invoice Format Guide for Businesses"],
    ["input-tax-credit-guide", "Input Tax Credit (ITC) Guide for GST"],
    ["gst-for-small-business", "GST for Small Business: Registration and Filing"],
  ],
  "pregnancy-due-date": [
    ["how-due-date-is-calculated", "How Pregnancy Due Date Is Calculated"],
    ["due-date-vs-ultrasound", "Due Date vs Ultrasound: Which Is More Accurate?"],
    ["trimester-guide-first-time-moms", "Trimester Guide for First-Time Moms"],
    ["pregnancy-milestones-by-week", "Pregnancy Milestones by Week (1–40)"],
    ["when-to-see-doctor-pregnant", "When to See a Doctor During Pregnancy"],
  ],
  "ovulation-calculator": [
    ["how-ovulation-works", "How Ovulation Works: Fertile Window Explained"],
    ["best-time-to-conceive", "Best Time to Conceive: Ovulation Timing Guide"],
    ["ovulation-signs-symptoms", "Ovulation Signs and Symptoms to Track"],
    ["irregular-periods-ovulation", "Ovulation with Irregular Periods: What to Know"],
    ["ovulation-tracker-apps-vs-calculator", "Ovulation Tracker Apps vs Calculator"],
  ],
  "vaccination-tracker": [
    ["iap-vaccination-schedule-india", "IAP Vaccination Schedule India (2026)"],
    ["baby-vaccination-first-year", "Baby Vaccination Schedule: First Year Guide"],
    ["vaccine-side-effects-babies", "Vaccine Side Effects in Babies: What to Expect"],
    ["missed-vaccination-catch-up", "Missed Vaccination Catch-Up Schedule Guide"],
    ["travel-vaccines-for-babies", "Travel Vaccines for Babies and Toddlers"],
  ],
};

/** Generic article templates per tool (slug suffix, title fn) */
export function genericArticles(tool) {
  const n = tool.name;
  return [
    [`${tool.slug}-complete-guide`, `${n}: Complete Free Online Guide (2026)`],
    [`${tool.slug}-how-to-use`, `How to Use ${n} — Step-by-Step Tutorial`],
    [`${tool.slug}-tips-and-tricks`, `${n} Tips and Tricks for Better Results`],
    [`${tool.slug}-common-mistakes`, `Common ${n} Mistakes to Avoid`],
    [`${tool.slug}-vs-alternatives`, `${n} vs Paid Software: Which Is Better?`],
    [`${tool.slug}-for-beginners`, `${n} for Beginners: Start Here`],
    [`${tool.slug}-mobile-guide`, `${n} on Mobile: Free Browser Guide`],
  ];
}

export function getRelatedTools(tool, allTools, count = 4) {
  const financeSlugs = ["emi-calculator", "sip-calculator", "loan-calculator", "gst-calculator"];
  if (tool.category === "business" && financeSlugs.includes(tool.slug)) {
    const finance = financeSlugs
      .filter((s) => s !== tool.slug)
      .map((s) => allTools.find((t) => t.slug === s))
      .filter(Boolean);
    const other = allTools.filter(
      (t) => t.category === tool.category && t.slug !== tool.slug && !financeSlugs.includes(t.slug)
    );
    return [...finance, ...other].slice(0, count);
  }
  const same = allTools.filter((t) => t.category === tool.category && t.slug !== tool.slug);
  const cross = allTools.filter((t) => t.category !== tool.category && t.slug !== tool.slug);
  return [...same.slice(0, 3), ...cross.slice(0, 1)].slice(0, count);
}

export function articlesForTool(tool, existingByTool) {
  const existing = existingByTool.get(tool.slug) || [];
  const existingCount = existing.length;
  const target = 7;
  const needed = Math.max(0, target - existingCount);

  const cluster = CLUSTER_ARTICLES[tool.slug] || [];
  const generic = genericArticles(tool);

  const candidates = [...cluster, ...generic];
  const newArticles = [];
  const usedSlugs = new Set(existing.map((a) => a.slug));

  for (const [slug, title] of candidates) {
    if (newArticles.length >= needed && existingCount + newArticles.length >= 5) break;
    if (usedSlugs.has(slug)) continue;
    if (existingCount + newArticles.length >= target) break;
    usedSlugs.add(slug);
    newArticles.push({ slug, title, tool: tool.slug });
  }

  // Ensure minimum 5 total articles linked per tool
  while (existingCount + newArticles.length < 5) {
    for (const [slug, title] of generic) {
      if (usedSlugs.has(slug)) continue;
      usedSlugs.add(slug);
      newArticles.push({ slug, title, tool: tool.slug });
      if (existingCount + newArticles.length >= 5) break;
    }
    break;
  }

  return newArticles;
}
