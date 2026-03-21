# Cloudflare Pages + Backend + n8n (VPS) Deployment Guide for lation.com.mx

## Architecture Overview

```
┌─────────────────────────────────────┐
│   Cloudflare Pages (Frontend)       │
│   https://lation.com.mx            │
│   (builds from GitHub)              │
└──────────────────┬──────────────────┘
                   │ (fetch to API)
                   ▼
┌─────────────────────────────────────┐
│   Backend (Node.js + Express)       │
│   https://api.lation.com.mx         │
│   (Docker on VPS)                   │
└──────────────────┬──────────────────┘
                   │ (POST to webhook)
                   ▼
┌─────────────────────────────────────┐
│   n8n (Docker on VPS)               │
│   https://n8n.lation.com.mx         │
│   (reverse proxied)                 │
└─────────────────────────────────────┘
```

## Prerequisites

- ✅ Domain `lation.com.mx` registered and added to Cloudflare
- ✅ Code pushed to GitHub repository
- ✅ Cloudflare account with Pages enabled
- ✅ Backend server (VPS) with Docker (or Node.js 18+)
- ✅ Cloudflare Origin Certificate for `n8n.lation.com.mx`
- ✅ Cloudflare WAF rule to skip challenges for `/webhook*`

## Step 1: Set up Cloudflare DNS Records

1. Log in to **Cloudflare Dashboard**
2. Select your domain `lation.com.mx`
3. Go to **DNS Records**
4. Add DNS records:
   - **Type:** A, **Name:** `api.lation.com.mx`, **Value:** `YOUR_SERVER_IP`, **Proxy:** Proxied (orange cloud)
   - **Type:** A, **Name:** `n8n.lation.com.mx`, **Value:** `YOUR_SERVER_IP`, **Proxy:** Proxied (orange cloud)
   - **Type:** CNAME, **Name:** `www`, **Value:** `lation.com.mx`, **Proxy:** Proxied (optional)

5. Go to **SSL/TLS** → **Overview** and set to **Full (Strict)**

## Step 2: Deploy Frontend to Cloudflare Pages

1. Log in to **Cloudflare Dashboard** → **Pages**
2. Click **Create application** → **Connect to Git**
3. Authorize GitHub and select your `lation-interviews-main` repository
4. Configure build settings:
   - **Production branch:** `main` (or your default)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Environment variables** and add:
   ```
   VITE_API_URL = https://api.lation.com.mx
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = sb_publishable_xxx
   VITE_TURNSTILE_SITE_KEY = 0x4AAAAAAAxxxxxxxxxxxxxx
   ```
6. Click **Save and Deploy**

Cloudflare will begin building. Once complete, your frontend is live at `https://lation.com.mx`.

**Every push to your GitHub main branch will auto-deploy.**

## Step 3: Deploy Backend to Your Server

### Option A: Docker (Recommended)

SSH into your server and run:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/lation-interviews-main.git
cd lation-interviews-main

# Copy environment template
cp .env.example .env

# Edit .env with your production values:
# FRONTEND_URL=https://lation.com.mx
# N8N_WEBHOOK_URL=https://n8n.lation.com.mx/webhook/contact
# N8N_WEBHOOK_SECRET=change-me
```

Edit `.env`:

```bash
# ===== PRODUCTION (lation.com.mx) =====
VITE_API_URL=https://api.lation.com.mx
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxx
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxxxxx
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
CF_TURNSTILE_SECRET=0x4AAAAAAAxxxxxxxxxxxxxx-secret
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-rest-token
ALLOWED_ORIGINS=https://lation.com.mx,https://www.lation.com.mx
FRONTEND_URL=https://lation.com.mx
N8N_WEBHOOK_URL=https://n8n.lation.com.mx/webhook/contact
N8N_WEBHOOK_SECRET=change-me
PORT=3001
```

Then start the backend:

```bash
# Build and run in background as daemon
docker compose up --build -d

# Check logs
docker compose logs backend

# Verify health
curl -k https://api.lation.com.mx/_health
# Expected: {"status":"ok"}
```

### Option B: Direct Node.js (if Docker not available)

```bash
cd server
npm install --production
npm run build

# Install process manager
npm install -g pm2

# Start backend
NODE_ENV=production pm2 start dist/index.js --name "lation-api"

# Setup auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 logs
```

## Step 4: Deploy n8n on VPS (No Tunnel)

Use the templates in:
- `ops/n8n/docker-compose.yml`
- `ops/n8n/nginx.conf`
- `ops/n8n/.env.example`

Summary:
1. Create `/opt/n8n` on the VPS and copy the files above.
2. Generate a **Cloudflare Origin Certificate** and place in:
   - `/opt/n8n/certs/origin.pem`
   - `/opt/n8n/certs/origin.key`
3. Create `.env` from `.env.example` and set strong secrets.
4. Start services:
   ```bash
   docker compose up -d
   ```
5. Verify:
   ```bash
   curl -I https://n8n.lation.com.mx
   ```

## Step 5: Configure Cloudflare WAF Rule (Required)

Add a WAF rule to skip challenges for webhook endpoints:
- Condition:
  - `http.host eq "n8n.lation.com.mx" and starts_with(http.request.uri.path, "/webhook")`
  - Also add `/webhook-test` if you use test URLs
- Action: **Skip**
- Skip: WAF, Managed Challenge, JS Challenge, Bot Fight Mode, Rate Limiting

This prevents Cloudflare from injecting JS challenges into webhook requests.

## Step 6: End-to-End Tests

### Test Frontend is Live
```bash
curl -I https://lation.com.mx
```

### Test Backend
```bash
curl https://api.lation.com.mx/_health
# Expected: {"status":"ok"}
```

### Test n8n
```bash
curl -I https://n8n.lation.com.mx
```

### Test Contact API Endpoint
```bash
curl -X POST https://api.lation.com.mx/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Acme Corp",
    "message": "Testing end-to-end deployment",
    "turnstileToken": "token",
    "website": ""
  }'

