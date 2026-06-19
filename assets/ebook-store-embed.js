/**
 * Drop on englishlearner.store or logictrade.site:
 *
 * <link rel="stylesheet" href="https://workpilottools.biz/assets/ebook-store.css">
 * <div data-ebook-site="englishlearner" data-ebook-embed></div>
 * <script src="https://workpilottools.biz/assets/razorpay-config.js"></script>
 * <script src="https://workpilottools.biz/assets/ebook-store.js"></script>
 *
 * Set data-ebook-site to: englishlearner | logictrade | workpilot
 */
(function () {
  if (document.body && !document.body.getAttribute("data-ebook-site")) {
    var node = document.querySelector("[data-ebook-embed][data-ebook-site]");
    if (node) {
      document.body.setAttribute("data-ebook-site", node.getAttribute("data-ebook-site"));
    }
  }
})();
