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
      '<img class="wp-logo wp-logo-workpilot" src="' +
      prefix +
      'workpilot-logo.svg" alt="" width="40" height="40">' +
      '<span class="wp-brand-text"><strong>WorkPilot Tools</strong>' +
      "<small>a product of MarketMind Labs</small></span>" +
      '<img class="wp-logo wp-logo-mml" src="' +
      prefix +
      'marketmind-labs-logo.png" alt="MarketMind Labs" width="36" height="36">'
    );
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
      'workpilot-logo.svg" alt="">' +
      "<span>WorkPilot Tools · MarketMind Labs</span></span>" +
      '<span style="display:flex;gap:12px;flex-wrap:wrap">' +
      '<a href="/about.html">About</a>' +
      '<a href="/contact.html">Contact</a>' +
      "</span>";

    var root = document.getElementById("root");
    if (root) document.body.insertBefore(bar, root);
    else document.body.insertBefore(bar, document.body.firstChild);
  }

  function init() {
    injectAppTopbar();
    patchHeaderBrand();
    injectHomeButton();
    patchFooterLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
