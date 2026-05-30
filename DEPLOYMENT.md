# Survey App - Deployment Guide

This guide explains how to deploy the Survey App to a subdirectory at `syedishaq.me/survey-app`.

## Prerequisites

- GitHub account with the repository: `https://github.com/ishaq019/survey-app`
- Domain: `syedishaq.me` (with DNS access)
- Node.js 18+ installed locally

## Project Setup

### 1. Initial Repository Setup

```bash
cd survey-app
git init
git add .
git commit -m "Initial commit: Survey App setup"
git branch -M main
git remote add origin https://github.com/ishaq019/survey-app.git
git push -u origin main
```

### 2. GitHub Repository Settings

1. Go to: `https://github.com/ishaq019/survey-app`
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** (will be created automatically)
   - Folder: **/ (root)**
4. **Note:** For subdirectory hosting, you do NOT need a custom domain in GitHub Pages settings. The deployment will use your gh-pages branch with the CNAME pointing to your custom domain.

### 3. DNS Configuration for Custom Domain

For subdirectory hosting on `syedishaq.me/survey-app`, configure DNS for the main domain:

**Option A: Using A records (recommended)**
```
Type: A
Name: @ (or syedishaq.me)
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

**Option B: Using CNAME record (simpler)**
```
Type: CNAME
Name: @
Value: ishaq019.github.io
```

> Note: DNS propagation can take up to 48 hours. The `/survey-app` subdirectory is configured in Vite and will be automatically created during deployment.

## Automated Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. **Triggers on:**
   - Push to `main` or `master` branch
   - Pull requests (testing only)

2. **Workflow Steps:**
   - Checkout code
   - Install Node.js 18
   - Install dependencies from `frontend/`
   - Build Vite application with `/survey-app/` base path
   - Deploy to GitHub Pages (gh-pages branch) with custom domain CNAME

3. **Result:** 
   - App deployed to: `https://syedishaq.me/survey-app/`

## Local Development

### Development Server

```bash
cd frontend
npm install
npm run dev
```

Server runs on: `http://localhost:5174`

### Production Build

```bash
cd frontend
npm run build
```

Output goes to: `frontend/dist/`

## Environment Variables

### Development (`.env`)
```
VITE_API_URL=http://localhost:5001/api
VITE_QUIZ_APP_URL=http://localhost:5173
```

### Production (`.env.production`)
```
VITE_API_URL=https://api.syedishaq.me/api
VITE_QUIZ_APP_URL=https://quiz.syedishaq.me
```

**Note:** Production URLs are used during GitHub Actions build.

## Deployment Workflow

1. **Make Changes**
   ```bash
   cd frontend
   npm run lint:fix
   npm run format
   ```

2. **Test Locally**
   ```bash
   npm run build
   npm run preview
   ```

3. **Commit and Push**
   ```bash
   git add .
   git commit -m "Feature: Your description"
   git push origin main
   ```

4. **Automatic Deployment**
   - GitHub Actions workflow starts automatically
   - Build and deployment logs: `https://github.com/ishaq019/survey-app/actions`
   - Site deployed to: `https://syedishaq.me/survey-app`

## Monitoring Deployment

### View Build Logs
1. Go to: `https://github.com/ishaq019/survey-app/actions`
2. Click on the latest workflow run
3. View the build and deployment steps

### Troubleshooting

**Site not loading:**
- Check GitHub Actions logs
- Verify DNS propagation: `nslookup syedishaq.me`
- Clear browser cache (Ctrl+Shift+Delete)

**DNS issues:**
- Wait 48 hours for DNS propagation
- Verify DNS records at: `https://mxtoolbox.com/`

**Build failures:**
- Check Node.js version in `deploy.yml`
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

## Performance Optimization

### Build Configuration
- Vite config enables:
  - Source maps disabled in production
  - Terser minification
  - Optimized output directory

### Caching
- GitHub Actions caches npm dependencies
- Faster builds on subsequent deployments

## Security

- HTTPS enabled automatically via GitHub Pages
- Custom domain CNAME verified
- Repository is public (adjust settings if needed)

## Branch Protection (Optional)

To prevent accidental deployments:

1. Go to: **Settings** → **Branches**
2. Add rule for `main`:
   - Require status checks to pass
   - Require pull request reviews

## Support

For issues with:
- **GitHub Pages:** https://docs.github.com/en/pages
- **Vite:** https://vitejs.dev/
- **GitHub Actions:** https://docs.github.com/en/actions

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 5174) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Auto-fix code style |
| `npm run format` | Format code with Prettier |

---

**Live Site:** https://syedishaq.me/survey-app  
**Repository:** https://github.com/ishaq019/survey-app  
**Last Updated:** 2026-05-30
