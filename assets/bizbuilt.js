(function () {
  var STORAGE_KEY = "bizbuilt-data-v1";
  var state = { view: "dashboard", data: null };

  var NAV = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "crm", icon: "👥", label: "CRM" },
    { id: "hr", icon: "🏢", label: "HR" },
    { id: "payroll", icon: "💰", label: "Payroll" },
    { id: "invoices", icon: "📄", label: "Invoices" },
    { id: "expenses", icon: "💳", label: "Expenses" },
    { id: "revenue", icon: "📈", label: "Revenue" },
    { id: "analytics", icon: "📉", label: "Growth Analytics" },
  ];

  var TITLES = {
    dashboard: "Business Overview",
    crm: "CRM — Leads & Clients",
    hr: "Human Resources",
    payroll: "Payroll",
    invoices: "Invoices",
    expenses: "Expenses",
    revenue: "Revenue Tracking",
    analytics: "Growth Analytics",
  };

  function defaultData() {
    return {
      company: "My SME",
      leads: [
        { id: 1, name: "Acme Corp", contact: "Raj Sharma", email: "raj@acme.in", stage: "lead", value: 85000 },
        { id: 2, name: "Bright Retail", contact: "Priya Nair", email: "priya@bright.in", stage: "won", value: 120000 },
        { id: 3, name: "TechStart Labs", contact: "Amit Verma", email: "amit@techstart.in", stage: "lead", value: 45000 },
      ],
      employees: [
        { id: 1, name: "Ananya Singh", role: "Sales Lead", dept: "Sales", join: "2023-04-01", salary: 55000 },
        { id: 2, name: "Vikram Patel", role: "Developer", dept: "Engineering", join: "2022-11-15", salary: 72000 },
        { id: 3, name: "Sneha Reddy", role: "Accountant", dept: "Finance", join: "2024-01-10", salary: 48000 },
      ],
      payrollRuns: [
        { id: 1, month: "2026-05", total: 175000, status: "paid", employees: 3 },
        { id: 2, month: "2026-06", total: 175000, status: "pending", employees: 3 },
      ],
      invoices: [
        { id: 1, client: "Bright Retail", amount: 120000, date: "2026-05-28", due: "2026-06-12", status: "paid" },
        { id: 2, client: "Acme Corp", amount: 45000, date: "2026-06-01", due: "2026-06-16", status: "pending" },
        { id: 3, client: "TechStart Labs", amount: 32000, date: "2026-05-15", due: "2026-05-30", status: "overdue" },
      ],
      expenses: [
        { id: 1, category: "Software", vendor: "SaaS Tools", amount: 8500, date: "2026-06-02" },
        { id: 2, category: "Marketing", vendor: "Google Ads", amount: 15000, date: "2026-06-05" },
        { id: 3, category: "Office", vendor: "WeWork", amount: 22000, date: "2026-06-01" },
        { id: 4, category: "Travel", vendor: "Client visit", amount: 4200, date: "2026-05-28" },
      ],
      revenue: [
        { month: "Jan", amount: 180000 },
        { month: "Feb", amount: 195000 },
        { month: "Mar", amount: 210000 },
        { month: "Apr", amount: 225000 },
        { month: "May", amount: 248000 },
        { month: "Jun", amount: 265000 },
      ],
      growth: [
        { month: "Jan", customers: 12, mrr: 180000 },
        { month: "Feb", customers: 14, mrr: 195000 },
        { month: "Mar", customers: 15, mrr: 210000 },
        { month: "Apr", customers: 17, mrr: 225000 },
        { month: "May", customers: 19, mrr: 248000 },
        { month: "Jun", customers: 21, mrr: 265000 },
      ],
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      state.data = raw ? JSON.parse(raw) : defaultData();
    } catch (e) {
      state.data = defaultData();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    } catch (e) {}
  }

  function fmt(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function sum(arr, key) {
    return arr.reduce(function (t, x) {
      return t + Number(x[key] || 0);
    }, 0);
  }

  function kpis() {
    var d = state.data;
    var rev = sum(d.revenue.slice(-1), "amount");
    var prev = d.revenue.length > 1 ? d.revenue[d.revenue.length - 2].amount : rev;
    var revDelta = prev ? (((rev - prev) / prev) * 100).toFixed(1) : 0;
    var exp = sum(d.expenses, "amount");
    var pipeline = sum(
      d.leads.filter(function (l) {
        return l.stage === "lead";
      }),
      "value"
    );
    return {
      revenue: rev,
      revDelta: revDelta,
      expenses: exp,
      profit: rev - exp,
      pipeline: pipeline,
      employees: d.employees.length,
      openInvoices: d.invoices.filter(function (i) {
        return i.status !== "paid";
      }).length,
    };
  }

  function lineChart(data, key, color, h) {
    h = h || 180;
    var w = 400;
    var pad = 24;
    var vals = data.map(function (d) {
      return Number(d[key]);
    });
    var max = Math.max.apply(null, vals.concat([1]));
    var min = Math.min.apply(null, vals.concat([0]));
    var range = max - min || 1;
    var pts = vals
      .map(function (v, i) {
        var x = pad + (i / Math.max(vals.length - 1, 1)) * (w - pad * 2);
        var y = h - pad - ((v - min) / range) * (h - pad * 2);
        return x + "," + y;
      })
      .join(" ");
    var labels = data
      .map(function (d, i) {
        var x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
        return (
          '<text x="' +
          x +
          '" y="' +
          (h - 4) +
          '" text-anchor="middle" font-size="10" fill="var(--bb-muted)">' +
          esc(d.month) +
          "</text>"
        );
      })
      .join("");
    return (
      '<svg class="bb-chart" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" preserveAspectRatio="none">' +
      '<polyline fill="none" stroke="' +
      color +
      '" stroke-width="2.5" points="' +
      pts +
      '"/>' +
      labels +
      "</svg>"
    );
  }

  function barChart(data, key, color) {
    var h = 180;
    var w = 400;
    var pad = 24;
    var vals = data.map(function (d) {
      return Number(d[key]);
    });
    var max = Math.max.apply(null, vals.concat([1]));
    var barW = (w - pad * 2) / vals.length - 6;
    var bars = vals
      .map(function (v, i) {
        var bh = ((v / max) * (h - pad * 2)) | 0;
        var x = pad + i * (barW + 6);
        var y = h - pad - bh;
        return (
          '<rect x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          barW +
          '" height="' +
          bh +
          '" fill="' +
          color +
          '" rx="4" opacity="0.85"/>' +
          '<text x="' +
          (x + barW / 2) +
          '" y="' +
          (h - 4) +
          '" text-anchor="middle" font-size="10" fill="var(--bb-muted)">' +
          esc(data[i].month) +
          "</text>"
        );
      })
      .join("");
    return (
      '<svg class="bb-chart" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" preserveAspectRatio="none">' +
      bars +
      "</svg>"
    );
  }

  function renderDashboard() {
    var k = kpis();
    return (
      '<div class="bb-kpi-grid">' +
      '<div class="bb-kpi"><label>Monthly Revenue</label><strong>' +
      fmt(k.revenue) +
      '</strong><div class="delta up">+' +
      k.revDelta +
      "% vs last month</div></div>" +
      '<div class="bb-kpi"><label>Expenses</label><strong>' +
      fmt(k.expenses) +
      "</strong></div>" +
      '<div class="bb-kpi"><label>Net Profit</label><strong>' +
      fmt(k.profit) +
      "</strong></div>" +
      '<div class="bb-kpi"><label>Pipeline Value</label><strong>' +
      fmt(k.pipeline) +
      "</strong></div>" +
      '<div class="bb-kpi"><label>Team Size</label><strong>' +
      k.employees +
      "</strong></div>" +
      '<div class="bb-kpi"><label>Open Invoices</label><strong>' +
      k.openInvoices +
      "</strong></div></div>" +
      '<div class="bb-grid-2">' +
      '<div class="bb-card"><h2>Revenue Trend</h2>' +
      lineChart(state.data.revenue, "amount", "#6366f1") +
      "</div>" +
      '<div class="bb-card"><h2>Customer Growth</h2>' +
      barChart(state.data.growth, "customers", "#10b981") +
      "</div></div>" +
      '<div class="bb-card"><h2>Recent Invoices</h2>' +
      renderInvoicesTable(state.data.invoices.slice(0, 5)) +
      "</div>"
    );
  }

  function renderInvoicesTable(rows) {
    if (!rows.length) return '<p class="bb-empty">No invoices yet.</p>';
    return (
      '<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Client</th><th>Amount</th><th>Due</th><th>Status</th></tr></thead><tbody>' +
      rows
        .map(function (r) {
          return (
            "<tr><td>" +
            esc(r.client) +
            "</td><td>" +
            fmt(r.amount) +
            "</td><td>" +
            esc(r.due) +
            '</td><td><span class="bb-status ' +
            esc(r.status) +
            '">' +
            esc(r.status) +
            "</span></td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>"
    );
  }

  function renderCrm() {
    return (
      '<div class="bb-card"><h2>Add Lead</h2>' +
      '<form id="bb-form-lead" class="bb-form-grid">' +
      '<label>Company<input name="name" required></label>' +
      '<label>Contact<input name="contact" required></label>' +
      '<label>Email<input name="email" type="email"></label>' +
      '<label>Value (₹)<input name="value" type="number" min="0"></label>' +
      '<label>Stage<select name="stage"><option value="lead">Lead</option><option value="won">Won</option></select></label>' +
      '</form><button type="submit" form="bb-form-lead" class="bb-btn bb-btn-primary">Add Lead</button></div>' +
      '<div class="bb-card" style="margin-top:20px"><h2>Leads & Clients</h2>' +
      '<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Company</th><th>Contact</th><th>Email</th><th>Value</th><th>Stage</th><th></th></tr></thead><tbody>' +
      state.data.leads
        .map(function (l) {
          return (
            "<tr><td>" +
            esc(l.name) +
            "</td><td>" +
            esc(l.contact) +
            "</td><td>" +
            esc(l.email) +
            "</td><td>" +
            fmt(l.value) +
            '</td><td><span class="bb-status ' +
            esc(l.stage) +
            '">' +
            esc(l.stage) +
            '</span></td><td><button type="button" class="bb-btn" data-del-lead="' +
            l.id +
            '">Remove</button></td></tr>'
          );
        })
        .join("") +
      "</tbody></table></div></div>"
    );
  }

  function renderHr() {
    return (
      '<div class="bb-card"><h2>Add Employee</h2>' +
      '<form id="bb-form-emp" class="bb-form-grid">' +
      '<label>Name<input name="name" required></label>' +
      '<label>Role<input name="role" required></label>' +
      '<label>Department<input name="dept" required></label>' +
      '<label>Join Date<input name="join" type="date"></label>' +
      '<label>Monthly Salary (₹)<input name="salary" type="number" min="0"></label>' +
      '</form><button type="submit" form="bb-form-emp" class="bb-btn bb-btn-primary">Add Employee</button></div>' +
      '<div class="bb-card" style="margin-top:20px"><h2>Team Directory</h2>' +
      '<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Name</th><th>Role</th><th>Dept</th><th>Joined</th><th>Salary</th><th></th></tr></thead><tbody>' +
      state.data.employees
        .map(function (e) {
          return (
            "<tr><td>" +
            esc(e.name) +
            "</td><td>" +
            esc(e.role) +
            "</td><td>" +
            esc(e.dept) +
            "</td><td>" +
            esc(e.join) +
            "</td><td>" +
            fmt(e.salary) +
            '</td><td><button type="button" class="bb-btn" data-del-emp="' +
            e.id +
            '">Remove</button></td></tr>'
          );
        })
        .join("") +
      "</tbody></table></div></div>"
    );
  }

  function renderPayroll() {
    var total = sum(state.data.employees, "salary");
    return (
      '<div class="bb-kpi-grid">' +
      '<div class="bb-kpi"><label>Monthly Payroll</label><strong>' +
      fmt(total) +
      "</strong></div>" +
      '<div class="bb-kpi"><label>Employees</label><strong>' +
      state.data.employees.length +
      "</strong></div></div>" +
      '<div class="bb-card"><h2>Run Payroll</h2><p style="color:var(--bb-muted);margin:0 0 16px">Generate a payroll run for the current month based on employee salaries.</p>' +
      '<button type="button" class="bb-btn bb-btn-primary" id="bb-run-payroll">Run Payroll for ' +
      new Date().toISOString().slice(0, 7) +
      "</button></div>" +
      '<div class="bb-card" style="margin-top:20px"><h2>Payroll History</h2>' +
      '<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Month</th><th>Employees</th><th>Total</th><th>Status</th></tr></thead><tbody>' +
      state.data.payrollRuns
        .map(function (p) {
          return (
            "<tr><td>" +
            esc(p.month) +
            "</td><td>" +
            p.employees +
            "</td><td>" +
            fmt(p.total) +
            '</td><td><span class="bb-status ' +
            esc(p.status) +
            '">' +
            esc(p.status) +
            "</span></td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div></div>"
    );
  }

  function renderInvoices() {
    return (
      '<div class="bb-card"><h2>Create Invoice</h2>' +
      '<form id="bb-form-inv" class="bb-form-grid">' +
      '<label>Client<input name="client" required></label>' +
      '<label>Amount (₹)<input name="amount" type="number" min="0" required></label>' +
      '<label>Issue Date<input name="date" type="date"></label>' +
      '<label>Due Date<input name="due" type="date"></label>' +
      '<label>Status<select name="status"><option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option></select></label>' +
      '</form><button type="submit" form="bb-form-inv" class="bb-btn bb-btn-primary">Create Invoice</button></div>' +
      '<div class="bb-card" style="margin-top:20px"><h2>All Invoices</h2>' +
      renderInvoicesTable(state.data.invoices) +
      "</div>"
    );
  }

  function renderExpenses() {
    return (
      '<div class="bb-card"><h2>Log Expense</h2>' +
      '<form id="bb-form-exp" class="bb-form-grid">' +
      '<label>Category<input name="category" required placeholder="Software, Travel…"></label>' +
      '<label>Vendor<input name="vendor" required></label>' +
      '<label>Amount (₹)<input name="amount" type="number" min="0" required></label>' +
      '<label>Date<input name="date" type="date"></label>' +
      '</form><button type="submit" form="bb-form-exp" class="bb-btn bb-btn-primary">Add Expense</button></div>' +
      '<div class="bb-card" style="margin-top:20px"><h2>Expense Log</h2>' +
      '<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Category</th><th>Vendor</th><th>Amount</th><th>Date</th><th></th></tr></thead><tbody>' +
      state.data.expenses
        .map(function (e) {
          return (
            "<tr><td>" +
            esc(e.category) +
            "</td><td>" +
            esc(e.vendor) +
            "</td><td>" +
            fmt(e.amount) +
            "</td><td>" +
            esc(e.date) +
            '</td><td><button type="button" class="bb-btn" data-del-exp="' +
            e.id +
            '">Remove</button></td></tr>'
          );
        })
        .join("") +
      "</tbody></table></div></div>"
    );
  }

  function renderRevenue() {
    var total = sum(state.data.revenue, "amount");
    return (
      '<div class="bb-kpi-grid"><div class="bb-kpi"><label>6-Month Revenue</label><strong>' +
      fmt(total) +
      "</strong></div></div>" +
      '<div class="bb-card"><h2>Revenue by Month</h2>' +
      lineChart(state.data.revenue, "amount", "#6366f1") +
      "</div>" +
      '<div class="bb-card" style="margin-top:20px"><h2>Add Revenue Entry</h2>' +
      '<form id="bb-form-rev" class="bb-form-grid">' +
      '<label>Month<input name="month" placeholder="Jul" required maxlength="3"></label>' +
      '<label>Amount (₹)<input name="amount" type="number" min="0" required></label>' +
      '</form><button type="submit" form="bb-form-rev" class="bb-btn bb-btn-primary">Add Entry</button></div>'
    );
  }

  function renderAnalytics() {
    var g = state.data.growth;
    var last = g[g.length - 1];
    var first = g[0];
    var growthPct = first.mrr ? (((last.mrr - first.mrr) / first.mrr) * 100).toFixed(1) : 0;
    return (
      '<div class="bb-kpi-grid">' +
      '<div class="bb-kpi"><label>MRR</label><strong>' +
      fmt(last.mrr) +
      '</strong><div class="delta up">+' +
      growthPct +
      "% in 6 months</div></div>" +
      '<div class="bb-kpi"><label>Customers</label><strong>' +
      last.customers +
      "</strong></div>" +
      '<div class="bb-kpi"><label>Avg Revenue / Customer</label><strong>' +
      fmt(Math.round(last.mrr / last.customers)) +
      "</strong></div></div>" +
      '<div class="bb-grid-2">' +
      '<div class="bb-card"><h2>MRR Growth</h2>' +
      lineChart(g, "mrr", "#8b5cf6") +
      "</div>" +
      '<div class="bb-card"><h2>Customer Count</h2>' +
      barChart(g, "customers", "#10b981") +
      "</div></div>"
    );
  }

  function renderView() {
    switch (state.view) {
      case "crm":
        return renderCrm();
      case "hr":
        return renderHr();
      case "payroll":
        return renderPayroll();
      case "invoices":
        return renderInvoices();
      case "expenses":
        return renderExpenses();
      case "revenue":
        return renderRevenue();
      case "analytics":
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  }

  function nextId(arr) {
    return arr.reduce(function (m, x) {
      return Math.max(m, x.id || 0);
    }, 0) + 1;
  }

  function bindForms() {
    var leadForm = document.getElementById("bb-form-lead");
    if (leadForm) {
      leadForm.onsubmit = function (e) {
        e.preventDefault();
        var fd = new FormData(leadForm);
        state.data.leads.push({
          id: nextId(state.data.leads),
          name: fd.get("name"),
          contact: fd.get("contact"),
          email: fd.get("email"),
          value: Number(fd.get("value")) || 0,
          stage: fd.get("stage"),
        });
        save();
        render();
      };
    }

    var empForm = document.getElementById("bb-form-emp");
    if (empForm) {
      empForm.onsubmit = function (e) {
        e.preventDefault();
        var fd = new FormData(empForm);
        state.data.employees.push({
          id: nextId(state.data.employees),
          name: fd.get("name"),
          role: fd.get("role"),
          dept: fd.get("dept"),
          join: fd.get("join") || new Date().toISOString().slice(0, 10),
          salary: Number(fd.get("salary")) || 0,
        });
        save();
        render();
      };
    }

    var invForm = document.getElementById("bb-form-inv");
    if (invForm) {
      invForm.onsubmit = function (e) {
        e.preventDefault();
        var fd = new FormData(invForm);
        state.data.invoices.push({
          id: nextId(state.data.invoices),
          client: fd.get("client"),
          amount: Number(fd.get("amount")),
          date: fd.get("date") || new Date().toISOString().slice(0, 10),
          due: fd.get("due"),
          status: fd.get("status"),
        });
        save();
        render();
      };
    }

    var expForm = document.getElementById("bb-form-exp");
    if (expForm) {
      expForm.onsubmit = function (e) {
        e.preventDefault();
        var fd = new FormData(expForm);
        state.data.expenses.push({
          id: nextId(state.data.expenses),
          category: fd.get("category"),
          vendor: fd.get("vendor"),
          amount: Number(fd.get("amount")),
          date: fd.get("date") || new Date().toISOString().slice(0, 10),
        });
        save();
        render();
      };
    }

    var revForm = document.getElementById("bb-form-rev");
    if (revForm) {
      revForm.onsubmit = function (e) {
        e.preventDefault();
        var fd = new FormData(revForm);
        var amt = Number(fd.get("amount"));
        state.data.revenue.push({ month: fd.get("month"), amount: amt });
        var cust = state.data.growth.length
          ? state.data.growth[state.data.growth.length - 1].customers + 1
          : 1;
        state.data.growth.push({ month: fd.get("month"), customers: cust, mrr: amt });
        save();
        render();
      };
    }

    var payrollBtn = document.getElementById("bb-run-payroll");
    if (payrollBtn) {
      payrollBtn.onclick = function () {
        var month = new Date().toISOString().slice(0, 7);
        var total = sum(state.data.employees, "salary");
        state.data.payrollRuns.unshift({
          id: nextId(state.data.payrollRuns),
          month: month,
          total: total,
          status: "pending",
          employees: state.data.employees.length,
        });
        save();
        render();
      };
    }

    document.querySelectorAll("[data-del-lead]").forEach(function (btn) {
      btn.onclick = function () {
        var id = Number(btn.getAttribute("data-del-lead"));
        state.data.leads = state.data.leads.filter(function (l) {
          return l.id !== id;
        });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-del-emp]").forEach(function (btn) {
      btn.onclick = function () {
        var id = Number(btn.getAttribute("data-del-emp"));
        state.data.employees = state.data.employees.filter(function (e) {
          return e.id !== id;
        });
        save();
        render();
      };
    });

    document.querySelectorAll("[data-del-exp]").forEach(function (btn) {
      btn.onclick = function () {
        var id = Number(btn.getAttribute("data-del-exp"));
        state.data.expenses = state.data.expenses.filter(function (e) {
          return e.id !== id;
        });
        save();
        render();
      };
    });
  }

  function render() {
    var root = document.getElementById("bb-root");
    if (!root) return;

    var navHtml = NAV.map(function (n) {
      return (
        '<button type="button" data-view="' +
        n.id +
        '" class="' +
        (state.view === n.id ? "active" : "") +
        '"><span class="icon">' +
        n.icon +
        "</span>" +
        esc(n.label) +
        "</button>"
      );
    }).join("");

    root.innerHTML =
      '<aside class="bb-sidebar" id="bb-sidebar">' +
      '<div class="bb-brand"><strong>BizBuilt AI</strong><small>by MarketMind Labs</small><span class="bb-premium-badge">Premium</span></div>' +
      '<nav class="bb-nav">' +
      navHtml +
      "</nav>" +
      '<div class="bb-sidebar-foot"><a href="../bizbuilt-ai.html">← Product info</a><br><a href="../index.html">WorkPilot Tools</a></div>' +
      "</aside>" +
      '<div class="bb-main">' +
      '<header class="bb-topbar">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
      '<button type="button" class="bb-menu-toggle" id="bb-menu-toggle" aria-label="Menu">☰</button>' +
      "<h1>" +
      esc(TITLES[state.view]) +
      "</h1></div>" +
      '<div class="bb-topbar-actions">' +
      '<button type="button" class="wp-theme-toggle bb-btn" aria-label="Toggle theme">🌙</button>' +
      '<a class="bb-btn" href="mailto:mml.products26@gmail.com?subject=BizBuilt%20AI%20Premium">Upgrade</a>' +
      '<button type="button" class="bb-btn" id="bb-reset-demo">Reset demo</button>' +
      "</div></header>" +
      '<div class="bb-content">' +
      renderView() +
      "</div></div>";

    root.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.onclick = function () {
        state.view = btn.getAttribute("data-view");
        render();
      };
    });

    var toggle = document.getElementById("bb-menu-toggle");
    var sidebar = document.getElementById("bb-sidebar");
    if (toggle && sidebar) {
      toggle.onclick = function () {
        sidebar.classList.toggle("open");
      };
    }

    var reset = document.getElementById("bb-reset-demo");
    if (reset) {
      reset.onclick = function () {
        if (confirm("Reset all demo data to defaults?")) {
          state.data = defaultData();
          save();
          render();
        }
      };
    }

    bindForms();
  }

  load();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
