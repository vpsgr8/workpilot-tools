(function () {
  "use strict";

  function num(v) {
    return Number(v) || 0;
  }

  function fmt(n, dec) {
    dec = dec == null ? 0 : dec;
    return "₹" + num(n).toLocaleString("en-IN", { maximumFractionDigits: dec, minimumFractionDigits: dec });
  }

  function pct(n) {
    return num(n).toFixed(2) + "%";
  }

  function emi(principal, annualRate, months) {
    principal = num(principal);
    months = num(months) || 1;
    var r = num(annualRate) / 12 / 100;
    if (!principal || !months) return 0;
    if (!r) return principal / months;
    var pow = Math.pow(1 + r, months);
    return (principal * r * pow) / (pow - 1);
  }

  function fv(pv, rate, years, n) {
    n = n || 1;
    return pv * Math.pow(1 + rate / 100 / n, n * years);
  }

  function sipFv(pmt, rate, months) {
    var r = rate / 12 / 100;
    if (!pmt || !months) return 0;
    if (!r) return pmt * months;
    return pmt * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  }

  function plfForAge(age) {
    age = num(age) || 62;
    if (age >= 80) return 0.65;
    if (age >= 75) return 0.58;
    if (age >= 70) return 0.52;
    if (age >= 65) return 0.45;
    return 0.4;
  }

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function parseCfg(root) {
    try {
      return JSON.parse(root.getAttribute("data-fc-config") || "{}");
    } catch (e) {
      return {};
    }
  }

  function kpis(items) {
    var box = el("div", "fc-results");
    items.forEach(function (item) {
      var k = el("div", "fc-kpi");
      k.appendChild(el("label", "", item[0]));
      k.appendChild(el("strong", "", item[1]));
      box.appendChild(k);
    });
    return box;
  }

  function bindForm(root, cfg, fields, compute, note) {
    root.innerHTML = "";
    root.className = "fc-widget";
    var form = el("form", "fc-form");
    fields.forEach(function (f) {
      var lab = el("label", "", f.label);
      var inp;
      if (f.type === "select") {
        inp = el("select", "");
        inp.name = f.name;
        f.options.forEach(function (o) {
          var opt = el("option", "", o.label);
          opt.value = o.value;
          if (String(o.value) === String(f.value)) opt.selected = true;
          inp.appendChild(opt);
        });
      } else {
        inp = el("input", "");
        inp.type = f.type || "number";
        inp.name = f.name;
        if (f.min != null) inp.min = f.min;
        if (f.max != null) inp.max = f.max;
        if (f.step != null) inp.step = f.step;
        inp.value = f.value;
      }
      lab.appendChild(inp);
      form.appendChild(lab);
    });
    form.appendChild(el("button", "fc-btn", "Calculate"));
    var results = el("div", "fc-results");
    root.appendChild(form);
    root.appendChild(results);
    root.appendChild(el("p", "fc-note", note || "Estimates only — verify with your bank, broker, or tax advisor."));

    function run() {
      var fd = new FormData(form);
      var data = {};
      fields.forEach(function (f) {
        data[f.name] = fd.get(f.name);
      });
      results.innerHTML = "";
      var out = compute(data, cfg) || [];
      out.forEach(function (item) {
        var k = el("div", "fc-kpi");
        k.appendChild(el("label", "", item[0]));
        k.appendChild(el("strong", "", item[1]));
        results.appendChild(k);
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      run();
    });
    run();
  }

  var FX = { USD: 83.5, EUR: 90.2, GBP: 105.4, AED: 22.7, SGD: 62.1, JPY: 0.56 };

  var HANDLERS = {
    emi: function (root, cfg) {
      bindForm(
        root,
        cfg,
        [
          { label: "Loan amount (₹)", name: "amount", value: cfg.defaultAmount || 1000000, step: 1000 },
          { label: "Interest rate (% p.a.)", name: "rate", value: cfg.defaultRate || 10, step: 0.1 },
          { label: "Tenure (years)", name: "years", value: cfg.defaultYears || 5, min: 1, max: 40 },
        ].concat(
          cfg.downPayment
            ? [{ label: "Down payment (₹)", name: "down", value: cfg.defaultDown || 0, step: 1000 }]
            : []
        ),
        function (d) {
          var principal = num(d.amount) - (cfg.downPayment ? num(d.down) : 0);
          principal = Math.max(0, principal);
          var months = num(d.years) * 12;
          var monthly = emi(principal, d.rate, months);
          var total = monthly * months;
          return [
            ["Monthly EMI", fmt(monthly, 0)],
            ["Total interest", fmt(total - principal, 0)],
            ["Total payment", fmt(total, 0)],
            ["Principal", fmt(principal, 0)],
          ];
        },
        "Loan EMI calculator — compare tenure and rate."
      );
    },

    sip: function (root, cfg) {
      bindForm(
        root,
        cfg,
        [
          { label: "Monthly SIP (₹)", name: "sip", value: 10000, step: 500 },
          { label: "Expected return (% p.a.)", name: "rate", value: 12, step: 0.5 },
          { label: "Investment period (years)", name: "years", value: 10, min: 1, max: 40 },
        ],
        function (d) {
          var months = num(d.years) * 12;
          var invested = num(d.sip) * months;
          var maturity = sipFv(num(d.sip), num(d.rate), months);
          return [
            ["Total invested", fmt(invested, 0)],
            ["Estimated maturity", fmt(maturity, 0)],
            ["Wealth gained", fmt(maturity - invested, 0)],
          ];
        }
      );
    },

    compound: function (root, cfg) {
      bindForm(
        root,
        cfg,
        [
          { label: cfg.label || "Principal (₹)", name: "pv", value: cfg.defaultPv || 100000, step: 1000 },
          { label: "Rate (% p.a.)", name: "rate", value: 8, step: 0.1 },
          { label: "Time (years)", name: "years", value: 10, min: 1 },
        ],
        function (d) {
          var n = cfg.quarterly ? 4 : 1;
          var maturity = fv(num(d.pv), num(d.rate), num(d.years), n);
          return [
            ["Maturity amount", fmt(maturity, 0)],
            ["Interest earned", fmt(maturity - num(d.pv), 0)],
            ["Effective return", pct(((maturity / num(d.pv) - 1) * 100) / num(d.years))],
          ];
        },
        cfg.quarterly ? "Quarterly compounding assumed." : "Annual compounding: FV = PV(1+r)^n"
      );
    },

    simple: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Principal (₹)", name: "pv", value: 100000, step: 1000 },
          { label: "Rate (% p.a.)", name: "rate", value: 6, step: 0.1 },
          { label: "Time (years)", name: "years", value: 3, min: 1 },
        ],
        function (d) {
          var interest = (num(d.pv) * num(d.rate) * num(d.years)) / 100;
          return [
            ["Simple interest", fmt(interest, 0)],
            ["Total amount", fmt(num(d.pv) + interest, 0)],
          ];
        },
        "SI = P × R × T / 100"
      );
    },

    pv: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Future value (₹)", name: "fv", value: 500000, step: 1000 },
          { label: "Discount rate (% p.a.)", name: "rate", value: 8, step: 0.1 },
          { label: "Years", name: "years", value: 10, min: 1 },
        ],
        function (d) {
          var present = num(d.fv) / Math.pow(1 + num(d.rate) / 100, num(d.years));
          return [
            ["Present value", fmt(present, 0)],
            ["Discount amount", fmt(num(d.fv) - present, 0)],
          ];
        },
        "PV = FV / (1+r)^n"
      );
    },

    cagr: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Beginning value (₹)", name: "pv", value: 100000, step: 1000 },
          { label: "Ending value (₹)", name: "fv", value: 250000, step: 1000 },
          { label: "Years", name: "years", value: 5, min: 1 },
        ],
        function (d) {
          var cagr = (Math.pow(num(d.fv) / num(d.pv), 1 / num(d.years)) - 1) * 100;
          return [
            ["CAGR", pct(cagr)],
            ["Absolute gain", fmt(num(d.fv) - num(d.pv), 0)],
            ["Gain %", pct(((num(d.fv) - num(d.pv)) / num(d.pv)) * 100)],
          ];
        }
      );
    },

    growth: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Initial investment (₹)", name: "init", value: 100000, step: 1000 },
          { label: "Monthly contribution (₹)", name: "sip", value: 5000, step: 500 },
          { label: "Return (% p.a.)", name: "rate", value: 12, step: 0.5 },
          { label: "Years", name: "years", value: 15, min: 1 },
        ],
        function (d) {
          var months = num(d.years) * 12;
          var lump = fv(num(d.init), num(d.rate), num(d.years));
          var sipPart = sipFv(num(d.sip), num(d.rate), months);
          var invested = num(d.init) + num(d.sip) * months;
          return [
            ["Total value", fmt(lump + sipPart, 0)],
            ["Total invested", fmt(invested, 0)],
            ["Growth", fmt(lump + sipPart - invested, 0)],
          ];
        }
      );
    },

    swp: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Corpus (₹)", name: "corpus", value: 5000000, step: 10000 },
          { label: "Monthly withdrawal (₹)", name: "withdraw", value: 40000, step: 1000 },
          { label: "Expected return (% p.a.)", name: "rate", value: 8, step: 0.5 },
        ],
        function (d) {
          var bal = num(d.corpus);
          var w = num(d.withdraw);
          var r = num(d.rate) / 12 / 100;
          var months = 0;
          while (bal > 0 && months < 600) {
            bal = bal * (1 + r) - w;
            months++;
            if (w <= 0) break;
          }
          return [
            ["Corpus lasts", months + " months (" + (months / 12).toFixed(1) + " yrs)"],
            ["Monthly withdrawal", fmt(w, 0)],
            ["Final balance", fmt(Math.max(0, bal), 0)],
          ];
        }
      );
    },

    rule72: function (root) {
      bindForm(
        root,
        {},
        [{ label: "Annual return (% p.a.)", name: "rate", value: 12, step: 0.5, min: 0.1 }],
        function (d) {
          var years = 72 / num(d.rate);
          return [
            ["Years to double", years.toFixed(1) + " years"],
            ["Rule of 72", "72 ÷ " + d.rate + " = " + years.toFixed(1)],
          ];
        }
      );
    },

    retirement: function (root, cfg) {
      bindForm(
        root,
        cfg,
        [
          { label: "Current age", name: "age", value: 30, min: 18, max: 70 },
          { label: "Retirement age", name: "retire", value: 60, min: 40, max: 80 },
          { label: "Monthly expenses today (₹)", name: "expense", value: 50000, step: 1000 },
          { label: "Inflation (% p.a.)", name: "infl", value: 6, step: 0.5 },
          { label: "Expected return (% p.a.)", name: "rate", value: 10, step: 0.5 },
        ],
        function (d) {
          var years = num(d.retire) - num(d.age);
          var futureExp = num(d.expense) * Math.pow(1 + num(d.infl) / 100, years);
          var corpus = futureExp * 12 * 25;
          var months = years * 12;
          var sipNeeded = months ? corpus / (months * 1.0) : 0;
          var sipCalc = sipFv(1000, num(d.rate), months);
          if (sipCalc) sipNeeded = (corpus / sipCalc) * 1000;
          return [
            ["Corpus needed (25× rule)", fmt(corpus, 0)],
            ["Monthly expenses at retirement", fmt(futureExp, 0)],
            ["Monthly SIP needed (approx.)", fmt(sipNeeded, 0)],
            ["Years to save", years + " years"],
          ];
        }
      );
    },

    fire: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Annual expenses (₹)", name: "expense", value: 600000, step: 10000 },
          { label: "Current savings (₹)", name: "saved", value: 2000000, step: 10000 },
          { label: "Monthly savings (₹)", name: "monthly", value: 80000, step: 5000 },
          { label: "Expected return (% p.a.)", name: "rate", value: 10, step: 0.5 },
        ],
        function (d) {
          var target = num(d.expense) * 25;
          var bal = num(d.saved);
          var m = num(d.monthly);
          var r = num(d.rate) / 12 / 100;
          var months = 0;
          while (bal < target && months < 1200) {
            bal = bal * (1 + r) + m;
            months++;
          }
          return [
            ["FIRE corpus (25× expenses)", fmt(target, 0)],
            ["Years to FIRE", (months / 12).toFixed(1) + " years"],
            ["Corpus at FIRE", fmt(bal, 0)],
          ];
        }
      );
    },

    irr: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Initial investment (₹)", name: "init", value: -100000, step: 1000 },
          { label: "Annual cash flow (₹)", name: "cf", value: 30000, step: 1000 },
          { label: "Years", name: "years", value: 5, min: 1 },
        ],
        function (d) {
          var guess = 0.1;
          for (var i = 0; i < 50; i++) {
            var npv = num(d.init);
            var dnpv = 0;
            for (var y = 1; y <= num(d.years); y++) {
              npv += num(d.cf) / Math.pow(1 + guess, y);
              dnpv -= (y * num(d.cf)) / Math.pow(1 + guess, y + 1);
            }
            if (!dnpv) break;
            guess -= npv / dnpv;
          }
          return [["IRR (approx.)", pct(guess * 100)]];
        }
      );
    },

    xirr: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Investment (₹)", name: "inv", value: 100000, step: 1000 },
          { label: "Current value (₹)", name: "val", value: 145000, step: 1000 },
          { label: "Years held", name: "years", value: 3, min: 0.5, step: 0.5 },
        ],
        function (d) {
          var cagr = (Math.pow(num(d.val) / num(d.inv), 1 / num(d.years)) - 1) * 100;
          return [
            ["XIRR (approx.)", pct(cagr)],
            ["Gain", fmt(num(d.val) - num(d.inv), 0)],
          ];
        },
        "Simplified XIRR using CAGR when cash flows are lump-sum."
      );
    },

    eligibility: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Monthly net income (₹)", name: "income", value: 80000, step: 1000 },
          { label: "Existing EMIs (₹)", name: "emi", value: 10000, step: 500 },
          { label: "FOIR limit (%)", name: "foir", value: 50, min: 30, max: 70 },
          { label: "Interest rate (% p.a.)", name: "rate", value: 9, step: 0.1 },
          { label: "Tenure (years)", name: "years", value: 20, min: 1 },
        ],
        function (d) {
          var maxEmi = num(d.income) * (num(d.foir) / 100) - num(d.emi);
          maxEmi = Math.max(0, maxEmi);
          var months = num(d.years) * 12;
          var r = num(d.rate) / 12 / 100;
          var loan = r ? (maxEmi * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months)) : maxEmi * months;
          return [
            ["Max eligible EMI", fmt(maxEmi, 0)],
            ["Max loan amount", fmt(loan, 0)],
          ];
        }
      );
    },

    affordability: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Affordable monthly EMI (₹)", name: "emi", value: 25000, step: 500 },
          { label: "Interest rate (% p.a.)", name: "rate", value: 9, step: 0.1 },
          { label: "Tenure (years)", name: "years", value: 15, min: 1 },
        ],
        function (d) {
          var months = num(d.years) * 12;
          var r = num(d.rate) / 12 / 100;
          var loan = r ? (num(d.emi) * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months)) : num(d.emi) * months;
          return [
            ["Affordable loan", fmt(loan, 0)],
            ["Total payment", fmt(num(d.emi) * months, 0)],
          ];
        }
      );
    },

    compare: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Loan A amount (₹)", name: "a1", value: 5000000, step: 10000 },
          { label: "Loan A rate (%)", name: "r1", value: 8.5, step: 0.1 },
          { label: "Loan A tenure (yrs)", name: "y1", value: 20, min: 1 },
          { label: "Loan B amount (₹)", name: "a2", value: 5000000, step: 10000 },
          { label: "Loan B rate (%)", name: "r2", value: 8.9, step: 0.1 },
          { label: "Loan B tenure (yrs)", name: "y2", value: 20, min: 1 },
        ],
        function (d) {
          var e1 = emi(d.a1, d.r1, num(d.y1) * 12);
          var e2 = emi(d.a2, d.r2, num(d.y2) * 12);
          var t1 = e1 * num(d.y1) * 12;
          var t2 = e2 * num(d.y2) * 12;
          var better = e1 <= e2 ? "Loan A" : "Loan B";
          return [
            ["Loan A EMI", fmt(e1, 0)],
            ["Loan B EMI", fmt(e2, 0)],
            ["Loan A total cost", fmt(t1, 0)],
            ["Loan B total cost", fmt(t2, 0)],
            ["Lower EMI", better],
          ];
        }
      );
    },

    prepay: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Outstanding loan (₹)", name: "bal", value: 3000000, step: 10000 },
          { label: "Interest rate (% p.a.)", name: "rate", value: 8.5, step: 0.1 },
          { label: "Remaining tenure (years)", name: "years", value: 15, min: 1 },
          { label: "Prepayment amount (₹)", name: "prepay", value: 500000, step: 10000 },
        ],
        function (d) {
          var months = num(d.years) * 12;
          var monthly = emi(d.bal, d.rate, months);
          var newBal = Math.max(0, num(d.bal) - num(d.prepay));
          var newEmi = emi(newBal, d.rate, months);
          var saved = monthly * months - (newEmi * months + num(d.prepay));
          return [
            ["Current EMI", fmt(monthly, 0)],
            ["New EMI after prepay", fmt(newEmi, 0)],
            ["Interest saved (approx.)", fmt(Math.max(0, saved), 0)],
          ];
        }
      );
    },

    balance: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Original loan (₹)", name: "loan", value: 5000000, step: 10000 },
          { label: "Interest rate (% p.a.)", name: "rate", value: 8.5, step: 0.1 },
          { label: "Total tenure (years)", name: "years", value: 20, min: 1 },
          { label: "EMIs paid so far", name: "paid", value: 60, min: 0 },
        ],
        function (d) {
          var months = num(d.years) * 12;
          var r = num(d.rate) / 12 / 100;
          var monthly = emi(d.loan, d.rate, months);
          var bal = num(d.loan);
          for (var i = 0; i < num(d.paid); i++) {
            var interest = bal * r;
            bal -= monthly - interest;
          }
          return [
            ["Outstanding balance", fmt(Math.max(0, bal), 0)],
            ["EMIs remaining", Math.max(0, months - num(d.paid)) + ""],
            ["Monthly EMI", fmt(monthly, 0)],
          ];
        }
      );
    },

    reverse: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Home value (₹)", name: "value", value: 6000000, step: 10000 },
          { label: "Borrower age", name: "age", value: 65, min: 55, max: 90 },
          { label: "Interest rate (% p.a.)", name: "rate", value: 9, step: 0.1 },
          { label: "Tenure (years)", name: "years", value: 15, min: 5 },
        ],
        function (d) {
          var maxLoan = num(d.value) * plfForAge(d.age);
          var months = num(d.years) * 12;
          return [
            ["Est. max loan", fmt(maxLoan, 0)],
            ["Monthly payout", fmt(months ? maxLoan / months : 0, 0)],
            ["PLF used", Math.round(plfForAge(d.age) * 100) + "%"],
          ];
        }
      );
    },

    equity: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Home value (₹)", name: "value", value: 8000000, step: 10000 },
          { label: "Outstanding mortgage (₹)", name: "owed", value: 4500000, step: 10000 },
          { label: "Max LTV (%)", name: "ltv", value: 75, min: 50, max: 90 },
        ],
        function (d) {
          var equity = Math.max(0, num(d.value) - num(d.owed));
          var borrow = Math.max(0, num(d.value) * (num(d.ltv) / 100) - num(d.owed));
          return [
            ["Total equity", fmt(equity, 0)],
            ["Available to borrow", fmt(borrow, 0)],
            ["Equity %", num(d.value) ? Math.round((equity / num(d.value)) * 100) + "%" : "—"],
          ];
        }
      );
    },

    gst: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Amount (₹)", name: "amount", value: 10000, step: 100 },
          { label: "GST rate (%)", name: "rate", type: "select", value: "18", options: [
            { label: "5%", value: "5" }, { label: "12%", value: "12" },
            { label: "18%", value: "18" }, { label: "28%", value: "28" },
          ]},
          { label: "Mode", name: "mode", type: "select", value: "add", options: [
            { label: "Add GST to base", value: "add" },
            { label: "Remove GST from total", value: "remove" },
          ]},
        ],
        function (d) {
          var amt = num(d.amount);
          var rate = num(d.rate) / 100;
          if (d.mode === "remove") {
            var base = amt / (1 + rate);
            return [
              ["Base amount", fmt(base, 2)],
              ["GST amount", fmt(amt - base, 2)],
              ["Total (incl. GST)", fmt(amt, 2)],
            ];
          }
          var gst = amt * rate;
          return [
            ["Base amount", fmt(amt, 2)],
            ["GST amount", fmt(gst, 2)],
            ["Total (incl. GST)", fmt(amt + gst, 2)],
          ];
        }
      );
    },

    "income-tax": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Annual income (₹)", name: "income", value: 1200000, step: 10000 },
          { label: "Deductions 80C etc. (₹)", name: "ded", value: 150000, step: 5000 },
          { label: "Regime", name: "regime", type: "select", value: "new", options: [
            { label: "New regime", value: "new" },
            { label: "Old regime", value: "old" },
          ]},
        ],
        function (d) {
          var taxable = Math.max(0, num(d.income) - (d.regime === "old" ? num(d.ded) : 75000));
          var tax = 0;
          if (d.regime === "new") {
            if (taxable > 300000) tax += Math.min(taxable - 300000, 300000) * 0.05;
            if (taxable > 600000) tax += Math.min(taxable - 600000, 300000) * 0.1;
            if (taxable > 900000) tax += Math.min(taxable - 900000, 300000) * 0.15;
            if (taxable > 1200000) tax += Math.min(taxable - 1200000, 300000) * 0.2;
            if (taxable > 1500000) tax += (taxable - 1500000) * 0.3;
          } else {
            if (taxable > 250000) tax += Math.min(taxable - 250000, 250000) * 0.05;
            if (taxable > 500000) tax += Math.min(taxable - 500000, 250000) * 0.2;
            if (taxable > 1000000) tax += (taxable - 1000000) * 0.3;
          }
          tax *= 1.04;
          return [
            ["Taxable income", fmt(taxable, 0)],
            ["Estimated tax", fmt(tax, 0)],
            ["Monthly tax", fmt(tax / 12, 0)],
          ];
        },
        "Simplified FY slabs — consult a CA for exact liability."
      );
    },

    "tax-regime": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Annual income (₹)", name: "income", value: 1500000, step: 10000 },
          { label: "Deductions (old regime) (₹)", name: "ded", value: 200000, step: 5000 },
        ],
        function (d) {
          var inc = num(d.income);
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
            var t = 0, taxable = Math.max(0, x - num(d.ded));
            if (taxable > 250000) t += Math.min(taxable - 250000, 250000) * 0.05;
            if (taxable > 500000) t += Math.min(taxable - 500000, 250000) * 0.2;
            if (taxable > 1000000) t += (taxable - 1000000) * 0.3;
            return t * 1.04;
          }
          var n = taxNew(inc), o = taxOld(inc);
          return [
            ["New regime tax", fmt(n, 0)],
            ["Old regime tax", fmt(o, 0)],
            ["Better regime", n <= o ? "New regime" : "Old regime"],
            ["Savings", fmt(Math.abs(n - o), 0)],
          ];
        }
      );
    },

    "capital-gains": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Buy price (₹)", name: "buy", value: 100000, step: 1000 },
          { label: "Sell price (₹)", name: "sell", value: 150000, step: 1000 },
          { label: "Holding (years)", name: "years", value: 2, min: 0, step: 0.5 },
        ],
        function (d) {
          var gain = num(d.sell) - num(d.buy);
          var ltcg = num(d.years) >= 1;
          var tax = ltcg ? Math.max(0, gain - 125000) * 0.125 : gain * 0.15;
          return [
            ["Capital gain", fmt(gain, 0)],
            ["Type", ltcg ? "LTCG (equity)" : "STCG"],
            ["Est. tax", fmt(Math.max(0, tax), 0)],
          ];
        }
      );
    },

    tds: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Payment amount (₹)", name: "amt", value: 100000, step: 1000 },
          { label: "TDS rate (%)", name: "rate", value: 10, step: 0.5 },
        ],
        function (d) {
          var tds = num(d.amt) * (num(d.rate) / 100);
          return [
            ["TDS deducted", fmt(tds, 0)],
            ["Net payment", fmt(num(d.amt) - tds, 0)],
          ];
        }
      );
    },

    hra: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Basic salary (monthly ₹)", name: "basic", value: 40000, step: 1000 },
          { label: "HRA received (monthly ₹)", name: "hra", value: 20000, step: 1000 },
          { label: "Rent paid (monthly ₹)", name: "rent", value: 18000, step: 1000 },
          { label: "Metro city?", name: "metro", type: "select", value: "yes", options: [
            { label: "Yes (50% of basic)", value: "yes" },
            { label: "No (40% of basic)", value: "no" },
          ]},
        ],
        function (d) {
          var a = num(d.hra);
          var b = num(d.rent) - 0.1 * num(d.basic);
          var c = num(d.basic) * (d.metro === "yes" ? 0.5 : 0.4);
          var exempt = Math.min(a, Math.max(0, b), c) * 12;
          return [
            ["Annual HRA exemption", fmt(exempt, 0)],
            ["Taxable HRA (approx.)", fmt(Math.max(0, num(d.hra) * 12 - exempt), 0)],
          ];
        }
      );
    },

    "advance-tax": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Estimated annual tax (₹)", name: "tax", value: 200000, step: 5000 },
          { label: "TDS already paid (₹)", name: "tds", value: 50000, step: 5000 },
        ],
        function (d) {
          var due = Math.max(0, num(d.tax) - num(d.tds));
          return [
            ["Advance tax due", fmt(due, 0)],
            ["15% by Jun 15", fmt(due * 0.15, 0)],
            ["45% by Sep 15", fmt(due * 0.45, 0)],
            ["75% by Dec 15", fmt(due * 0.75, 0)],
            ["100% by Mar 15", fmt(due, 0)],
          ];
        }
      );
    },

    "prof-tax": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Monthly gross salary (₹)", name: "salary", value: 50000, step: 1000 },
          { label: "State", name: "state", type: "select", value: "mh", options: [
            { label: "Maharashtra", value: "mh" },
            { label: "Karnataka", value: "ka" },
            { label: "Other (₹200/mo max)", value: "other" },
          ]},
        ],
        function (d) {
          var s = num(d.salary);
          var pt = 0;
          if (d.state === "mh") pt = s <= 7500 ? 0 : s <= 10000 ? 175 : 200;
          else if (d.state === "ka") pt = s <= 15000 ? 0 : 200;
          else pt = s > 15000 ? 200 : 0;
          return [
            ["Professional tax (monthly)", fmt(pt, 0)],
            ["Annual professional tax", fmt(pt * 12, 0)],
          ];
        }
      );
    },

    "in-hand": function (root, cfg) {
      bindForm(
        root,
        cfg,
        [
          { label: "Annual CTC (₹)", name: "ctc", value: 1200000, step: 10000 },
          { label: "Employee PF (monthly ₹)", name: "pf", value: 1800, step: 100 },
          { label: "Est. annual tax (₹)", name: "tax", value: 80000, step: 5000 },
        ],
        function (d) {
          var monthly = num(d.ctc) / 12;
          var deductions = num(d.pf) + num(d.tax) / 12;
          var inHand = monthly - deductions;
          return [
            ["Monthly gross", fmt(monthly, 0)],
            ["Monthly in-hand (approx.)", fmt(inHand, 0)],
            ["Annual in-hand", fmt(inHand * 12, 0)],
          ];
        }
      );
    },

    hike: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Old CTC (₹)", name: "old", value: 1000000, step: 10000 },
          { label: "New CTC (₹)", name: "new", value: 1200000, step: 10000 },
        ],
        function (d) {
          var hike = ((num(d.new) - num(d.old)) / num(d.old)) * 100;
          return [
            ["Hike amount", fmt(num(d.new) - num(d.old), 0)],
            ["Hike %", pct(hike)],
            ["Old monthly", fmt(num(d.old) / 12, 0)],
            ["New monthly", fmt(num(d.new) / 12, 0)],
          ];
        }
      );
    },

    overtime: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Hourly rate (₹)", name: "rate", value: 500, step: 10 },
          { label: "Overtime hours", name: "hours", value: 10, min: 0, step: 0.5 },
          { label: "OT multiplier", name: "mult", value: 2, step: 0.5 },
        ],
        function (d) {
          var pay = num(d.rate) * num(d.hours) * num(d.mult);
          return [["Overtime pay", fmt(pay, 0)]];
        }
      );
    },

    freelance: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Target annual income (₹)", name: "target", value: 2400000, step: 10000 },
          { label: "Billable hours/week", name: "hours", value: 30, min: 1 },
          { label: "Weeks/year", name: "weeks", value: 48, min: 1 },
        ],
        function (d) {
          var totalHours = num(d.hours) * num(d.weeks);
          var rate = totalHours ? num(d.target) / totalHours : 0;
          return [
            ["Required hourly rate", fmt(rate, 0)],
            ["Daily rate (8 hr)", fmt(rate * 8, 0)],
          ];
        }
      );
    },

    hourly: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Annual salary / income (₹)", name: "annual", value: 1200000, step: 10000 },
          { label: "Hours per week", name: "hours", value: 40, min: 1 },
        ],
        function (d) {
          var hourly = num(d.annual) / (num(d.hours) * 52);
          return [
            ["Hourly rate", fmt(hourly, 0)],
            ["Daily rate (8 hr)", fmt(hourly * 8, 0)],
          ];
        }
      );
    },

    commission: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Sales amount (₹)", name: "sales", value: 500000, step: 1000 },
          { label: "Commission rate (%)", name: "rate", value: 5, step: 0.5 },
        ],
        function (d) {
          var comm = num(d.sales) * (num(d.rate) / 100);
          return [["Commission earned", fmt(comm, 0)]];
        }
      );
    },

    bonus: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Annual CTC (₹)", name: "ctc", value: 1000000, step: 10000 },
          { label: "Bonus (% of CTC)", name: "pct", value: 10, step: 1 },
          { label: "Tax on bonus (%)", name: "tax", value: 30, step: 1 },
        ],
        function (d) {
          var bonus = num(d.ctc) * (num(d.pct) / 100);
          var net = bonus * (1 - num(d.tax) / 100);
          return [
            ["Gross bonus", fmt(bonus, 0)],
            ["Net bonus (after tax)", fmt(net, 0)],
          ];
        }
      );
    },

    "margin-pct": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Revenue (₹)", name: "rev", value: 1000000, step: 1000 },
          { label: "Net profit (₹)", name: "profit", value: 150000, step: 1000 },
        ],
        function (d) {
          var m = num(d.rev) ? (num(d.profit) / num(d.rev)) * 100 : 0;
          return [["Net profit margin", pct(m)]];
        }
      );
    },

    "gross-profit": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Revenue (₹)", name: "rev", value: 1000000, step: 1000 },
          { label: "COGS (₹)", name: "cogs", value: 600000, step: 1000 },
        ],
        function (d) {
          var gp = num(d.rev) - num(d.cogs);
          return [
            ["Gross profit", fmt(gp, 0)],
            ["Gross margin", pct(num(d.rev) ? (gp / num(d.rev)) * 100 : 0)],
          ];
        }
      );
    },

    "net-profit": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Revenue (₹)", name: "rev", value: 1000000, step: 1000 },
          { label: "Total expenses (₹)", name: "exp", value: 850000, step: 1000 },
        ],
        function (d) {
          var np = num(d.rev) - num(d.exp);
          return [
            ["Net profit", fmt(np, 0)],
            ["Net margin", pct(num(d.rev) ? (np / num(d.rev)) * 100 : 0)],
          ];
        }
      );
    },

    "breakeven-biz": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Fixed costs (₹)", name: "fixed", value: 200000, step: 1000 },
          { label: "Price per unit (₹)", name: "price", value: 500, step: 1 },
          { label: "Variable cost per unit (₹)", name: "var", value: 300, step: 1 },
        ],
        function (d) {
          var contrib = num(d.price) - num(d.var);
          var units = contrib > 0 ? num(d.fixed) / contrib : 0;
          return [
            ["Break-even units", Math.ceil(units) + ""],
            ["Break-even revenue", fmt(units * num(d.price), 0)],
          ];
        }
      );
    },

    roi: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Gain from investment (₹)", name: "gain", value: 50000, step: 1000 },
          { label: "Cost of investment (₹)", name: "cost", value: 200000, step: 1000 },
        ],
        function (d) {
          var roi = num(d.cost) ? (num(d.gain) / num(d.cost)) * 100 : 0;
          return [["ROI", pct(roi)]];
        }
      );
    },

    roe: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Net income (₹)", name: "ni", value: 500000, step: 1000 },
          { label: "Shareholders' equity (₹)", name: "eq", value: 2500000, step: 1000 },
        ],
        function (d) {
          return [["ROE", pct(num(d.eq) ? (num(d.ni) / num(d.eq)) * 100 : 0)]];
        }
      );
    },

    roce: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "EBIT (₹)", name: "ebit", value: 800000, step: 1000 },
          { label: "Capital employed (₹)", name: "cap", value: 4000000, step: 1000 },
        ],
        function (d) {
          return [["ROCE", pct(num(d.cap) ? (num(d.ebit) / num(d.cap)) * 100 : 0)]];
        }
      );
    },

    "working-capital": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Current assets (₹)", name: "ca", value: 3000000, step: 10000 },
          { label: "Current liabilities (₹)", name: "cl", value: 1500000, step: 10000 },
        ],
        function (d) {
          var wc = num(d.ca) - num(d.cl);
          return [["Working capital", fmt(wc, 0)]];
        }
      );
    },

    "cash-flow": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Cash inflows (₹)", name: "in", value: 500000, step: 1000 },
          { label: "Cash outflows (₹)", name: "out", value: 420000, step: 1000 },
        ],
        function (d) {
          var cf = num(d.in) - num(d.out);
          return [["Net cash flow", fmt(cf, 0)]];
        }
      );
    },

    valuation: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Annual profit (₹)", name: "profit", value: 2000000, step: 10000 },
          { label: "Revenue multiple", name: "mult", value: 3, step: 0.5 },
        ],
        function (d) {
          return [["Business valuation (approx.)", fmt(num(d.profit) * num(d.mult), 0)]];
        }
      );
    },

    inventory: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "COGS (annual ₹)", name: "cogs", value: 2400000, step: 10000 },
          { label: "Average inventory (₹)", name: "inv", value: 400000, step: 1000 },
        ],
        function (d) {
          var turns = num(d.inv) ? num(d.cogs) / num(d.inv) : 0;
          return [
            ["Inventory turnover", turns.toFixed(2) + "×"],
            ["Days inventory", turns ? (365 / turns).toFixed(0) + " days" : "—"],
          ];
        }
      );
    },

    "debt-equity": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Total debt (₹)", name: "debt", value: 3000000, step: 10000 },
          { label: "Total equity (₹)", name: "eq", value: 5000000, step: 10000 },
        ],
        function (d) {
          return [["Debt-to-equity ratio", num(d.eq) ? (num(d.debt) / num(d.eq)).toFixed(2) : "—"]];
        }
      );
    },

    burn: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Monthly expenses (₹)", name: "exp", value: 800000, step: 10000 },
          { label: "Monthly revenue (₹)", name: "rev", value: 300000, step: 10000 },
        ],
        function (d) {
          var burn = num(d.exp) - num(d.rev);
          return [["Net burn (monthly)", fmt(burn, 0)]];
        }
      );
    },

    runway: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Cash balance (₹)", name: "cash", value: 10000000, step: 100000 },
          { label: "Monthly net burn (₹)", name: "burn", value: 500000, step: 10000 },
        ],
        function (d) {
          var months = num(d.burn) ? num(d.cash) / num(d.burn) : 0;
          return [
            ["Runway", months.toFixed(1) + " months"],
            ["Runway (years)", (months / 12).toFixed(1) + " years"],
          ];
        }
      );
    },

    pricing: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Cost per unit (₹)", name: "cost", value: 400, step: 1 },
          { label: "Target margin (%)", name: "margin", value: 30, step: 1 },
          { label: "GST (%)", name: "gst", value: 18, step: 1 },
        ],
        function (d) {
          var price = num(d.cost) / (1 - num(d.margin) / 100);
          var withGst = price * (1 + num(d.gst) / 100);
          return [
            ["Selling price (excl. GST)", fmt(price, 2)],
            ["MRP (incl. GST)", fmt(withGst, 2)],
          ];
        }
      );
    },

    fd: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Deposit amount (₹)", name: "amt", value: 500000, step: 1000 },
          { label: "Interest rate (% p.a.)", name: "rate", value: 7, step: 0.1 },
          { label: "Tenure (years)", name: "years", value: 5, min: 1 },
        ],
        function (d) {
          var maturity = fv(num(d.amt), num(d.rate), num(d.years), 4);
          return [
            ["Maturity amount", fmt(maturity, 0)],
            ["Interest earned", fmt(maturity - num(d.amt), 0)],
          ];
        },
        "Quarterly compounding assumed for FD."
      );
    },

    rd: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Monthly deposit (₹)", name: "dep", value: 5000, step: 500 },
          { label: "Interest rate (% p.a.)", name: "rate", value: 6.5, step: 0.1 },
          { label: "Tenure (years)", name: "years", value: 3, min: 1 },
        ],
        function (d) {
          var maturity = sipFv(num(d.dep), num(d.rate), num(d.years) * 12);
          var invested = num(d.dep) * num(d.years) * 12;
          return [
            ["Maturity amount", fmt(maturity, 0)],
            ["Total deposited", fmt(invested, 0)],
            ["Interest earned", fmt(maturity - invested, 0)],
          ];
        }
      );
    },

    "cc-payoff": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Outstanding balance (₹)", name: "bal", value: 100000, step: 1000 },
          { label: "Monthly payment (₹)", name: "pay", value: 10000, step: 500 },
          { label: "Interest rate (% p.a.)", name: "rate", value: 36, step: 1 },
        ],
        function (d) {
          var bal = num(d.bal);
          var pay = num(d.pay);
          var r = num(d.rate) / 12 / 100;
          var months = 0;
          var totalInt = 0;
          while (bal > 0 && months < 600) {
            var interest = bal * r;
            totalInt += interest;
            bal = bal + interest - pay;
            months++;
          }
          return [
            ["Months to payoff", months + ""],
            ["Total interest paid", fmt(totalInt, 0)],
          ];
        }
      );
    },

    currency: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Amount", name: "amt", value: 1000, step: 1 },
          { label: "From", name: "from", type: "select", value: "USD", options: Object.keys(FX).map(function (k) { return { label: k, value: k }; }).concat([{ label: "INR", value: "INR" }]) },
          { label: "To", name: "to", type: "select", value: "INR", options: Object.keys(FX).map(function (k) { return { label: k, value: k }; }).concat([{ label: "INR", value: "INR" }]) },
        ],
        function (d) {
          var amt = num(d.amt);
          var fromInr = d.from === "INR" ? amt : amt * (FX[d.from] || 1);
          var result = d.to === "INR" ? fromInr : fromInr / (FX[d.to] || 1);
          return [
            ["Converted amount", result.toFixed(2) + " " + d.to],
            ["Rate used (vs INR)", d.from === "INR" ? "1 INR" : FX[d.from] + " INR/" + d.from],
          ];
        },
        "Reference rates for planning — not live market rates."
      );
    },

    forex: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Lot size (units)", name: "lots", value: 10000, step: 1000 },
          { label: "Entry rate", name: "entry", value: 83.2, step: 0.01 },
          { label: "Exit rate", name: "exit", value: 83.8, step: 0.01 },
          { label: "Direction", name: "dir", type: "select", value: "long", options: [
            { label: "Long (buy)", value: "long" },
            { label: "Short (sell)", value: "short" },
          ]},
        ],
        function (d) {
          var diff = num(d.exit) - num(d.entry);
          if (d.dir === "short") diff = -diff;
          var pnl = diff * num(d.lots);
          return [["Forex P&L", fmt(pnl, 2)]];
        }
      );
    },

    exchange: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Amount", name: "amt", value: 100, step: 1 },
          { label: "Exchange rate", name: "rate", value: 83.5, step: 0.01 },
        ],
        function (d) {
          return [["Converted", fmt(num(d.amt) * num(d.rate), 2)]];
        }
      );
    },

    purchasing: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Amount in India (₹)", name: "inr", value: 1000, step: 100 },
          { label: "PPP factor (US=1)", name: "ppp", value: 0.35, step: 0.01 },
        ],
        function (d) {
          var us = num(d.inr) * num(d.ppp);
          return [
            ["Equivalent US purchasing power", "$" + us.toFixed(2)],
            ["Note", "PPP is illustrative, not live data"],
          ];
        }
      );
    },

    goal: function (root, cfg) {
      bindForm(
        root,
        cfg,
        [
          { label: "Goal amount today (₹)", name: "goal", value: cfg.goal === "education" ? 2500000 : 1500000, step: 10000 },
          { label: "Years until goal", name: "years", value: 10, min: 1 },
          { label: "Inflation (% p.a.)", name: "infl", value: 6, step: 0.5 },
          { label: "Expected return (% p.a.)", name: "rate", value: 12, step: 0.5 },
        ],
        function (d) {
          var future = num(d.goal) * Math.pow(1 + num(d.infl) / 100, num(d.years));
          var months = num(d.years) * 12;
          var sip = sipFv(1000, num(d.rate), months);
          var monthly = sip ? (future / sip) * 1000 : 0;
          return [
            ["Future cost (with inflation)", fmt(future, 0)],
            ["Monthly SIP needed", fmt(monthly, 0)],
          ];
        }
      );
    },

    emergency: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Monthly expenses (₹)", name: "exp", value: 50000, step: 1000 },
          { label: "Months of cover", name: "months", value: 6, min: 3, max: 24 },
        ],
        function (d) {
          return [["Emergency fund target", fmt(num(d.exp) * num(d.months), 0)]];
        }
      );
    },

    "net-worth": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Total assets (₹)", name: "assets", value: 5000000, step: 10000 },
          { label: "Total liabilities (₹)", name: "liab", value: 2000000, step: 10000 },
        ],
        function (d) {
          var nw = num(d.assets) - num(d.liab);
          return [
            ["Net worth", fmt(nw, 0)],
            ["Debt ratio", pct(num(d.assets) ? (num(d.liab) / num(d.assets)) * 100 : 0)],
          ];
        }
      );
    },

    inflation: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Cost today (₹)", name: "cost", value: 100000, step: 1000 },
          { label: "Inflation (% p.a.)", name: "infl", value: 6, step: 0.5 },
          { label: "Years", name: "years", value: 10, min: 1 },
        ],
        function (d) {
          var future = num(d.cost) * Math.pow(1 + num(d.infl) / 100, num(d.years));
          return [
            ["Future cost", fmt(future, 0)],
            ["Increase", fmt(future - num(d.cost), 0)],
          ];
        }
      );
    },

    "stock-avg": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Qty 1", name: "q1", value: 10, min: 1 },
          { label: "Price 1 (₹)", name: "p1", value: 100, step: 0.05 },
          { label: "Qty 2", name: "q2", value: 15, min: 0 },
          { label: "Price 2 (₹)", name: "p2", value: 120, step: 0.05 },
        ],
        function (d) {
          var q = num(d.q1) + num(d.q2);
          var avg = q ? (num(d.q1) * num(d.p1) + num(d.q2) * num(d.p2)) / q : 0;
          return [
            ["Total quantity", q + ""],
            ["Average price", "₹" + avg.toFixed(2)],
          ];
        }
      );
    },

    position: function (root, cfg) {
      bindForm(
        root,
        cfg,
        [
          { label: "Account size (₹)", name: "acct", value: 500000, step: 10000 },
          { label: "Risk per trade (%)", name: "risk", value: 1, step: 0.1 },
          { label: "Entry price (₹)", name: "entry", value: 100, step: 0.05 },
          { label: "Stop loss (₹)", name: "sl", value: 95, step: 0.05 },
        ],
        function (d) {
          var riskAmt = num(d.acct) * (num(d.risk) / 100);
          var perShare = Math.abs(num(d.entry) - num(d.sl));
          var qty = perShare ? Math.floor(riskAmt / perShare) : 0;
          return [
            ["Position size (shares)", qty + ""],
            ["Capital deployed", fmt(qty * num(d.entry), 0)],
            ["Risk amount", fmt(riskAmt, 0)],
          ];
        },
        cfg.index ? cfg.index + " position sizing." : "Risk-based position sizing."
      );
    },

    "risk-reward": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Entry (₹)", name: "entry", value: 100, step: 0.05 },
          { label: "Target (₹)", name: "target", value: 110, step: 0.05 },
          { label: "Stop loss (₹)", name: "sl", value: 95, step: 0.05 },
        ],
        function (d) {
          var reward = num(d.target) - num(d.entry);
          var risk = num(d.entry) - num(d.sl);
          var rr = risk ? reward / risk : 0;
          return [
            ["Risk (₹)", "₹" + risk.toFixed(2)],
            ["Reward (₹)", "₹" + reward.toFixed(2)],
            ["Risk : Reward", "1 : " + rr.toFixed(2)],
          ];
        }
      );
    },

    pnl: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Buy qty", name: "qty", value: 100, min: 1 },
          { label: "Buy price (₹)", name: "buy", value: 250, step: 0.05 },
          { label: "Sell price (₹)", name: "sell", value: 275, step: 0.05 },
        ],
        function (d) {
          var pnl = num(d.qty) * (num(d.sell) - num(d.buy));
          var pctVal = num(d.buy) ? ((num(d.sell) - num(d.buy)) / num(d.buy)) * 100 : 0;
          return [
            ["P&L", fmt(pnl, 2)],
            ["Return", pct(pctVal)],
          ];
        }
      );
    },

    brokerage: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Turnover (₹)", name: "turn", value: 100000, step: 1000 },
          { label: "Brokerage (%)", name: "brok", value: 0.03, step: 0.01 },
          { label: "Segment", name: "seg", type: "select", value: "delivery", options: [
            { label: "Delivery", value: "delivery" },
            { label: "Intraday", value: "intraday" },
          ]},
        ],
        function (d) {
          var brok = num(d.turn) * (num(d.brok) / 100);
          var stt = d.seg === "delivery" ? num(d.turn) * 0.001 : num(d.turn) * 0.00025;
          var gst = (brok + stt) * 0.18;
          return [
            ["Brokerage", fmt(brok, 2)],
            ["STT (approx.)", fmt(stt, 2)],
            ["GST on charges", fmt(gst, 2)],
            ["Total charges", fmt(brok + stt + gst, 2)],
          ];
        }
      );
    },

    margin: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Position value (₹)", name: "val", value: 500000, step: 1000 },
          { label: "Margin rate (%)", name: "rate", value: 20, step: 1 },
        ],
        function (d) {
          var margin = num(d.val) * (num(d.rate) / 100);
          return [
            ["Margin required", fmt(margin, 0)],
            ["Leverage", (100 / num(d.rate)).toFixed(1) + "×"],
          ];
        }
      );
    },

    futures: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Lot size", name: "lot", value: 50, min: 1 },
          { label: "Entry price", name: "entry", value: 22000, step: 1 },
          { label: "Exit price", name: "exit", value: 22100, step: 1 },
          { label: "Direction", name: "dir", type: "select", value: "long", options: [
            { label: "Long", value: "long" }, { label: "Short", value: "short" },
          ]},
        ],
        function (d) {
          var diff = num(d.exit) - num(d.entry);
          if (d.dir === "short") diff = -diff;
          return [["Futures P&L", fmt(diff * num(d.lot), 0)]];
        }
      );
    },

    options: function (root, cfg) {
      bindForm(
        root,
        cfg,
        [
          { label: "Premium paid (₹)", name: "prem", value: 150, step: 1 },
          { label: "Strike price", name: "strike", value: 22000, step: 1 },
          { label: "Spot at expiry", name: "spot", value: 22150, step: 1 },
          { label: "Type", name: "type", type: "select", value: "call", options: [
            { label: "Call", value: "call" }, { label: "Put", value: "put" },
          ]},
          { label: "Lots", name: "lots", value: 1, min: 1 },
        ],
        function (d) {
          var lot = cfg.index === "BANKNIFTY" ? 15 : 25;
          var intrinsic = d.type === "call"
            ? Math.max(0, num(d.spot) - num(d.strike))
            : Math.max(0, num(d.strike) - num(d.spot));
          var pnl = (intrinsic - num(d.prem)) * lot * num(d.lots);
          return [
            ["Intrinsic value", fmt(intrinsic, 2)],
            ["P&L at expiry", fmt(pnl, 0)],
          ];
        }
      );
    },

    "breakeven-trade": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Buy price (₹)", name: "buy", value: 100, step: 0.05 },
          { label: "Quantity", name: "qty", value: 100, min: 1 },
          { label: "Total charges (₹)", name: "ch", value: 50, step: 1 },
        ],
        function (d) {
          var be = num(d.buy) + num(d.ch) / num(d.qty);
          return [["Break-even price", "₹" + be.toFixed(2)]];
        }
      );
    },

    "div-yield": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Annual dividend per share (₹)", name: "div", value: 12, step: 0.5 },
          { label: "Share price (₹)", name: "price", value: 300, step: 0.05 },
        ],
        function (d) {
          return [["Dividend yield", pct(num(d.price) ? (num(d.div) / num(d.price)) * 100 : 0)]];
        }
      );
    },

    drip: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Initial investment (₹)", name: "init", value: 100000, step: 1000 },
          { label: "Annual dividend yield (%)", name: "yield", value: 3, step: 0.1 },
          { label: "Years", name: "years", value: 10, min: 1 },
          { label: "Price growth (% p.a.)", name: "growth", value: 8, step: 0.5 },
        ],
        function (d) {
          var val = num(d.init);
          for (var y = 0; y < num(d.years); y++) {
            var div = val * (num(d.yield) / 100);
            val = (val + div) * (1 + num(d.growth) / 100);
          }
          return [
            ["Value with DRIP", fmt(val, 0)],
            ["Gain", fmt(val - num(d.init), 0)],
          ];
        }
      );
    },

    allocation: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Total portfolio (₹)", name: "total", value: 1000000, step: 10000 },
          { label: "Equity (%)", name: "eq", value: 60, step: 1 },
          { label: "Debt (%)", name: "debt", value: 30, step: 1 },
          { label: "Gold (%)", name: "gold", value: 10, step: 1 },
        ],
        function (d) {
          var t = num(d.total);
          return [
            ["Equity", fmt(t * num(d.eq) / 100, 0)],
            ["Debt", fmt(t * num(d.debt) / 100, 0)],
            ["Gold", fmt(t * num(d.gold) / 100, 0)],
          ];
        }
      );
    },

    "stock-return": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Investment (₹)", name: "inv", value: 50000, step: 1000 },
          { label: "Current value (₹)", name: "val", value: 68000, step: 1000 },
        ],
        function (d) {
          var gain = num(d.val) - num(d.inv);
          return [
            ["Absolute return", fmt(gain, 0)],
            ["Return %", pct(num(d.inv) ? (gain / num(d.inv)) * 100 : 0)],
          ];
        }
      );
    },

    intraday: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Quantity", name: "qty", value: 200, min: 1 },
          { label: "Buy price (₹)", name: "buy", value: 150, step: 0.05 },
          { label: "Sell price (₹)", name: "sell", value: 153, step: 0.05 },
          { label: "Charges (₹)", name: "ch", value: 80, step: 1 },
        ],
        function (d) {
          var gross = num(d.qty) * (num(d.sell) - num(d.buy));
          return [
            ["Gross P&L", fmt(gross, 2)],
            ["Net P&L", fmt(gross - num(d.ch), 2)],
          ];
        }
      );
    },

    delivery: function (root) {
      HANDLERS.intraday(root, {});
    },

    journal: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Winning trades", name: "wins", value: 6, min: 0 },
          { label: "Losing trades", name: "losses", value: 4, min: 0 },
          { label: "Avg win (₹)", name: "avgW", value: 2500, step: 100 },
          { label: "Avg loss (₹)", name: "avgL", value: 1200, step: 100 },
        ],
        function (d) {
          var total = num(d.wins) + num(d.losses);
          var wr = total ? (num(d.wins) / total) * 100 : 0;
          var exp = (num(d.wins) * num(d.avgW) - num(d.losses) * num(d.avgL)) / (total || 1);
          return [
            ["Win rate", pct(wr)],
            ["Expectancy per trade", fmt(exp, 0)],
            ["Total trades", total + ""],
          ];
        }
      );
    },

    gann: function (root) {
      bindForm(
        root,
        {},
          [{ label: "Base price (₹)", name: "base", value: 100, step: 0.05 }],
        function (d) {
          var b = num(d.base);
          var rootVal = Math.sqrt(b);
          return [
            ["Square of 9 center", "₹" + b.toFixed(2)],
            ["+45° level", "₹" + Math.pow(rootVal + 0.5, 2).toFixed(2)],
            ["−45° level", "₹" + Math.pow(Math.max(0, rootVal - 0.5), 2).toFixed(2)],
          ];
        },
        "Simplified GANN square-of-9 levels."
      );
    },

    fibonacci: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Swing high (₹)", name: "high", value: 200, step: 0.05 },
          { label: "Swing low (₹)", name: "low", value: 150, step: 0.05 },
        ],
        function (d) {
          var range = num(d.high) - num(d.low);
          return [
            ["23.6%", "₹" + (num(d.high) - range * 0.236).toFixed(2)],
            ["38.2%", "₹" + (num(d.high) - range * 0.382).toFixed(2)],
            ["50%", "₹" + (num(d.high) - range * 0.5).toFixed(2)],
            ["61.8%", "₹" + (num(d.high) - range * 0.618).toFixed(2)],
          ];
        }
      );
    },

    pivot: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "High (₹)", name: "h", value: 105, step: 0.05 },
          { label: "Low (₹)", name: "l", value: 95, step: 0.05 },
          { label: "Close (₹)", name: "c", value: 102, step: 0.05 },
        ],
        function (d) {
          var p = (num(d.h) + num(d.l) + num(d.c)) / 3;
          return [
            ["Pivot", "₹" + p.toFixed(2)],
            ["R1", "₹" + (2 * p - num(d.l)).toFixed(2)],
            ["S1", "₹" + (2 * p - num(d.h)).toFixed(2)],
          ];
        }
      );
    },

    "risk-mgmt": function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Portfolio (₹)", name: "port", value: 1000000, step: 10000 },
          { label: "Max portfolio risk (%)", name: "risk", value: 5, step: 0.5 },
          { label: "Open positions", name: "pos", value: 5, min: 1 },
        ],
        function (d) {
          var total = num(d.port) * (num(d.risk) / 100);
          return [
            ["Max total risk", fmt(total, 0)],
            ["Risk per position", fmt(total / num(d.pos), 0)],
          ];
        }
      );
    },

    psychology: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Discipline (1-10)", name: "d", value: 7, min: 1, max: 10 },
          { label: "Patience (1-10)", name: "p", value: 6, min: 1, max: 10 },
          { label: "Risk control (1-10)", name: "r", value: 8, min: 1, max: 10 },
        ],
        function (d) {
          var score = (num(d.d) + num(d.p) + num(d.r)) / 3;
          var label = score >= 8 ? "Strong" : score >= 6 ? "Moderate" : "Needs work";
          return [
            ["Psychology score", score.toFixed(1) + " / 10"],
            ["Assessment", label],
          ];
        }
      );
    },

    rebalance: function (root) {
      bindForm(
        root,
        {},
        [
          { label: "Equity current (₹)", name: "eqC", value: 650000, step: 1000 },
          { label: "Debt current (₹)", name: "deC", value: 350000, step: 1000 },
          { label: "Target equity (%)", name: "eqT", value: 60, step: 1 },
        ],
        function (d) {
          var total = num(d.eqC) + num(d.deC);
          var eqTarget = total * (num(d.eqT) / 100);
          var diff = eqTarget - num(d.eqC);
          return [
            ["Total portfolio", fmt(total, 0)],
            ["Buy/sell equity", diff >= 0 ? "Buy " + fmt(diff, 0) : "Sell " + fmt(-diff, 0)],
          ];
        }
      );
    },
  };

  // Legacy aliases for existing mortgage pages
  HANDLERS.mortgage = function (r, c) { HANDLERS.emi(r, Object.assign({ defaultAmount: 6000000, defaultRate: 7.5, defaultYears: 20, downPayment: true, defaultDown: 600000 }, c)); };
  HANDLERS["home-loan"] = function (r, c) { HANDLERS.emi(r, Object.assign({ defaultAmount: 5000000, defaultRate: 8.5, defaultYears: 20 }, c)); };
  HANDLERS["car-loan"] = function (r, c) { HANDLERS.emi(r, Object.assign({ defaultAmount: 1200000, defaultRate: 9.5, defaultYears: 5, downPayment: true, defaultDown: 200000 }, c)); };
  HANDLERS["home-equity"] = HANDLERS.equity;
  HANDLERS["reverse-mortgage"] = HANDLERS.reverse;

  function init() {
    document.querySelectorAll("[data-finance-calc]").forEach(function (root) {
      var type = root.getAttribute("data-finance-calc");
      var cfg = parseCfg(root);
      if (HANDLERS[type]) HANDLERS[type](root, cfg);
      else {
        root.className = "fc-widget";
        root.innerHTML = "<p class=\"fc-note\">Calculator loading… If this persists, refresh the page.</p>";
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
