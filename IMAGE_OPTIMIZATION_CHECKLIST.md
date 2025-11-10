# Image Optimization - Testing Checklist

## ✅ Pre-Deployment Checklist

### 1. Build Verification

- [x] Dependencies installed (`npm install`)
- [x] Images optimized (`npm run build:images`)
- [x] Full build successful (`npm run build`)
- [x] `dist/images/` directory created
- [x] WebP files generated
- [x] Responsive sizes created
- [x] Fallback formats preserved

### 2. File Verification

```bash
# Check hero image (should show PNG and WebP)
ls -lh dist/images/hero-1.*

# Check responsive images
ls -lh dist/images/brand/lifestyle/patou*

# Count total images
find dist/images -type f | wc -l
```

Expected:
- Hero: PNG (~265KB) + WebP (~42KB)
- Responsive: Multiple sizes per image
- Total: ~100-150 files (originals + WebP + responsive)

### 3. Path Updates

- [x] `index.html` uses `dist/images/`
- [x] `assets/data/brands.js` updated
- [x] `assets/data/mediumArticles.js` updated
- [x] Snippet templates updated

### 4. Local Testing

```bash
# Start local server
python3 -m http.server 8080

# Open browser
open http://localhost:8080
```

#### Visual Checks:

- [ ] Hero image loads correctly
- [ ] All brand logos display
- [ ] Brand lifestyle images load
- [ ] Medium article images load
- [ ] No broken image icons (404s)
- [ ] Images look sharp/not blurry
- [ ] No console errors

#### Browser DevTools Checks:

**Network Tab:**
- [ ] WebP images being served (check Response Headers: `Content-Type: image/webp`)
- [ ] Image sizes are smaller than before
- [ ] Responsive images loading appropriate sizes
- [ ] No 404 errors for images

**Performance Tab:**
- [ ] LCP improved
- [ ] No layout shifts from images (CLS)
- [ ] Images load progressively

### 5. Browser Compatibility Testing

Test in:

- [ ] **Chrome** (WebP native support)
  - Should load `.webp` files
  - Check Network tab for `image/webp`
  
- [ ] **Firefox** (WebP support)
  - Should load `.webp` files
  - Verify in Network tab
  
- [ ] **Safari** (WebP support Safari 14+)
  - Should load `.webp` files on newer versions
  - Should fallback to JPG/PNG on older versions
  
- [ ] **Mobile Safari** (iOS 14+)
  - Test responsive images
  - Verify appropriate sizes load

### 6. Lighthouse Audit

Run Lighthouse on:
- Desktop
- Mobile

#### Check Metrics:

**Performance:**
- [ ] Score improved (target: 90+)
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

**Opportunities:**
- [ ] "Serve images in next-gen formats" ✅ (should be resolved)
- [ ] "Properly size images" ✅ (responsive sizes)
- [ ] "Efficiently encode images" ✅ (compression)

**Diagnostics:**
- [ ] Reduced image transfer size
- [ ] Proper image dimensions
- [ ] Images loaded lazily

### 7. Network Performance

**Before/After Comparison:**

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total Page Size | ? MB | ? MB | ? % |
| Image Transfer | ? MB | ? MB | ? % |
| Number of Requests | ? | ? | ±0 |
| LCP | ? s | ? s | ? % |
| Page Load Time | ? s | ? s | ? % |

Use Browser DevTools Network tab to measure.

### 8. Git & Deployment

- [x] `.gitignore` includes `dist/images/`
- [x] Source images in `assets/images/` committed
- [ ] Deployment script includes `npm run build`
- [ ] CI/CD pipeline updated (if applicable)

### 9. Documentation

- [x] `IMAGE_OPTIMIZATION.md` created
- [x] `IMAGE_OPTIMIZATION_SUMMARY.md` created
- [x] `optimize-images.js` documented
- [ ] README updated with image optimization info

### 10. Future Maintenance

- [ ] Document image addition process
- [ ] Add image size guidelines
- [ ] Consider automated image validation
- [ ] Set up image budget alerts

## 🐛 Common Issues & Solutions

### Images Not Loading

**Symptoms:** Broken image icons, 404 errors

**Solution:**
```bash
# Rebuild images
npm run build:images

# Hard refresh browser
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + F5
```

### WebP Not Being Served

**Symptoms:** JPG/PNG files loading instead of WebP

**Check:**
1. Browser supports WebP (Chrome, Firefox, Safari 14+)
2. Network tab shows correct Content-Type
3. Picture element has correct structure

### Responsive Images Wrong Size

**Symptoms:** Large images on mobile, small on desktop

**Check:**
1. `sizes` attribute configured correctly
2. Breakpoints match your CSS
3. Browser window width vs loaded image size

### Build Fails

**Error:** "Sharp installation failed"

**Solution:**
```bash
npm uninstall sharp
npm cache clean --force
npm install sharp
```

### Performance Not Improved

**Check:**
1. WebP actually being served
2. Original images were already optimized
3. Other blocking resources (CSS/JS)
4. Server compression enabled

## 📊 Expected Results

### File Size Improvements

- **Hero PNG**: 93% smaller (3.9MB → 42KB WebP)
- **Brand Logos**: 30-50% smaller
- **Lifestyle Images**: 20-40% smaller
- **Overall Page Weight**: 40-60% reduction

### Performance Improvements

- **LCP**: 30-50% faster
- **Page Load**: 20-40% faster
- **Lighthouse Performance**: +10-20 points
- **Data Saved**: ~4-6 MB per page load

## ✅ Sign-Off

- [ ] All checks passed
- [ ] Performance metrics recorded
- [ ] No visual regressions
- [ ] Ready for deployment

**Tested by:** _______________
**Date:** _______________
**Browsers tested:** _______________
**Performance Score:** Before: ___ After: ___
