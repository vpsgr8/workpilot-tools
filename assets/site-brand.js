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

  function brandHtml(prefix) {
    return (
      '<img class="wp-logo wp-logo-mml" src="' +
      prefix +
      'marketmind-labs-logo.png" alt="MarketMind Labs" width="40" height="40">' +
      '<span class="wp-brand-text"><strong>WorkPilot Tools</strong>' +
      "<small>a product of MarketMind Labs</small></span>"
    );
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
    document.querySelectorAll("footer").forEach(function (footer) {
      if (footer.dataset.wpBrandPatched) return;
      var text = footer.textContent || "";
      if (text.indexOf("About") !== -1 && text.indexOf("Contact") !== -1) {
        if (text.indexOf("Donate") === -1) {
          var donateLink = document.createElement("a");
          donateLink.href = "https://razorpay.me/@vishalpratapsingh601";
          donateLink.target = "_blank";
          donateLink.rel = "noopener";
          donateLink.textContent = "Donate";
          footer.appendChild(document.createTextNode(" "));
          footer.appendChild(donateLink);
        }
        if (text.indexOf("BizBuilt") === -1) {
          var premium = document.createElement("a");
          premium.href = depthPrefix() + "bizbuilt-ai.html";
          premium.textContent = "BizBuilt AI Premium";
          footer.appendChild(document.createTextNode(" "));
          footer.appendChild(premium);
        }
        footer.dataset.wpBrandPatched = "1";
        return;
      }

      var about = document.createElement("a");
      about.href = aboutHref();
      about.textContent = "About Us";

      var contact = document.createElement("a");
      contact.href = contactHref();
      contact.textContent = "Contact Us";

      var home = document.createElement("a");
      home.href = homeHref();
      home.textContent = "Home";

      footer.appendChild(document.createTextNode(" "));
      footer.appendChild(home);
      footer.appendChild(document.createTextNode(" "));
      footer.appendChild(about);
      footer.appendChild(document.createTextNode(" "));
      footer.appendChild(contact);

      var donate = document.createElement("a");
      donate.href = "https://razorpay.me/@vishalpratapsingh601";
      donate.target = "_blank";
      donate.rel = "noopener";
      donate.textContent = "Donate";

      footer.appendChild(document.createTextNode(" "));
      footer.appendChild(donate);

      var premium = document.createElement("a");
      premium.href = depthPrefix() + "bizbuilt-ai.html";
      premium.textContent = "BizBuilt AI Premium";

      footer.appendChild(document.createTextNode(" "));
      footer.appendChild(premium);

      if (footer.querySelector("span") || footer.textContent.indexOf("MarketMind") === -1) {
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
    injectHomeButton();
    patchFooterLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
