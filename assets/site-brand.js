(function () {
  function depthPrefix() {
    var p = location.pathname.replace(/\\/g, "/");
    if (p.indexOf("/tools/") !== -1 || p.indexOf("/blog/") !== -1 || p.indexOf("/app/") !== -1) {
      return "../";
    }
    return "";
  }

  function assetPrefix() {
    return depthPrefix() + "assets/";
  }

  function homeHref() {
    return depthPrefix() + "index.html";
  }

  function aboutHref() {
    return depthPrefix() + "about.html";
  }

  function contactHref() {
    return depthPrefix() + "contact.html";
  }

  function productsHref() {
    return depthPrefix() + "our-products.html";
  }

  var OTHER_PRODUCTS = [
    {
      id: "workpilot",
      name: "WorkPilot Tools",
      url: null,
      internal: "index.html",
      tag: "Free tools",
      desc: "170+ PDF, AI, finance & baby tools — 100+ free calculators.",
    },
    {
      id: "bizbuilt",
      name: "BizBuilt AI",
      url: null,
      internal: "bizbuilt-ai.html",
      tag: "Premium SME",
      desc: "CRM, HR, payroll, inventory & AI Copilot for growing businesses.",
    },
    {
      id: "englishlearner",
      name: "English Learner Store",
      url: "https://englishlearner.store",
      tag: "Learning",
      desc: "English vocabulary, grammar & practice — plus paid PDF eBooks.",
    },
    {
      id: "logictrade",
      name: "LogicTrade",
      url: "https://logictrade.site",
      tag: "Finance",
      desc: "Logic-based trading education, risk tools & disciplined planning.",
    },
  ];

  function productCardHtml(p) {
    var href = p.internal ? depthPrefix() + p.internal : p.url;
    var ext = p.url ? ' target="_blank" rel="noopener"' : "";
    return (
      '<article class="wp-footer-product">' +
      '<span class="wp-footer-product-tag">' + p.tag + "</span>" +
      "<h3><a href=\"" + href + "\"" + ext + ">" + p.name + "</a></h3>" +
      "<p>" + p.desc + "</p>" +
      '<a class="wp-footer-product-link" href="' + href + '"' + ext + ">Visit →</a>" +
      "</article>"
    );
  }

  function injectFooterProducts() {
    if (document.querySelector(".wp-footer-products")) return;

    var cards = OTHER_PRODUCTS.map(productCardHtml).join("");
    var html =
      '<section class="wp-footer-products" aria-label="Our other products">' +
      '<div class="wp-footer-products-inner">' +
      "<h2>Our Products</h2>" +
      "<p>More from <strong>MarketMind Labs</strong> — free tools, business software, learning &amp; finance.</p>" +
      '<div class="wp-footer-products-grid">' + cards + "</div>" +
      '<p class="wp-footer-products-more"><a href="' + productsHref() + '">View all products &amp; details →</a></p>' +
      "</div></section>";

    var footer = document.querySelector("footer");
    if (footer) {
      footer.insertAdjacentHTML("beforebegin", html);
    } else {
      document.body.insertAdjacentHTML("beforeend", html);
    }
  }

  function appendFooterNavLink(footer, href, text) {
    if ((footer.textContent || "").indexOf(text) !== -1) return;
    footer.appendChild(document.createTextNode(" "));
    var a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    footer.appendChild(a);
  }

  function brandHtml(prefix) {
    return (
      '<img class="wp-logo wp-logo-mml" src="' +
      prefix +
      'marketmind-labs-logo.png" alt="MarketMind Labs" width="40" height="40">' +
      '<span class="wp-brand-text"><strong>WorkPilot Tools</strong>' +
      "<small>a product of MarketMind Labs</small></span>"
    );
  }

  function hasHealthNav(header) {
    return !!header.querySelector('a[href*="health-tools"]');
  }

  var SITE_NAV = [
    { label: "PDF", path: "pdf-tools.html" },
    { label: "AI", path: "ai-tools.html" },
    { label: "Image", path: "image-tools.html" },
    { label: "Audio", path: "audio-tools.html" },
    { label: "Video", path: "video-tools.html" },
    { label: "Business", path: "business-tools.html" },
    { label: "Finance", path: "finance-tools.html" },
    { label: "Pregnancy", path: "pregnancy-tools.html" },
    { label: "Baby", path: "baby-parenting-tools.html" },
    { label: "Health", path: "health-tools.html" },
    { label: "Blog", path: "blog/index.html" },
  ];

  function injectSiteNav() {
    var header = document.querySelector("header");
    if (!header || header.dataset.wpNavPatched) return;

    var prefix = depthPrefix();
    var path = location.pathname.replace(/\\/g, "/");
    var navBar = header.querySelector(".nav-links, .links");

    if (navBar) {
      if (!hasHealthNav(header)) {
        var health = document.createElement("a");
        health.href = prefix + "health-tools.html";
        health.textContent = "Health";
        var blog = navBar.querySelector('a[href*="blog"]');
        if (blog) navBar.insertBefore(health, blog);
        else navBar.appendChild(health);
      }
      header.dataset.wpNavPatched = "1";
      return;
    }

    if (path.indexOf("/tools/") === -1) return;
    if (header.querySelector(".wp-site-nav")) {
      header.dataset.wpNavPatched = "1";
      return;
    }

    var nav = document.createElement("nav");
    nav.className = "wp-site-nav";
    nav.setAttribute("aria-label", "Site categories");
    SITE_NAV.forEach(function (item) {
      var a = document.createElement("a");
      a.href = prefix + item.path;
      a.textContent = item.label;
      nav.appendChild(a);
    });

    var flex = header.querySelector(".max-w-6xl") || header.querySelector("div");
    var themeBtn = header.querySelector(".wp-theme-toggle");
    if (flex) {
      if (themeBtn) flex.insertBefore(nav, themeBtn);
      else flex.appendChild(nav);
    } else {
      header.appendChild(nav);
    }
    header.dataset.wpNavPatched = "1";
  }

  function stripTopNavLinks() {
    var header = document.querySelector("header");
    if (!header) return;

    header.querySelectorAll("a").forEach(function (a) {
      if (a.classList.contains("wp-brand-lockup") || a.closest(".wp-brand-lockup")) return;

      var href = (a.getAttribute("href") || "").toLowerCase();
      var text = (a.textContent || "").trim().toLowerCase();

      var isHome =
        text === "home" ||
        href === "index.html" ||
        href === "../index.html" ||
        href === "/index.html";
      var isBlog =
        text === "blogs" ||
        text === "blog" ||
        href === "#blogs" ||
        href.indexOf("blog/") !== -1 ||
        href.indexOf("blog/index") !== -1;
      var isAbout = text === "about" || text === "about us" || href.indexOf("about.html") !== -1;
      var isContact = text === "contact" || text === "contact us" || href.indexOf("contact.html") !== -1;

      if (isHome || isBlog || isAbout || isContact) a.remove();
    });
  }

  function injectHomeButton() {
    if (document.querySelector(".wp-home-btn")) return;
    var a = document.createElement("a");
    a.className = "wp-home-btn";
    a.href = homeHref();
    a.setAttribute("aria-label", "Back to homepage");
    a.innerHTML = "&#8592; Home";
    document.body.appendChild(a);
  }

  function patchHeaderBrand() {
    var prefix = assetPrefix();
    var home = homeHref();
    var header = document.querySelector("header");
    if (!header) return;

    header.querySelectorAll(".wp-brand-lockup").forEach(function (link) {
      link.href = home;
      link.innerHTML = brandHtml(prefix);
    });

    var candidates = header.querySelectorAll(
      'a.brand, a[href="index.html"], a[href="../index.html"], a[href="/index.html"]'
    );

    candidates.forEach(function (link) {
      if (link.classList.contains("wp-brand-lockup")) return;
      if (link.textContent.indexOf("WorkPilot") === -1 && !link.classList.contains("brand")) return;
      link.className = "wp-brand-lockup";
      link.href = home;
      link.innerHTML = brandHtml(prefix);
    });

    if (!header.querySelector(".wp-brand-lockup")) {
      var firstHome = header.querySelector('a[href*="index.html"]');
      if (firstHome) {
        firstHome.className = "wp-brand-lockup";
        firstHome.href = home;
        firstHome.innerHTML = brandHtml(prefix);
      }
    }
  }

  function patchFooterLinks() {
    injectFooterProducts();

    document.querySelectorAll("footer").forEach(function (footer) {
      if (footer.dataset.wpBrandPatched) return;
      var text = footer.textContent || "";

      appendFooterNavLink(footer, productsHref(), "Our Products");

      if (text.indexOf("About") !== -1 && text.indexOf("Contact") !== -1) {
        if (text.indexOf("Donate") === -1) {
          var donateLink = document.createElement("button");
          donateLink.type = "button";
          donateLink.className = "wp-footer-donate wp-rzp-pay";
          donateLink.setAttribute("data-rzp-purpose", "donation");
          donateLink.textContent = "Donate";
          footer.appendChild(document.createTextNode(" "));
          footer.appendChild(donateLink);
        }
        if (text.indexOf("BizBuilt") === -1) {
          appendFooterNavLink(footer, depthPrefix() + "bizbuilt-ai.html", "BizBuilt AI Premium");
        }
        footer.dataset.wpBrandPatched = "1";
        return;
      }

      appendFooterNavLink(footer, homeHref(), "Home");
      appendFooterNavLink(footer, aboutHref(), "About Us");
      appendFooterNavLink(footer, contactHref(), "Contact Us");

      var donate = document.createElement("button");
      donate.type = "button";
      donate.className = "wp-footer-donate wp-rzp-pay";
      donate.setAttribute("data-rzp-purpose", "donation");
      donate.textContent = "Donate";
      footer.appendChild(document.createTextNode(" "));
      footer.appendChild(donate);

      appendFooterNavLink(footer, depthPrefix() + "bizbuilt-ai.html", "BizBuilt AI Premium");

      if (footer.querySelector("span") || text.indexOf("MarketMind") === -1) {
        var note = document.createElement("span");
        note.style.display = "block";
        note.style.width = "100%";
        note.style.marginTop = "8px";
        note.style.fontSize = "12px";
        note.textContent = "WorkPilot Tools is a product of MarketMind Labs.";
        footer.appendChild(note);
      }

      footer.dataset.wpBrandPatched = "1";
    });
  }

  function injectAppTopbar() {
    if (!location.pathname.replace(/\\/g, "/").startsWith("/app")) return;
    if (document.getElementById("wp-app-topbar")) return;

    var prefix = assetPrefix();
    var bar = document.createElement("div");
    bar.id = "wp-app-topbar";
    bar.className = "wp-app-topbar";
    bar.innerHTML =
      '<a class="wp-app-home" href="/index.html">&#8592; Back to Homepage</a>' +
      '<span class="wp-app-brand">' +
      '<img src="' +
      prefix +
      'marketmind-labs-logo.png" alt="MarketMind Labs">' +
      "<span>WorkPilot Tools · MarketMind Labs</span></span>";

    var root = document.getElementById("root");
    if (root) document.body.insertBefore(bar, root);
    else document.body.insertBefore(bar, document.body.firstChild);
  }

  function init() {
    injectAppTopbar();
    patchHeaderBrand();
    stripTopNavLinks();
    injectSiteNav();
    injectHomeButton();
    patchFooterLinks();
    if (!window.RazorpayPay && !document.querySelector('script[src*="razorpay-payments.js"]')) {
      var prefix = assetPrefix();
      ["razorpay-config.js", "razorpay-payments.js"].forEach(function (file) {
        var s = document.createElement("script");
        s.src = prefix + file;
        s.defer = true;
        document.head.appendChild(s);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
