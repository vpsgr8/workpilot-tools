# Complete Razorpay setup (workpilottools.biz)

## Current status

| Piece | Status |
|-------|--------|
| Donate / BizBuilt pay buttons on site | Done |
| Keys in `server/.env` (local) | Run `npm run sync-rzp-keys` |
| Payment API (`server/`) | Ready |
| Live checkout on site | **Needs deployed API URL in `razorpay-config.js`** |

Until `apiUrl` is set, buttons fall back to https://razorpay.me/@vishalpratapsingh601

---

## Option A — Render.com (easiest, no gcloud)

1. Go to https://dashboard.render.com → **New** → **Blueprint**
2. Connect GitHub repo `vpsgr8/workpilot-tools`
3. Render reads `render.yaml` — creates **workpilot-payments** service
4. In Render dashboard → **Environment** → set `RAZORPAY_KEY_SECRET` (from `rzp-key.csv`)
5. After deploy, copy URL e.g. `https://workpilot-payments.onrender.com`
6. Edit `assets/razorpay-config.js`:
   ```javascript
   apiUrl: "https://workpilot-payments.onrender.com",
   ```
7. Push to GitHub → live in 1–3 min

Test: open `https://YOUR-URL/api/payments/config` — should show `"enabled": true`

---

## Option B — Google Cloud Run (PowerShell)

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. `gcloud auth login`
3. From project root:
   ```powershell
   cd server
   npm run sync-rzp-keys
   cd ..
   .\deploy\deploy-payments.ps1 -ProjectId YOUR_GCP_PROJECT_ID
   ```
4. Copy the printed URL into `assets/razorpay-config.js` → `apiUrl`
5. Push to GitHub

---

## Option C — GitHub Actions → Cloud Run

Add GitHub repo secrets:

| Secret | Value |
|--------|--------|
| `GCP_PROJECT_ID` | Your GCP project |
| `GCP_SA_KEY` | Service account JSON |
| `RAZORPAY_KEY_SECRET` | From rzp-key.csv |

Push changes to `server/` — workflow `.github/workflows/deploy-payments-cloudrun.yml` deploys automatically.

---

## Local test

```powershell
cd server
npm run sync-rzp-keys
npm run dev
```

Visit http://localhost:8080/api/payments/config

Open site locally with `apiUrl: "http://localhost:8080"` in `razorpay-config.js` and click Donate.

---

## After apiUrl is live

1. Open https://workpilottools.biz
2. Click **Donate** → Razorpay popup (not razorpay.me redirect)
3. BizBuilt **Pay — Get Starter** uses selected billing cycle amount

---

## Security

- Never commit `rzp-key.csv` or `server/.env`
- Rotate keys in Razorpay Dashboard if ever exposed on GitHub
