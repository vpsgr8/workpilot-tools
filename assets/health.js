/* WorkPilot Tools — Health section renderer (directory + disease detail) */
(function () {
  "use strict";

  var DATA = window.WP_HEALTH;
  if (!DATA) return;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function catName(id) {
    var c = (DATA.categories || []).filter(function (x) { return x.id === id; })[0];
    return c ? c.name : id;
  }
  function catIcon(id) {
    var c = (DATA.categories || []).filter(function (x) { return x.id === id; })[0];
    return c ? c.icon : "💊";
  }

  /* ---------------- Directory page ---------------- */
  function initDirectory(root) {
    var search = root.querySelector("[data-hl-search]");
    var chips = root.querySelector("[data-hl-cats]");
    var grid = root.querySelector("[data-hl-grid]");
    if (!grid) return;

    var state = { q: "", cat: "all" };

    // category chips
    if (chips) {
      var html = '<button class="hl-chip active" data-cat="all">All</button>';
      (DATA.categories || []).forEach(function (c) {
        html += '<button class="hl-chip" data-cat="' + esc(c.id) + '">' + c.icon + " " + esc(c.name) + "</button>";
      });
      chips.innerHTML = html;
      chips.addEventListener("click", function (e) {
        var btn = e.target.closest(".hl-chip");
        if (!btn) return;
        state.cat = btn.getAttribute("data-cat");
        Array.prototype.forEach.call(chips.querySelectorAll(".hl-chip"), function (b) {
          b.classList.toggle("active", b === btn);
        });
        render();
      });
    }

    var initialQ = getParam("q");
    if (initialQ && search) search.value = initialQ;

    if (search) {
      search.addEventListener("input", function () {
        state.q = search.value.trim().toLowerCase();
        render();
      });
      state.q = (search.value || "").trim().toLowerCase();
    }

    function matches(d) {
      if (state.cat !== "all" && d.category !== state.cat) return false;
      if (!state.q) return true;
      var sym = (d.symptoms || []).join(" ");
      var hay = (d.name + " " + (d.aka || "") + " " + (d.overview || "") + " " + sym).toLowerCase();
      if (hay.indexOf(state.q) !== -1) return true;
      // also search medicine brand/company names linked to this disease
      var brands = collectBrands(d).map(function (m) { return (m.brand + " " + m.company).toLowerCase(); }).join(" ");
      return brands.indexOf(state.q) !== -1;
    }

    function render() {
      var list = (DATA.diseases || []).filter(matches);
      if (!list.length) {
        grid.innerHTML = '<p class="hl-empty">No conditions found. Try a different search term.</p>';
        return;
      }
      grid.innerHTML = list.map(function (d) {
        return '<a class="hl-card" href="disease.html?d=' + encodeURIComponent(d.slug) + '">' +
          '<span class="hl-ico">' + catIcon(d.category) + "</span>" +
          '<span class="hl-tag">' + esc(catName(d.category)) + "</span>" +
          "<strong>" + esc(d.name) + "</strong>" +
          "<small>" + esc((d.overview || "").slice(0, 96)) + "…</small>" +
        "</a>";
      }).join("");
    }

    render();
  }

  /* ---------------- Detail page ---------------- */
  function collectBrands(d) {
    var out = [];
    (d.drugs || []).forEach(function (g) {
      (g.salts || []).forEach(function (salt) {
        (DATA.medicines[salt] || []).forEach(function (m) { out.push(m); });
      });
    });
    return out;
  }

  function getParam(name) {
    var m = new RegExp("[?&]" + name + "=([^&]+)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }

  function disclaimerHtml() {
    return '<div class="hl-disclaimer"><strong>Educational reference only — not medical advice</strong>' +
      "All content here is provided solely for general education and awareness. Information is compiled from various publicly available sources on the internet and is presented as a <b>reference medical directory</b> — not professional medical advice, diagnosis, or treatment. " +
      "Always consult a qualified doctor or registered medical practitioner before taking any medicine, starting or stopping treatment, or making health decisions. Never self-medicate, especially with antibiotics or prescription-only drugs. " +
      "Medicine prices are indicative and may vary by pharmacy, city, and date. " +
      "WorkPilot Tools accepts no responsibility or liability for any harm, loss, or adverse outcome arising from use of or reliance on this information.</div>";
  }

  function searchBarHtml(opts) {
    var q = opts && opts.q ? esc(opts.q) : "";
    var action = opts && opts.action ? opts.action : "";
    if (action) {
      return '<form class="hl-search' + (opts.compact ? " hl-search--compact" : "") + '" action="' + esc(action) + '" method="get" role="search">' +
        '<input type="search" name="q" value="' + q + '" placeholder="Search disease, symptom, brand or company…" aria-label="Search conditions">' +
      "</form>";
    }
    return '<div class="hl-search' + (opts && opts.compact ? " hl-search--compact" : "") + '">' +
      '<input type="search" data-hl-search value="' + q + '" placeholder="Search disease, symptom, brand or company…" aria-label="Search conditions">' +
    "</div>";
  }

  function priceTable(salt) {
    var list = (DATA.medicines[salt] || []).slice();
    if (!list.length) return '<p class="hl-drug-note">No brand pricing available for this composition.</p>';
    var min = Math.min.apply(null, list.map(function (m) { return m.mrp; }));
    list.sort(function (a, b) { return a.mrp - b.mrp; });
    var rows = list.map(function (m) {
      var cheap = m.mrp === min;
      return '<tr class="' + (cheap ? "hl-cheapest" : "") + '">' +
        "<td>" + esc(m.brand) + (cheap ? '<span class="hl-best">LOWEST</span>' : "") + "</td>" +
        "<td>" + esc(m.company) + "</td>" +
        "<td>" + esc(m.pack) + "</td>" +
        '<td class="hl-price">' + esc(DATA.currency) + m.mrp + "</td>" +
      "</tr>";
    }).join("");
    return '<div class="hl-table-scroll"><table class="hl-table">' +
      "<thead><tr><th>Brand</th><th>Company / Manufacturer</th><th>Pack</th><th>Price (MRP)</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div>";
  }

  function listBlock(title, items) {
    if (!items || !items.length) return "";
    return '<div class="hl-section"><h2>' + esc(title) + "</h2><ul>" +
      items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") +
      "</ul></div>";
  }

  function initDetail(root) {
    var slug = getParam("d");
    var d = (DATA.diseases || []).filter(function (x) { return x.slug === slug; })[0];

    if (!d) {
      root.innerHTML = searchBarHtml({ action: "health-tools.html", compact: true }) +
        '<a class="hl-back" href="health-tools.html">← All conditions</a>' +
        disclaimerHtml() +
        '<div class="hl-section"><h1>Condition not found</h1>' +
        '<p class="hl-lead">We couldn\'t find that condition. Please return to the directory.</p></div>';
      document.title = "Not found — WorkPilot Health";
      return;
    }

    document.title = d.name + " — Treatment, Medicines & Prices | WorkPilot Tools";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", (d.overview || "").slice(0, 155));

    var drugsHtml = (d.drugs || []).map(function (g) {
      var saltBlocks = (g.salts || []).map(function (salt) {
        return '<div style="margin-top:10px">' +
          '<div class="hl-drug-head"><span class="hl-salt">' + esc(salt) + "</span></div>" +
          priceTable(salt) +
        "</div>";
      }).join("");
      return '<div class="hl-drug">' +
        '<div class="hl-drug-head"><span class="hl-class">' + esc(g.class) + "</span></div>" +
        (g.note ? '<p class="hl-drug-note">' + esc(g.note) + "</p>" : "") +
        saltBlocks +
      "</div>";
    }).join("");

    root.innerHTML =
      searchBarHtml({ action: "health-tools.html", compact: true }) +
      '<a class="hl-back" href="health-tools.html">← All conditions</a>' +
      '<div class="hl-detail">' +
        "<h1>" + esc(d.name) + "</h1>" +
        (d.aka ? '<p class="hl-aka">Also known as: ' + esc(d.aka) + " · " + esc(catName(d.category)) + "</p>" : '<p class="hl-aka">' + esc(catName(d.category)) + "</p>") +
        disclaimerHtml() +
        '<div class="hl-section"><p class="hl-lead">' + esc(d.overview) + "</p></div>" +
      "</div>";

    var blocks = "";
    blocks += '<div class="hl-cols">';
    blocks += "<div>" + listBlock("Common symptoms", d.symptoms) + "</div>";
    blocks += "<div>" + listBlock("Common causes", d.causes) + "</div>";
    blocks += "</div>";

    blocks += '<div class="hl-section"><h2>Treatment approach</h2><p class="hl-lead">' + esc(d.treatment) + "</p></div>";

    blocks += '<div class="hl-section"><h2>Medicines & price comparison</h2>' +
      '<p class="hl-drug-note">Common brands by composition, with manufacturer and indicative price. The lowest-priced brand for each composition is highlighted.</p>' +
      drugsHtml + "</div>";

    blocks += '<div class="hl-cols">';
    blocks += "<div>" + listBlock("Prevention & self-care", d.prevention) + "</div>";
    blocks += "<div>" + (d.whenDoctor ? '<div class="hl-section"><h2>When to see a doctor</h2><p class="hl-lead">' + esc(d.whenDoctor) + "</p></div>" : "") + "</div>";
    blocks += "</div>";

    blocks += '<p class="hl-meta">Reference data last reviewed: ' + esc(DATA.updated) + ".</p>";

    root.insertAdjacentHTML("beforeend", blocks);

    // Structured data for SEO
    try {
      var ld = {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "name": d.name,
        "description": (d.overview || "").slice(0, 200),
        "about": { "@type": "MedicalCondition", "name": d.name }
      };
      var s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    var dir = document.querySelector("[data-hl-directory]");
    if (dir) initDirectory(dir);
    var det = document.querySelector("[data-hl-detail]");
    if (det) initDetail(det);
  });
})();
