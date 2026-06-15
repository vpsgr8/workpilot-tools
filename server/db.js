"use strict";

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT,
      license_tier TEXT DEFAULT 'starter',
      max_employees INT DEFAULT 10,
      license_expires TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      picture TEXT,
      company_id INT REFERENCES companies(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS app_data (
      company_id INT PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
      data JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

async function ensureDefaultCompany() {
  const { rows } = await pool.query("SELECT id FROM companies LIMIT 1");
  if (rows.length) return rows[0].id;

  const name = process.env.COMPANY_NAME || "Default Company";
  const tier = process.env.LICENSE_TIER || "starter";
  const maxEmp = Number(process.env.MAX_EMPLOYEES) || 10;
  const expires = process.env.LICENSE_EXPIRES || "2027-12-31";

  const inserted = await pool.query(
    `INSERT INTO companies (name, domain, license_tier, max_employees, license_expires)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [name, process.env.ALLOWED_DOMAIN || null, tier, maxEmp, expires]
  );
  return inserted.rows[0].id;
}

async function upsertUser(email, name, picture, companyId) {
  const result = await pool.query(
    `INSERT INTO users (email, name, picture, company_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, picture = EXCLUDED.picture
     RETURNING *`,
    [email, name, picture, companyId]
  );
  return result.rows[0];
}

async function getAppData(companyId) {
  const { rows } = await pool.query(
    "SELECT data, updated_at FROM app_data WHERE company_id = $1",
    [companyId]
  );
  return rows[0] || null;
}

async function saveAppData(companyId, data) {
  await pool.query(
    `INSERT INTO app_data (company_id, data, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (company_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [companyId, data]
  );
}

async function getCompany(companyId) {
  const { rows } = await pool.query("SELECT * FROM companies WHERE id = $1", [companyId]);
  return rows[0] || null;
}

module.exports = {
  pool,
  initSchema,
  ensureDefaultCompany,
  upsertUser,
  getAppData,
  saveAppData,
  getCompany,
};
