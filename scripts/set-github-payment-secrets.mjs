#!/usr/bin/env node
/**
 * Push payment secrets to GitHub Actions (never prints secret values).
 * Run: node scripts/set-github-payment-secrets.mjs
 */
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = path.join(ROOT, "rzp-key.csv");
const envPath = path.join(ROOT, "server", ".env");
const REPO = "vpsgr8/workpilot-tools";

function readEnv(key) {
  if (!fs.existsSync(envPath)) return "";
  const line = fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(key + "="));
  return line ? line.slice(key.length + 1).trim() : "";
}

function readCsvSecret() {
  const lines = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  const values = lines[1].split(",");
  const idx = headers.findIndex((h) => h.trim() === "key_secret");
  return idx >= 0 ? values[idx].trim() : "";
}

function setSecret(name, value) {
  if (!value) {
    console.warn("Skip " + name + " (empty)");
    return;
  }
  execFileSync("gh", ["secret", "set", name, "--repo", REPO, "--body", value], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  console.log("Set GitHub secret:", name);
}

if (!fs.existsSync(csvPath)) {
  console.error("Missing rzp-key.csv");
  process.exit(1);
}

const rzpSecret = readCsvSecret();
const jwt = readEnv("JWT_SECRET") || readEnv("EBOOK_DOWNLOAD_SECRET");

setSecret("RAZORPAY_KEY_SECRET", rzpSecret);
setSecret("JWT_SECRET", jwt);
console.log("Done. Add GCP_PROJECT_ID + GCP_SA_KEY to enable Cloud Run deploy workflow.");
