"use strict";

const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signSession(user, company) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      companyId: company.id,
      tier: company.license_tier,
      maxEmployees: company.max_employees,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function verifySession(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

async function verifyGoogleToken(idToken) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID not configured");
  }
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }

  const allowedDomain = (process.env.ALLOWED_DOMAIN || "").trim().toLowerCase();
  if (allowedDomain) {
    const emailDomain = payload.email.split("@")[1].toLowerCase();
    if (emailDomain !== allowedDomain) {
      throw new Error("Email domain not allowed for this deployment");
    }
  }

  return {
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
    picture: payload.picture || "",
  };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    req.user = verifySession(token);
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

module.exports = {
  signSession,
  verifySession,
  verifyGoogleToken,
  authMiddleware,
};
