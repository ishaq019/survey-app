# Quick Verification & Testing Guide

## Pre-Deployment Testing

Before pushing to GitHub, verify everything works locally with the subdirectory configuration.

### Step 1: Test Build

```bash
cd frontend
npm install
npm run build
```

Expected output:
- No errors during build
- `dist/` directory created
- Files include subdirectory in asset paths

### Step 2: Preview Production Build

```bash
cd frontend
npm run preview
```

This starts a local preview server (typically on http://localhost:4173) showing exactly how the app will appear in production.

**Verify:**
- [ ] App loads without errors
- [ ] Styling applies correctly
- [ ] Images and assets display
- [ ] No 404 errors in browser console (F12)
- [ ] Navigation works between routes
- [ ] Forms and interactive elements function

### Step 3: Check Asset Paths

In browser DevTools (F12), check the Network tab:

**Expected paths should include `/survey-app/`:**
- ✅ `https://localhost:4173/survey-app/assets/...`
- ✅ CSS files loading correctly
- ✅ JavaScript bundles loading from `/survey-app/` prefix

**NOT acceptable:**
- ❌ Assets at root: `/assets/...` (without `/survey-app/`)
- ❌ 404 errors on resource loading

### Step 4: Test Routing

With preview running, test these routes:
- [ ] Root: `http://localhost:4173/survey-app/` (should show HomePage)
- [ ] Admin route: `http://localhost:4173/survey-app/admin/exams/123/survey-templates`
- [ ] Student route: `http://localhost:4173/survey-app/student/exams/123/before-survey`
- [ ] Invalid route: Should redirect to homepage

### Step 5: Check Console

In browser console (F12), verify:
- ✅ No errors (red messages)
- ✅ No warnings about failed resources
- ✅ No CORS errors for API calls
- ✅ Environment variables loaded correctly

## Build Verification

```bash
cd frontend

# Check build size
ls -lh dist/

# Expected output: dist/ should contain:
# - index.html
# - assets/ (with .js, .css files)
```

## GitHub Workflow Verification

After pushing to GitHub, verify the workflow:

1. **Visit Actions:**
   https://github.com/ishaq019/survey-app/actions

2. **Check Latest Workflow:**
   - [ ] Click latest push
   - [ ] Verify "Build frontend" step passed
   - [ ] Verify "Deploy to Custom Domain" step passed
   - [ ] Check for any error messages

3. **View Build Logs:**
   Click on steps to see detailed logs if any issues occur

## Production Verification

After GitHub Actions completes:

1. **Wait for Deployment:**
   - Usually takes 30-60 seconds
   - Check Actions page for completion

2. **Access Live Site:**
   https://syedishaq.me/survey-app

3. **Verify in Production:**
   - [ ] Page loads without 404 errors
   - [ ] All assets load (CSS, images, fonts)
   - [ ] Navigation works
   - [ ] No console errors (F12)
   - [ ] HTTPS certificate valid (no warnings)

4. **Test Functionality:**
   - [ ] Click through all major pages
   - [ ] Test forms if applicable
   - [ ] Check responsive design (mobile/tablet)

## Troubleshooting Common Issues

### Issue: Build Command Error
```
Error: Cannot find module 'vite'
```
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Vite Config Error
```
Error: base should not include the trailing slash
```
**Solution:** 
Ensure `vite.config.js` has `base: '/survey-app/'` (WITH trailing slash)

### Issue: Assets Return 404 in Preview
```
GET http://localhost:4173/survey-app/assets/app.js 404
```
**Solution:**
- Verify `vite.config.js` has correct base path
- Verify `main.jsx` has correct basename
- Delete `node_modules/.vite` cache
- Run `npm run build` again

### Issue: Routes Not Working
```
http://syedishaq.me/survey-app/admin/dashboard gives 404
```
**Solution:**
- Verify React Router has `basename="/survey-app"`
- Check `/frontend/src/main.jsx` for correct BrowserRouter setup
- Verify routes in `AppRoutes.jsx` are correct

### Issue: API Calls Failing
```
POST https://api.syedishaq.me/api/surveys 404
```
**Solution:**
- Verify `.env.production` has correct API URL
- Check that API service is running at that URL
- Verify CORS headers if API is on different domain

## DNS Verification

Verify DNS is properly configured:

```bash
# Check DNS resolution
nslookup syedishaq.me
# or on Linux/Mac:
dig syedishaq.me

# Should return:
# Non-authoritative answer:
# Address: 185.199.108.153 (or other GitHub Pages IP)
```

## Performance Check

1. **Lighthouse Score:**
   - Run Chrome DevTools Lighthouse
   - Aim for Green score (90+)

2. **Load Time:**
   - Should load in <3 seconds on 4G
   - Check Network tab in DevTools

3. **Bundle Size:**
   ```bash
   cd frontend
   npm run build
   # Check dist/ size - should be reasonable for React app
   ```

## Final Checklist Before Deployment

- [ ] Local build completes without errors: `npm run build`
- [ ] Preview shows correct paths: `npm run preview`
- [ ] Browser console has no errors
- [ ] All images/assets load in preview
- [ ] Routing works correctly in preview
- [ ] GitHub workflow file is valid YAML
- [ ] DNS is configured correctly
- [ ] GitHub Pages settings verified
- [ ] All documentation files updated

## Support URLs

- **Build Issues:** Check `.github/workflows/deploy.yml` syntax
- **Route Issues:** Check `frontend/src/main.jsx` and `frontend/src/routes/AppRoutes.jsx`
- **Asset Issues:** Check `frontend/vite.config.js` base path
- **Deployment Issues:** View GitHub Actions logs
- **DNS Issues:** Use https://mxtoolbox.com/ to check DNS

---

**Ready to Deploy?**

Once all verifications pass:
```bash
git add .
git commit -m "Ready for production: subdirectory deployment at /survey-app"
git push origin main
```

Then monitor at: https://github.com/ishaq019/survey-app/actions

**Live at:** https://syedishaq.me/survey-app ✅
