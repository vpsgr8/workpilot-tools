(function () {
  var STORAGE_KEY = "bizbuilt-data-v2";
  var state = { view: "dashboard", tab: "", data: null, docQuery: "" };

  var PIPELINE = [
    "New Lead", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost",
  ];

  var NAV = [
    { section: "Command Center", items: [
      { id: "dashboard", icon: "📊", label: "Dashboard" },
      { id: "copilot", icon: "🤖", label: "AI Copilot" },
    ]},
    { section: "Core", items: [
      { id: "crm", icon: "👥", label: "CRM" },
      { id: "invoices", icon: "📄", label: "Invoices" },
      { id: "expenses", icon: "💳", label: "Expenses" },
      { id: "revenue", icon: "📈", label: "Revenue" },
      { id: "analytics", icon: "📉", label: "Analytics & BI" },
    ]},
    { section: "Finance & Ops", items: [
      { id: "finance", icon: "🏦", label: "Finance" },
      { id: "quotations", icon: "📝", label: "Quotations" },
      { id: "hr", icon: "🏢", label: "HR" },
      { id: "payroll", icon: "💰", label: "Payroll" },
    ]},
    { section: "Growth", items: [
      { id: "projects", icon: "📋", label: "Projects" },
      { id: "marketing", icon: "📣", label: "Marketing" },
      { id: "support", icon: "🎧", label: "Support" },
    ]},
    { section: "Supply Chain", items: [
      { id: "inventory", icon: "📦", label: "Inventory" },
      { id: "procurement", icon: "🛒", label: "Procurement" },
    ]},
    { section: "Platform", items: [
      { id: "documents", icon: "📁", label: "Documents" },
    ]},
  ];

  var TITLES = {
    dashboard: "Command Center",
    copilot: "AI Business Copilot",
    crm: "CRM",
    invoices: "Invoice Management",
    expenses: "Expenses",
    revenue: "Revenue Tracking",
    analytics: "Analytics & BI",
    finance: "Finance & Accounting",
    quotations: "Quotations & Proposals",
    hr: "HR Management",
    payroll: "Payroll",
    projects: "Project Management",
    marketing: "Marketing Automation",
    support: "Customer Support",
    inventory: "Inventory Management",
    procurement: "Procurement",
    documents: "Document Center",
  };

  function defaultData() {
    return {
      company: "Demo SME Pvt Ltd",
      leads: [
        { id: 1, name: "Acme Corp", contact: "Raj Sharma", email: "raj@acme.in", phone: "+91 98765 43210", stage: "Proposal Sent", value: 85000, score: 72, region: "East", assigned: "Ananya Singh" },
        { id: 2, name: "Bright Retail", contact: "Priya Nair", email: "priya@bright.in", phone: "+91 98123 45678", stage: "Won", value: 120000, score: 91, region: "West", assigned: "Ananya Singh" },
        { id: 3, name: "TechStart Labs", contact: "Amit Verma", email: "amit@techstart.in", phone: "+91 99000 11223", stage: "Qualified", value: 45000, score: 58, region: "East", assigned: "Vikram Patel" },
        { id: 4, name: "ABC Builders", contact: "Suresh Kumar", email: "suresh@abcbuilders.in", phone: "+91 91234 56789", stage: "Negotiation", value: 210000, score: 85, region: "North", assigned: "Ananya Singh" },
        { id: 5, name: "Green Foods", contact: "Meera Joshi", email: "meera@greenfoods.in", stage: "New Lead", value: 35000, score: 42, region: "South", assigned: "Ananya Singh" },
      ],
      customers: [
        { id: 1, name: "Bright Retail", contact: "Priya Nair", email: "priya@bright.in", since: "2024-06-01", ltv: 480000 },
        { id: 2, name: "Metro Supplies", contact: "Karan Mehta", email: "karan@metro.in", since: "2023-11-15", ltv: 320000 },
      ],
      employees: [
        { id: 1, name: "Ananya Singh", role: "Sales Lead", dept: "Sales", join: "2023-04-01", salary: 55000, skills: "CRM, Negotiation", status: "active" },
        { id: 2, name: "Vikram Patel", role: "Developer", dept: "Engineering", join: "2022-11-15", salary: 72000, skills: "React, Node", status: "active" },
        { id: 3, name: "Sneha Reddy", role: "Accountant", dept: "Finance", join: "2024-01-10", salary: 48000, skills: "GST, Tally", status: "active" },
      ],
      attendance: [
        { id: 1, empId: 1, date: "2026-06-14", in: "09:02", out: "18:15", type: "office" },
        { id: 2, empId: 2, date: "2026-06-14", in: "09:45", out: "19:00", type: "remote" },
        { id: 3, empId: 3, date: "2026-06-14", in: "08:55", out: "17:30", type: "office" },
      ],
      leaves: [
        { id: 1, empId: 1, type: "Casual", from: "2026-06-20", to: "2026-06-21", status: "pending" },
      ],
      payrollRuns: [
        { id: 1, month: "2026-05", total: 175000, status: "paid", employees: 3 },
        { id: 2, month: "2026-06", total: 175000, status: "pending", employees: 3 },
      ],
      invoices: [
        { id: 1, client: "Bright Retail", amount: 120000, gst: 21600, date: "2026-05-28", due: "2026-06-12", status: "paid" },
        { id: 2, client: "Acme Corp", amount: 45000, gst: 8100, date: "2026-06-01", due: "2026-06-16", status: "pending" },
        { id: 3, client: "TechStart Labs", amount: 32000, gst: 5760, date: "2026-05-15", due: "2026-05-30", status: "overdue" },
        { id: 4, client: "ABC Builders", amount: 85000, gst: 15300, date: "2026-06-08", due: "2026-06-23", status: "pending" },
      ],
      expenses: [
        { id: 1, category: "Software", vendor: "SaaS Tools", amount: 8500, date: "2026-06-02", recurring: true },
        { id: 2, category: "Marketing", vendor: "Google Ads", amount: 15000, date: "2026-06-05", recurring: false },
        { id: 3, category: "Office", vendor: "WeWork", amount: 22000, date: "2026-06-01", recurring: true },
        { id: 4, category: "Travel", vendor: "Client visit East", amount: 4200, date: "2026-05-28", recurring: false },
      ],
      bankAccounts: [
        { id: 1, name: "HDFC Current", balance: 842000, lastSync: "2026-06-14" },
        { id: 2, name: "ICICI Savings", balance: 125000, lastSync: "2026-06-13" },
      ],
      transactions: [
        { id: 1, type: "in", desc: "Bright Retail payment", amount: 120000, date: "2026-06-10" },
        { id: 2, type: "out", desc: "Google Ads", amount: 15000, date: "2026-06-05" },
        { id: 3, type: "out", desc: "WeWork rent", amount: 22000, date: "2026-06-01" },
      ],
      quotations: [
        { id: 1, client: "ABC Builders", amount: 210000, date: "2026-06-07", status: "sent", validUntil: "2026-07-07" },
        { id: 2, client: "Green Foods", amount: 35000, date: "2026-06-12", status: "draft", validUntil: "2026-07-12" },
      ],
      projects: [
        { id: 1, name: "Website Redesign", client: "Bright Retail", status: "active", progress: 65, due: "2026-07-15" },
        { id: 2, name: "ERP Integration", client: "Metro Supplies", status: "active", progress: 30, due: "2026-08-01" },
      ],
      tasks: [
        { id: 1, projectId: 1, title: "Finalize homepage mockups", assignee: "Vikram Patel", due: "2026-06-15", done: false },
        { id: 2, projectId: 1, title: "Client review call", assignee: "Ananya Singh", due: "2026-06-14", done: false },
        { id: 3, projectId: 2, title: "API documentation", assignee: "Vikram Patel", due: "2026-06-18", done: false },
      ],
      products: [
        { id: 1, sku: "PRD-001", name: "Premium Widget", stock: 45, reorder: 20, warehouse: "Main" },
        { id: 2, sku: "PRD-002", name: "Standard Kit", stock: 8, reorder: 15, warehouse: "Main" },
        { id: 3, sku: "PRD-003", name: "Service Pack A", stock: 120, reorder: 30, warehouse: "East" },
      ],
      vendors: [
        { id: 1, name: "SupplyCo India", contact: "Ravi", rating: 4.5, orders: 12 },
        { id: 2, name: "PartsHub", contact: "Deepa", rating: 3.8, orders: 8 },
      ],
      purchaseOrders: [
        { id: 1, vendor: "SupplyCo India", amount: 42000, date: "2026-06-01", status: "received" },
        { id: 2, vendor: "PartsHub", amount: 18500, date: "2026-06-10", status: "pending" },
      ],
      campaigns: [
        { id: 1, name: "June Lead Gen", channel: "Email", sent: 2400, opens: 680, leads: 34 },
        { id: 2, name: "WhatsApp Promo", channel: "WhatsApp", sent: 890, opens: 720, leads: 18 },
      ],
      tickets: [
        { id: 1, customer: "Bright Retail", subject: "Invoice query", priority: "medium", status: "open" },
        { id: 2, customer: "Metro Supplies", subject: "Feature request", priority: "low", status: "resolved" },
      ],
      documents: [
        { id: 1, name: "Invoice #INV-001 Bright Retail", type: "Invoice", client: "Bright Retail", date: "2026-05-28" },
        { id: 2, name: "Contract ABC Builders", type: "Contract", client: "ABC Builders", date: "2026-06-01" },
        { id: 3, name: "Quotation Green Foods", type: "Quotation", client: "Green Foods", date: "2026-06-12" },
        { id: 4, name: "Payslip May 2026 - Ananya", type: "Payroll", client: "Internal", date: "2026-05-31" },
        { id: 5, name: "PO SupplyCo #PO-102", type: "Purchase Order", client: "SupplyCo India", date: "2026-06-01" },
      ],
      revenue: [
        { month: "Jan", amount: 180000 }, { month: "Feb", amount: 195000 },
        { month: "Mar", amount: 210000 }, { month: "Apr", amount: 225000 },
        { month: "May", amount: 248000 }, { month: "Jun", amount: 233000 },
      ],
      growth: [
        { month: "Jan", customers: 12, mrr: 180000 }, { month: "Feb", customers: 14, mrr: 195000 },
        { month: "Mar", customers: 15, mrr: 210000 }, { month: "Apr", customers: 17, mrr: 225000 },
        { month: "May", customers: 19, mrr: 248000 }, { month: "Jun", customers: 20, mrr: 233000 },
      ],
      chatHistory: [
        { role: "ai", text: "Hello! I'm your BizBuilt AI Copilot. Ask me about revenue, follow-ups, payroll, or business health." },
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
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); } catch (e) {}
  }

  function fmt(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function sum(arr, key) { return arr.reduce(function (t, x) { return t + Number(x[key] || 0); }, 0); }
  function nextId(arr) { return arr.reduce(function (m, x) { return Math.max(m, x.id || 0); }, 0) + 1; }

  function kpis() {
    var d = state.data;
    var rev = d.revenue.length ? d.revenue[d.revenue.length - 1].amount : 0;
    var prev = d.revenue.length > 1 ? d.revenue[d.revenue.length - 2].amount : rev;
    var revDelta = prev ? (((rev - prev) / prev) * 100).toFixed(1) : 0;
    var exp = sum(d.expenses.filter(function (e) { return e.date && e.date.indexOf("2026-06") === 0; }), "amount");
    var outstanding = sum(d.invoices.filter(function (i) { return i.status !== "paid"; }), "amount");
    var newLeads = d.leads.filter(function (l) { return l.stage === "New Lead"; }).length;
    var tasksDue = d.tasks.filter(function (t) { return !t.done; }).length;
    var cashIn = sum(d.transactions.filter(function (t) { return t.type === "in"; }), "amount");
    var cashOut = sum(d.transactions.filter(function (t) { return t.type === "out"; }), "amount");
    return {
      todayRevenue: 45000, monthlyRevenue: rev, revDelta: revDelta,
      outstanding: outstanding, newLeads: newLeads, tasksDue: tasksDue,
      payrollDue: d.payrollRuns.find(function (p) { return p.status === "pending"; }) ? fmt(d.payrollRuns.find(function (p) { return p.status === "pending"; }).total) : "—",
      expensesMonth: exp, profit: rev - exp, cashFlow: cashIn - cashOut,
      pendingInvoices: d.invoices.filter(function (i) { return i.status === "pending" || i.status === "overdue"; }).length,
      healthScore: 78,
    };
  }

  function aiInsights() {
    var k = kpis();
    return [
      { type: "warn", icon: "📉", text: "Revenue down " + Math.abs(k.revDelta) + "% this month — sales in Region East dropped after two top reps went inactive." },
      { type: "info", icon: "📄", text: k.pendingInvoices + " invoices pending collection worth " + fmt(k.outstanding) + ". ABC Builders due in 9 days." },
      { type: "success", icon: "⭐", text: "Top performer: Ananya Singh — 3 deals in pipeline worth " + fmt(330000) + "." },
      { type: "warn", icon: "⚠️", text: "Expense anomaly: Marketing spend up 40% vs last month (Google Ads)." },
      { type: "info", icon: "📦", text: "Low stock alert: Standard Kit (8 units) — reorder suggested." },
    ];
  }

  function lineChart(data, key, color, h) {
    h = h || 180; var w = 400; var pad = 24;
    var vals = data.map(function (d) { return Number(d[key]); });
    var max = Math.max.apply(null, vals.concat([1]));
    var min = Math.min.apply(null, vals.concat([0]));
    var range = max - min || 1;
    var pts = vals.map(function (v, i) {
      var x = pad + (i / Math.max(vals.length - 1, 1)) * (w - pad * 2);
      var y = h - pad - ((v - min) / range) * (h - pad * 2);
      return x + "," + y;
    }).join(" ");
    var labels = data.map(function (d, i) {
      var x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
      return '<text x="' + x + '" y="' + (h - 4) + '" text-anchor="middle" font-size="10" fill="var(--bb-muted)">' + esc(d.month) + "</text>";
    }).join("");
    return '<svg class="bb-chart" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none"><polyline fill="none" stroke="' + color + '" stroke-width="2.5" points="' + pts + '"/>' + labels + "</svg>";
  }

  function barChart(data, key, color) {
    var h = 180, w = 400, pad = 24;
    var vals = data.map(function (d) { return Number(d[key]); });
    var max = Math.max.apply(null, vals.concat([1]));
    var barW = (w - pad * 2) / vals.length - 6;
    var bars = vals.map(function (v, i) {
      var bh = ((v / max) * (h - pad * 2)) | 0;
      var x = pad + i * (barW + 6);
      return '<rect x="' + x + '" y="' + (h - pad - bh) + '" width="' + barW + '" height="' + bh + '" fill="' + color + '" rx="4" opacity="0.85"/><text x="' + (x + barW / 2) + '" y="' + (h - 4) + '" text-anchor="middle" font-size="10" fill="var(--bb-muted)">' + esc(data[i].month) + "</text>";
    }).join("");
    return '<svg class="bb-chart" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none">' + bars + "</svg>";
  }

  function tabs(items, active) {
    return '<div class="bb-tabs">' + items.map(function (t) {
      return '<button type="button" data-tab="' + t.id + '" class="' + (active === t.id ? "active" : "") + '">' + esc(t.label) + "</button>";
    }).join("") + "</div>";
  }

  function insightHtml(list) {
    return '<div class="bb-insights">' + list.map(function (i) {
      return '<div class="bb-insight ' + i.type + '"><span class="bb-insight-icon">' + i.icon + '</span><span>' + esc(i.text) + "</span></div>";
    }).join("") + "</div>";
  }

  function renderDashboard() {
    var k = kpis();
    return (
      '<div class="bb-widget-grid">' +
      '<div class="bb-widget"><label>Today\'s Revenue</label><strong>' + fmt(k.todayRevenue) + "</strong></div>" +
      '<div class="bb-widget"><label>Monthly Revenue</label><strong>' + fmt(k.monthlyRevenue) + '</strong><small class="' + (k.revDelta >= 0 ? "bb-score-high" : "bb-score-low") + '">' + (k.revDelta >= 0 ? "+" : "") + k.revDelta + '% vs last month</small></div>' +
      '<div class="bb-widget"><label>Outstanding Invoices</label><strong>' + fmt(k.outstanding) + "<small>" + k.pendingInvoices + " pending</small></strong></div>" +
      '<div class="bb-widget"><label>New Leads</label><strong>' + k.newLeads + "</strong></div>" +
      '<div class="bb-widget"><label>Tasks Due Today</label><strong>' + k.tasksDue + "</strong></div>" +
      '<div class="bb-widget"><label>Payroll Due</label><strong>' + k.payrollDue + "</strong></div>" +
      '<div class="bb-widget"><label>Expenses This Month</label><strong>' + fmt(k.expensesMonth) + "</strong></div>" +
      '<div class="bb-widget"><label>Profit / Loss</label><strong class="' + (k.profit >= 0 ? "bb-score-high" : "bb-score-low") + '">' + fmt(k.profit) + "</strong></div>" +
      '<div class="bb-widget"><label>Cash Flow</label><strong class="' + (k.cashFlow >= 0 ? "bb-score-high" : "bb-score-low") + '">' + fmt(k.cashFlow) + "</strong></div>" +
      "</div>" +
      '<div class="bb-grid-2">' +
      '<div class="bb-card"><h2>🤖 AI Business Insights</h2>' + insightHtml(aiInsights()) + "</div>" +
      '<div class="bb-card"><div class="bb-health-score"><div class="score">' + k.healthScore + '</div><p>Business Health Score</p><small style=\'color:var(--bb-muted)\'>Based on revenue, collections, expenses & pipeline</small></div></div>' +
      "</div>" +
      '<div class="bb-grid-2">' +
      '<div class="bb-card"><h2>Revenue Trend</h2>' + lineChart(state.data.revenue, "amount", "#6366f1") + "</div>" +
      '<div class="bb-card"><h2>Recent Invoices</h2>' + renderInvoicesTable(state.data.invoices.slice(0, 4)) + "</div></div>"
    );
  }

  function copilotReply(q) {
    q = q.toLowerCase();
    var d = state.data;
    var k = kpis();
    if (/revenue|sales|down/.test(q)) {
      return "Revenue Analysis:\n\n• Monthly revenue: " + fmt(k.monthlyRevenue) + " (" + k.revDelta + "% vs last month)\n• Sales down in Region East — conversion dropped ~15%\n• Two top sales reps had zero activity this week\n• Recommendation: Schedule East region review and re-engage Acme Corp & TechStart Labs.";
    }
    if (/follow|customer|collection/.test(q)) {
      var pending = d.invoices.filter(function (i) { return i.status !== "paid"; });
      var msg = "Customers to follow up with:\n\n";
      pending.forEach(function (i) {
        msg += "• " + i.client + " — " + fmt(i.amount) + " (" + i.status + ", due " + i.due + ")\n";
      });
      msg += "\nWhatsApp draft (ABC Builders):\n\"Hi Suresh, gentle reminder on invoice #" + pending[0].id + " for " + fmt(pending[pending.length - 1].amount) + ". Happy to share payment link. — Demo SME\"";
      return msg;
    }
    if (/payroll|salary/.test(q)) {
      return "Payroll Summary:\n\n• June payroll: " + fmt(sum(d.employees, "salary")) + " (pending)\n• 3 employees\n• Compliance: PF/ESI filings due by 15th\n• No errors detected in salary structures.";
    }
    if (/health|score|overview/.test(q)) {
      return "Business Health: " + k.healthScore + "/100\n\n✓ Strong customer retention\n⚠ Revenue dipped 12% in June\n⚠ 14 invoices pending\n✓ Payroll on schedule\n⚠ Marketing spend anomaly\n\nTop action: Chase overdue invoices worth " + fmt(k.outstanding);
    }
    if (/stock|inventory|reorder/.test(q)) {
      var low = d.products.filter(function (p) { return p.stock <= p.reorder; });
      return "Inventory Alert:\n\n" + (low.length ? low.map(function (p) { return "• " + p.name + ": " + p.stock + " units (reorder at " + p.reorder + ")"; }).join("\n") : "All stock levels OK") + "\n\nAI suggests PO for Standard Kit from SupplyCo India.";
    }
    return "I can help with:\n• \"Why is revenue down?\"\n• \"Which customers should I follow up with?\"\n• \"Payroll status\"\n• \"Business health overview\"\n• \"Low stock items\"\n\nAsk anything about your CRM, finance, HR, or operations.";
  }

  function renderCopilot() {
    var msgs = state.data.chatHistory.map(function (m) {
      return '<div class="bb-msg ' + m.role + '">' + (m.role === "ai" ? esc(m.text).replace(/\n/g, "<br>") : esc(m.text)) + "</div>";
    }).join("");
    var suggestions = [
      "Why is my revenue down?",
      "Which customers should I follow up with?",
      "What's our business health score?",
      "Any payroll or compliance alerts?",
      "Low stock items to reorder?",
    ];
    return (
      '<div class="bb-copilot">' +
      '<div class="bb-chat"><div class="bb-chat-msgs" id="bb-chat-msgs">' + msgs + '</div>' +
      '<form class="bb-chat-input" id="bb-chat-form"><input type="text" id="bb-chat-input" placeholder="Ask BizBuilt AI anything…" autocomplete="off"><button type="submit" class="bb-btn bb-btn-primary">Send</button></form></div>' +
      '<div class="bb-suggestions"><h3 style="margin:0 0 12px;font-size:14px">Suggested questions</h3>' +
      suggestions.map(function (s) {
        return '<button type="button" data-ask="' + esc(s) + '">' + esc(s) + "</button>";
      }).join("") +
      "</div></div>"
    );
  }

  function renderPipeline() {
    return '<div class="bb-pipeline">' + PIPELINE.map(function (stage) {
      var deals = state.data.leads.filter(function (l) { return l.stage === stage; });
      return '<div class="bb-pipeline-col"><h4>' + esc(stage) + " (" + deals.length + ")</h4>" +
        deals.map(function (d) {
          return '<div class="bb-deal-card"><strong>' + esc(d.name) + "</strong>" + fmt(d.value) + '<br><span class="bb-tag">Score: ' + d.score + "</span></div>";
        }).join("") + "</div>";
    }).join("") + "</div>";
  }

  function renderCrm() {
    var tab = state.tab || "pipeline";
    var head = tabs([
      { id: "pipeline", label: "Sales Pipeline" },
      { id: "leads", label: "Lead Management" },
      { id: "customers", label: "Customers" },
    ], tab);
    if (tab === "customers") {
      return head + '<div class="bb-card"><h2>Customer Management</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Company</th><th>Contact</th><th>Email</th><th>Since</th><th>LTV</th></tr></thead><tbody>' +
        state.data.customers.map(function (c) {
          return "<tr><td>" + esc(c.name) + "</td><td>" + esc(c.contact) + "</td><td>" + esc(c.email) + "</td><td>" + esc(c.since) + "</td><td>" + fmt(c.ltv) + "</td></tr>";
        }).join("") + "</tbody></table></div></div>";
    }
    if (tab === "leads") {
      return head +
        '<div class="bb-card"><h2>Add Lead</h2><form id="bb-form-lead" class="bb-form-grid">' +
        '<label>Company<input name="name" required></label><label>Contact<input name="contact" required></label>' +
        '<label>Email<input name="email" type="email"></label><label>Value (₹)<input name="value" type="number"></label>' +
        '<label>Region<input name="region" placeholder="East, West…"></label>' +
        '<label>Stage<select name="stage">' + PIPELINE.map(function (s) { return '<option>' + s + "</option>"; }).join("") + "</select></label>" +
        '</form><button type="submit" form="bb-form-lead" class="bb-btn bb-btn-primary">Add Lead</button></div>' +
        '<div class="bb-card"><h2>All Leads <span class="bb-pro-tag">AI Scoring</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Company</th><th>Contact</th><th>Stage</th><th>Score</th><th>Region</th><th>Value</th><th>Assigned</th></tr></thead><tbody>' +
        state.data.leads.map(function (l) {
          var sc = l.score >= 80 ? "bb-score-high" : l.score >= 50 ? "bb-score-med" : "bb-score-low";
          return "<tr><td>" + esc(l.name) + "</td><td>" + esc(l.contact) + "</td><td><span class=\"bb-status\">" + esc(l.stage) + "</span></td><td class=\"" + sc + "\">" + l.score + "</td><td>" + esc(l.region) + "</td><td>" + fmt(l.value) + "</td><td>" + esc(l.assigned) + "</td></tr>";
        }).join("") + "</tbody></table></div></div>";
    }
    return head + '<div class="bb-card"><h2>Sales Pipeline</h2>' + renderPipeline() + "</div>";
  }

  function renderInvoicesTable(rows) {
    if (!rows.length) return '<p class="bb-empty">No invoices.</p>';
    return '<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Client</th><th>Amount</th><th>GST</th><th>Due</th><th>Status</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return "<tr><td>" + esc(r.client) + "</td><td>" + fmt(r.amount) + "</td><td>" + fmt(r.gst || 0) + "</td><td>" + esc(r.due) + '</td><td><span class="bb-status ' + esc(r.status) + '">' + esc(r.status) + "</span></td></tr>";
      }).join("") + "</tbody></table></div>";
  }

  function renderInvoices() {
    return (
      '<div class="bb-card"><h2>Create GST Invoice</h2><form id="bb-form-inv" class="bb-form-grid">' +
      '<label>Client<input name="client" required></label><label>Amount (₹)<input name="amount" type="number" required></label>' +
      '<label>GST (₹)<input name="gst" type="number"></label><label>Due Date<input name="due" type="date"></label>' +
      '<label>Status<select name="status"><option value="pending">Pending</option><option value="paid">Paid</option></select></label>' +
      '</form><button type="submit" form="bb-form-inv" class="bb-btn bb-btn-primary">Create Invoice</button></div>' +
      '<div class="bb-card"><h2>Invoices <span class="bb-pro-tag">AI: Late payment prediction</span></h2>' + renderInvoicesTable(state.data.invoices) + "</div>"
    );
  }

  function renderExpenses() {
    return (
      '<div class="bb-card"><h2>Log Expense</h2><form id="bb-form-exp" class="bb-form-grid">' +
      '<label>Category<input name="category" required></label><label>Vendor<input name="vendor" required></label>' +
      '<label>Amount (₹)<input name="amount" type="number" required></label><label>Date<input name="date" type="date"></label>' +
      '<label>Recurring<select name="recurring"><option value="false">No</option><option value="true">Yes</option></select></label>' +
      '</form><button type="submit" form="bb-form-exp" class="bb-btn bb-btn-primary">Add Expense</button></div>' +
      '<div class="bb-card"><h2>Expenses <span class="bb-pro-tag">AI Classification</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Category</th><th>Vendor</th><th>Amount</th><th>Date</th><th>Recurring</th></tr></thead><tbody>' +
      state.data.expenses.map(function (e) {
        return "<tr><td>" + esc(e.category) + "</td><td>" + esc(e.vendor) + "</td><td>" + fmt(e.amount) + "</td><td>" + esc(e.date) + "</td><td>" + (e.recurring ? "Yes" : "No") + "</td></tr>";
      }).join("") + "</tbody></table></div></div>"
    );
  }

  function renderRevenue() {
    return '<div class="bb-kpi-grid"><div class="bb-kpi"><label>6-Month Revenue</label><strong>' + fmt(sum(state.data.revenue, "amount")) + "</strong></div></div>" +
      '<div class="bb-card"><h2>Revenue Tracking</h2>' + lineChart(state.data.revenue, "amount", "#6366f1") + "</div>";
  }

  function renderAnalytics() {
    var g = state.data.growth;
    var last = g[g.length - 1];
    return (
      '<div class="bb-grid-2"><div class="bb-card"><div class="bb-health-score"><div class="score">' + kpis().healthScore + '</div><p>Business Health Score</p></div></div>' +
      '<div class="bb-card"><h2>Conversion Rate</h2><p style="font-size:2rem;font-weight:800;margin:0">24%</p><small style="color:var(--bb-muted)">Lead → Won (last 90 days)</small></div></div>' +
      '<div class="bb-grid-2"><div class="bb-card"><h2>MRR Growth</h2>' + lineChart(g, "mrr", "#8b5cf6") + "</div>" +
      '<div class="bb-card"><h2>Customer Growth</h2>' + barChart(g, "customers", "#10b981") + "</div></div>" +
      '<div class="bb-card"><h2>Forecast <span class="bb-pro-tag">AI</span></h2><p>Projected July MRR: <strong>' + fmt(Math.round(last.mrr * 1.08)) + "</strong> (+8% based on pipeline)</p></div>"
    );
  }

  function renderFinance() {
    var tab = state.tab || "banking";
    var head = tabs([{ id: "banking", label: "Banking" }, { id: "cashflow", label: "Cash Flow" }], tab);
    if (tab === "cashflow") {
      var k = kpis();
      return head + '<div class="bb-kpi-grid"><div class="bb-kpi"><label>Cash In</label><strong class="bb-score-high">' + fmt(sum(state.data.transactions.filter(function (t) { return t.type === "in"; }), "amount")) + '</strong></div><div class="bb-kpi"><label>Cash Out</label><strong class="bb-score-low">' + fmt(sum(state.data.transactions.filter(function (t) { return t.type === "out"; }), "amount")) + '</strong></div><div class="bb-kpi"><label>Net Cash Flow</label><strong>' + fmt(k.cashFlow) + "</strong></div></div>" +
        '<div class="bb-card"><h2>Transactions</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th></tr></thead><tbody>' +
        state.data.transactions.map(function (t) {
          return "<tr><td>" + esc(t.date) + "</td><td>" + esc(t.desc) + "</td><td>" + esc(t.type) + "</td><td>" + fmt(t.amount) + "</td></tr>";
        }).join("") + "</tbody></table></div></div>";
    }
    return head + '<div class="bb-card"><h2>Bank Accounts</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Account</th><th>Balance</th><th>Last Sync</th></tr></thead><tbody>' +
      state.data.bankAccounts.map(function (b) {
        return "<tr><td>" + esc(b.name) + "</td><td>" + fmt(b.balance) + "</td><td>" + esc(b.lastSync) + "</td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  function renderQuotations() {
    return '<div class="bb-card"><h2>Quotations & Proposals <span class="bb-pro-tag">AI Auto-write</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Client</th><th>Amount</th><th>Date</th><th>Valid Until</th><th>Status</th></tr></thead><tbody>' +
      state.data.quotations.map(function (q) {
        return "<tr><td>" + esc(q.client) + "</td><td>" + fmt(q.amount) + "</td><td>" + esc(q.date) + "</td><td>" + esc(q.validUntil) + "</td><td><span class=\"bb-status\">" + esc(q.status) + "</span></td></tr>";
      }).join("") + '</tbody></table></div><p style=\'margin-top:12px;color:var(--bb-muted);font-size:13px\'>Generate PDF proposals with client branding — available in Pro plan.</p></div>';
  }

  function renderHr() {
    var tab = state.tab || "directory";
    var head = tabs([{ id: "directory", label: "Directory" }, { id: "attendance", label: "Attendance" }, { id: "leave", label: "Leave" }], tab);
    if (tab === "attendance") {
      return head + '<div class="bb-card"><h2>Today\'s Attendance <span class="bb-pro-tag">GPS / Biometric ready</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Employee</th><th>Clock In</th><th>Clock Out</th><th>Type</th></tr></thead><tbody>' +
        state.data.attendance.map(function (a) {
          var emp = state.data.employees.find(function (e) { return e.id === a.empId; });
          return "<tr><td>" + esc(emp ? emp.name : "—") + "</td><td>" + esc(a.in) + "</td><td>" + esc(a.out) + "</td><td>" + esc(a.type) + "</td></tr>";
        }).join("") + "</tbody></table></div></div>";
    }
    if (tab === "leave") {
      return head + '<div class="bb-card"><h2>Leave Requests</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Status</th></tr></thead><tbody>' +
        state.data.leaves.map(function (l) {
          var emp = state.data.employees.find(function (e) { return e.id === l.empId; });
          return "<tr><td>" + esc(emp ? emp.name : "—") + "</td><td>" + esc(l.type) + "</td><td>" + esc(l.from) + "</td><td>" + esc(l.to) + "</td><td><span class=\"bb-status pending\">" + esc(l.status) + "</span></td></tr>";
        }).join("") + "</tbody></table></div></div>";
    }
    return head +
      '<div class="bb-card"><h2>Employee Directory</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Name</th><th>Role</th><th>Dept</th><th>Skills</th><th>Salary</th></tr></thead><tbody>' +
      state.data.employees.map(function (e) {
        return "<tr><td>" + esc(e.name) + "</td><td>" + esc(e.role) + "</td><td>" + esc(e.dept) + "</td><td>" + esc(e.skills) + "</td><td>" + fmt(e.salary) + "</td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  function renderPayroll() {
    var total = sum(state.data.employees, "salary");
    return '<div class="bb-kpi-grid"><div class="bb-kpi"><label>Monthly Payroll</label><strong>' + fmt(total) + "</strong></div></div>" +
      '<div class="bb-card"><h2>Process Payroll <span class="bb-pro-tag">AI Error Detection</span></h2><button type="button" class="bb-btn bb-btn-primary" id="bb-run-payroll">Run Payroll — ' + new Date().toISOString().slice(0, 7) + "</button></div>" +
      '<div class="bb-card"><h2>Payroll History</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Month</th><th>Employees</th><th>Total</th><th>Status</th></tr></thead><tbody>' +
      state.data.payrollRuns.map(function (p) {
        return "<tr><td>" + esc(p.month) + "</td><td>" + p.employees + "</td><td>" + fmt(p.total) + '</td><td><span class="bb-status ' + esc(p.status) + '">' + esc(p.status) + "</span></td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  function renderProjects() {
    return '<div class="bb-card"><h2>Projects <span class="bb-pro-tag">AI Delay Prediction</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Project</th><th>Client</th><th>Progress</th><th>Due</th><th>Status</th></tr></thead><tbody>' +
      state.data.projects.map(function (p) {
        return "<tr><td>" + esc(p.name) + "</td><td>" + esc(p.client) + "</td><td>" + p.progress + "%</td><td>" + esc(p.due) + "</td><td>" + esc(p.status) + "</td></tr>";
      }).join("") + "</tbody></table></div></div>" +
      '<div class="bb-card"><h2>Tasks Due</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Task</th><th>Assignee</th><th>Due</th><th>Status</th></tr></thead><tbody>' +
      state.data.tasks.map(function (t) {
        return "<tr><td>" + esc(t.title) + "</td><td>" + esc(t.assignee) + "</td><td>" + esc(t.due) + "</td><td>" + (t.done ? "Done" : "Open") + "</td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  function renderMarketing() {
    return '<div class="bb-card"><h2>Campaigns <span class="bb-pro-tag">AI Content</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Campaign</th><th>Channel</th><th>Sent</th><th>Opens</th><th>Leads</th></tr></thead><tbody>' +
      state.data.campaigns.map(function (c) {
        return "<tr><td>" + esc(c.name) + "</td><td>" + esc(c.channel) + "</td><td>" + c.sent + "</td><td>" + c.opens + "</td><td>" + c.leads + "</td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  function renderSupport() {
    return '<div class="bb-card"><h2>Support Tickets <span class="bb-pro-tag">AI Chatbot</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Customer</th><th>Subject</th><th>Priority</th><th>Status</th></tr></thead><tbody>' +
      state.data.tickets.map(function (t) {
        return "<tr><td>" + esc(t.customer) + "</td><td>" + esc(t.subject) + "</td><td>" + esc(t.priority) + "</td><td><span class=\"bb-status\">" + esc(t.status) + "</span></td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  function renderInventory() {
    return '<div class="bb-card"><h2>Product Catalog <span class="bb-pro-tag">AI Reorder</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>SKU</th><th>Product</th><th>Stock</th><th>Reorder At</th><th>Warehouse</th><th>Alert</th></tr></thead><tbody>' +
      state.data.products.map(function (p) {
        var low = p.stock <= p.reorder;
        return "<tr><td>" + esc(p.sku) + "</td><td>" + esc(p.name) + "</td><td>" + p.stock + "</td><td>" + p.reorder + "</td><td>" + esc(p.warehouse) + "</td><td>" + (low ? '<span class="bb-score-low">Low stock</span>' : "OK") + "</td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  function renderProcurement() {
    return '<div class="bb-card"><h2>Vendors <span class="bb-pro-tag">AI Performance Score</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Vendor</th><th>Contact</th><th>Rating</th><th>Orders</th></tr></thead><tbody>' +
      state.data.vendors.map(function (v) {
        return "<tr><td>" + esc(v.name) + "</td><td>" + esc(v.contact) + "</td><td>" + v.rating + " ★</td><td>" + v.orders + "</td></tr>";
      }).join("") + "</tbody></table></div></div>" +
      '<div class="bb-card"><h2>Purchase Orders</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Vendor</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>' +
      state.data.purchaseOrders.map(function (p) {
        return "<tr><td>" + esc(p.vendor) + "</td><td>" + fmt(p.amount) + "</td><td>" + esc(p.date) + "</td><td>" + esc(p.status) + "</td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  function renderDocuments() {
    var q = (state.docQuery || "").toLowerCase();
    var docs = state.data.documents.filter(function (d) {
      if (!q) return true;
      return (d.name + d.type + d.client).toLowerCase().indexOf(q) !== -1;
    });
    return (
      '<div class="bb-doc-search"><input type="search" id="bb-doc-search" placeholder="AI Search: e.g. last invoice for ABC Builders" value="' + esc(state.docQuery) + '"></div>' +
      '<div class="bb-card"><h2>Document Center</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Name</th><th>Type</th><th>Client</th><th>Date</th></tr></thead><tbody>' +
      docs.map(function (d) {
        return "<tr><td>" + esc(d.name) + "</td><td><span class=\"bb-tag\">" + esc(d.type) + "</span></td><td>" + esc(d.client) + "</td><td>" + esc(d.date) + "</td></tr>";
      }).join("") + "</tbody></table></div></div>"
    );
  }

  var RENDERERS = {
    dashboard: renderDashboard, copilot: renderCopilot, crm: renderCrm,
    invoices: renderInvoices, expenses: renderExpenses, revenue: renderRevenue,
    analytics: renderAnalytics, finance: renderFinance, quotations: renderQuotations,
    hr: renderHr, payroll: renderPayroll, projects: renderProjects,
    marketing: renderMarketing, support: renderSupport, inventory: renderInventory,
    procurement: renderProcurement, documents: renderDocuments,
  };

  function bindForms() {
    var leadForm = document.getElementById("bb-form-lead");
    if (leadForm) leadForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(leadForm);
      state.data.leads.push({ id: nextId(state.data.leads), name: fd.get("name"), contact: fd.get("contact"), email: fd.get("email"), stage: fd.get("stage"), value: Number(fd.get("value")) || 0, score: 50 + Math.floor(Math.random() * 40), region: fd.get("region") || "—", assigned: "Unassigned" });
      save(); render();
    };
    var invForm = document.getElementById("bb-form-inv");
    if (invForm) invForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(invForm);
      state.data.invoices.push({ id: nextId(state.data.invoices), client: fd.get("client"), amount: Number(fd.get("amount")), gst: Number(fd.get("gst")) || 0, date: new Date().toISOString().slice(0, 10), due: fd.get("due"), status: fd.get("status") });
      save(); render();
    };
    var expForm = document.getElementById("bb-form-exp");
    if (expForm) expForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(expForm);
      state.data.expenses.push({ id: nextId(state.data.expenses), category: fd.get("category"), vendor: fd.get("vendor"), amount: Number(fd.get("amount")), date: fd.get("date") || new Date().toISOString().slice(0, 10), recurring: fd.get("recurring") === "true" });
      save(); render();
    };
    var payrollBtn = document.getElementById("bb-run-payroll");
    if (payrollBtn) payrollBtn.onclick = function () {
      state.data.payrollRuns.unshift({ id: nextId(state.data.payrollRuns), month: new Date().toISOString().slice(0, 7), total: sum(state.data.employees, "salary"), status: "pending", employees: state.data.employees.length });
      save(); render();
    };
    var chatForm = document.getElementById("bb-chat-form");
    if (chatForm) chatForm.onsubmit = function (e) {
      e.preventDefault();
      var input = document.getElementById("bb-chat-input");
      var q = (input.value || "").trim();
      if (!q) return;
      state.data.chatHistory.push({ role: "user", text: q });
      state.data.chatHistory.push({ role: "ai", text: copilotReply(q) });
      save(); render();
      var msgs = document.getElementById("bb-chat-msgs");
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    };
    document.querySelectorAll("[data-ask]").forEach(function (btn) {
      btn.onclick = function () {
        var q = btn.getAttribute("data-ask");
        state.data.chatHistory.push({ role: "user", text: q });
        state.data.chatHistory.push({ role: "ai", text: copilotReply(q) });
        save(); render();
      };
    });
    var docSearch = document.getElementById("bb-doc-search");
    if (docSearch) docSearch.oninput = function () {
      state.docQuery = docSearch.value;
      var content = document.getElementById("bb-view-content");
      if (content) content.innerHTML = renderDocuments();
      bindForms();
    };
  }

  function render() {
    var root = document.getElementById("bb-root");
    if (!root) return;

    var navHtml = NAV.map(function (group) {
      return '<div class="bb-nav-section">' + esc(group.section) + "</div>" +
        group.items.map(function (n) {
          return '<button type="button" data-view="' + n.id + '" class="' + (state.view === n.id ? "active" : "") + '"><span class="icon">' + n.icon + "</span>" + esc(n.label) + "</button>";
        }).join("");
    }).join("");

    var fn = RENDERERS[state.view] || renderDashboard;

    root.innerHTML =
      '<aside class="bb-sidebar" id="bb-sidebar">' +
      '<div class="bb-brand"><strong>BizBuilt AI</strong><small>The SME Operating System</small><span class="bb-premium-badge">Premium</span></div>' +
      '<nav class="bb-nav">' + navHtml + "</nav>" +
      '<div class="bb-sidebar-foot"><a href="../bizbuilt-ai.html">← Product info</a><a href="../index.html">WorkPilot Tools</a></div></aside>' +
      '<div class="bb-main"><header class="bb-topbar">' +
      '<div style="display:flex;align-items:center;gap:12px"><button type="button" class="bb-menu-toggle" id="bb-menu-toggle">☰</button><h1>' + esc(TITLES[state.view]) + "</h1></div>" +
      '<div class="bb-topbar-actions"><button type="button" class="wp-theme-toggle bb-btn">🌙</button>' +
      '<a class="bb-btn" href="mailto:mml.products26@gmail.com?subject=BizBuilt%20AI%20Upgrade">Upgrade</a>' +
      '<button type="button" class="bb-btn" id="bb-reset-demo">Reset demo</button></div></header>' +
      '<div class="bb-content" id="bb-view-content">' + fn() + "</div></div>";

    root.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.onclick = function () {
        state.view = btn.getAttribute("data-view");
        state.tab = "";
        render();
      };
    });
    root.querySelectorAll("[data-tab]").forEach(function (btn) {
      btn.onclick = function () {
        state.tab = btn.getAttribute("data-tab");
        document.getElementById("bb-view-content").innerHTML = (RENDERERS[state.view] || renderDashboard)();
        bindForms();
        root.querySelectorAll("[data-tab]").forEach(function (b) {
          b.classList.toggle("active", b.getAttribute("data-tab") === state.tab);
        });
      };
    });

    var toggle = document.getElementById("bb-menu-toggle");
    var sidebar = document.getElementById("bb-sidebar");
    if (toggle && sidebar) toggle.onclick = function () { sidebar.classList.toggle("open"); };

    var reset = document.getElementById("bb-reset-demo");
    if (reset) reset.onclick = function () {
      if (confirm("Reset all demo data?")) { state.data = defaultData(); state.tab = ""; save(); render(); }
    };

    bindForms();
    var msgs = document.getElementById("bb-chat-msgs");
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  load();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
