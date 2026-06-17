(function () {
  "use strict";

  function num(v) { return Number(v) || 0; }
  function fmt(n) { return "₹" + num(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }); }
  function sipFv(pmt, rate, months) {
    var r = rate / 12 / 100;
    if (!pmt || !months) return 0;
    if (!r) return pmt * months;
    return pmt * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function riskProfile(score) {
    if (score >= 7) return { label: "Aggressive", equity: 75, debt: 20, gold: 5 };
    if (score >= 4) return { label: "Moderate", equity: 60, debt: 30, gold: 10 };
    return { label: "Conservative", equity: 40, debt: 50, gold: 10 };
  }

  function buildPlan(data) {
    var age = num(data.age);
    var income = num(data.income);
    var expenses = num(data.expenses);
    var savings = num(data.savings);
    var risk = num(data.risk);
    var goal = data.goal || "wealth";
    var profile = riskProfile(risk);
    var monthly = income / 12;
    var emergency = expenses * 6;
    var emergencyGap = Math.max(0, emergency - savings);
    var investable = Math.max(0, monthly - expenses) * 0.7;
    var retirementYears = Math.max(58 - age, 5);
    var retireMonths = retirementYears * 12;
    var futureExp = expenses * Math.pow(1.06, retirementYears);
    var corpus = futureExp * 12 * 25;
    var corpusGap = Math.max(0, corpus - savings);
    var sipForCorpus = retireMonths ? corpusGap / (retireMonths * 0.8) : 0;
    var sipRate = profile.label === "Aggressive" ? 12 : profile.label === "Moderate" ? 10 : 8;
    var suggestedSip = Math.min(Math.max(investable, 5000), Math.round(sipForCorpus / 1000) * 1000 || 5000);

    var steps = [];
    if (emergencyGap > 0) {
      steps.push("Build an emergency fund of " + fmt(emergency) + " (6 months of expenses). You need " + fmt(emergencyGap) + " more — park this in liquid FD or debt fund first.");
    } else {
      steps.push("Emergency fund target met at " + fmt(emergency) + ". Maintain 6 months of expenses in liquid assets.");
    }
    steps.push("Recommended monthly SIP: " + fmt(suggestedSip) + " into diversified equity (" + profile.equity + "%) and debt (" + profile.debt + "%) aligned with your " + profile.label.toLowerCase() + " risk profile.");
    if (goal === "retirement") {
      steps.push("Retirement corpus target: " + fmt(corpus) + " by age 58 (25× annual expenses rule with 6% inflation). Start or increase SIP now.");
    } else if (goal === "home") {
      steps.push("For a home goal, cap EMI at 40% of net income. Use our home loan eligibility calculator before applying.");
    } else if (goal === "education") {
      steps.push("Education goals need inflation-adjusted planning — target 10–12% return via equity SIP for timelines over 7 years.");
    }
    steps.push("Asset allocation: " + profile.equity + "% equity · " + profile.debt + "% debt · " + profile.gold + "% gold. Rebalance annually.");
    if (age < 35) steps.push("At your age, prioritise equity SIP and term insurance (10× annual income cover).");
    else if (age < 50) steps.push("Increase SIP with salary hikes. Review health insurance and critical illness cover.");
    else steps.push("Shift 10–20% of equity to debt each year in the 5 years before retirement.");

    var projection = [];
    var bal = savings;
    var sip = suggestedSip;
    for (var y = 1; y <= Math.min(10, retirementYears); y++) {
      bal = bal * (1 + sipRate / 100) + sip * 12;
      projection.push({ year: y, age: age + y, value: bal });
    }

    return {
      profile: profile,
      emergency: emergency,
      suggestedSip: suggestedSip,
      corpus: corpus,
      steps: steps,
      projection: projection,
      sipRate: sipRate,
    };
  }

  function renderPlan(root, plan) {
    root.innerHTML = "";
    var head = el("div", "fc-ai-summary");
    head.innerHTML =
      "<h3>Your AI financial plan</h3>" +
      "<p>Risk profile: <strong>" + plan.profile.label + "</strong> · " +
      plan.profile.equity + "% equity / " + plan.profile.debt + "% debt</p>";
    root.appendChild(head);

    var kpis = el("div", "fc-results");
    [
      ["Emergency fund target", fmt(plan.emergency)],
      ["Suggested monthly SIP", fmt(plan.suggestedSip)],
      ["Retirement corpus (est.)", fmt(plan.corpus)],
    ].forEach(function (k) {
      var box = el("div", "fc-kpi");
      box.innerHTML = "<label>" + k[0] + "</label><strong>" + k[1] + "</strong>";
      kpis.appendChild(box);
    });
    root.appendChild(kpis);

    var list = el("ol", "fc-ai-steps");
    plan.steps.forEach(function (s) {
      var li = el("li", "", s);
      list.appendChild(li);
    });
    root.appendChild(list);

    if (plan.projection.length) {
      var tbl = el("div", "fc-ai-projection");
      tbl.innerHTML = "<h4>10-year wealth projection (at " + plan.sipRate + "% p.a.)</h4>";
      var table = el("table", "fc-ai-table");
      table.innerHTML = "<thead><tr><th>Year</th><th>Age</th><th>Est. corpus</th></tr></thead>";
      var tbody = el("tbody");
      plan.projection.forEach(function (row) {
        var tr = el("tr", "", "<td>" + row.year + "</td><td>" + row.age + "</td><td>" + fmt(row.value) + "</td>");
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      tbl.appendChild(table);
      root.appendChild(tbl);
    }

    root.appendChild(el("p", "fc-note", "AI-generated plan using rule-based financial planning logic — runs privately in your browser. Not personalised investment advice; consult a SEBI-registered advisor for final decisions."));
  }

  function bindPlanner(root) {
    root.innerHTML =
      '<form class="fc-form fc-ai-form">' +
      '<label>Age<input name="age" type="number" value="32" min="18" max="70"></label>' +
      '<label>Annual income (₹)<input name="income" type="number" value="1200000" step="10000"></label>' +
      '<label>Monthly expenses (₹)<input name="expenses" type="number" value="45000" step="1000"></label>' +
      '<label>Current savings / investments (₹)<input name="savings" type="number" value="300000" step="10000"></label>' +
      '<label>Risk appetite (1=low, 10=high)<input name="risk" type="number" value="6" min="1" max="10"></label>' +
      '<label>Primary goal<select name="goal">' +
      '<option value="wealth">Wealth building</option>' +
      '<option value="retirement">Retirement</option>' +
      '<option value="home">Home purchase</option>' +
      '<option value="education">Child education</option>' +
      "</select></label>" +
      '<button type="submit" class="fc-btn">Generate AI financial plan</button></form>' +
      '<div class="fc-ai-output"></div>';

    var form = root.querySelector("form");
    var output = root.querySelector(".fc-ai-output");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var plan = buildPlan({
        age: fd.get("age"),
        income: fd.get("income"),
        expenses: fd.get("expenses"),
        savings: fd.get("savings"),
        risk: fd.get("risk"),
        goal: fd.get("goal"),
      });
      renderPlan(output, plan);
    });
  }

  function bindProjection(root) {
    root.innerHTML =
      '<form class="fc-form">' +
      '<label>Monthly SIP (₹)<input name="sip" type="number" value="15000" step="500"></label>' +
      '<label>Expected return (% p.a.)<input name="rate" type="number" value="12" step="0.5"></label>' +
      '<label>Years<input name="years" type="number" value="15" min="1" max="40"></label>' +
      '<label>Annual step-up (% p.a.)<input name="step" type="number" value="10" step="1"></label>' +
      '<button type="submit" class="fc-btn">Project investment growth</button></form>' +
      '<div class="fc-ai-projection-out"></div>';

    var form = root.querySelector("form");
    var out = root.querySelector(".fc-ai-projection-out");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var sip = num(fd.get("sip"));
      var rate = num(fd.get("rate"));
      var years = num(fd.get("years"));
      var step = num(fd.get("step")) / 100;
      var totalInv = 0;
      var corpus = 0;
      var rows = "";
      for (var y = 1; y <= years; y++) {
        var monthly = sip * Math.pow(1 + step, y - 1);
        totalInv += monthly * 12;
        corpus = corpus * (1 + rate / 100) + sipFv(monthly, rate, 12);
        rows += "<tr><td>" + y + "</td><td>" + fmt(monthly) + "</td><td>" + fmt(totalInv) + "</td><td>" + fmt(corpus) + "</td></tr>";
      }
      out.innerHTML =
        '<div class="fc-results">' +
        '<div class="fc-kpi"><label>Total invested</label><strong>' + fmt(totalInv) + "</strong></div>" +
        '<div class="fc-kpi"><label>Projected corpus</label><strong>' + fmt(corpus) + "</strong></div>" +
        '<div class="fc-kpi"><label>Wealth gained</label><strong>' + fmt(corpus - totalInv) + "</strong></div></div>" +
        '<table class="fc-ai-table"><thead><tr><th>Year</th><th>Monthly SIP</th><th>Invested</th><th>Corpus</th></tr></thead><tbody>' +
        rows +
        "</tbody></table>" +
        '<p class="fc-note">Projection with annual SIP step-up — illustrative only.</p>';
    });
  }

  function init() {
    document.querySelectorAll("[data-finance-ai]").forEach(function (root) {
      var mode = root.getAttribute("data-finance-ai");
      if (mode === "planner") bindPlanner(root);
      else if (mode === "projection") bindProjection(root);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
