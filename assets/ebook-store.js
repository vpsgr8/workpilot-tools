(function (global) {
  "use strict";

  var STORAGE_KEY = "mml_ebook_purchases";
  var PREVIEW_PAGES = 7;

  var CATALOG = {
    "text-like-a-pro": {
      id: "text-like-a-pro",
      title: "Text Like a Pro",
      subtitle: "Clear, confident written communication for work and life",
      price: 199,
      category: "English · Communication",
      preview: "assets/ebooks/previews/text-like-a-pro-preview.pdf",
      detail: "ebooks/text-like-a-pro.html",
    },
    "unseen-india": {
      id: "unseen-india",
      title: "Unseen India",
      subtitle: "Lesser-known places, stories, and perspectives across India",
      price: 499,
      mrp: 750,
      category: "Travel · India",
      preview: "assets/ebooks/previews/unseen-india-preview.pdf",
      detail: "ebooks/unseen-india.html",
    },
  };

  var SITES = {
    workpilot: {
      id: "workpilot",
      name: "WorkPilot Tools",
      home: "index.html",
      store: "ebooks.html",
      footer: "© 2026 MarketMind Labs · WorkPilot Tools",
    },
    englishlearner: {
      id: "englishlearner",
      name: "English Learner Store",
      home: "https://englishlearner.store",
      store: "https://workpilottools.biz/store/englishlearner.html",
      footer: "© 2026 MarketMind Labs · English Learner Store",
    },
    logictrade: {
      id: "logictrade",
      name: "LogicTrade",
      home: "https://logictrade.site",
      store: "https://workpilottools.biz/store/logictrade.html",
      footer: "© 2026 MarketMind Labs · LogicTrade",
    },
  };

  function assetPrefix() {
    var p = location.pathname.replace(/\\/g, "/");
    if (p.indexOf("/ebooks/") !== -1 || p.indexOf("/store/") !== -1) return "../";
    if (p.indexOf("/tools/") !== -1 || p.indexOf("/blog/") !== -1) return "../";
    return "";
  }

  function resolveAsset(path) {
    if (/^https?:\/\//i.test(path)) return path;
    return assetPrefix() + path;
  }

  function apiBase() {
    var cfg = global.RAZORPAY_CONFIG || {};
    var url = (cfg.apiUrl || global.EBOOK_STORE_API || "").replace(/\/$/, "");
    if (url) return url;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return "http://localhost:8080";
    }
    return "";
  }

  function fmtInr(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  function getSite() {
    var body = document.body;
    var id = (body && body.getAttribute("data-ebook-site")) || "workpilot";
    return SITES[id] || SITES.workpilot;
  }

  function getPurchases() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function savePurchase(productId, token, purchaseKey) {
    var all = getPurchases();
    all[productId] = { token: token, purchaseKey: purchaseKey || "", at: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function captureTokenFromUrl() {
    try {
      var params = new URLSearchParams(location.search);
      var token = params.get("token");
      var product = params.get("product");
      if (token && product && CATALOG[product]) {
        savePurchase(product, token);
        params.delete("token");
        params.delete("product");
        var qs = params.toString();
        history.replaceState({}, "", location.pathname + (qs ? "?" + qs : ""));
      }
    } catch (e) {}
  }

  function hasPurchase(productId) {
    var p = getPurchases()[productId];
    return Boolean(p && p.token);
  }

  function priceHtml(book) {
    var html = '<div class="es-price"><span class="es-price-sale">' + fmtInr(book.price) + "</span>";
    if (book.mrp) {
      html += '<span class="es-price-mrp">' + fmtInr(book.mrp) + "</span>";
      html += '<span class="es-price-note">Limited offer</span>';
    }
    html += "</div>";
    return html;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) return resolve();
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensurePdfJs() {
    if (global.pdfjsLib) return Promise.resolve(global.pdfjsLib);
    return loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js").then(function () {
      global.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      return global.pdfjsLib;
    });
  }

  function renderPreview(container, previewUrl) {
    container.innerHTML = '<div class="es-loading">Loading preview…</div>';
    ensurePdfJs()
      .then(function (pdfjsLib) {
        return pdfjsLib.getDocument(previewUrl).promise;
      })
      .then(function (pdf) {
        var count = Math.min(PREVIEW_PAGES, pdf.numPages);
        container.innerHTML = "";
        var wrap = document.createElement("div");
        wrap.className = "es-preview-pages";
        container.appendChild(wrap);

        var chain = Promise.resolve();
        for (var i = 1; i <= count; i++) {
          (function (pageNum) {
            chain = chain.then(function () {
              return pdf.getPage(pageNum).then(function (page) {
                var viewport = page.getViewport({ scale: 1.35 });
                var canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                var box = document.createElement("div");
                box.className = "es-preview-page";
                box.appendChild(canvas);
                wrap.appendChild(box);
                return page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise;
              });
            });
          })(i);
        }
        return chain;
      })
      .catch(function () {
        container.innerHTML =
          '<p class="es-loading">Preview unavailable. You can still purchase and download the full PDF after payment.</p>';
      });
  }

  function ensureCheckout() {
    return loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }

  function fetchConfig() {
    var base = apiBase();
    if (!base) return Promise.resolve({ enabled: false });
    return fetch(base + "/api/payments/config")
      .then(function (r) { return r.json(); })
      .catch(function () { return { enabled: false }; });
  }

  function createOrder(productId) {
    var base = apiBase();
    return fetch(base + "/api/payments/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: productId,
        purpose: "ebook",
        source: location.hostname + location.pathname,
      }),
    }).then(function (r) {
      return r.json().then(function (body) {
        if (!r.ok) throw new Error(body.error || "Could not start payment");
        return body;
      });
    });
  }

  function verifyPayment(productId, response) {
    var base = apiBase();
    return fetch(base + "/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: productId,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    }).then(function (r) {
      return r.json().then(function (body) {
        if (!r.ok) throw new Error(body.error || "Payment verification failed");
        return body;
      });
    });
  }

  function downloadUrl(token) {
    var base = apiBase();
    if (!base) return "";
    return base + "/api/ebooks/download?token=" + encodeURIComponent(token);
  }

  function openCheckout(productId, onSuccess) {
    var book = CATALOG[productId];
    if (!book) return;

    fetchConfig()
      .then(function (cfg) {
        if (!apiBase()) {
          throw new Error("Payment server not configured yet. Email mml.products26@gmail.com to buy.");
        }
        return ensureCheckout().then(function () { return createOrder(productId); }).then(function (order) {
          var key = order.keyId || (global.RAZORPAY_CONFIG && global.RAZORPAY_CONFIG.keyId);
          if (!key) throw new Error("Razorpay key missing");

          var rzp = new global.Razorpay({
            key: key,
            amount: order.amount,
            currency: order.currency || "INR",
            name: order.name || "MarketMind Labs",
            description: order.description || book.title,
            order_id: order.id,
            theme: { color: getComputedStyle(document.documentElement).getPropertyValue("--es-accent").trim() || "#6366f1" },
            handler: function (response) {
              verifyPayment(productId, response)
                .then(function (result) {
                  if (result.downloadToken) {
                    savePurchase(productId, result.downloadToken, result.purchaseKey);
                    var onWorkpilot =
                      location.hostname === "workpilottools.biz" ||
                      location.hostname === "localhost" ||
                      location.hostname === "127.0.0.1";
                    if (!onWorkpilot) {
                      location.href =
                        "https://workpilottools.biz/ebooks/" +
                        productId +
                        ".html?product=" +
                        encodeURIComponent(productId) +
                        "&token=" +
                        encodeURIComponent(result.downloadToken);
                      return;
                    }
                  }
                  if (onSuccess) onSuccess(result);
                })
                .catch(function (err) {
                  alert("Payment received but unlock failed: " + err.message + "\nEmail mml.products26@gmail.com with your payment ID.");
                });
            },
          });
          rzp.open();
        });
      })
      .catch(function (err) {
        alert(err.message || "Payment unavailable");
      });
  }

  function bindBuyButtons(root) {
    root.querySelectorAll("[data-ebook-buy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-ebook-buy");
        openCheckout(id, function () {
          if (document.body.getAttribute("data-ebook-id") === id) {
            initDetailPage();
          } else {
            alert("Thank you! Your eBook is unlocked — open the book page to download.");
          }
        });
      });
    });

    root.querySelectorAll("[data-ebook-download]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-ebook-download");
        var purchase = getPurchases()[id];
        if (!purchase || !purchase.token) {
          alert("Purchase not found on this device. Complete payment first or contact support.");
          return;
        }
        var url = downloadUrl(purchase.token);
        if (!url) {
          alert("Download server not configured.");
          return;
        }
        global.open(url, "_blank", "noopener");
      });
    });
  }

  function cardHtml(book, site) {
    var detail = resolveAsset(book.detail);
    if (site.id !== "workpilot" && /^ebooks\//.test(book.detail)) {
      detail = "https://workpilottools.biz/" + book.detail;
    }
    return (
      '<article class="es-card">' +
      '<span class="es-tag">' + book.category + "</span>" +
      "<h3>" + book.title + "</h3>" +
      "<p>" + book.subtitle + "</p>" +
      priceHtml(book) +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">' +
      '<a class="es-btn es-btn--ghost" href="' + detail + '">Preview 7 pages</a>' +
      '<button type="button" class="es-btn" data-ebook-buy="' + book.id + '">Buy ' + fmtInr(book.price) + "</button>" +
      (hasPurchase(book.id)
        ? '<button type="button" class="es-btn es-btn--ghost" data-ebook-download="' + book.id + '">Download</button>'
        : "") +
      "</div></article>"
    );
  }

  function initHub() {
    var grid = document.querySelector("[data-ebook-hub]");
    if (!grid) return;
    var site = getSite();
    var html = "";
    Object.keys(CATALOG).forEach(function (id) {
      html += cardHtml(CATALOG[id], site);
    });
    grid.innerHTML = html;
    bindBuyButtons(grid);
  }

  function initDetailPage() {
    var id = document.body.getAttribute("data-ebook-id");
    var book = CATALOG[id];
    if (!book) return;

    var site = getSite();
    var owned = hasPurchase(id);
    var purchase = getPurchases()[id];

    var titleEl = document.querySelector("[data-ebook-title]");
    if (titleEl) titleEl.textContent = book.title;

    var subEl = document.querySelector("[data-ebook-subtitle]");
    if (subEl) subEl.textContent = book.subtitle;

    var tagEl = document.querySelector("[data-ebook-tag]");
    if (tagEl) tagEl.textContent = book.category;

    var priceEl = document.querySelector("[data-ebook-price]");
    if (priceEl) priceEl.innerHTML = priceHtml(book);

    var previewEl = document.querySelector("[data-ebook-preview]");
    if (previewEl) renderPreview(previewEl, resolveAsset(book.preview));

    var buyBox = document.querySelector("[data-ebook-buybox]");
    if (buyBox) {
      if (owned) {
        buyBox.innerHTML =
          '<div class="es-owned"><strong>You own this eBook</strong>Download the full PDF anytime from this device after payment.</div>' +
          '<button type="button" class="es-btn es-btn--block" data-ebook-download="' + id + '" style="margin-top:12px">Download full PDF</button>';
      } else {
        var priceBlock = document.querySelector("[data-ebook-price]") ? "" : priceHtml(book);
        buyBox.innerHTML =
          priceBlock +
          '<button type="button" class="es-btn es-btn--block" data-ebook-buy="' + id + '" style="margin-top:14px">Buy now — ' + fmtInr(book.price) + "</button>" +
          '<div class="es-trust" style="margin-top:14px">' +
          "<span>7-page free preview</span><span>Secure Razorpay payment</span><span>Instant download</span></div>";
      }
      bindBuyButtons(buyBox);
    }

    var lockEl = document.querySelector("[data-ebook-lock-msg]");
    if (lockEl && !owned) {
      lockEl.innerHTML =
        "<strong>Preview ends after page " +
        PREVIEW_PAGES +
        ".</strong> Buy once to download the complete eBook from this website.";
    } else if (lockEl && owned) {
      lockEl.style.display = "none";
    }

    document.title = book.title + " — Buy PDF eBook | " + site.name;
  }

  function initEmbed() {
    document.querySelectorAll("[data-ebook-embed]").forEach(function (node) {
      var site = getSite();
      var html = '<div class="es-grid es-embed-grid">';
      Object.keys(CATALOG).forEach(function (id) {
        html += cardHtml(CATALOG[id], site);
      });
      html += "</div>";
      node.innerHTML = html;
      bindBuyButtons(node);
    });
  }

  function init() {
    captureTokenFromUrl();
    initHub();
    initDetailPage();
    initEmbed();
  }

  global.EbookStore = {
    CATALOG: CATALOG,
    SITES: SITES,
    openCheckout: openCheckout,
    hasPurchase: hasPurchase,
    fmtInr: fmtInr,
    init: init,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
