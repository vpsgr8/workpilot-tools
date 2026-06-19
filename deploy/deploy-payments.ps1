# Deploy WorkPilot payments API to Google Cloud Run
# Prerequisites: gcloud CLI, billing-enabled GCP project
# Usage: .\deploy\deploy-payments.ps1 -ProjectId YOUR_PROJECT_ID

param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectId,
  [string]$Region = "asia-south1",
  [string]$ServiceName = "workpilot-payments"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ServerDir = Join-Path $Root "server"
$EnvFile = Join-Path $ServerDir ".env"

if (-not (Test-Path $EnvFile)) {
  Write-Host "Run: cd server && npm run sync-rzp-keys" -ForegroundColor Yellow
  exit 1
}

$secret = (Get-Content $EnvFile | Where-Object { $_ -match "^RAZORPAY_KEY_SECRET=" }) -replace "^RAZORPAY_KEY_SECRET=", ""
$jwt = (Get-Content $EnvFile | Where-Object { $_ -match "^JWT_SECRET=" }) -replace "^JWT_SECRET=", ""
if (-not $secret) {
  Write-Host "RAZORPAY_KEY_SECRET missing in server/.env" -ForegroundColor Red
  exit 1
}
if (-not $jwt) {
  Write-Host "JWT_SECRET missing — run: cd server && node scripts/ensure-production-env.js" -ForegroundColor Red
  exit 1
}

$cors = "https://workpilottools.biz,https://www.workpilottools.biz,https://englishlearner.store,https://logictrade.site"

gcloud config set project $ProjectId

Write-Host "Deploying $ServiceName to Cloud Run ($Region)..." -ForegroundColor Cyan

gcloud run deploy $ServiceName `
  --source $ServerDir `
  --region $Region `
  --allow-unauthenticated `
  --set-env-vars "RAZORPAY_KEY_ID=rzp_live_T28wwjAyHRA0jd,RAZORPAY_KEY_SECRET=$secret,JWT_SECRET=$jwt,CORS_ORIGINS=$cors,RAZORPAY_MERCHANT_NAME=WorkPilot Tools,RAZORPAY_MERCHANT_DESC=MarketMind Labs"

$url = gcloud run services describe $ServiceName --region $Region --format "value(status.url)"
Write-Host ""
Write-Host "Deployed! Set this in assets/razorpay-config.js:" -ForegroundColor Green
Write-Host "  apiUrl: `"$url`"" -ForegroundColor White
Write-Host ""
Write-Host "Test: $url/api/payments/config" -ForegroundColor Gray
