"use strict";

const crypto = require("crypto");
const Razorpay = require("razorpay");

function getClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys not configured on server");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

function isConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function getPublicConfig() {
  return {
    enabled: isConfigured(),
    keyId: process.env.RAZORPAY_KEY_ID || "",
    currency: "INR",
    name: process.env.RAZORPAY_MERCHANT_NAME || "WorkPilot Tools",
    description: process.env.RAZORPAY_MERCHANT_DESC || "MarketMind Labs",
  };
}

async function createOrder(amountPaise, receipt, notes) {
  amountPaise = Math.round(Number(amountPaise));
  if (!amountPaise || amountPaise < 100) {
    throw new Error("Minimum payment amount is ₹1");
  }

  const client = getClient();
  return client.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: receipt || "wp_" + Date.now(),
    notes: notes || {},
  });
}

function verifyPaymentSignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Razorpay secret not configured");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  return expected === signature;
}

async function fetchOrder(orderId) {
  const client = getClient();
  return client.orders.fetch(orderId);
}

module.exports = {
  isConfigured,
  getPublicConfig,
  createOrder,
  verifyPaymentSignature,
  fetchOrder,
  getClient,
};
