"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const EBOOK_DIR = path.join(__dirname, "ebooks");

/** @type {Record<string, { id: string, title: string, subtitle: string, pricePaise: number, mrpPaise?: number, file: string, previewFile: string, category: string }>} */
const CATALOG = {
  "text-like-a-pro": {
    id: "text-like-a-pro",
    title: "Text Like a Pro",
    subtitle: "Clear, confident written communication for work and life",
    pricePaise: 19900,
    file: "text-like-a-pro.pdf",
    previewFile: "text-like-a-pro-preview.pdf",
    category: "English · Communication",
  },
  "unseen-india": {
    id: "unseen-india",
    title: "Unseen India",
    subtitle: "Lesser-known places, stories, and perspectives across India",
    pricePaise: 49900,
    mrpPaise: 75000,
    file: "unseen-india.pdf",
    previewFile: "unseen-india-preview.pdf",
    category: "Travel · India",
  },
};

function getProduct(id) {
  return CATALOG[String(id || "").trim()] || null;
}

function listPublicCatalog() {
  return Object.values(CATALOG).map(function (p) {
    return {
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      price: p.pricePaise / 100,
      mrp: p.mrpPaise ? p.mrpPaise / 100 : null,
      category: p.category,
      previewUrl: "/assets/ebooks/previews/" + p.previewFile,
      detailPath: "/ebooks/" + p.id + ".html",
    };
  });
}

function getDownloadSecret() {
  return process.env.EBOOK_DOWNLOAD_SECRET || process.env.JWT_SECRET || "";
}

function signDownloadToken(productId, orderId, paymentId) {
  const secret = getDownloadSecret();
  if (!secret) throw new Error("Download signing secret not configured");

  return jwt.sign(
    {
      typ: "ebook",
      product: productId,
      orderId: orderId,
      paymentId: paymentId,
    },
    secret,
    { expiresIn: "90d" }
  );
}

function verifyDownloadToken(token) {
  const secret = getDownloadSecret();
  if (!secret) throw new Error("Download signing secret not configured");

  const payload = jwt.verify(token, secret);
  if (!payload || payload.typ !== "ebook" || !payload.product) {
    throw new Error("Invalid download token");
  }
  const product = getProduct(payload.product);
  if (!product) throw new Error("Unknown product");
  return { product, payload };
}

function resolveFullPdfPath(product) {
  const filePath = path.join(EBOOK_DIR, product.file);
  if (!fs.existsSync(filePath)) {
    throw new Error("eBook file not available");
  }
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(EBOOK_DIR))) {
    throw new Error("Invalid file path");
  }
  return resolved;
}

async function validateOrderForProduct(razorpayClient, orderId, productId) {
  const product = getProduct(productId);
  if (!product) throw new Error("Unknown eBook");

  const order = await razorpayClient.orders.fetch(orderId);
  const notes = order.notes || {};
  const noteProduct = notes.product || notes.ebook || "";

  if (noteProduct !== productId) {
    throw new Error("Payment does not match this eBook");
  }
  if (Number(order.amount) !== product.pricePaise) {
    throw new Error("Payment amount mismatch");
  }

  return product;
}

function hashPurchaseKey(orderId, paymentId) {
  return crypto.createHash("sha256").update(orderId + "|" + paymentId).digest("hex").slice(0, 24);
}

module.exports = {
  CATALOG,
  EBOOK_DIR,
  getProduct,
  listPublicCatalog,
  signDownloadToken,
  verifyDownloadToken,
  resolveFullPdfPath,
  validateOrderForProduct,
  hashPurchaseKey,
};
