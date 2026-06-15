"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const auth = require("./auth");

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
    console.warn("Warning: JWT_SECRET not set — auth will fail until configured.");
  }
  await db.initSchema();
  await db.ensureDefaultCompany();

  app.listen(PORT, function () {
    console.log("BizBuilt API listening on port " + PORT);
  });
}

start().catch(function (err) {
  console.error("Failed to start:", err);
  process.exit(1);
});
