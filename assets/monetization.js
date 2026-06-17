(function () {
  var EMAIL_ENDPOINT = "https://formsubmit.co/ajax/mml.products26@gmail.com";
  var EMAIL_STORAGE = "wp-email-subscribed";
  var AMAZON_TAG = "glamstore072-21";

  function scriptPrefix() {
    var p = location.pathname.replace(/\\/g, "/");
    if (p.indexOf("/tools/") !== -1 || p.indexOf("/blog/") !== -1 || p.indexOf("/app/") !== -1 || p.indexOf("/bizbuilt/") !== -1) {
      return "../assets/";
    }
    return "assets/";
  }

  function loadRazorpayScripts() {
    if (window.RazorpayPay) return;
    var prefix = scriptPrefix();
    ["razorpay-config.js", "razorpay-payments.js"].forEach(function (file) {
      if (document.querySelector('script[src*="' + file + '"]')) return;
      var s = document.createElement("script");
      s.src = prefix + file;
      s.defer = true;
      document.head.appendChild(s);
    });
  }

  function amz(asin) {
    return "https://www.amazon.in/dp/" + asin + "?tag=" + AMAZON_TAG;
  }

  function amzSearch(keywords) {
    return "https://www.amazon.in/s?k=" + encodeURIComponent(keywords) + "&tag=" + AMAZON_TAG;
  }

  function product(title, body, cta, asin) {
    return { title: title, body: body, cta: cta, url: amz(asin) };
  }

  function searchProduct(title, body, cta, keywords) {
    return { title: title, body: body, cta: cta, url: amzSearch(keywords) };
  }

  var P = {
    hpPrinter: product(
      "HP Smart Tank 589 WiFi Printer",
      "Print, scan & copy at home — perfect after merging, converting, or compressing PDFs. Low-cost ink tank, bestseller on Amazon India.",
      "View on Amazon",
      "B0BN1XT6TF"
    ),
    laminator: product(
      "Amazon Basics 9\" Thermal Laminator",
      "Protect important PDF printouts, certificates, and ID copies with a compact home/office laminator.",
      "Shop on Amazon",
      "B07BJLMSSJ"
    ),
    fileOrganizer: searchProduct(
      "Document File Organizers (Pack of 6)",
      "Keep merged PDFs and printouts sorted — ring-binder folders rated highly by home-office buyers.",
      "Browse on Amazon",
      "document file folder organizer A4"
    ),
    wacomTablet: product(
      "Wacom One Pen Tablet",
      "Level up AI art and avatar tools with a pressure-sensitive pen tablet — top pick for digital creators.",
      "View on Amazon",
      "B07FX45BHK"
    ),
    xpPen: product(
      "XP-Pen Deco 01 V2 Drawing Tablet",
      "Create AI-style art, avatars, and headshots with a budget-friendly graphic tablet loved by beginners.",
      "View on Amazon",
      "B07W5JKTGJ"
    ),
    ringLight: product(
      "Digitek 10\" LED Ring Light with Tripod",
      "Better lighting for AI headshots, face-swap previews, and social content — essential creator gear.",
      "View on Amazon",
      "B07WCL9L8K"
    ),
    sandiskSd: product(
      "SanDisk Ultra 128GB SD Card",
      "Store compressed images, RAW exports, and photo batches — fast UHS-I card with thousands of 5★ reviews.",
      "View on Amazon",
      "B07DNH56PM"
    ),
    photoPaper: searchProduct(
      "HP Glossy Photo Paper (100 Sheets)",
      "Print collage and resized images at photo quality — pairs well with our image tools.",
      "Shop on Amazon",
      "HP photo paper glossy A4 100 sheets"
    ),
    boatHeadphones: product(
      "boAt Rockerz 450 Bluetooth Headphones",
      "#1 bestselling on-ear headphones on Amazon India — great for editing audio and voice recordings.",
      "View on Amazon",
      "B07PR1CL3S"
    ),
    zebronicsMic: product(
      "Zebronics Zeb-Ultima Pro USB Microphone",
      "Crystal-clear voice recording and podcasting — upgrade from your laptop mic for speech-to-text workflows.",
      "View on Amazon",
      "B07WJ5D3HW"
    ),
    jblSpeaker: product(
      "JBL Go 3 Portable Bluetooth Speaker",
      "Preview text-to-speech output and audio merges on a compact speaker with deep bass.",
      "View on Amazon",
      "B09G6QG4SL"
    ),
    logitechWebcam: product(
      "Logitech C270 HD Webcam",
      "Record screen tutorials and video calls in sharper HD — pairs with our screen & video tools.",
      "View on Amazon",
      "B008QS9W06"
    ),
    tripod: searchProduct(
      "Digitek Portable Camera Tripod",
      "Stable shots for screen recordings, video trims, and creator setups — lightweight bestseller on Amazon.",
      "Browse on Amazon",
      "camera tripod stand mobile holder"
    ),
    fireTvStick: product(
      "Amazon Fire TV Stick 4K Max",
      "Stream and preview compressed videos on your TV — popular living-room upgrade in India.",
      "View on Amazon",
      "B0CJKM68RC"
    ),
    casioCalc: product(
      "Casio FX-991EX Scientific Calculator",
      "India's most trusted calculator for EMI, SIP, GST, and loan math — exam-approved and bestseller.",
      "View on Amazon",
      "B011UK5DGY"
    ),
    financeBook: product(
      "Rich Dad Poor Dad (Paperback)",
      "Classic personal-finance read after running SIP, EMI, or loan numbers — millions sold worldwide.",
      "View on Amazon",
      "B016ZY3KNO"
    ),
    resumeFolder: searchProduct(
      "Leatherette Document & Resume Folder",
      "Carry printed resumes and business cards professionally to interviews and client meetings.",
      "Browse on Amazon",
      "resume document folder interview"
    ),
    labelPrinter: searchProduct(
      "Brother QL-800 Label Printer",
      "Print barcode & QR labels for inventory, shipping, and retail — pro upgrade from on-screen codes.",
      "Shop on Amazon",
      "Brother label printer QR barcode"
    ),
    portableScanner: product(
      "iBall Portable Document Scanner",
      "Scan receipts and papers to PDF on the go — ideal companion to our document scanner tool.",
      "View on Amazon",
      "B07Y2VFMF3"
    ),
    pregnancyBook: product(
      "What to Expect When You're Expecting",
      "World's bestselling pregnancy guide — read alongside due-date, week-by-week, and BMI tools.",
      "View on Amazon",
      "B004FV4AR6"
    ),
    maternityPillow: searchProduct(
      "Mom's Moon Maternity Pillow (C-Shape)",
      "Top-rated full-body pregnancy pillow for better sleep during second and third trimesters.",
      "View on Amazon",
      "maternity pillow C shape pregnancy"
    ),
    ovulationKit: searchProduct(
      "i-Know Ovulation Test Kit (5 Tests)",
      "Track fertile days accurately — use with our ovulation and fertility calculators.",
      "Shop on Amazon",
      "ovulation test kit India"
    ),
    babyDiapers: product(
      "Pampers Active Baby Taped Diapers (New Born)",
      "India's trusted diaper brand for newborns — essential after using feeding and growth calculators.",
      "View on Amazon",
      "B07BHCB9RR"
    ),
    babyMonitor: searchProduct(
      "Realme Wi-Fi Baby Monitor Camera",
      "Watch your baby remotely with night vision — peace of mind for new parents.",
      "Browse on Amazon",
      "baby monitor camera wifi night vision"
    ),
    babyThermometer: searchProduct(
      "Dr. Trust Infrared Forehead Thermometer",
      "Quick fever checks for infants — recommended alongside vaccination and health tracking.",
      "View on Amazon",
      "baby infrared thermometer forehead"
    ),
  };

  var CATEGORY_AFFILIATES = {
    pdf: P.hpPrinter,
    ai: P.wacomTablet,
    image: P.sandiskSd,
    audio: P.boatHeadphones,
    video: P.logitechWebcam,
    business: P.casioCalc,
    finance: P.financeBook,
    pregnancy: P.pregnancyBook,
    baby: P.babyDiapers,
  };

  var TOOL_AFFILIATES = {
    "pdf-compress": P.hpPrinter,
    "pdf-merge": P.fileOrganizer,
    "pdf-protect": P.laminator,
    "pdf-rotate": P.hpPrinter,
    "pdf-split": P.fileOrganizer,
    "pdf-to-jpg": P.hpPrinter,
    "pdf-to-word": P.hpPrinter,
    "jpg-to-pdf": P.photoPaper,
    "word-to-pdf": P.hpPrinter,
    "excel-to-pdf": P.hpPrinter,
    "ai-image-generator": P.wacomTablet,
    "ai-avatar": P.xpPen,
    "ai-upscaler": P.sandiskSd,
    "background-remover": P.ringLight,
    "face-swap": P.ringLight,
    "image-enhancer": P.sandiskSd,
    "object-remover": P.xpPen,
    "ai-headshots": P.ringLight,
    "instagram-captions": P.ringLight,
    "youtube-titles": P.fireTvStick,
    "hashtag-generator": P.ringLight,
    "image-compressor": P.sandiskSd,
    "image-converter": P.sandiskSd,
    "image-cropper": P.photoPaper,
    "image-resizer": P.photoPaper,
    "image-rotator": P.sandiskSd,
    "collage-maker": P.photoPaper,
    "gif-maker": P.sandiskSd,
    "meme-generator": P.ringLight,
    "watermark-adder": P.photoPaper,
    "audio-converter": P.boatHeadphones,
    "audio-merger": P.boatHeadphones,
    "audio-trimmer": P.boatHeadphones,
    "voice-recorder": P.zebronicsMic,
    "speech-to-text": P.zebronicsMic,
    "text-to-speech": P.jblSpeaker,
    "video-compressor": P.fireTvStick,
    "video-converter": P.fireTvStick,
    "video-trimmer": P.tripod,
    "screen-recorder": P.logitechWebcam,
    "barcode-generator": P.labelPrinter,
    "business-card": P.resumeFolder,
    "document-scanner": P.portableScanner,
    "invoice-generator": P.financeBook,
    "qr-generator": P.labelPrinter,
    "age-calculator": P.casioCalc,
    "emi-calculator": P.financeBook,
    "sip-calculator": P.financeBook,
    "gst-calculator": P.casioCalc,
    "loan-calculator": P.financeBook,
    "mortgage-calculator": P.financeBook,
    "home-loan-calculator": P.financeBook,
    "car-loan-calculator": P.financeBook,
    "home-equity-calculator": P.financeBook,
    "reverse-mortgage-calculator": P.financeBook,
    "qr-code-studio": P.labelPrinter,
    "resume-builder": P.resumeFolder,
    "pregnancy-due-date": P.pregnancyBook,
    "pregnancy-week": P.pregnancyBook,
    "ovulation-calculator": P.ovulationKit,
    "fertility-calculator": P.ovulationKit,
    "pregnancy-weight-gain": P.maternityPillow,
    "pregnancy-bmi": P.maternityPillow,
    "baby-gender-predictor": P.pregnancyBook,
    "baby-name-generator": P.pregnancyBook,
    "conception-date": P.ovulationKit,
    "pregnancy-countdown": P.maternityPillow,
    "baby-growth-percentile": P.babyThermometer,
    "baby-feeding-calculator": P.babyDiapers,
    "baby-sleep-calculator": P.babyMonitor,
    "vaccination-tracker": P.babyThermometer,
    "baby-age-calculator": P.babyDiapers,
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
    "emi-calculator": "finance", "sip-calculator": "finance", "gst-calculator": "finance",
    "loan-calculator": "finance", "mortgage-calculator": "finance", "home-loan-calculator": "finance",
    "car-loan-calculator": "finance", "home-equity-calculator": "finance", "reverse-mortgage-calculator": "finance",
    "qr-code-studio": "business", "resume-builder": "business",
    "pregnancy-due-date": "pregnancy", "pregnancy-week": "pregnancy", "ovulation-calculator": "pregnancy",
    "fertility-calculator": "pregnancy", "pregnancy-weight-gain": "pregnancy", "pregnancy-bmi": "pregnancy",
    "baby-gender-predictor": "pregnancy", "baby-name-generator": "pregnancy", "conception-date": "pregnancy",
    "pregnancy-countdown": "pregnancy",
    "baby-growth-percentile": "baby", "baby-feeding-calculator": "baby", "baby-sleep-calculator": "baby",
    "vaccination-tracker": "baby", "baby-age-calculator": "baby",
  };

  var CATEGORY_PAGES = {
    "pdf-tools.html": "pdf",
    "ai-tools.html": "ai",
    "image-tools.html": "image",
    "audio-tools.html": "audio",
    "video-tools.html": "video",
    "business-tools.html": "business",
    "finance-tools.html": "finance",
    "finance-compare.html": "finance",
    "pregnancy-tools.html": "pregnancy",
    "baby-parenting-tools.html": "baby",
  };

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function inferCategory(slug) {
    if (slug && TOOL_CATEGORIES[slug]) return TOOL_CATEGORIES[slug];
    if (slug && /calculator|converter|sip|emi|tax|loan|fd|rd|cagr|swp|xirr|irr|brokerage|margin|forex|currency|salary|retirement|fire|gst|tds|hra|roi|roe|roce|burn|runway|pricing|valuation|dividend|portfolio|nifty|pivot|fibonacci|gann|inflation|net-worth|equity|mortgage|pnl|payoff|rebalance|journal|psychology|ai-financial|financial-planner/.test(slug)) {
      return "finance";
    }
    return null;
  }

  function getAffiliate(slug) {
    if (slug && TOOL_AFFILIATES[slug]) return TOOL_AFFILIATES[slug];
    var cat = inferCategory(slug) || slug || "business";
    return CATEGORY_AFFILIATES[cat] || CATEGORY_AFFILIATES.business;
  }

  function categoryFromPath() {
    var path = location.pathname.replace(/\\/g, "/");
    for (var file in CATEGORY_PAGES) {
      if (path.indexOf(file) !== -1) return CATEGORY_PAGES[file];
    }
    return null;
  }

  function affiliateHtml(data) {
    return (
      '<section class="wp-affiliate-block" aria-label="Recommended product">' +
      '<span class="wp-affiliate-badge">Amazon Affiliate</span>' +
      "<h3>" + esc(data.title) + "</h3>" +
      "<p>" + esc(data.body) + "</p>" +
      '<a class="wp-affiliate-cta" href="' + esc(data.url) + '" rel="nofollow sponsored noopener" target="_blank">' +
      esc(data.cta) + " →</a>" +
      "</section>"
    );
  }

  function donateHtml(compact) {
    var cls = compact ? " wp-donate-block--compact" : "";
    return (
      '<section class="wp-donate-block' + cls + '" aria-label="Support WorkPilot Tools">' +
      "<h3>Support WorkPilot Tools</h3>" +
      "<p>Enjoy our free tools? Donate any amount — secured by Razorpay.</p>" +
      '<div class="wp-donate-amounts">' +
      '<button type="button" class="wp-donate-cta wp-rzp-pay" data-rzp-purpose="donation" data-rzp-amount="4900">₹49</button>' +
      '<button type="button" class="wp-donate-cta wp-rzp-pay" data-rzp-purpose="donation" data-rzp-amount="9900">₹99</button>' +
      '<button type="button" class="wp-donate-cta wp-rzp-pay" data-rzp-purpose="donation" data-rzp-amount="49900">₹499</button>' +
      '<button type="button" class="wp-donate-cta wp-rzp-pay wp-donate-custom" data-rzp-purpose="donation">Custom</button>' +
      "</div></section>"
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
    if (document.querySelector(".wp-affiliate-block")) return;

    var slug = toolSlugFromPath();
    var cat = categoryFromPath();
    if (!slug && !cat) return;

    var data = slug ? getAffiliate(slug) : getAffiliate(cat);
    var html = affiliateHtml(data);
    var toolRoot = document.getElementById("workpilot-tool");
    var card = toolRoot
      ? toolRoot.closest(".bg-white.rounded-2xl")
      : document.querySelector("main .bg-white.rounded-2xl");

    if (card) {
      card.insertAdjacentHTML("beforeend", html);
      return;
    }

    var grid = document.querySelector("main .grid");
    if (grid) {
      grid.insertAdjacentHTML("afterend", html);
      return;
    }

    var main = document.querySelector("main");
    if (main) main.insertAdjacentHTML("beforeend", html);
  }

  function insertDonateBlock() {
    if (document.querySelector(".wp-donate-block")) return;

    var footer = document.querySelector("footer");
    if (footer) {
      footer.insertAdjacentHTML("beforebegin", donateHtml(false));
    } else {
      document.body.insertAdjacentHTML("beforeend", donateHtml(false));
    }
  }

  function injectFloatingDonate() {
    if (document.querySelector(".wp-donate-btn")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wp-donate-btn wp-rzp-pay";
    btn.setAttribute("data-rzp-purpose", "donation");
    btn.setAttribute("aria-label", "Donate via Razorpay");
    btn.innerHTML = "&#10084; Donate";
    document.body.appendChild(btn);
  }

  function insertEmailCapture() {
    if (document.querySelector(".wp-email-capture:not(.wp-email-capture--compact)")) return;

    var donate = document.querySelector(".wp-donate-block");
    if (donate) {
      donate.insertAdjacentHTML("afterend", emailCaptureHtml(false));
      return;
    }

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
    if (!asideInner.querySelector(".wp-donate-block--compact")) {
      asideInner.insertAdjacentHTML("beforeend", donateHtml(true));
    }
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
    loadRazorpayScripts();
    insertAffiliateBlock();
    insertDonateBlock();
    injectFloatingDonate();
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
