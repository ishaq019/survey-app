# Survey App Deployment Checklist

Use this checklist to ensure your deployment to syedishaq.me/survey-app is properly configured.

## Pre-Deployment Setup

- [ ] Repository created at https://github.com/ishaq019/survey-app
- [ ] Repository cloned locally
- [ ] Dependencies installed: `cd frontend && npm install`
- [ ] Application tested locally: `npm run dev`
- [ ] Build tested: `npm run build && npm run preview`

## GitHub Repository Configuration

- [ ] `main` branch is the default branch
- [ ] `.github/workflows/deploy.yml` file is present
- [ ] `.gitignore` file includes `node_modules/`, `dist/`, `.env`
- [ ] `.env` files are NOT committed to git

## GitHub Pages Settings

1. Go to: https://github.com/ishaq019/survey-app/settings/pages
2. Configure:
   - [ ] Source: **Deploy from a branch**
   - [ ] Branch: Select **gh-pages** (will be auto-created)
   - [ ] Folder: **/ (root)**
   - [ ] Note: Custom domain is NOT needed for subdirectory hosting

## DNS Configuration for syedishaq.me

With your domain registrar (GoDaddy, Namecheap, etc.):

### Option A: Using A records (GitHub Recommended)
- [ ] Add 4 A records pointing to:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

### Option B: Using CNAME (simpler)
- [ ] Add CNAME record:
  - Type: CNAME
  - Name: @ (root)
  - Value: ishaq019.github.io

> Note: The subdirectory `/survey-app/` is configured in Vite and doesn't require separate DNS setup.

## Verification

- [ ] DNS records propagated: `nslookup syedishaq.me`
- [ ] GitHub Actions workflow ran successfully
  - Visit: https://github.com/ishaq019/survey-app/actions
- [ ] Site is accessible: https://syedishaq.me/survey-app
- [ ] HTTPS enabled and working
- [ ] No certificate errors

## Post-Deployment

- [ ] Test all pages on production site
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Verify images and assets load correctly
- [ ] Test form submissions and interactions

## Troubleshooting

If deployment fails:

1. **Build Error:**
   - [ ] Check GitHub Actions logs
   - [ ] Run `npm run build` locally
   - [ ] Verify all imports are correct

2. **Site not accessible:**
   - [ ] Wait 48 hours for DNS propagation
   - [ ] Clear browser cache (Ctrl+Shift+Delete)
   - [ ] Try incognito mode
   - [ ] Check DNS status: https://dnschecker.org/

3. **404 Error:**
   - [ ] Verify CNAME file exists in `frontend/dist/`
   - [ ] Check GitHub Pages branch settings
   - [ ] Ensure `gh-pages` branch has build files

## Useful Links

- GitHub Pages Status: https://www.githubstatus.com/
- DNS Checker: https://mxtoolbox.com/
- GitHub Actions Logs: https://github.com/ishaq019/survey-app/actions
- Repository Settings: https://github.com/ishaq019/survey-app/settings/pages

## Rollback Steps

If something goes wrong:

1. Revert the last commit:
   ```bash
   git revert HEAD
   git push origin main
   ```

2. Or force rebuild:
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push origin main
   ```

3. Check Actions tab for new deployment

---

**Domain:** syedishaq.me/survey-app  
**Repository:** https://github.com/ishaq019/survey-app  
**Last Updated:** 2026-05-30
