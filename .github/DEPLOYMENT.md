# GitHub Actions Deployment Setup

This document explains how to set up GitHub Actions for automated deployment to Cloudflare Pages and your production server.

## Frontend Deployment (Cloudflare Pages)

The `deploy-frontend.yml` workflow automatically deploys your frontend to Cloudflare Pages when you push to main/master branches.

### Required GitHub Secrets

Add these secrets to your GitHub repository:

```bash
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
VITE_API_URL=https://api.lation.com.mx
```

### How to Get Cloudflare Credentials

1. **Cloudflare API Token**:
   - Go to Cloudflare Dashboard → Profile → API Tokens → View API Tokens
   - Create a new token with these permissions:
     - `Zone:Zone:Read` (for DNS records)
     - `Zone:Zone:Edit` (for DNS updates)
     - `Pages:Read` (for Pages deployment)
     - `Pages:Write` (for Pages deployment)

2. **Cloudflare Account ID**:
   - Go to Cloudflare Dashboard → Overview → Account ID
   - Copy your Account ID (looks like `a1b2c3d4e5f6g7h8i9j0`)

3. **Frontend API URL**:
   - Set to your production backend URL: `https://api.lation.com.mx`

### Setup Steps

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each of the required secrets above
4. Push your changes to main/master branch
5. The workflow will automatically build and deploy to Cloudflare Pages

## Full Deployment (Frontend + Backend)

The `deploy.yml` workflow includes both frontend and backend deployment. This requires additional secrets for server deployment.

### Additional Required Secrets

```bash
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_password
SERVER_IP=your_server_ip_address
SERVER_USER=your_server_ssh_username
SSH_PRIVATE_KEY=your_ssh_private_key
```

### Backend Deployment Setup

1. **Docker Hub**:
   - Create a Docker Hub account
   - Generate an access token with write permissions
   - Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` to GitHub secrets

2. **Server Access**:
   - Generate an SSH key pair if you don't have one
   - Add the private key to GitHub secrets as `SSH_PRIVATE_KEY`
   - Add your server IP as `SERVER_IP`
   - Add your SSH username as `SERVER_USER`

3. **Server Setup** (one-time):
   ```bash
   # On your server
   sudo apt update
   sudo apt install docker docker-compose git
   
   # Create deployment directory
   sudo mkdir -p /opt/lation
   sudo chown $USER:$USER /opt/lation
   cd /opt/lation
   
   # Clone your repository
   git clone https://github.com/yourusername/lation-interviews-main.git
   cd lation-interviews-main
   
   # Create docker-compose.yml (or copy from repo)
   # Set up environment variables
   ```

### Environment Variables on Server

Create a `.env` file on your server:

```bash
PORT=3001
FRONTEND_URL=https://lation.com.mx
N8N_WEBHOOK_URL=https://n8n.lation.com.mx/webhook/contact
```

## Workflow Triggers

Both workflows run on:
- Push to `main` or `master` branches (deploys to production)
- Pull requests to `main` or `master` branches (tests only, no deployment)

## Monitoring Deployments

1. **GitHub Actions Tab**: View deployment status and logs
2. **Cloudflare Dashboard**: Check Pages deployment status
3. **Server**: Check Docker container status with `docker ps`

## Troubleshooting

### Common Issues

**Cloudflare API Token Permission Error**:
- Verify your token has all required permissions
- Regenerate the token if needed

**Docker Build Fails**:
- Check Docker Hub credentials in GitHub secrets
- Ensure your Docker Hub account has write permissions

**SSH Connection Fails**:
- Verify server IP and SSH username
- Ensure SSH key is properly added to server `authorized_keys`
- Check server firewall settings

**Build Fails**:
- Check that all dependencies are installed
- Verify environment variables are set correctly
- Run `npm run lint` locally to catch issues early

## Manual Deployment

If you need to deploy manually without GitHub Actions:

1. **Frontend**:
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name=lation-interviews
   ```

2. **Backend**:
   ```bash
   cd server
   docker build -t yourusername/lation-backend:latest .
   docker push yourusername/lation-backend:latest
   # Then SSH to server and run docker compose up -d
   ```

## Security Notes

- Use GitHub secrets to never expose sensitive information
- Rotate your API tokens regularly
- Use read-only tokens where possible
- Limit SSH key permissions to only necessary directories