"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const db = require("./db");
const auth = require("./auth");
const razorpay = require("./razorpay");
const ebooks = require("./ebooks");

const app = express();
const PORT = Number(process.env.PORT) || 8080;

const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(function (s) { return s.trim(); })
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins.length ? corsOrigins : true,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", function (_req, res) {
  res.json({ ok: true, service: "bizbuilt-api", version: "1.0.0" });
});

app.get("/api/config", function (_req, res) {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    companyName: process.env.COMPANY_NAME || "BizBuilt",
    cloudEnabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.JWT_SECRET),
    licenseTier: process.env.LICENSE_TIER || "starter",
    maxEmployees: Number(process.env.MAX_EMPLOYEES) || 10,
  });
});

app.post("/api/auth/google", async function (req, res) {
  try {
    const idToken = req.body && req.body.credential;
    if (!idToken) return res.status(400).json({ error: "Missing credential" });

    const profile = await auth.verifyGoogleToken(idToken);
    const companyId = await db.ensureDefaultCompany();
    const user = await db.upsertUser(profile.email, profile.name, profile.picture, companyId);
    const company = await db.getCompany(companyId);

    const token = auth.signSession(user, company);
    res.json({
      token,
      user: { email: user.email, name: user.name, picture: user.picture },
      company: {
        name: company.name,
        tier: company.license_tier,
        maxEmployees: company.max_employees,
        licenseExpires: company.license_expires,
      },
    });
  } catch (e) {
    res.status(401).json({ error: e.message || "Authentication failed" });
  }
});

app.get("/api/data", auth.authMiddleware, async function (req, res) {
  try {
    const row = await db.getAppData(req.user.companyId);
    res.json({
      data: row ? row.data : null,
      updatedAt: row ? row.updated_at : null,
    });
  } catch (e) {
    res.status(500).json({ error: e.message || "Failed to load data" });
  }
});

app.put("/api/data", auth.authMiddleware, async function (req, res) {
  try {
    if (!req.body || typeof req.body.data !== "object") {
      return res.status(400).json({ error: "Missing data object" });
    }
    await db.saveAppData(req.user.companyId, req.body.data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || "Failed to save data" });
  }
});

app.get("/api/ebooks/catalog", function (_req, res) {
  res.json({ books: ebooks.listPublicCatalog() });
});

app.get("/api/ebooks/download", function (req, res) {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).json({ error: "Missing download token" });

    const { product } = ebooks.verifyDownloadToken(token);
    const filePath = ebooks.resolveFullPdfPath(product);
    const filename = product.file;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="' + filename + '"');
    res.setHeader("Cache-Control", "private, no-store");
    fs.createReadStream(filePath).pipe(res);
  } catch (e) {
    res.status(403).json({ error: e.message || "Download not allowed" });
  }
});

app.get("/api/payments/config", function (_req, res) {
  res.json(razorpay.getPublicConfig());
});

app.post("/api/payments/order", async function (req, res) {
  try {
    if (!razorpay.isConfigured()) {
      return res.status(503).json({ error: "Razorpay not configured on server" });
    }
    const body = req.body || {};
    const productId = String(body.product || body.ebook || "").trim();
    const ebook = productId ? ebooks.getProduct(productId) : null;

    let amount = Number(body.amount);
    let purpose = String(body.purpose || "payment");
    const plan = String(body.plan || "");
    const cycle = String(body.cycle || "");
    let label = String(body.label || "WorkPilot Tools");
    let receipt = "wp_" + purpose + "_" + Date.now();
    let notes = {
      purpose,
      plan,
      cycle,
      source: String(body.source || ""),
    };

    if (ebook) {
      amount = ebook.pricePaise;
      purpose = "ebook";
      label = ebook.title + " — MarketMind Labs eBook";
      receipt = "ebook_" + ebook.id + "_" + Date.now();
      notes = {
        purpose: "ebook",
        product: ebook.id,
        source: String(body.source || ""),
      };
    }

    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    const order = await razorpay.createOrder(amount, receipt, notes);

    const pub = razorpay.getPublicConfig();
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: pub.keyId,
      name: pub.name,
      description: label,
      product: ebook ? ebook.id : undefined,
    });
  } catch (e) {
    res.status(400).json({ error: e.message || "Failed to create order" });
  }
});

app.post("/api/payments/verify", async function (req, res) {
  try {
    const body = req.body || {};
    const orderId = body.razorpay_order_id;
    const paymentId = body.razorpay_payment_id;
    const signature = body.razorpay_signature;
    const productId = String(body.product || body.ebook || "").trim();

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: "Missing payment fields" });
    }

    const ok = razorpay.verifyPaymentSignature(orderId, paymentId, signature);
    if (!ok) return res.status(400).json({ error: "Invalid payment signature" });

    console.log("Payment verified:", orderId, paymentId, productId || "(general)");

    if (productId) {
      if (!ebooks.getDownloadSecret()) {
        return res.status(503).json({ error: "Download signing not configured on server" });
      }
      const client = razorpay.getClient();
      await ebooks.validateOrderForProduct(client, orderId, productId);
      const downloadToken = ebooks.signDownloadToken(productId, orderId, paymentId);
      return res.json({
        ok: true,
        product: productId,
        downloadToken: downloadToken,
        purchaseKey: ebooks.hashPurchaseKey(orderId, paymentId),
      });
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message || "Verification failed" });
  }
});

app.get("/api/me", auth.authMiddleware, async function (req, res) {
  try {
    const company = await db.getCompany(req.user.companyId);
    res.json({
      email: req.user.email,
      name: req.user.name,
      company: company ? {
        name: company.name,
        tier: company.license_tier,
        maxEmployees: company.max_employees,
        licenseExpires: company.license_expires,
      } : null,
    });
  } catch (e) {
    res.status(500).json({ error: e.message || "Failed to load profile" });
  }
});

async function start() {
  if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET not set — BizBuilt auth disabled until configured.");
  }
  if (!razorpay.isConfigured()) {
    console.warn("Warning: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set — payments disabled.");
  }
  if (process.env.DATABASE_URL) {
    try {
      await db.initSchema();
      await db.ensureDefaultCompany();
      console.log("Database connected.");
    } catch (e) {
      console.warn("Database unavailable — running payments-only:", e.message);
    }
  } else {
    console.log("Payments-only mode (no DATABASE_URL).");
  }

  app.listen(PORT, function () {
    console.log("WorkPilot API listening on port " + PORT);
  });
}

start().catch(function (err) {
  console.error("Failed to start:", err);
  process.exit(1);
});
