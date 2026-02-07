# Lation Backend

Minimal Express + TypeScript backend for forwarding contact form submissions to n8n.

Environment variables (see `.env.example`):
- `PORT` - backend port (default 3001)
- `N8N_WEBHOOK_URL` - the n8n webhook URL to forward contact form data to
- `N8N_WEBHOOK_SECRET` - optional shared secret sent as `x-form-secret`
- `FRONTEND_URL` - allowed CORS origin for frontend

Run locally (requires Node 18+):

```
cd server
npm install
npm run dev
```

Build and run with Docker (uses `docker-compose.yml` at repo root):

```
# ensure .env has N8N_WEBHOOK_URL pointing to your n8n instance
docker compose up --build
```

Notes:
- If n8n runs on the host and the backend runs in Docker, use `http://host.docker.internal:5678` for `N8N_WEBHOOK_URL` so the container can reach the host n8n instance.
