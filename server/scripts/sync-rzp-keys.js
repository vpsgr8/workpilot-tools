"use strict";

/**
 * Copy Razorpay keys from rzp-key.csv into server/.env (local use only).
 * Run: node server/scripts/sync-rzp-keys.js
 */
const fs = require("fs");
const path = require("path");

const csvPath = path.join(__dirname, "..", "..", "rzp-key.csv");
const envPath = path.join(__dirname, "..", ".env");
const examplePath = path.join(__dirname, "..", ".env.example");

if (!fs.existsSync(csvPath)) {
  console.error("Missing rzp-key.csv in project root.");
  process.exit(1);
}

const lines = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
if (lines.length < 2) {
  console.error("Invalid rzp-key.csv format.");
  process.exit(1);
}

const headers = lines[0].split(",");
const values = lines[1].split(",");
const row = {};
headers.forEach(function (h, i) {
  row[h.trim()] = (values[i] || "").trim();
});

let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : fs.readFileSync(examplePath, "utf8");

function setEnv(key, val) {
  var re = new RegExp("^" + key + "=.*$", "m");
  var line = key + "=" + val;
  env = re.test(env) ? env.replace(re, line) : env.trim() + "\n" + line + "\n";
}

setEnv("RAZORPAY_KEY_ID", row.key_id);
setEnv("RAZORPAY_KEY_SECRET", row.key_secret);

fs.writeFileSync(envPath, env);
console.log("Updated server/.env with Razorpay keys from rzp-key.csv");
