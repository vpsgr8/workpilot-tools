"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const examplePath = path.join(__dirname, "..", ".env.example");

let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : fs.readFileSync(examplePath, "utf8");

function setEnv(key, val) {
  var re = new RegExp("^" + key + "=.*$", "m");
  var line = key + "=" + val;
  env = re.test(env) ? env.replace(re, line) : env.trim() + "\n" + line + "\n";
}

function hasEnv(key) {
  return new RegExp("^" + key + "=.+$", "m").test(env);
}

if (!hasEnv("JWT_SECRET") && !hasEnv("EBOOK_DOWNLOAD_SECRET")) {
  setEnv("JWT_SECRET", crypto.randomBytes(32).toString("hex"));
  console.log("Generated JWT_SECRET for eBook download tokens.");
}

var cors =
  "https://workpilottools.biz,https://www.workpilottools.biz,https://englishlearner.store,https://logictrade.site,http://localhost:5500,http://127.0.0.1:5500";
setEnv("CORS_ORIGINS", cors);

fs.writeFileSync(envPath, env);
console.log("Updated server/.env for production (CORS + JWT).");
