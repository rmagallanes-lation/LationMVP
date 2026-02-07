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
    "message": "Testing end-to-end deployment"
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
| `FRONTEND_URL` | Backend CORS allowed origin | `https://lation.com.mx` |
| `N8N_WEBHOOK_URL` | Backend n8n webhook URL | `https://n8n.lation.com.mx/webhook/contact` |
| `N8N_WEBHOOK_SECRET` | Shared secret header | `change-me` |
| `PORT` | Backend port | `3001` |

---

**Last Updated:** February 7, 2026
