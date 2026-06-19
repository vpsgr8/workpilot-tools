# BizBuilt AI — Customer GCP Deployment

Deploy BizBuilt on a customer's Google Cloud project with their domain.

## What gets deployed

| Component | GCP service |
|-----------|-------------|
| BizBuilt API | Cloud Run |
| PostgreSQL database | Cloud SQL |
| Static frontend | Cloud Storage + CDN, or same domain via Cloud Run |
| File uploads (future) | Cloud Storage |
| SSL + domain | Cloud Load Balancer or Cloud Run domain mapping |
| Auth | Google OAuth (Workspace / Gmail) |

## Prerequisites

1. Customer GCP project (or billing-enabled project you create for them)
2. Custom domain (e.g. `erp.acmecorp.com`)
3. Google OAuth Client ID (Web application) with authorized origins:
   - `https://erp.acmecorp.com`
   - `https://workpilottools.biz` (for staging)
4. PostgreSQL instance in **asia-south1** (Mumbai)

## Razorpay payments (donate + BizBuilt subscriptions)

1. Copy keys from `rzp-key.csv` into `server/.env` (never commit `.env`):
   ```bash
   cd server
   npm run sync-rzp-keys
   ```
2. Start API locally:
   ```bash
   npm run dev
   ```
3. Set your Cloud Run URL in `assets/razorpay-config.js`:
   ```javascript
   apiUrl: "https://your-api-xxxxx.run.app"
   ```
4. Add the same URL to `CORS_ORIGINS` in server `.env`.

**Endpoints:** `GET /api/payments/config`, `POST /api/payments/order`, `POST /api/payments/verify`

**Paid eBooks:** `GET /api/ebooks/catalog`, `GET /api/ebooks/download?token=…` — full PDFs live in `server/ebooks/` (not public static). Set `JWT_SECRET` or `EBOOK_DOWNLOAD_SECRET` for signed download tokens. Add `https://englishlearner.store` and `https://logictrade.site` to `CORS_ORIGINS`.

Until `apiUrl` is set on the live site, donate buttons fall back to your Razorpay.me link.

## Quick start (local API dev)

```bash
cd server
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID

npm install
npm run init-db
npm run dev
```

Enable cloud mode in the frontend (`assets/bizbuilt-config.js`):

```javascript
window.BIZBUILT_CONFIG = {
  apiUrl: "http://localhost:8080",
  googleClientId: "YOUR_CLIENT_ID.apps.googleusercontent.com",
};
```

Open `bizbuilt/index.html` via a local server. Sign in with Google — data syncs to PostgreSQL.

## Docker (Cloud Run)

```bash
cd server
docker build -t bizbuilt-api .
docker run -p 8080:8080 --env-file .env bizbuilt-api
```

Push to Artifact Registry and deploy to Cloud Run with env vars from Secret Manager.

## Terraform (starter)

```bash
cd deploy/terraform
cp terraform.tfvars.example terraform.tfvars
# Fill in project_id, region, domain, secrets

terraform init
terraform plan
terraform apply
```

See `deploy/terraform/variables.tf` for all inputs.

## Environment variables (production)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Cloud SQL connection string |
| `DATABASE_SSL` | `true` for Cloud SQL |
| `JWT_SECRET` | Long random string (Secret Manager) |
| `GOOGLE_CLIENT_ID` | OAuth client for this deployment |
| `ALLOWED_DOMAIN` | e.g. `acmecorp.com` — only @acmecorp.com can sign in |
| `COMPANY_NAME` | Display name |
| `LICENSE_TIER` | starter / growth / business |
| `MAX_EMPLOYEES` | License limit |
| `CORS_ORIGINS` | Frontend URL(s) |

## Customer onboarding checklist

- [ ] Discovery call — employees, modules, billing cycle
- [ ] GCP project access (Editor or dedicated deploy SA)
- [ ] Domain DNS CNAME to Cloud Run / Load Balancer
- [ ] OAuth consent screen + Client ID
- [ ] Terraform apply or manual Cloud Run deploy
- [ ] Set `bizbuilt-config.js` apiUrl + googleClientId on their frontend
- [ ] Import employees / products / opening stock
- [ ] Training session + handoff doc
- [ ] Razorpay / invoice for subscription

## Support

MarketMind Labs · mml.products26@gmail.com
