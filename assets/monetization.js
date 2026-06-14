(function () {
  var EMAIL_ENDPOINT = "https://formsubmit.co/ajax/noreply@workpilottools.biz";
  var EMAIL_STORAGE = "wp-email-subscribed";

  var CATEGORY_AFFILIATES = {
    pdf: {
      title: "Adobe Acrobat Pro",
      body: "Need advanced PDF editing, OCR, and batch workflows? Acrobat Pro is the industry standard for professionals.",
      cta: "Explore Adobe Acrobat Pro",
      url: "https://www.adobe.com/acrobat/online.html",
    },
    ai: {
      title: "Canva Pro",
      body: "Create stunning AI-assisted designs, social posts, and presentations with premium templates and tools.",
      cta: "Try Canva Pro free",
      url: "https://www.canva.com/pro/",
    },
    image: {
      title: "Adobe Photoshop",
      body: "Go beyond quick edits — Photoshop offers professional retouching, layers, and creative control.",
      cta: "See Adobe Photoshop plans",
      url: "https://www.adobe.com/products/photoshop.html",
    },
    audio: {
      title: "Descript",
      body: "Edit audio and podcasts like a doc — transcription, filler-word removal, and studio sound in one app.",
      cta: "Try Descript free",
      url: "https://www.descript.com/",
    },
    video: {
      title: "CapCut Pro",
      body: "Upgrade your video edits with premium effects, auto captions, and faster exports for creators.",
      cta: "Get CapCut Pro",
      url: "https://www.capcut.com/",
    },
    business: {
      title: "FreshBooks",
      body: "Send professional invoices, track expenses, and manage clients — ideal for freelancers and small businesses.",
      cta: "Start FreshBooks free trial",
      url: "https://www.freshbooks.com/",
    },
    pregnancy: {
      title: "What to Expect App",
      body: "Track your pregnancy week-by-week with expert tips, checklists, and community support.",
      cta: "Download What to Expect",
      url: "https://www.whattoexpect.com/",
    },
    baby: {
      title: "BabyCenter App",
      body: "Monitor milestones, feeding, sleep, and growth with trusted parenting guidance.",
      cta: "Try BabyCenter",
      url: "https://www.babycenter.com/",
    },
  };

  var TOOL_AFFILIATES = {
    "sip-calculator": {
      title: "Groww — Start SIP Investing",
      body: "Ready to invest? Open a free demat account and start SIPs in mutual funds with zero commission on direct plans.",
      cta: "Start SIP on Groww",
      url: "https://groww.in/mutual-funds",
    },
    "emi-calculator": {
      title: "HDFC Bank Home Loans",
      body: "Compare home loan rates and check eligibility after running your EMI numbers.",
      cta: "Check HDFC home loan rates",
      url: "https://www.hdfcbank.com/personal/borrow/your-home-loans",
    },
    "loan-calculator": {
      title: "BankBazaar Loan Offers",
      body: "Find personal and home loan offers matched to your profile and compare interest rates side by side.",
      cta: "Compare loan offers",
      url: "https://www.bankbazaar.com/personal-loan.html",
    },
    "resume-builder": {
      title: "LinkedIn Premium",
      body: "Boost your job search with InMail, applicant insights, and profile views with LinkedIn Premium.",
      cta: "Try LinkedIn Premium",
      url: "https://premium.linkedin.com/",
    },
    "invoice-generator": {
      title: "Zoho Invoice",
      body: "Automate invoicing, payment reminders, and GST billing for growing businesses.",
      cta: "Use Zoho Invoice free",
      url: "https://www.zoho.com/invoice/",
    },
    "gst-calculator": {
      title: "ClearTax GST Software",
      body: "File GST returns and manage compliance easily after calculating tax on your invoices.",
      cta: "Explore ClearTax GST",
      url: "https://cleartax.in/gst",
    },
    "ai-image-generator": {
      title: "Midjourney",
      body: "Generate high-quality AI art and illustrations for creative projects and marketing.",
      cta: "Join Midjourney",
      url: "https://www.midjourney.com/",
    },
    "background-remover": {
      title: "Remove.bg Pro",
      body: "Batch-remove backgrounds at scale with HD cutouts for e-commerce and design work.",
      cta: "Upgrade to Remove.bg Pro",
      url: "https://www.remove.bg/pricing",
    },
    "pdf-to-word": {
      title: "Smallpdf Pro",
      body: "Convert, edit, and sign PDFs without limits — great for document-heavy workflows.",
      cta: "Try Smallpdf Pro",
      url: "https://smallpdf.com/pricing",
    },
    "pdf-merge": {
      title: "PDF Expert",
      body: "Merge, annotate, and edit PDFs on Mac and iOS with a polished native experience.",
      cta: "Get PDF Expert",
      url: "https://pdfexpert.com/",
    },
    "screen-recorder": {
      title: "Loom Business",
      body: "Record and share quick video messages for teams, tutorials, and async communication.",
      cta: "Try Loom free",
      url: "https://www.loom.com/",
    },
    "text-to-speech": {
      title: "ElevenLabs",
      body: "Create natural AI voiceovers and narration for videos, podcasts, and accessibility.",
      cta: "Try ElevenLabs",
      url: "https://elevenlabs.io/",
    },
    "vaccination-tracker": {
      title: "BabyCenter Vaccine Guide",
      body: "Cross-check IAP schedules with pediatrician-approved vaccine information and reminders.",
      cta: "View vaccine guide",
      url: "https://www.babycenter.com/health/doctor-visits-and-vaccines",
    },
    "pregnancy-due-date": {
      title: "Pregnancy+ App",
      body: "Track due date, baby size, and daily tips with one of the most popular pregnancy apps.",
      cta: "Download Pregnancy+",
      url: "https://pregnancyplusapp.com/",
    },
  };

  var TOOL_CATEGORIES = {
    "pdf-compress": "pdf", "pdf-merge": "pdf", "pdf-protect": "pdf", "pdf-rotate": "pdf",
    "pdf-split": "pdf", "pdf-to-jpg": "pdf", "pdf-to-word": "pdf", "jpg-to-pdf": "pdf",
    "word-to-pdf": "pdf", "excel-to-pdf": "pdf",
    "ai-image-generator": "ai", "ai-avatar": "ai", "ai-upscaler": "ai", "background-remover": "ai",
    "face-swap": "ai", "image-enhancer": "ai", "object-remover": "ai", "ai-headshots": "ai",
    "instagram-captions": "ai", "youtube-titles": "ai", "hashtag-generator": "ai",
    "image-compressor": "image", "image-converter": "image", "image-cropper": "image",
    "image-resizer": "image", "image-rotator": "image", "collage-maker": "image",
    "gif-maker": "image", "meme-generator": "image", "watermark-adder": "image",
    "audio-converter": "audio", "audio-merger": "audio", "audio-trimmer": "audio",
    "voice-recorder": "audio", "speech-to-text": "audio", "text-to-speech": "audio",
    "video-compressor": "video", "video-converter": "video", "video-trimmer": "video",
    "screen-recorder": "video",
    "barcode-generator": "business", "business-card": "business", "document-scanner": "business",
    "invoice-generator": "business", "qr-generator": "business", "age-calculator": "business",
    "emi-calculator": "business", "sip-calculator": "business", "gst-calculator": "business",
    "loan-calculator": "business", "qr-code-studio": "business", "resume-builder": "business",
    "pregnancy-due-date": "pregnancy", "pregnancy-week": "pregnancy", "ovulation-calculator": "pregnancy",
    "fertility-calculator": "pregnancy", "pregnancy-weight-gain": "pregnancy", "pregnancy-bmi": "pregnancy",
    "baby-gender-predictor": "pregnancy", "baby-name-generator": "pregnancy", "conception-date": "pregnancy",
    "pregnancy-countdown": "pregnancy",
    "baby-growth-percentile": "baby", "baby-feeding-calculator": "baby", "baby-sleep-calculator": "baby",
    "vaccination-tracker": "baby", "baby-age-calculator": "baby",
  };

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function getAffiliate(slug) {
    if (TOOL_AFFILIATES[slug]) return TOOL_AFFILIATES[slug];
    var cat = TOOL_CATEGORIES[slug] || "business";
    return CATEGORY_AFFILIATES[cat] || CATEGORY_AFFILIATES.business;
  }

  function affiliateHtml(data) {
    return (
      '<section class="wp-affiliate-block" aria-label="Recommended partner">' +
      '<span class="wp-affiliate-badge">Affiliate</span>' +
      "<h3>" + esc(data.title) + "</h3>" +
      "<p>" + esc(data.body) + "</p>" +
      '<a class="wp-affiliate-cta" href="' + esc(data.url) + '" rel="nofollow sponsored noopener" target="_blank">' +
      esc(data.cta) + " →</a>" +
      "</section>"
    );
  }

  function emailCaptureHtml(compact) {
    var cls = compact ? " wp-email-capture--compact" : "";
    return (
      '<section class="wp-email-capture' + cls + '" aria-label="Email signup">' +
      '<div class="wp-email-inner">' +
      "<h3>Get free tool updates</h3>" +
      "<p>Weekly tips on PDF, AI, finance, and productivity tools. No spam — unsubscribe anytime.</p>" +
      '<form class="wp-email-form" novalidate>' +
      '<input type="email" name="email" placeholder="Your email address" autocomplete="email" required aria-label="Email address">' +
      '<input type="hidden" name="_subject" value="WorkPilot Tools newsletter signup">' +
      '<input type="hidden" name="_captcha" value="false">' +
      '<button type="submit">Subscribe free</button>' +
      "</form>" +
      '<p class="wp-email-msg" role="status" aria-live="polite"></p>' +
      "</div></section>"
    );
  }

  function toolSlugFromPath() {
    var m = location.pathname.match(/\/tools\/([^/]+)\.html$/);
    return m ? m[1] : null;
  }

  function insertAffiliateBlock() {
    var slug = toolSlugFromPath();
    if (!slug || document.querySelector(".wp-affiliate-block")) return;

    var data = getAffiliate(slug);
    var html = affiliateHtml(data);
    var toolRoot = document.getElementById("workpilot-tool");
    var card = toolRoot
      ? toolRoot.closest(".bg-white.rounded-2xl")
      : document.querySelector("main .bg-white.rounded-2xl");

    if (card) {
      card.insertAdjacentHTML("beforeend", html);
      return;
    }

    var main = document.querySelector("main");
    if (main) main.insertAdjacentHTML("afterbegin", html);
  }

  function insertEmailCapture() {
    if (document.querySelector(".wp-email-capture:not(.wp-email-capture--compact)")) return;

    var footer = document.querySelector("footer");
    if (footer) {
      footer.insertAdjacentHTML("beforebegin", emailCaptureHtml(false));
      return;
    }

    document.body.insertAdjacentHTML("beforeend", emailCaptureHtml(false));
  }

  function insertSidebarEmail() {
    var slug = toolSlugFromPath();
    if (!slug) return;

    var asideInner = document.querySelector("aside .sticky");
    if (!asideInner || asideInner.querySelector(".wp-email-capture--compact")) return;

    asideInner.insertAdjacentHTML("beforeend", emailCaptureHtml(true));
  }

  function bindEmailForms() {
    document.querySelectorAll(".wp-email-form").forEach(function (form) {
      if (form.dataset.bound) return;
      form.dataset.bound = "1";

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var msg = form.parentElement.querySelector(".wp-email-msg");
        var btn = form.querySelector("button");
        var email = (input && input.value || "").trim();

        if (!email || email.indexOf("@") === -1) {
          if (msg) {
            msg.textContent = "Please enter a valid email.";
            msg.className = "wp-email-msg err";
          }
          return;
        }

        try {
          if (localStorage.getItem(EMAIL_STORAGE) === email) {
            if (msg) {
              msg.textContent = "You are already subscribed. Thank you!";
              msg.className = "wp-email-msg ok";
            }
            return;
          }
        } catch (err) {}

        btn.disabled = true;
        if (msg) {
          msg.textContent = "Subscribing…";
          msg.className = "wp-email-msg";
        }

        fetch(EMAIL_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            _subject: "WorkPilot Tools newsletter signup",
            _captcha: "false",
            source: location.pathname,
          }),
        })
          .then(function (res) {
            if (!res.ok) throw new Error("fail");
            try {
              localStorage.setItem(EMAIL_STORAGE, email);
            } catch (err) {}
            if (msg) {
              msg.textContent = "Thanks! You are subscribed.";
              msg.className = "wp-email-msg ok";
            }
            form.reset();
          })
          .catch(function () {
            if (msg) {
              msg.textContent = "Could not subscribe right now. Please try again.";
              msg.className = "wp-email-msg err";
            }
          })
          .finally(function () {
            btn.disabled = false;
          });
      });
    });
  }

  function init() {
    insertAffiliateBlock();
    insertEmailCapture();
    insertSidebarEmail();
    bindEmailForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
