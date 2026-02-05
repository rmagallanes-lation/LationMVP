# Cloudflare Pages + Backend Deployment Guide for lation.com.mx

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
│   (same server, port 3001)          │
└──────────────────┬──────────────────┘
                   │ (POST to webhook)
                   ▼
┌─────────────────────────────────────┐
│   n8n (via Cloudflare Tunnel)       │
│   https://n8n.lation.com.mx         │
│   (local Docker, exposed publicly)  │
└─────────────────────────────────────┘
```

## Prerequisites

- ✅ Domain `lation.com.mx` registered and added to Cloudflare
- ✅ Code pushed to GitHub repository
- ✅ Cloudflare account with Pages enabled
- ✅ Backend server with Docker (or Node.js 18+)
- ✅ Local n8n running in Docker
- ✅ Cloudflared CLI installed (for n8n tunnel)

## Step 1: Set up Cloudflare DNS Records

1. Log in to **Cloudflare Dashboard**
2. Select your domain `lation.com.mx`
3. Go to **DNS Records**
4. Add DNS records:
   - **Type:** A, **Name:** `lation.com.mx`, **Value:** `YOUR_SERVER_IP`, **Proxy:** Proxied (orange cloud)
   - **Type:** A, **Name:** `api.lation.com.mx`, **Value:** `YOUR_SERVER_IP`, **Proxy:** Proxied (orange cloud)
   - **Type:** CNAME, **Name:** `www`, **Value:** `lation.com.mx`, **Proxy:** Proxied (optional)

5. Go to **SSL/TLS** → **Overview** and set to **Full** or **Full (Strict)**

## Step 2: Deploy Frontend to Cloudflare Pages

1. Log in to **Cloudflare Dashboard** → **Pages**
2. Click **Create application** → **Connect to Git**
3. Authorize GitHub and select your `lation-interviews-main` repository
4. Configure build settings:
   - **Production branch:** `main` or `button-behavior` (your default branch)
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
# (Keep N8N_WEBHOOK_URL as is for now, we'll set up the tunnel next)
```

Edit `.env`:

```bash
# ===== PRODUCTION (lation.com.mx) =====
VITE_API_URL=https://api.lation.com.mx
FRONTEND_URL=https://lation.com.mx
N8N_WEBHOOK_URL=https://n8n.lation.com.mx/webhook/contact
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

## Step 4: Set up Cloudflare Tunnel for n8n

**On your local machine** (where n8n Docker is running):

### Install Cloudflared

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Ubuntu/Debian
curl -L --output cloudflared.tgz https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.tgz
tar -xvf cloudflared.tgz
sudo cp ./cloudflared /usr/local/bin/

# Windows
# Download from: https://github.com/cloudflare/cloudflared/releases/download/2024.1.0/cloudflared-windows-amd64.exe
```

### Authenticate

```bash
cloudflared tunnel login
```

This opens your browser to authenticate. Approve the authorization.

### Create Tunnel

```bash
cloudflared tunnel create lation-n8n
```

Outputs:
```
Created tunnel lation-n8n with ID <TUNNEL_ID>
Credentials written to ~/.cloudflared/<TUNNEL_ID>.json
```

Save the `<TUNNEL_ID>` value — you'll need it.

### Route Tunnel to Domain

```bash
cloudflared tunnel route dns lation-n8n n8n.lation.com.mx
```

This automatically creates a CNAME record in Cloudflare DNS.

### Create Configuration File

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: lation-n8n
credentials-file: /path/to/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: n8n.lation.com.mx
    service: http://localhost:5678
  - hostname: n8n.lation.com.mx/webhook
    service: http://localhost:5678/webhook
  - service: http_status:404
```

(Replace `/path/to/.cloudflared/<TUNNEL_ID>.json` with the actual credentials file path)

### Run Tunnel

**Option 1: Foreground (testing)**
```bash
cloudflared tunnel run lation-n8n
```

Keep this terminal open to debug.

**Option 2: Background Service (production)**

```bash
# Install as systemd service (Linux/macOS)
sudo cloudflared service install

# Start and enable auto-start
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -f
```

### Verify Tunnel is Working

```bash
# Should return n8n login page (200 OK)
curl -I https://n8n.lation.com.mx

# Response should be:
# HTTP/2 200
# ...
```

## Step 5: Configure Backend to Use n8n Webhook

On your **backend server**, update `.env`:

```
N8N_WEBHOOK_URL=https://n8n.lation.com.mx/webhook/contact
```

(Replace `/webhook/contact` with your actual n8n webhook trigger path)

Restart backend:

```bash
docker compose restart backend
# or
pm2 restart lation-api
```

Verify n8n webhook path:
1. Log in to `https://n8n.lation.com.mx`
2. Open your contact form workflow
3. Check the webhook trigger node for the exact path (usually something like `/webhook/contact`)
4. Update `N8N_WEBHOOK_URL` accordingly

## Step 6: Test End-to-End

From your local machine:

### Test Frontend is Live
```bash
curl -I https://lation.com.mx
# Should return 200 OK
```

### Test Backend is Reachable
```bash
curl https://api.lation.com.mx/_health
# Expected: {"status":"ok"}
```

### Test n8n is Reachable
```bash
curl -I https://n8n.lation.com.mx
# Should return 200 OK
```