# Expected response: {"ok":true}
```

## Troubleshooting

### Backend Can't Reach n8n (502 Error)
**Response:**
```json
{"error":"n8n_forward_error"}
```

**Fix:**
1. Verify n8n is reachable:
   ```bash
   curl -I https://n8n.lation.com.mx
   ```
2. Confirm WAF challenge is skipped for `/webhook*`.
3. Verify `N8N_WEBHOOK_URL` points to the correct webhook path.

### CORS Errors in Browser
**Error:**
```
Access to XMLHttpRequest at 'https://api.lation.com.mx/api/contact'
from origin 'https://lation.com.mx' has been blocked by CORS policy
```

**Fix:**
1. Ensure backend `.env` has `FRONTEND_URL=https://lation.com.mx`
2. Restart backend

### n8n Webhook 404
1. Check the exact webhook path in the n8n workflow.
2. Update `N8N_WEBHOOK_URL` in backend `.env`.

## Environment Variables Summary

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Frontend API endpoint | `https://api.lation.com.mx` |
| `VITE_SUPABASE_URL` | Frontend Supabase project URL | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Frontend Supabase publishable/anon key | `sb_publishable_xxx` |
| `VITE_TURNSTILE_SITE_KEY` | Frontend Turnstile widget site key | `0x4AAAAAAAxxxxxxxxxxxxxx` |
| `SUPABASE_URL` | Server-side Supabase URL used by `/api/lead` | `https://your-project-id.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase service role key used by `/api/lead` | `eyJ...` |
| `CF_TURNSTILE_SECRET` | Server-side Turnstile verification secret | `0x4AAAAAAAxxxxxxxxxxxxxx-secret` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint for distributed rate limiting | `https://your-instance.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST auth token | `A...` |
| `ALLOWED_ORIGINS` | Exact origin allow-list for API requests | `https://lation.com.mx,https://www.lation.com.mx` |
| `RESEND_API_KEY` | Resend API key for non-blocking lead notifications | `re_xxxxxxxxxxxxx` |
| `RESEND_FROM_EMAIL` | Sender address used by lead notifications | `Lation Leads <leads@lation.com.mx>` |
| `RESEND_NOTIFICATION_TO` | Comma-separated recipients for lead notifications | `ops@lation.com.mx,founder@lation.com.mx` |
| `FRONTEND_URL` | Backend CORS allowed origin | `https://lation.com.mx` |
| `N8N_WEBHOOK_URL` | Backend n8n webhook URL | `https://n8n.lation.com.mx/webhook/contact` |
| `N8N_WEBHOOK_SECRET` | Shared secret header | `change-me` |
| `PORT` | Backend port | `3001` |

## Contact Form Env Checklist

Use this checklist whenever contact submission is disabled in the UI.

1. Set the required frontend anti-bot variable:
   - `VITE_TURNSTILE_SITE_KEY`
2. Configure all active frontend targets:
   - Vercel: Project Settings -> Environment Variables (`Preview` + `Production`, and `Development` for parity)
   - Cloudflare Pages: Project -> Settings -> Environment variables (`Preview` + `Production`)
   - GitHub Actions Secrets (if deploying via workflows): `VITE_TURNSTILE_SITE_KEY`
3. Redeploy after updating variables:
   - Vercel: redeploy latest preview and production deployment
   - Cloudflare Pages / GitHub Actions: trigger a new deployment run
4. Verify on the live page:
   - Contact button should show `Send Message` (not `Temporarily Unavailable`)
   - No contact configuration warning should be visible to users in production
5. Optional debug hint for non-production:
   - Set `VITE_SHOW_CONTACT_CONFIG_HINT=true` in preview/local builds to show technical config details in the alert.
6. If using Vercel `/api/lead`, also set server-side secrets:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CF_TURNSTILE_SECRET`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
7. If using Vercel email notifications, also set:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `RESEND_NOTIFICATION_TO`
8. Verify Vercel notification flow:
   - Submit a lead from the site
   - Confirm lead row is stored in Supabase
   - Confirm notification email is delivered to each configured recipient
   - If email fails, ensure user still sees successful submission (non-blocking behavior)
9. Rotate `SUPABASE_SERVICE_ROLE_KEY`, `CF_TURNSTILE_SECRET`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, and `N8N_WEBHOOK_SECRET` every 90 days.
10. Apply `supabase/migrations/20260309120000_harden_leads_rls.sql` to enforce RLS and input-length constraints on `public.leads`.

---

**Last Updated:** March 9, 2026
