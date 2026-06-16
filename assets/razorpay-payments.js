(function (global) {
  var cfg = global.RAZORPAY_CONFIG || {};
  var checkoutLoaded = false;
  var publicConfig = null;

  var PLANS = {
    starter: { monthly: 2999, quarterly: 8249, yearly: 30590 },
    growth: { monthly: 7999, quarterly: 22037, yearly: 81590 },
    business: { monthly: 19999, quarterly: 55197, yearly: 203890 },
    setup: { once: 15000 },
  };

  function assetPrefix() {
    var p = location.pathname.replace(/\\/g, "/");
    if (p.indexOf("/tools/") !== -1 || p.indexOf("/blog/") !== -1 || p.indexOf("/app/") !== -1 || p.indexOf("/bizbuilt/") !== -1) {
      return "../assets/";
    }
    return "assets/";
  }

  function apiBase() {
    var url = (cfg.apiUrl || "").replace(/\/$/, "");
    if (url) return url;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return "http://localhost:8080";
    }
    return "";
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensureCheckout() {
    if (checkoutLoaded && global.Razorpay) return Promise.resolve();
    return loadScript("https://checkout.razorpay.com/v1/checkout.js").then(function () {
      checkoutLoaded = true;
    });
  }

  function fetchPublicConfig() {
    var base = apiBase();
    if (!base) return Promise.resolve({ enabled: false, keyId: cfg.keyId || "" });
    if (publicConfig) return Promise.resolve(publicConfig);

    return fetch(base + "/api/payments/config")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        publicConfig = data;
        if (data.keyId) cfg.keyId = data.keyId;
        return data;
      })
      .catch(function () {
        return { enabled: false, keyId: cfg.keyId || "" };
      });
  }

  function getBillingCycle() {
    var active = document.querySelector(".bb-billing-toggle button.active");
    return (active && active.getAttribute("data-cycle")) || "monthly";
  }

  function resolveAmount(el) {
    var amount = Number(el.getAttribute("data-rzp-amount"));
    if (amount) return Math.round(amount);

    var plan = el.getAttribute("data-rzp-plan");
    if (plan === "setup") return PLANS.setup.once * 100;

    if (plan && PLANS[plan]) {
      var cycle = el.getAttribute("data-rzp-cycle") || getBillingCycle();
      var rupees = PLANS[plan][cycle] || PLANS[plan].monthly;
      return Math.round(rupees * 100);
    }

    return 0;
  }

  function resolvePurpose(el) {
    return el.getAttribute("data-rzp-purpose") || el.getAttribute("data-rzp-plan") || "payment";
  }

  function resolveLabel(el, amountPaise) {
    var label = el.getAttribute("data-rzp-label");
    if (label) return label;
    var plan = el.getAttribute("data-rzp-plan");
    if (plan) return "BizBuilt AI — " + plan;
    if (amountPaise) return "Donation — WorkPilot Tools";
    return "WorkPilot Tools";
  }

  function promptDonationAmount() {
    var choice = prompt(
      "Enter donation amount in INR (minimum ₹49):\n\nSuggested: 49, 99, 199, 499, 999",
      "99"
    );
    if (choice == null) return 0;
    var rupees = Number(String(choice).replace(/[^\d.]/g, ""));
    if (!rupees || rupees < 49) {
      alert("Minimum donation is ₹49.");
      return 0;
    }
    return Math.round(rupees * 100);
  }

  function openFallback() {
    if (cfg.fallbackMeLink) {
      global.open(cfg.fallbackMeLink, "_blank", "noopener");
      return;
    }
    alert("Payments are temporarily unavailable. Email mml.products26@gmail.com");
  }

  function createOrder(payload) {
    var base = apiBase();
    if (!base) return Promise.reject(new Error("Payment API not configured"));

    return fetch(base + "/api/payments/order", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }).then(function (r) {
      return r.json().then(function (body) {
        if (!r.ok) throw new Error(body.error || "Could not start payment");
        return body;
      });
    });
  }

  function verifyPayment(payload) {
    var base = apiBase();
    if (!base) return Promise.resolve();
    return fetch(base + "/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
  }

  function openCheckout(el) {
    var amountPaise = resolveAmount(el);
    var purpose = resolvePurpose(el);

    if (!amountPaise && (purpose === "donation" || el.classList.contains("wp-rzp-donate"))) {
      amountPaise = promptDonationAmount();
    }
    if (!amountPaise) return;

    var plan = el.getAttribute("data-rzp-plan") || "";
    var cycle = el.getAttribute("data-rzp-cycle") || getBillingCycle();
    var label = resolveLabel(el, amountPaise);

    fetchPublicConfig()
      .then(function (config) {
        if (!config.enabled && !apiBase()) {
          openFallback();
          return;
        }
        return ensureCheckout().then(function () {
          return createOrder({
            amount: amountPaise,
            purpose: purpose,
            plan: plan,
            cycle: cycle,
            label: label,
            source: location.pathname,
          });
        }).then(function (order) {
          if (!order) return;
          var key = order.keyId || cfg.keyId || config.keyId;
          if (!key) throw new Error("Razorpay key missing");

          var rzp = new global.Razorpay({
            key: key,
            amount: order.amount,
            currency: order.currency || "INR",
            name: order.name || "WorkPilot Tools",
            description: order.description || label,
            order_id: order.id,
            theme: { color: "#6366f1" },
            prefill: {
              name: el.getAttribute("data-rzp-name") || "",
              email: el.getAttribute("data-rzp-email") || "",
              contact: el.getAttribute("data-rzp-phone") || "",
            },
            handler: function (response) {
              verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).finally(function () {
                alert("Thank you! Payment received successfully.");
              });
            },
            modal: {
              ondismiss: function () {},
            },
          });
          rzp.open();
        });
      })
      .catch(function (err) {
        console.warn("Razorpay:", err.message);
        if (confirm(err.message + "\n\nOpen Razorpay payment page instead?")) {
          openFallback();
        }
      });
  }

  function bindDelegation() {
    document.addEventListener("click", function (e) {
      var el = e.target.closest(
        "[data-rzp-pay], .wp-rzp-pay, .wp-donate-cta, .wp-donate-btn, .wp-footer-donate, .bb-rzp-pay"
      );
      if (!el) return;
      e.preventDefault();
      openCheckout(el);
    });
  }

  function init() {
    bindDelegation();
    document.querySelectorAll('a[href*="razorpay.me/@vishalpratapsingh601"]').forEach(function (a) {
      a.removeAttribute("href");
      a.removeAttribute("target");
      a.classList.add("wp-rzp-pay");
      a.setAttribute("data-rzp-purpose", "donation");
    });
  }

  global.RazorpayPay = {
    open: openCheckout,
    getBillingCycle: getBillingCycle,
    PLANS: PLANS,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
