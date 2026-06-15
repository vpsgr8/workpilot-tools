(function () {
  var STORAGE_KEY = "bizbuilt-data-v3";
  var state = { view: "dashboard", tabs: {}, data: null, docQuery: "" };

  function getTab(view, fallback) {
    if (!state.tabs[view]) state.tabs[view] = fallback;
    return state.tabs[view];
  }

  function refreshView() {
    var el = document.getElementById("bb-view-content");
    if (!el) return;
    var fn = RENDERERS[state.view] || renderDashboard;
    el.innerHTML = fn();
    bindForms();
    initBarcodes();
  }

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
      payrollStructures: [
        {
          id: 1,
          name: "Standard SME — India",
          description: "Basic 50% + HRA 20% + allowances with PF, ESI & Professional Tax",
          basicPercent: 50,
          hraPercent: 20,
          transportAllowance: 1600,
          medicalAllowance: 1250,
          specialAllowancePercent: 10,
          pfPercent: 12,
          esiPercent: 0.75,
          professionalTax: 200,
          tdsPercent: 5,
          savedAt: "2026-01-15",
        },
        {
          id: 2,
          name: "Senior Management",
          description: "Higher basic ratio with bonus component for leadership roles",
          basicPercent: 60,
          hraPercent: 25,
          transportAllowance: 3000,
          medicalAllowance: 2500,
          specialAllowancePercent: 15,
          pfPercent: 12,
          esiPercent: 0,
          professionalTax: 200,
          tdsPercent: 10,
          savedAt: "2026-02-01",
        },
      ],
      employeePayroll: [
        { empId: 1, structureId: 1, ctc: 660000, bankAccount: "HDFC ****4521", pan: "ABCDE1234F", uan: "100012345678" },
        { empId: 2, structureId: 2, ctc: 864000, bankAccount: "ICICI ****8890", pan: "FGHIJ5678K", uan: "100098765432" },
        { empId: 3, structureId: 1, ctc: 576000, bankAccount: "HDFC ****3312", pan: "KLMNO9012P", uan: "100055667788" },
      ],
      payslips: [
        { id: 1, empId: 1, month: "2026-05", gross: 55000, deductions: 6800, net: 48200, generatedAt: "2026-05-31" },
        { id: 2, empId: 2, month: "2026-05", gross: 72000, deductions: 12400, net: 59600, generatedAt: "2026-05-31" },
        { id: 3, empId: 3, month: "2026-05", gross: 48000, deductions: 5900, net: 42100, generatedAt: "2026-05-31" },
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
        { id: 1, sku: "PRD-001", barcode: "8901234567890", name: "Premium Widget", stock: 45, reorder: 20, warehouse: "Main", unitPrice: 1299 },
        { id: 2, sku: "PRD-002", barcode: "8901234567891", name: "Standard Kit", stock: 8, reorder: 15, warehouse: "Main", unitPrice: 599 },
        { id: 3, sku: "PRD-003", barcode: "8901234567892", name: "Service Pack A", stock: 120, reorder: 30, warehouse: "East", unitPrice: 249 },
      ],
      stockMovements: [
        { id: 1, productId: 1, type: "in", qty: 50, method: "manual", ref: "PO-102", note: "SupplyCo delivery", date: "2026-06-01T10:30:00" },
        { id: 2, productId: 1, type: "sale", qty: 5, method: "barcode", ref: "SALE-8841", note: "Bright Retail counter sale", date: "2026-06-10T14:22:00" },
        { id: 3, productId: 2, type: "sale", qty: 2, method: "barcode", ref: "SALE-8842", note: "Walk-in customer", date: "2026-06-12T11:05:00" },
        { id: 4, productId: 3, type: "out", qty: 10, method: "manual", ref: "ADJ-001", note: "Sample units sent", date: "2026-06-08T09:00:00" },
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
      if (raw) {
        state.data = JSON.parse(raw);
        var def = defaultData();
        ["payrollStructures", "employeePayroll", "payslips", "stockMovements"].forEach(function (k) {
          if (!state.data[k]) state.data[k] = def[k];
        });
        state.data.products.forEach(function (p) {
          if (!p.barcode) p.barcode = "8901234567" + String(890 + p.id).slice(-3);
          if (p.unitPrice == null) p.unitPrice = 0;
        });
        if (!state.data.stockMovements) state.data.stockMovements = def.stockMovements || [];
      } else {
        state.data = defaultData();
      }
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

  function getStructure(id) {
    return state.data.payrollStructures.find(function (s) { return s.id === id; });
  }

  function getEmpPayroll(empId) {
    return state.data.employeePayroll.find(function (p) { return p.empId === empId; });
  }

  function calcPayrollBreakdown(ctcAnnual, structure) {
    var monthly = ctcAnnual / 12;
    var basic = Math.round(monthly * (structure.basicPercent / 100));
    var hra = Math.round(monthly * (structure.hraPercent / 100));
    var special = Math.round(monthly * (structure.specialAllowancePercent / 100));
    var transport = structure.transportAllowance || 0;
    var medical = structure.medicalAllowance || 0;
    var gross = basic + hra + special + transport + medical;
    var pf = Math.round(basic * (structure.pfPercent / 100));
    var esi = structure.esiPercent ? Math.round(gross * (structure.esiPercent / 100)) : 0;
    var pt = structure.professionalTax || 0;
    var tds = Math.round(gross * ((structure.tdsPercent || 0) / 100));
    var deductions = pf + esi + pt + tds;
    var net = gross - deductions;
    return { basic: basic, hra: hra, special: special, transport: transport, medical: medical, gross: gross, pf: pf, esi: esi, pt: pt, tds: tds, deductions: deductions, net: net };
  }

  function generatePayslipHtml(emp, profile, structure, month) {
    var b = calcPayrollBreakdown(profile.ctc, structure);
    var company = state.data.company;
    return (
      "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Payslip " + esc(emp.name) + " " + month + "</title>" +
      "<style>body{font-family:Arial,sans-serif;max-width:640px;margin:40px auto;padding:24px;color:#111}" +
      "h1{font-size:20px;margin:0 0 4px}table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}" +
      "th,td{padding:8px 10px;border:1px solid #ddd;text-align:left}th{background:#f3f4f6}" +
      ".net{font-size:18px;font-weight:bold;color:#4f46e5}.header{border-bottom:2px solid #4f46e5;padding-bottom:12px;margin-bottom:16px}" +
      ".row{display:flex;justify-content:space-between;font-size:13px;margin:4px 0}</style></head><body>" +
      '<div class="header"><h1>' + esc(company) + "</h1><p>Payslip for " + esc(month) + "</p></div>" +
      '<div class="row"><span><strong>Employee:</strong> ' + esc(emp.name) + "</span><span><strong>Dept:</strong> " + esc(emp.dept) + "</span></div>" +
      '<div class="row"><span><strong>PAN:</strong> ' + esc(profile.pan) + "</span><span><strong>UAN:</strong> " + esc(profile.uan || "—") + "</span></div>" +
      '<div class="row"><span><strong>Bank:</strong> ' + esc(profile.bankAccount) + "</span><span><strong>Structure:</strong> " + esc(structure.name) + "</span></div>" +
      "<h3>Earnings</h3><table><tr><th>Component</th><th>Amount (₹)</th></tr>" +
      "<tr><td>Basic Salary</td><td>" + b.basic.toLocaleString("en-IN") + "</td></tr>" +
      "<tr><td>HRA</td><td>" + b.hra.toLocaleString("en-IN") + "</td></tr>" +
      "<tr><td>Special Allowance</td><td>" + b.special.toLocaleString("en-IN") + "</td></tr>" +
      "<tr><td>Transport</td><td>" + b.transport.toLocaleString("en-IN") + "</td></tr>" +
      "<tr><td>Medical</td><td>" + b.medical.toLocaleString("en-IN") + "</td></tr>" +
      "<tr><th>Gross Salary</th><th>" + b.gross.toLocaleString("en-IN") + "</th></tr></table>" +
      "<h3>Deductions</h3><table><tr><th>Component</th><th>Amount (₹)</th></tr>" +
      "<tr><td>PF (" + structure.pfPercent + "%)</td><td>" + b.pf.toLocaleString("en-IN") + "</td></tr>" +
      (b.esi ? "<tr><td>ESI</td><td>" + b.esi.toLocaleString("en-IN") + "</td></tr>" : "") +
      "<tr><td>Professional Tax</td><td>" + b.pt.toLocaleString("en-IN") + "</td></tr>" +
      (b.tds ? "<tr><td>TDS</td><td>" + b.tds.toLocaleString("en-IN") + "</td></tr>" : "") +
      "<tr><th>Total Deductions</th><th>" + b.deductions.toLocaleString("en-IN") + "</th></tr></table>" +
      '<p class="net">Net Pay: ₹' + b.net.toLocaleString("en-IN") + "</p>" +
      "<p style=\"font-size:12px;color:#666\">Generated by BizBuilt AI · MarketMind Labs</p></body></html>"
    );
  }

  function downloadPayslip(empId, month) {
    var emp = state.data.employees.find(function (e) { return e.id === empId; });
    var profile = getEmpPayroll(empId);
    if (!emp || !profile) return;
    var structure = getStructure(profile.structureId);
    if (!structure) return;
    var html = generatePayslipHtml(emp, profile, structure, month);
    var blob = new Blob([html], { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Payslip_" + emp.name.replace(/\s+/g, "_") + "_" + month + ".html";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function findProductByBarcode(code) {
    if (!code) return null;
    code = String(code).trim().toLowerCase();
    return state.data.products.find(function (p) {
      return (p.barcode && p.barcode.toLowerCase() === code) ||
        (p.sku && p.sku.toLowerCase() === code) ||
        String(p.id) === code;
    }) || null;
  }

  function recordStockMovement(productId, type, qty, method, ref, note) {
    state.data.stockMovements.unshift({
      id: nextId(state.data.stockMovements),
      productId: productId,
      type: type,
      qty: qty,
      method: method || "manual",
      ref: ref || "",
      note: note || "",
      date: new Date().toISOString(),
    });
  }

  function adjustStock(productId, delta, type, method, ref, note) {
    var product = state.data.products.find(function (p) { return p.id === productId; });
    if (!product) return { ok: false, msg: "Product not found." };
    if (delta < 0 && product.stock + delta < 0) {
      return { ok: false, msg: "Insufficient stock for " + product.name + ". Available: " + product.stock };
    }
    product.stock += delta;
    recordStockMovement(productId, type, Math.abs(delta), method, ref, note);
    save();
    return { ok: true, msg: product.name + " — stock now " + product.stock + " units.", product: product };
  }

  function processBarcodeSale(barcode, qty, ref, note) {
    qty = Math.max(1, Number(qty) || 1);
    var product = findProductByBarcode(barcode);
    if (!product) return { ok: false, msg: "No product matched barcode: " + barcode };
    return adjustStock(product.id, -qty, "sale", "barcode", ref || "SALE-" + Date.now(), note || "Barcode sale");
  }

  function generateBarcodeForSku(sku, id) {
    var base = String(sku || "SKU").replace(/\W/g, "").toUpperCase();
    var hash = base.split("").reduce(function (a, c) { return a + c.charCodeAt(0); }, id || 0);
    return "890" + String(1000000000 + (hash % 999999999)).slice(-10);
  }

  function barcodeValue(product) {
    return product.barcode || product.sku || String(product.id);
  }

  function initBarcodes() {
    if (typeof JsBarcode === "undefined") return;
    state.data.products.forEach(function (p) {
      document.querySelectorAll("[data-barcode-for=\"" + p.id + "\"]").forEach(function (el) {
        try {
          JsBarcode(el, barcodeValue(p), {
            format: "CODE128",
            width: el.getAttribute("data-bc-width") ? Number(el.getAttribute("data-bc-width")) : 1.8,
            height: el.getAttribute("data-bc-height") ? Number(el.getAttribute("data-bc-height")) : 48,
            margin: 6,
            fontSize: 11,
            displayValue: true,
          });
        } catch (err) {}
      });
    });
  }

  function downloadBarcodeSvg(productId) {
    var p = state.data.products.find(function (x) { return x.id === productId; });
    if (!p) return;
    var svg = document.querySelector('[data-barcode-for="' + productId + '"].bb-barcode-full');
    if (!svg && typeof JsBarcode !== "undefined") {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      JsBarcode(svg, barcodeValue(p), { format: "CODE128", width: 2, height: 70, margin: 8, fontSize: 14, displayValue: true });
    }
    if (!svg) return;
    var xml = new XMLSerializer().serializeToString(svg);
    var blob = new Blob([xml], { type: "image/svg+xml" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Barcode_" + (p.sku || p.id) + ".svg";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function printBarcodeLabel(productId) {
    var p = state.data.products.find(function (x) { return x.id === productId; });
    if (!p || typeof JsBarcode === "undefined") return;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(svg, barcodeValue(p), { format: "CODE128", width: 2.2, height: 80, margin: 10, fontSize: 14, displayValue: true });
    var xml = new XMLSerializer().serializeToString(svg);
    var win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      "<!DOCTYPE html><html><head><title>Label " + esc(p.sku) + "</title>" +
      "<style>body{font-family:Arial,sans-serif;text-align:center;padding:24px}h2{margin:0 0 8px;font-size:16px}.meta{font-size:12px;color:#555;margin-top:8px}</style></head><body>" +
      "<h2>" + esc(p.name) + "</h2><p class=\"meta\">SKU: " + esc(p.sku) + " · " + fmt(p.unitPrice || 0) + "</p>" +
      xml + "<script>window.onload=function(){window.print()}<\/script></body></html>"
    );
    win.document.close();
  }

  function renderBarcodeLabelsGrid() {
    return '<div class="bb-barcode-labels">' + state.data.products.map(function (p) {
      return (
        '<div class="bb-barcode-label">' +
        "<h4>" + esc(p.name) + "</h4>" +
        '<p class="bb-barcode-meta">SKU: <strong>' + esc(p.sku) + "</strong> · Code: " + esc(p.barcode || barcodeValue(p)) + "</p>" +
        '<svg class="bb-barcode-full" data-barcode-for="' + p.id + '" data-bc-width="2" data-bc-height="64"></svg>' +
        '<div class="bb-barcode-actions">' +
        '<button type="button" class="bb-btn" data-download-barcode="' + p.id + '">⬇ Download</button>' +
        '<button type="button" class="bb-btn bb-btn-primary" data-print-barcode="' + p.id + '">🖨 Print Label</button>' +
        "</div></div>"
      );
    }).join("") + "</div>";
  }

  function movementLabel(type) {
    if (type === "sale") return "Sale (out)";
    if (type === "in") return "Stock In";
    if (type === "out") return "Stock Out";
    return type;
  }

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
      '<div class="bb-widget"><label>Outstanding Invoices</label><strong>' + fmt(k.outstanding) + '</strong><small>' + k.pendingInvoices + " pending</small></div>" +
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
    var tab = getTab("crm", "pipeline");
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
        '<label>Email<input name="email" type="email"></label><label>Phone<input name="phone" placeholder="+91…"></label>' +
        '<label>Value (₹)<input name="value" type="number" min="0"></label>' +
        '<label>Region<input name="region" placeholder="East, West…"></label>' +
        '<label>Assigned To<input name="assigned" placeholder="Sales rep name"></label>' +
        '<label>Stage<select name="stage">' + PIPELINE.map(function (s) { return "<option>" + esc(s) + "</option>"; }).join("") + "</select></label>" +
        '</form><button type="submit" form="bb-form-lead" class="bb-btn bb-btn-primary">Add Lead</button></div>' +
        '<div class="bb-card"><h2>All Leads <span class="bb-pro-tag">AI Scoring</span></h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Company</th><th>Contact</th><th>Stage</th><th>Score</th><th>Region</th><th>Value</th><th>Assigned</th><th></th></tr></thead><tbody>' +
        state.data.leads.map(function (l) {
          var sc = l.score >= 80 ? "bb-score-high" : l.score >= 50 ? "bb-score-med" : "bb-score-low";
          return "<tr><td>" + esc(l.name) + "</td><td>" + esc(l.contact) + "</td><td><span class=\"bb-status\">" + esc(l.stage) + "</span></td><td class=\"" + sc + "\">" + l.score + "</td><td>" + esc(l.region) + "</td><td>" + fmt(l.value) + "</td><td>" + esc(l.assigned) + '</td><td><button type="button" class="bb-btn" data-del-lead="' + l.id + '">Remove</button></td></tr>';
        }).join("") + "</tbody></table></div></div>";
    }
    return head + '<div class="bb-card"><h2>Sales Pipeline</h2><p style="color:var(--bb-muted);font-size:13px;margin:0 0 16px">Drag-free view of all 7 stages — New Lead through Won/Lost.</p>' + renderPipeline() + "</div>";
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
    var tab = getTab("finance", "banking");
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
    var tab = getTab("hr", "directory");
    var head = tabs([
      { id: "directory", label: "Employee Directory" },
      { id: "attendance", label: "Attendance" },
      { id: "leave", label: "Leave Management" },
    ], tab);
    if (tab === "attendance") {
      return head +
        '<div class="bb-card"><h2>Clock In / Out <span class="bb-pro-tag">GPS / Biometric ready</span></h2>' +
        '<form id="bb-form-attendance" class="bb-form-grid">' +
        '<label>Employee<select name="empId" required>' + state.data.employees.map(function (e) {
          return '<option value="' + e.id + '">' + esc(e.name) + "</option>";
        }).join("") + "</select></label>" +
        '<label>Clock In<input name="in" type="time" value="09:00"></label>' +
        '<label>Clock Out<input name="out" type="time" value="18:00"></label>' +
        '<label>Type<select name="type"><option value="office">Office</option><option value="remote">Remote</option><option value="field">Field</option></select></label>' +
        '</form><button type="submit" form="bb-form-attendance" class="bb-btn bb-btn-primary">Record Attendance</button></div>' +
        '<div class="bb-card"><h2>Today\'s Attendance</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Employee</th><th>Date</th><th>Clock In</th><th>Clock Out</th><th>Type</th></tr></thead><tbody>' +
        state.data.attendance.map(function (a) {
          var emp = state.data.employees.find(function (e) { return e.id === a.empId; });
          return "<tr><td>" + esc(emp ? emp.name : "—") + "</td><td>" + esc(a.date) + "</td><td>" + esc(a.in) + "</td><td>" + esc(a.out) + "</td><td>" + esc(a.type) + "</td></tr>";
        }).join("") + "</tbody></table></div></div>";
    }
    if (tab === "leave") {
      return head +
        '<div class="bb-card"><h2>Apply for Leave</h2><form id="bb-form-leave" class="bb-form-grid">' +
        '<label>Employee<select name="empId" required>' + state.data.employees.map(function (e) {
          return '<option value="' + e.id + '">' + esc(e.name) + "</option>";
        }).join("") + "</select></label>" +
        '<label>Leave Type<select name="type"><option>Casual</option><option>Sick</option><option>Paid</option></select></label>' +
        '<label>From<input name="from" type="date" required></label><label>To<input name="to" type="date" required></label>' +
        '</form><button type="submit" form="bb-form-leave" class="bb-btn bb-btn-primary">Submit Leave Request</button></div>' +
        '<div class="bb-card"><h2>Leave Requests</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Status</th><th></th></tr></thead><tbody>' +
        state.data.leaves.map(function (l) {
          var emp = state.data.employees.find(function (e) { return e.id === l.empId; });
          return "<tr><td>" + esc(emp ? emp.name : "—") + "</td><td>" + esc(l.type) + "</td><td>" + esc(l.from) + "</td><td>" + esc(l.to) + "</td><td><span class=\"bb-status pending\">" + esc(l.status) + '</span></td><td><button type="button" class="bb-btn" data-approve-leave="' + l.id + '">Approve</button></td></tr>';
        }).join("") + "</tbody></table></div></div>";
    }
    return head +
      '<div class="bb-card"><h2>Add Employee</h2><form id="bb-form-emp" class="bb-form-grid">' +
      '<label>Full Name<input name="name" required></label><label>Role<input name="role" required></label>' +
      '<label>Department<input name="dept" required></label><label>Join Date<input name="join" type="date"></label>' +
      '<label>Monthly Salary (₹)<input name="salary" type="number" min="0"></label>' +
      '<label>Skills<input name="skills" placeholder="e.g. CRM, Excel"></label>' +
      '</form><button type="submit" form="bb-form-emp" class="bb-btn bb-btn-primary">Add Employee</button></div>' +
      '<div class="bb-card"><h2>Employee Directory</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Name</th><th>Role</th><th>Dept</th><th>Skills</th><th>Salary</th><th>Status</th><th></th></tr></thead><tbody>' +
      state.data.employees.map(function (e) {
        return "<tr><td>" + esc(e.name) + "</td><td>" + esc(e.role) + "</td><td>" + esc(e.dept) + "</td><td>" + esc(e.skills) + "</td><td>" + fmt(e.salary) + "</td><td>" + esc(e.status || "active") + '</td><td><button type="button" class="bb-btn" data-del-emp="' + e.id + '">Remove</button></td></tr>';
      }).join("") + "</tbody></table></div></div>";
  }

  function renderPayrollStructureCard(s) {
    var sample = calcPayrollBreakdown(660000, s);
    return (
      '<div class="bb-card" style="margin-bottom:12px">' +
      "<h3>" + esc(s.name) + ' <button type="button" class="bb-btn" data-del-structure="' + s.id + '" style="float:right;font-size:12px">Delete</button></h3>' +
      "<p style=\"color:var(--bb-muted);font-size:13px;margin:0 0 12px\">" + esc(s.description) + "</p>" +
      '<div class="bb-form-grid" style="font-size:13px">' +
      "<div><strong>Basic:</strong> " + s.basicPercent + "%</div><div><strong>HRA:</strong> " + s.hraPercent + "%</div>" +
      "<div><strong>Transport:</strong> " + fmt(s.transportAllowance) + "</div><div><strong>Medical:</strong> " + fmt(s.medicalAllowance) + "</div>" +
      "<div><strong>Special:</strong> " + s.specialAllowancePercent + "%</div><div><strong>PF:</strong> " + s.pfPercent + "%</div>" +
      "<div><strong>ESI:</strong> " + s.esiPercent + "%</div><div><strong>Prof. Tax:</strong> " + fmt(s.professionalTax) + "</div>" +
      "<div><strong>TDS:</strong> " + s.tdsPercent + "%</div><div><strong>Saved:</strong> " + esc(s.savedAt) + "</div>" +
      "</div><p style=\"margin-top:12px;font-size:13px\"><strong>Sample (₹6.6L CTC):</strong> Gross " + fmt(sample.gross) + " → Net " + fmt(sample.net) + "</p></div>"
    );
  }

  function renderPayroll() {
    var tab = getTab("payroll", "structure");
    var head = tabs([
      { id: "structure", label: "Salary Structure" },
      { id: "employees", label: "Employee Payroll" },
      { id: "process", label: "Process Payroll" },
      { id: "payslips", label: "Payslips" },
    ], tab);

    if (tab === "structure") {
      return head +
        '<div class="bb-card"><h2>Define & Save Payroll Structure</h2>' +
        "<p style=\"color:var(--bb-muted);font-size:13px;margin:0 0 16px\">Create a reusable salary template with earnings and deductions. Save it and assign to employees.</p>" +
        '<form id="bb-form-structure" class="bb-form-grid">' +
        '<label>Structure Name<input name="name" required placeholder="e.g. Standard SME India"></label>' +
        '<label>Description<input name="description" placeholder="Brief notes"></label>' +
        '<label>Basic Salary %<input name="basicPercent" type="number" min="0" max="100" value="50" required></label>' +
        '<label>HRA %<input name="hraPercent" type="number" min="0" max="100" value="20"></label>' +
        '<label>Special Allowance %<input name="specialAllowancePercent" type="number" min="0" max="100" value="10"></label>' +
        '<label>Transport Allowance (₹)<input name="transportAllowance" type="number" min="0" value="1600"></label>' +
        '<label>Medical Allowance (₹)<input name="medicalAllowance" type="number" min="0" value="1250"></label>' +
        '<label>PF Deduction %<input name="pfPercent" type="number" min="0" max="100" value="12"></label>' +
        '<label>ESI Deduction %<input name="esiPercent" type="number" min="0" max="100" value="0.75" step="0.01"></label>' +
        '<label>Professional Tax (₹)<input name="professionalTax" type="number" min="0" value="200"></label>' +
        '<label>TDS %<input name="tdsPercent" type="number" min="0" max="100" value="5"></label>' +
        '</form><button type="submit" form="bb-form-structure" class="bb-btn bb-btn-primary">Save Structure for Later Use</button></div>' +
        "<h2 style=\"margin:24px 0 12px;font-size:1rem\">Saved Structures (" + state.data.payrollStructures.length + ")</h2>" +
        state.data.payrollStructures.map(renderPayrollStructureCard).join("");
    }

    if (tab === "employees") {
      return head +
        '<div class="bb-card"><h2>Assign Payroll to Employee</h2><form id="bb-form-emp-payroll" class="bb-form-grid">' +
        '<label>Employee<select name="empId" required>' + state.data.employees.map(function (e) {
          return '<option value="' + e.id + '">' + esc(e.name) + "</option>";
        }).join("") + "</select></label>" +
        '<label>Salary Structure<select name="structureId" required>' + state.data.payrollStructures.map(function (s) {
          return '<option value="' + s.id + '">' + esc(s.name) + "</option>";
        }).join("") + "</select></label>" +
        '<label>Annual CTC (₹)<input name="ctc" type="number" min="0" required placeholder="660000"></label>' +
        '<label>PAN<input name="pan" placeholder="ABCDE1234F"></label>' +
        '<label>UAN<input name="uan" placeholder="PF UAN number"></label>' +
        '<label>Bank Account<input name="bankAccount" placeholder="HDFC ****1234"></label>' +
        '</form><button type="submit" form="bb-form-emp-payroll" class="bb-btn bb-btn-primary">Save Employee Payroll</button></div>' +
        '<div class="bb-card"><h2>Employee Payroll Profiles</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Employee</th><th>Structure</th><th>CTC (Annual)</th><th>Monthly Net (est.)</th><th>PAN</th><th>Bank</th></tr></thead><tbody>' +
        state.data.employeePayroll.map(function (p) {
          var emp = state.data.employees.find(function (e) { return e.id === p.empId; });
          var str = getStructure(p.structureId);
          var net = str ? calcPayrollBreakdown(p.ctc, str).net : 0;
          return "<tr><td>" + esc(emp ? emp.name : "—") + "</td><td>" + esc(str ? str.name : "—") + "</td><td>" + fmt(p.ctc) + "</td><td>" + fmt(net) + "</td><td>" + esc(p.pan) + "</td><td>" + esc(p.bankAccount) + "</td></tr>";
        }).join("") + "</tbody></table></div></div>";
    }

    if (tab === "payslips") {
      var month = new Date().toISOString().slice(0, 7);
      return head +
        '<div class="bb-card"><h2>Download Payslips</h2>' +
        "<p style=\"color:var(--bb-muted);font-size:13px;margin:0 0 16px\">Generate and download individual payslips as HTML (print-ready). Select month and employee below.</p>" +
        '<div class="bb-form-grid" style="margin-bottom:16px">' +
        '<label>Payroll Month<input type="month" id="bb-payslip-month" value="' + month + '"></label></div>' +
        '<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Employee</th><th>Structure</th><th>Est. Net Pay</th><th>Last Generated</th><th>Download</th></tr></thead><tbody>' +
        state.data.employeePayroll.map(function (p) {
          var emp = state.data.employees.find(function (e) { return e.id === p.empId; });
          var str = getStructure(p.structureId);
          var net = str ? calcPayrollBreakdown(p.ctc, str).net : 0;
          var slip = state.data.payslips.filter(function (s) { return s.empId === p.empId; }).sort(function (a, b) { return b.month.localeCompare(a.month); })[0];
          return "<tr><td>" + esc(emp ? emp.name : "—") + "</td><td>" + esc(str ? str.name : "—") + "</td><td>" + fmt(net) + "</td><td>" + (slip ? esc(slip.month) : "—") + '</td><td><button type="button" class="bb-btn bb-btn-primary" data-download-payslip="' + p.empId + '">⬇ Download Payslip</button></td></tr>';
        }).join("") + "</tbody></table></div></div>" +
        '<div class="bb-card"><h2>Payslip History</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Employee</th><th>Month</th><th>Gross</th><th>Deductions</th><th>Net Pay</th><th></th></tr></thead><tbody>' +
        state.data.payslips.map(function (s) {
          var emp = state.data.employees.find(function (e) { return e.id === s.empId; });
          return "<tr><td>" + esc(emp ? emp.name : "—") + "</td><td>" + esc(s.month) + "</td><td>" + fmt(s.gross) + "</td><td>" + fmt(s.deductions) + "</td><td>" + fmt(s.net) + '</td><td><button type="button" class="bb-btn" data-download-payslip-hist="' + s.empId + '" data-payslip-month="' + esc(s.month) + '">Download</button></td></tr>';
        }).join("") + "</tbody></table></div></div>";
    }

    var totalNet = state.data.employeePayroll.reduce(function (t, p) {
      var str = getStructure(p.structureId);
      return t + (str ? calcPayrollBreakdown(p.ctc, str).net : 0);
    }, 0);
    return head +
      '<div class="bb-kpi-grid"><div class="bb-kpi"><label>Total Monthly Net</label><strong>' + fmt(totalNet) + "</strong></div>" +
      '<div class="bb-kpi"><label>Employees</label><strong>' + state.data.employeePayroll.length + "</strong></div></div>" +
      '<div class="bb-card"><h2>Process Payroll <span class="bb-pro-tag">AI Error Detection</span></h2>' +
      "<p style=\"color:var(--bb-muted);font-size:13px;margin:0 0 16px\">Generates payslips for all employees using saved structures and records payroll run.</p>" +
      '<label style="display:block;margin-bottom:12px;font-size:13px">Payroll Month <input type="month" id="bb-process-month" value="' + new Date().toISOString().slice(0, 7) + '" style="margin-left:8px;padding:6px 10px;border:1px solid var(--bb-line);border-radius:6px"></label>' +
      '<button type="button" class="bb-btn bb-btn-primary" id="bb-run-payroll">Run Payroll & Generate Payslips</button></div>' +
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
    var tab = getTab("inventory", "catalog");
    var head = tabs([
      { id: "catalog", label: "Product Catalog" },
      { id: "barcodes", label: "Barcode Generator" },
      { id: "barcode", label: "Barcode Sale" },
      { id: "stock", label: "Stock In / Out" },
      { id: "history", label: "Movement Log" },
    ], tab);

    var lowCount = state.data.products.filter(function (p) { return p.stock <= p.reorder; }).length;
    var summary = '<div class="bb-kpi-grid">' +
      '<div class="bb-kpi"><label>Total SKUs</label><strong>' + state.data.products.length + "</strong></div>" +
      '<div class="bb-kpi"><label>Total Units in Stock</label><strong>' + state.data.products.reduce(function (t, p) { return t + p.stock; }, 0) + "</strong></div>" +
      '<div class="bb-kpi"><label>Low Stock Alerts</label><strong class="' + (lowCount ? "bb-score-low" : "bb-score-high") + '">' + lowCount + "</strong></div></div>";

    if (tab === "barcodes") {
      return head + summary +
        '<div class="bb-card"><h2>Barcode Generator — one label per SKU</h2>' +
        "<p style=\"color:var(--bb-muted);font-size:13px;margin:0 0 16px\">Generate printable CODE128 barcodes for every product. Stick labels on stock — scan them in <strong>Barcode Sale</strong> to auto-deduct inventory.</p>" +
        '<button type="button" class="bb-btn bb-btn-primary" id="bb-print-all-barcodes">🖨 Print All Labels</button></div>' +
        renderBarcodeLabelsGrid();
    }

    if (tab === "barcode") {
      return head + summary +
        '<div class="bb-card bb-barcode-scan">' +
        "<h2>📷 Scan Barcode to Sell</h2>" +
        "<p style=\"color:var(--bb-muted);font-size:13px;margin:0 0 16px\">Stick a barcode on each product. Scan with a USB/barcode gun (or type the code) — stock deducts automatically by quantity sold.</p>" +
        '<form id="bb-form-barcode-sale" class="bb-form-grid">' +
        '<label>Barcode / SKU<input name="barcode" id="bb-barcode-input" required placeholder="Scan or type barcode…" autocomplete="off" autofocus></label>' +
        '<label>Qty Sold<input name="qty" type="number" min="1" value="1" id="bb-barcode-qty"></label>' +
        '<label>Sale Ref (optional)<input name="ref" placeholder="Invoice / receipt no."></label>' +
        '<label>Note<input name="note" placeholder="Customer name, etc."></label>' +
        '</form><button type="submit" form="bb-form-barcode-sale" class="bb-btn bb-btn-primary">Complete Sale & Deduct Stock</button>' +
        '<p id="bb-barcode-msg" class="bb-stock-msg" role="status" aria-live="polite"></p>' +
        "<h3 style=\"margin:24px 0 12px;font-size:14px\">Demo barcodes to try</h3>" +
        '<div class="bb-barcode-chips">' +
        state.data.products.map(function (p) {
          return '<button type="button" class="bb-barcode-chip" data-fill-barcode="' + esc(p.barcode) + '">' + esc(p.name) + " · " + esc(p.barcode) + "</button>";
        }).join("") +
        "</div></div>" +
        '<div class="bb-card"><h2>Live Stock After Sales</h2>' + renderProductTable(true) + "</div>";
    }

    if (tab === "stock") {
      return head + summary +
        '<div class="bb-card"><h2>Manual Stock Adjustment</h2>' +
        "<p style=\"color:var(--bb-muted);font-size:13px;margin:0 0 16px\">Receive new stock, return goods, or adjust counts without a sale.</p>" +
        '<form id="bb-form-stock-move" class="bb-form-grid">' +
        '<label>Product<select name="productId" required>' + state.data.products.map(function (p) {
          return '<option value="' + p.id + '">' + esc(p.name) + " (" + p.stock + " in stock)</option>";
        }).join("") + "</select></label>" +
        '<label>Or Barcode<input name="barcodeAlt" placeholder="Optional — overrides product select"></label>' +
        '<label>Movement<select name="direction" required><option value="in">Stock In (+)</option><option value="out">Stock Out (−)</option></select></label>' +
        '<label>Quantity<input name="qty" type="number" min="1" value="1" required></label>' +
        '<label>Reference<input name="ref" placeholder="PO no., return ref…"></label>' +
        '<label>Note<input name="note" placeholder="Reason for adjustment"></label>' +
        '</form><button type="submit" form="bb-form-stock-move" class="bb-btn bb-btn-primary">Update Stock</button>' +
        '<p id="bb-stock-msg" class="bb-stock-msg" role="status"></p></div>' +
        '<div class="bb-card"><h2>Current Levels</h2>' + renderProductTable(true) + "</div>";
    }

    if (tab === "history") {
      return head + summary +
        '<div class="bb-card"><h2>Stock Movement Log</h2><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Method</th><th>Ref</th><th>Note</th></tr></thead><tbody>' +
        state.data.stockMovements.map(function (m) {
          var p = state.data.products.find(function (x) { return x.id === m.productId; });
          var typeCls = m.type === "sale" || m.type === "out" ? "bb-score-low" : "bb-score-high";
          return "<tr><td>" + esc(m.date.slice(0, 16).replace("T", " ")) + "</td><td>" + esc(p ? p.name : "—") + '</td><td class="' + typeCls + '">' + esc(movementLabel(m.type)) + "</td><td>" + m.qty + "</td><td><span class=\"bb-tag\">" + esc(m.method) + "</span></td><td>" + esc(m.ref) + "</td><td>" + esc(m.note) + "</td></tr>";
        }).join("") + "</tbody></table></div></div>";
    }

    return head + summary +
      '<div class="bb-card"><h2>Add Product with Barcode</h2>' +
      '<form id="bb-form-product" class="bb-form-grid">' +
      '<label>Product Name<input name="name" required></label>' +
      '<label>SKU<input name="sku" required placeholder="PRD-004"></label>' +
      '<label>Barcode<input name="barcode" placeholder="Auto-generated if empty"></label>' +
      '<label>Opening Stock<input name="stock" type="number" min="0" value="0"></label>' +
      '<label>Reorder Level<input name="reorder" type="number" min="0" value="10"></label>' +
      '<label>Warehouse<input name="warehouse" value="Main"></label>' +
      '<label>Unit Price (₹)<input name="unitPrice" type="number" min="0"></label>' +
      '</form><button type="submit" form="bb-form-product" class="bb-btn bb-btn-primary">Add Product</button></div>' +
      '<div class="bb-card"><h2>Product Catalog <span class="bb-pro-tag">Barcode tracked</span></h2>' + renderProductTable(true) + "</div>" +
      '<div class="bb-card"><h2>Quick Barcode Preview</h2>' + renderBarcodeLabelsGrid();
  }

  function renderProductTable(showBarcode) {
    return '<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>SKU</th>' +
      (showBarcode ? "<th>Barcode</th><th>Scan Code</th>" : "") +
      "<th>Product</th><th>Stock</th><th>Reorder</th><th>Price</th><th>Warehouse</th><th>Status</th>" +
      (showBarcode ? "<th>Label</th>" : "") +
      "</tr></thead><tbody>" +
      state.data.products.map(function (p) {
        var low = p.stock <= p.reorder;
        return "<tr><td>" + esc(p.sku) + "</td>" +
          (showBarcode ? "<td><code style=\"font-size:11px\">" + esc(p.barcode || "—") + "</code></td>" +
          '<td><svg class="bb-barcode-mini" data-barcode-for="' + p.id + '" data-bc-width="1.2" data-bc-height="32"></svg></td>' : "") +
          "<td>" + esc(p.name) + "</td><td><strong>" + p.stock + "</strong></td><td>" + p.reorder + "</td><td>" + fmt(p.unitPrice || 0) + "</td><td>" + esc(p.warehouse) + "</td><td>" +
          (low ? '<span class="bb-score-low">Low stock</span>' : '<span class="bb-score-high">OK</span>') + "</td>" +
          (showBarcode ? '<td><button type="button" class="bb-btn" data-download-barcode="' + p.id + '" title="Download">⬇</button> ' +
          '<button type="button" class="bb-btn" data-print-barcode="' + p.id + '" title="Print">🖨</button></td>' : "") +
          "</tr>";
      }).join("") + "</tbody></table></div>";
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
      state.data.leads.push({
        id: nextId(state.data.leads), name: fd.get("name"), contact: fd.get("contact"),
        email: fd.get("email"), phone: fd.get("phone") || "", stage: fd.get("stage"),
        value: Number(fd.get("value")) || 0, score: 50 + Math.floor(Math.random() * 40),
        region: fd.get("region") || "—", assigned: fd.get("assigned") || "Unassigned",
      });
      save(); refreshView();
    };

    var empForm = document.getElementById("bb-form-emp");
    if (empForm) empForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(empForm);
      var id = nextId(state.data.employees);
      state.data.employees.push({
        id: id, name: fd.get("name"), role: fd.get("role"), dept: fd.get("dept"),
        join: fd.get("join") || new Date().toISOString().slice(0, 10),
        salary: Number(fd.get("salary")) || 0, skills: fd.get("skills") || "", status: "active",
      });
      save(); refreshView();
    };

    var attForm = document.getElementById("bb-form-attendance");
    if (attForm) attForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(attForm);
      state.data.attendance.unshift({
        id: nextId(state.data.attendance), empId: Number(fd.get("empId")),
        date: new Date().toISOString().slice(0, 10), in: fd.get("in"), out: fd.get("out"), type: fd.get("type"),
      });
      save(); refreshView();
    };

    var leaveForm = document.getElementById("bb-form-leave");
    if (leaveForm) leaveForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(leaveForm);
      state.data.leaves.push({
        id: nextId(state.data.leaves), empId: Number(fd.get("empId")),
        type: fd.get("type"), from: fd.get("from"), to: fd.get("to"), status: "pending",
      });
      save(); refreshView();
    };

    var structForm = document.getElementById("bb-form-structure");
    if (structForm) structForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(structForm);
      state.data.payrollStructures.push({
        id: nextId(state.data.payrollStructures),
        name: fd.get("name"), description: fd.get("description") || "",
        basicPercent: Number(fd.get("basicPercent")), hraPercent: Number(fd.get("hraPercent")),
        specialAllowancePercent: Number(fd.get("specialAllowancePercent")),
        transportAllowance: Number(fd.get("transportAllowance")),
        medicalAllowance: Number(fd.get("medicalAllowance")),
        pfPercent: Number(fd.get("pfPercent")), esiPercent: Number(fd.get("esiPercent")),
        professionalTax: Number(fd.get("professionalTax")), tdsPercent: Number(fd.get("tdsPercent")),
        savedAt: new Date().toISOString().slice(0, 10),
      });
      save(); refreshView();
    };

    var empPayForm = document.getElementById("bb-form-emp-payroll");
    if (empPayForm) empPayForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(empPayForm);
      var empId = Number(fd.get("empId"));
      var existing = getEmpPayroll(empId);
      var row = {
        empId: empId, structureId: Number(fd.get("structureId")), ctc: Number(fd.get("ctc")),
        pan: fd.get("pan") || "", uan: fd.get("uan") || "", bankAccount: fd.get("bankAccount") || "",
      };
      if (existing) {
        Object.assign(existing, row);
      } else {
        state.data.employeePayroll.push(row);
      }
      save(); refreshView();
    };

    var invForm = document.getElementById("bb-form-inv");
    if (invForm) invForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(invForm);
      state.data.invoices.push({ id: nextId(state.data.invoices), client: fd.get("client"), amount: Number(fd.get("amount")), gst: Number(fd.get("gst")) || 0, date: new Date().toISOString().slice(0, 10), due: fd.get("due"), status: fd.get("status") });
      save(); refreshView();
    };

    var expForm = document.getElementById("bb-form-exp");
    if (expForm) expForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(expForm);
      state.data.expenses.push({ id: nextId(state.data.expenses), category: fd.get("category"), vendor: fd.get("vendor"), amount: Number(fd.get("amount")), date: fd.get("date") || new Date().toISOString().slice(0, 10), recurring: fd.get("recurring") === "true" });
      save(); refreshView();
    };

    var payrollBtn = document.getElementById("bb-run-payroll");
    if (payrollBtn) payrollBtn.onclick = function () {
      var monthEl = document.getElementById("bb-process-month");
      var month = monthEl ? monthEl.value : new Date().toISOString().slice(0, 7);
      var total = 0;
      state.data.employeePayroll.forEach(function (p) {
        var str = getStructure(p.structureId);
        if (!str) return;
        var b = calcPayrollBreakdown(p.ctc, str);
        total += b.net;
        var existing = state.data.payslips.find(function (s) { return s.empId === p.empId && s.month === month; });
        if (existing) {
          existing.gross = b.gross; existing.deductions = b.deductions; existing.net = b.net;
        } else {
          state.data.payslips.push({ id: nextId(state.data.payslips), empId: p.empId, month: month, gross: b.gross, deductions: b.deductions, net: b.net, generatedAt: new Date().toISOString().slice(0, 10) });
        }
      });
      state.data.payrollRuns.unshift({ id: nextId(state.data.payrollRuns), month: month, total: total, status: "paid", employees: state.data.employeePayroll.length });
      save(); refreshView();
    };

    document.querySelectorAll("[data-del-lead]").forEach(function (btn) {
      btn.onclick = function () {
        var id = Number(btn.getAttribute("data-del-lead"));
        state.data.leads = state.data.leads.filter(function (l) { return l.id !== id; });
        save(); refreshView();
      };
    });

    document.querySelectorAll("[data-del-emp]").forEach(function (btn) {
      btn.onclick = function () {
        var id = Number(btn.getAttribute("data-del-emp"));
        state.data.employees = state.data.employees.filter(function (e) { return e.id !== id; });
        state.data.employeePayroll = state.data.employeePayroll.filter(function (p) { return p.empId !== id; });
        save(); refreshView();
      };
    });

    document.querySelectorAll("[data-approve-leave]").forEach(function (btn) {
      btn.onclick = function () {
        var id = Number(btn.getAttribute("data-approve-leave"));
        var leave = state.data.leaves.find(function (l) { return l.id === id; });
        if (leave) leave.status = "approved";
        save(); refreshView();
      };
    });

    document.querySelectorAll("[data-del-structure]").forEach(function (btn) {
      btn.onclick = function () {
        var id = Number(btn.getAttribute("data-del-structure"));
        if (!confirm("Delete this payroll structure?")) return;
        state.data.payrollStructures = state.data.payrollStructures.filter(function (s) { return s.id !== id; });
        save(); refreshView();
      };
    });

    document.querySelectorAll("[data-download-payslip]").forEach(function (btn) {
      btn.onclick = function () {
        var empId = Number(btn.getAttribute("data-download-payslip"));
        var monthEl = document.getElementById("bb-payslip-month");
        var month = monthEl ? monthEl.value : new Date().toISOString().slice(0, 7);
        downloadPayslip(empId, month);
      };
    });

    document.querySelectorAll("[data-download-payslip-hist]").forEach(function (btn) {
      btn.onclick = function () {
        downloadPayslip(Number(btn.getAttribute("data-download-payslip-hist")), btn.getAttribute("data-payslip-month"));
      };
    });

    var chatForm = document.getElementById("bb-chat-form");
    if (chatForm) chatForm.onsubmit = function (e) {
      e.preventDefault();
      var input = document.getElementById("bb-chat-input");
      var q = (input && input.value || "").trim();
      if (!q) return;
      state.data.chatHistory.push({ role: "user", text: q });
      state.data.chatHistory.push({ role: "ai", text: copilotReply(q) });
      save(); render();
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
      refreshView();
    };

    var productForm = document.getElementById("bb-form-product");
    if (productForm) productForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(productForm);
      var id = nextId(state.data.products);
      var sku = fd.get("sku");
      var barcode = (fd.get("barcode") || "").trim() || generateBarcodeForSku(sku, id);
      state.data.products.push({
        id: id, name: fd.get("name"), sku: sku, barcode: barcode,
        stock: Number(fd.get("stock")) || 0, reorder: Number(fd.get("reorder")) || 10,
        warehouse: fd.get("warehouse") || "Main", unitPrice: Number(fd.get("unitPrice")) || 0,
      });
      if (Number(fd.get("stock")) > 0) {
        recordStockMovement(id, "in", Number(fd.get("stock")), "manual", "OPENING", "Opening stock");
      }
      save(); refreshView();
    };

    var barcodeForm = document.getElementById("bb-form-barcode-sale");
    if (barcodeForm) {
      barcodeForm.onsubmit = function (e) {
        e.preventDefault();
        var fd = new FormData(barcodeForm);
        var result = processBarcodeSale(fd.get("barcode"), fd.get("qty"), fd.get("ref"), fd.get("note"));
        var msgEl = document.getElementById("bb-barcode-msg");
        if (msgEl) {
          msgEl.textContent = result.msg;
          msgEl.className = "bb-stock-msg " + (result.ok ? "ok" : "err");
        }
        if (result.ok) {
          barcodeForm.reset();
          var qtyInput = document.getElementById("bb-barcode-qty");
          if (qtyInput) qtyInput.value = "1";
          var bcInput = document.getElementById("bb-barcode-input");
          if (bcInput) bcInput.focus();
          refreshView();
        }
      };
      var bcInput = document.getElementById("bb-barcode-input");
      if (bcInput) {
        bcInput.onkeydown = function (ev) {
          if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            barcodeForm.requestSubmit();
          }
        };
      }
    }

    document.querySelectorAll("[data-fill-barcode]").forEach(function (btn) {
      btn.onclick = function () {
        var input = document.getElementById("bb-barcode-input");
        if (input) {
          input.value = btn.getAttribute("data-fill-barcode");
          input.focus();
        }
      };
    });

    var stockForm = document.getElementById("bb-form-stock-move");
    if (stockForm) stockForm.onsubmit = function (e) {
      e.preventDefault();
      var fd = new FormData(stockForm);
      var qty = Number(fd.get("qty")) || 1;
      var product = fd.get("barcodeAlt") ? findProductByBarcode(fd.get("barcodeAlt")) : state.data.products.find(function (p) { return p.id === Number(fd.get("productId")); });
      var msgEl = document.getElementById("bb-stock-msg");
      if (!product) {
        if (msgEl) { msgEl.textContent = "Product not found."; msgEl.className = "bb-stock-msg err"; }
        return;
      }
      var dir = fd.get("direction");
      var result = adjustStock(product.id, dir === "in" ? qty : -qty, dir === "in" ? "in" : "out", "manual", fd.get("ref"), fd.get("note"));
      if (msgEl) {
        msgEl.textContent = result.msg;
        msgEl.className = "bb-stock-msg " + (result.ok ? "ok" : "err");
      }
      if (result.ok) { stockForm.reset(); refreshView(); }
    };

    document.querySelectorAll("[data-download-barcode]").forEach(function (btn) {
      btn.onclick = function () { downloadBarcodeSvg(Number(btn.getAttribute("data-download-barcode"))); };
    });

    document.querySelectorAll("[data-print-barcode]").forEach(function (btn) {
      btn.onclick = function () { printBarcodeLabel(Number(btn.getAttribute("data-print-barcode"))); };
    });

    var printAll = document.getElementById("bb-print-all-barcodes");
    if (printAll) printAll.onclick = function () {
      state.data.products.forEach(function (p, i) {
        setTimeout(function () { printBarcodeLabel(p.id); }, i * 400);
      });
    };
  }

  var tabDelegationReady = false;
  function initTabDelegation() {
    if (tabDelegationReady) return;
    tabDelegationReady = true;
    document.addEventListener("click", function (e) {
      var tabBtn = e.target.closest("[data-tab]");
      if (!tabBtn || !tabBtn.closest("#bb-view-content")) return;
      e.preventDefault();
      state.tabs[state.view] = tabBtn.getAttribute("data-tab");
      refreshView();
    });
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
        render();
      };
    });

    var toggle = document.getElementById("bb-menu-toggle");
    var sidebar = document.getElementById("bb-sidebar");
    if (toggle && sidebar) toggle.onclick = function () { sidebar.classList.toggle("open"); };

    var reset = document.getElementById("bb-reset-demo");
    if (reset) reset.onclick = function () {
      if (confirm("Reset all demo data?")) { state.data = defaultData(); state.tabs = {}; save(); render(); }
    };

    bindForms();
    initBarcodes();
    var msgs = document.getElementById("bb-chat-msgs");
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  load();
  initTabDelegation();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
