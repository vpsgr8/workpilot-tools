(function () {
  "use strict";

  function num(v) { return Number(v) || 0; }
  function fmt(n) { return "₹" + num(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }); }
  function emi(p, r, m) {
    p = num(p); m = num(m) || 1;
    var rate = num(r) / 12 / 100;
    if (!p || !m) return 0;
    if (!rate) return p / m;
    var pow = Math.pow(1 + rate, m);
    return (p * rate * pow) / (pow - 1);
  }
  function sipFv(pmt, rate, months) {
    var r = rate / 12 / 100;
    if (!pmt || !months) return 0;
    if (!r) return pmt * months;
    return pmt * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  }
  function fv(pv, rate, years) {
    return pv * Math.pow(1 + rate / 100, years);
  }

  function bindCompare(root, type) {
    root.innerHTML = "";
    root.className = "fc-compare-widget";
    var html = "";
    var note = "";

    if (type === "sip-vs-fd" || type === "rd-vs-sip" || type === "retirement-sip-fd") {
      html =
        '<form class="fc-form">' +
        '<label>Monthly amount (₹)<input name="amt" type="number" value="10000" step="500"></label>' +
        '<label>SIP / equity return (% p.a.)<input name="sipRate" type="number" value="12" step="0.5"></label>' +
        '<label>FD / RD rate (% p.a.)<input name="fdRate" type="number" value="7" step="0.1"></label>' +
        '<label>Years<input name="years" type="number" value="10" min="1"></label>' +
        '<button type="submit" class="fc-btn">Compare returns</button></form>';
      note = "Illustrative — actual MF returns are not guaranteed.";
    } else if (type === "sip-vs-lumpsum") {
      html =
        '<form class="fc-form">' +
        '<label>Total investment (₹)<input name="total" type="number" value="1200000" step="10000"></label>' +
        '<label>Expected return (% p.a.)<input name="rate" type="number" value="12" step="0.5"></label>' +
        '<label>SIP period (years)<input name="years" type="number" value="10" min="1"></label>' +
        '<button type="submit" class="fc-btn">Compare SIP vs lumpsum</button></form>';
      note = "Lumpsum assumes full amount invested day 1; SIP spreads over the period.";
    } else if (type === "tax-regime-compare") {
      html =
        '<form class="fc-form">' +
        '<label>Annual income (₹)<input name="income" type="number" value="1500000" step="10000"></label>' +
        '<label>Deductions old regime (₹)<input name="ded" type="number" value="200000" step="5000"></label>' +
        '<button type="submit" class="fc-btn">Compare tax regimes</button></form>';
    } else if (type === "loan-type-compare" || type === "car-vs-personal" || type === "emi-cc-compare") {
      html =
        '<form class="fc-form">' +
        '<label>Loan amount (₹)<input name="amt" type="number" value="500000" step="10000"></label>' +
        '<label>Lower-rate loan (% p.a.)<input name="r1" type="number" value="9" step="0.1"></label>' +
        '<label>Higher-rate loan (% p.a.)<input name="r2" type="number" value="14" step="0.1"></label>' +
        '<label>Tenure (years)<input name="years" type="number" value="5" min="1"></label>' +
        '<button type="submit" class="fc-btn">Compare EMIs</button></form>';
    } else if (type === "compound-vs-simple") {
      html =
        '<form class="fc-form">' +
        '<label>Principal (₹)<input name="pv" type="number" value="500000" step="1000"></label>' +
        '<label>Rate (% p.a.)<input name="rate" type="number" value="8" step="0.1"></label>' +
        '<label>Years<input name="years" type="number" value="10" min="1"></label>' +
        '<button type="submit" class="fc-btn">Compare interest types</button></form>';
    } else if (type === "trade-mode-compare") {
      html =
        '<form class="fc-form">' +
        '<label>Quantity<input name="qty" type="number" value="100" min="1"></label>' +
        '<label>Buy price (₹)<input name="buy" type="number" value="250" step="0.05"></label>' +
        '<label>Sell price (₹)<input name="sell" type="number" value="260" step="0.05"></label>' +
        '<button type="submit" class="fc-btn">Compare delivery vs intraday P&amp;L</button></form>';
      note = "Delivery STT 0.1% vs intraday 0.025% on sell — simplified.";
    } else if (type === "ppf-vs-fd") {
      html =
        '<form class="fc-form">' +
        '<label>Annual investment (₹)<input name="amt" type="number" value="150000" step="5000"></label>' +
        '<label>Rate (% p.a.)<input name="rate" type="number" value="7.1" step="0.1"></label>' +
        '<label>Years<input name="years" type="number" value="15" min="1"></label>' +
        '<label>Your tax slab (%)<input name="tax" type="number" value="30" step="5"></label>' +
        '<button type="submit" class="fc-btn">Compare post-tax maturity</button></form>';
    } else if (type === "mf-vs-stock") {
      html =
        '<form class="fc-form">' +
        '<label>Monthly SIP (₹)<input name="sip" type="number" value="15000" step="500"></label>' +
        '<label>MF return (% p.a.)<input name="mf" type="number" value="11" step="0.5"></label>' +
        '<label>Stock return (% p.a.)<input name="stk" type="number" value="14" step="0.5"></label>' +
        '<label>Years<input name="years" type="number" value="10" min="1"></label>' +
        '<button type="submit" class="fc-btn">Compare wealth outcomes</button></form>';
      note = "Stock return assumes successful stock picking — higher risk.";
    } else {
      root.innerHTML = "<p class=\"fc-note\">Interactive comparison available on linked calculators.</p>";
      return;
    }

    var results = document.createElement("div");
    results.className = "fc-compare-results";
    root.innerHTML = html;
    root.appendChild(results);
    if (note) {
      var p = document.createElement("p");
      p.className = "fc-note";
      p.textContent = note;
      root.appendChild(p);
    }

    var form = root.querySelector("form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      results.innerHTML = "";
      var out = [];

      if (type === "sip-vs-fd" || type === "rd-vs-sip" || type === "retirement-sip-fd") {
        var months = num(fd.get("years")) * 12;
        var sipVal = sipFv(num(fd.get("amt")), num(fd.get("sipRate")), months);
        var fdVal = sipFv(num(fd.get("amt")), num(fd.get("fdRate")), months);
        out = [
          ["SIP / equity maturity", fmt(sipVal)],
          ["FD / RD maturity", fmt(fdVal)],
          ["Difference", fmt(sipVal - fdVal)],
        ];
      } else if (type === "sip-vs-lumpsum") {
        var yrs = num(fd.get("years"));
        var total = num(fd.get("total"));
        var rate = num(fd.get("rate"));
        var lump = fv(total, rate, yrs);
        var monthly = total / (yrs * 12);
        var sipM = sipFv(monthly, rate, yrs * 12);
        out = [
          ["Lumpsum maturity", fmt(lump)],
          ["SIP maturity (same total invested)", fmt(sipM)],
          ["Lumpsum advantage", fmt(lump - sipM)],
        ];
      } else if (type === "tax-regime-compare") {
        var inc = num(fd.get("income"));
        var ded = num(fd.get("ded"));
        function taxNew(x) {
          var t = 0, taxable = Math.max(0, x - 75000);
          if (taxable > 300000) t += Math.min(taxable - 300000, 300000) * 0.05;
          if (taxable > 600000) t += Math.min(taxable - 600000, 300000) * 0.1;
          if (taxable > 900000) t += Math.min(taxable - 900000, 300000) * 0.15;
          if (taxable > 1200000) t += Math.min(taxable - 1200000, 300000) * 0.2;
          if (taxable > 1500000) t += (taxable - 1500000) * 0.3;
          return t * 1.04;
        }
        function taxOld(x) {
          var t = 0, taxable = Math.max(0, x - ded);
          if (taxable > 250000) t += Math.min(taxable - 250000, 250000) * 0.05;
          if (taxable > 500000) t += Math.min(taxable - 500000, 250000) * 0.2;
          if (taxable > 1000000) t += (taxable - 1000000) * 0.3;
          return t * 1.04;
        }
        var n = taxNew(inc), o = taxOld(inc);
        out = [
          ["New regime tax", fmt(n)],
          ["Old regime tax", fmt(o)],
          ["You save with", n <= o ? "New regime" : "Old regime"],
          ["Annual savings", fmt(Math.abs(n - o))],
        ];
      } else if (type === "loan-type-compare" || type === "car-vs-personal" || type === "emi-cc-compare") {
        var m = num(fd.get("years")) * 12;
        var e1 = emi(fd.get("amt"), fd.get("r1"), m);
        var e2 = emi(fd.get("amt"), fd.get("r2"), m);
        out = [
          ["Lower-rate EMI", fmt(e1)],
          ["Higher-rate EMI", fmt(e2)],
          ["Monthly savings", fmt(e2 - e1)],
          ["Total savings over tenure", fmt((e2 - e1) * m)],
        ];
      } else if (type === "compound-vs-simple") {
        var pv = num(fd.get("pv")), rt = num(fd.get("rate")), y = num(fd.get("years"));
        var comp = fv(pv, rt, y);
        var simp = pv + (pv * rt * y) / 100;
        out = [
          ["Compound maturity", fmt(comp)],
          ["Simple interest total", fmt(simp)],
          ["Compounding bonus", fmt(comp - simp)],
        ];
      } else if (type === "trade-mode-compare") {
        var qty = num(fd.get("qty")), buy = num(fd.get("buy")), sell = num(fd.get("sell"));
        var gross = qty * (sell - buy);
        var del = gross - sell * qty * 0.001;
        var intra = gross - sell * qty * 0.00025;
        out = [
          ["Gross P&L", fmt(gross)],
          ["Delivery net (approx.)", fmt(del)],
          ["Intraday net (approx.)", fmt(intra)],
        ];
      } else if (type === "ppf-vs-fd") {
        var annual = num(fd.get("amt")), rt2 = num(fd.get("rate")), yy = num(fd.get("years")), slab = num(fd.get("tax"));
        var ppf = 0;
        for (var i = 0; i < yy; i++) ppf = (ppf + annual) * (1 + rt2 / 100);
        var fdGross = 0;
        for (var j = 0; j < yy; j++) fdGross = (fdGross + annual) * (1 + rt2 / 100);
        var fdNet = fdGross - (fdGross - annual * yy) * (slab / 100);
        out = [
          ["PPF maturity (tax-free)", fmt(ppf)],
          ["FD maturity (post-tax approx.)", fmt(fdNet)],
          ["PPF advantage", fmt(ppf - fdNet)],
        ];
      } else if (type === "mf-vs-stock") {
        var mo = num(fd.get("years")) * 12;
        var mfV = sipFv(num(fd.get("sip")), num(fd.get("mf")), mo);
        var stV = sipFv(num(fd.get("sip")), num(fd.get("stk")), mo);
        out = [
          ["MF SIP maturity", fmt(mfV)],
          ["Stock SIP maturity (if sustained)", fmt(stV)],
          ["Difference", fmt(stV - mfV)],
        ];
      }

      out.forEach(function (row) {
        var box = document.createElement("div");
        box.className = "fc-kpi";
        box.innerHTML = "<label>" + row[0] + "</label><strong>" + row[1] + "</strong>";
        results.appendChild(box);
      });
    });
  }

  function init() {
    document.querySelectorAll("[data-finance-compare]").forEach(function (root) {
      bindCompare(root, root.getAttribute("data-finance-compare"));
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