### Test Contact API Endpoint
```bash
curl -X POST https://api.lation.com.mx/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Acme Corp",
    "message": "Testing end-to-end Cloudflare deployment"
  }'

# Expected response: {"ok":true}
```

### Verify Data in n8n

1. Navigate to `https://n8n.lation.com.mx`
2. Check your workflow execution history
3. Verify the contact form data was received
4. Confirm it was added to Google Sheets (if that's your n8n workflow)

## Step 7: Set up Continuous Deployment (Optional)

### Automatic Frontend Deployment

Cloudflare Pages automatically redeploys when you push to GitHub. No additional setup needed.

### Automatic Backend Deployment (GitHub Actions)

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main, button-behavior]
    paths:
      - 'server/**'
      - '.github/workflows/deploy-backend.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/lation-interviews-main
            git pull
            docker compose up --build -d backend
            docker compose logs backend
```

In GitHub repo, add Secrets:
- `SERVER_IP`: Your server's public IP
- `SERVER_USER`: SSH username (e.g., `root` or `ubuntu`)
- `SSH_PRIVATE_KEY`: Your private SSH key (the content of `~/.ssh/id_rsa`)

## Troubleshooting

### Frontend Can't Reach Backend (CORS Error)

**Error in browser console:**
```
Access to XMLHttpRequest at 'https://api.lation.com.mx/api/contact' 
from origin 'https://lation.com.mx' has been blocked by CORS policy
```

**Fix:**
1. Check backend `.env` has `FRONTEND_URL=https://lation.com.mx`
2. Restart backend: `docker compose restart backend`
3. Clear browser cache and reload

### Backend Can't Reach n8n (502 Error)

**Response:**
```json
{"error":"n8n_forward_error"}
```

**Fix:**
1. Verify cloudflared tunnel is running:
   ```bash
   sudo systemctl status cloudflared
   # Or if running in terminal: it should be active
   ```

2. Test tunnel directly:
   ```bash
   curl -I https://n8n.lation.com.mx
   ```

3. Verify n8n webhook URL in `.env`:
   ```bash
   N8N_WEBHOOK_URL=https://n8n.lation.com.mx/webhook/contact
   ```

4. Check n8n logs:
   ```bash
   docker compose logs n8n
   ```

5. Restart backend to reload env vars:
   ```bash
   docker compose restart backend
   ```

### Cloudflare Tunnel Drops Connection

**Issue:** Backend gets 503, tunnel is down

**Fix:**
```bash
# Check tunnel status
cloudflared tunnel list

# Restart tunnel
sudo systemctl restart cloudflared

# Or if running in terminal, kill and restart:
pkill cloudflared
cloudflared tunnel run lation-n8n &
```

### SSL Certificate Issues

Cloudflare automatically issues SSL certificates for:
- `lation.com.mx` (Cloudflare Pages)
- `api.lation.com.mx` (Backend via DNS proxy)
- `n8n.lation.com.mx` (Cloudflare Tunnel)

**If you see SSL errors:**

1. Ensure DNS records are **Proxied** (orange cloud) in Cloudflare
2. Set SSL/TLS to **Full** or **Full (Strict)**
3. Wait 5-10 minutes for Cloudflare to issue certificates

### 404 Errors on n8n Paths

If n8n routes like `/webhook/contact` return 404:

1. Check the actual webhook path in your n8n workflow
2. Update `~/.cloudflared/config.yml` with correct ingress paths (optional)
3. Verify n8n is running locally: `docker ps -a | grep n8n`

## Production Checklist

- ✅ Domain `lation.com.mx` registered and nameservers changed to Cloudflare
- ✅ DNS A records created for `lation.com.mx` and `api.lation.com.mx`
- ✅ SSL/TLS set to **Full** or **Full (Strict)**
- ✅ Cloudflare Pages connected to GitHub repo
- ✅ `VITE_API_URL` environment variable set in Cloudflare Pages
- ✅ Backend deployed and running on server (Docker or PM2)
- ✅ Backend `.env` configured with production URLs
- ✅ Cloudflared tunnel created and running for n8n
- ✅ Tunnel routed to `n8n.lation.com.mx`
- ✅ Tunnel config file (`~/.cloudflared/config.yml`) set up
- ✅ Backend `N8N_WEBHOOK_URL` points to tunnel domain
- ✅ All three services tested and reachable (frontend, backend, n8n)
- ✅ Contact form tested end-to-end
- ✅ Logs monitored for errors
- ✅ Cloudflare Tunnel runs on boot (systemd service installed)

## Environment Variables Summary

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Frontend API endpoint | `https://api.lation.com.mx` |
| `FRONTEND_URL` | Backend CORS allowed origin | `https://lation.com.mx` |
| `N8N_WEBHOOK_URL` | Backend n8n webhook URL | `https://n8n.lation.com.mx/webhook/contact` |
| `PORT` | Backend port | `3001` |

## Next Steps

1. ✅ All services deployed and tested
2. Configure monitoring (Cloudflare & server logs)
3. Set up automated backups for n8n workflows
4. Add rate limiting to frontend (reCAPTCHA, etc.)
5. Plan scaling strategy as traffic grows

## Support & Resources

- **Cloudflare Docs:** https://developers.cloudflare.com/
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **Cloudflare Tunnel:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **n8n Docs:** https://docs.n8n.io/

---

**Last Updated:** February 4, 2026
