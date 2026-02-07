# n8n VPS Deployment (lation.com.mx)

This folder contains templates to deploy n8n on a VPS at `/opt/n8n` using Docker Compose, Postgres, and Nginx with a Cloudflare Origin Certificate.

## 1) Cloudflare DNS
- `A` record: `n8n.lation.com.mx` -> VPS IP (**Proxied**)
- `A` record: `api.lation.com.mx` -> VPS IP (**Proxied**)

## 2) Cloudflare Origin Certificate
Create a Cloudflare Origin Certificate (not Let's Encrypt):
1. Cloudflare Dashboard -> SSL/TLS -> Origin Server
2. Create certificate for `n8n.lation.com.mx`
3. Save the certificate and key as:
   - `/opt/n8n/certs/origin.pem`
   - `/opt/n8n/certs/origin.key`

This keeps Cloudflare proxy enabled and avoids ACME renewal issues.

## 3) WAF / Challenge Bypass (critical for webhooks)
Create a Cloudflare WAF rule:
- Condition: `http.host eq "n8n.lation.com.mx" and starts_with(http.request.uri.path, "/webhook")`
- Also add `/webhook-test` if you use test URLs
- Action: **Skip**
- Skip: WAF, Managed Challenge, JS Challenge, Bot Fight Mode, Rate Limiting

## 4) Deploy on VPS
```bash
# On the VPS
sudo mkdir -p /opt/n8n/certs
sudo chown -R $USER:$USER /opt/n8n

# Copy files from this repo to /opt/n8n
# docker-compose.yml, nginx.conf, .env

cp .env.example .env
# Edit .env with strong secrets

# Start
docker compose up -d
```

## 5) Verify
```bash
curl -I https://n8n.lation.com.mx
```
Expected: `HTTP/2 200`

## 6) Backend integration
Set in backend `.env`:
```
N8N_WEBHOOK_URL=https://n8n.lation.com.mx/webhook/<your-path>
N8N_WEBHOOK_SECRET=change-me
```

In n8n, validate the header `x-form-secret` before processing.

## 7) Migration
Export workflows and credentials from your local n8n instance and import them into the VPS instance.
Make sure `N8N_ENCRYPTION_KEY` is set **before** importing credentials.
