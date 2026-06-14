(function () {
  var KEY = "wp-theme";

  function icon(isDark) {
    return isDark ? "\u2600\uFE0F" : "\uD83C\uDF19";
  }

  function apply(theme) {
    var dark = theme === "dark";
    if (dark) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    document.querySelectorAll(".wp-theme-toggle").forEach(function (btn) {
      btn.textContent = icon(dark);
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
    });
  }

  function init() {
    var saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch (e) {}
    var prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    apply(saved || (prefersDark ? "dark" : "light"));
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".wp-theme-toggle");
    if (!btn) return;
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var next = dark ? "light" : "dark";
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
    apply(next);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
