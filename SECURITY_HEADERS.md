# Security & Performance Headers Configuration

## Implemented in HTML

The following security headers are implemented via `<meta>` tags in `index.html`:

✅ **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
✅ **X-Frame-Options**: `SAMEORIGIN` - Prevents clickjacking
✅ **Referrer-Policy**: `strict-origin-when-cross-origin` - Protects referrer information
✅ **Permissions-Policy**: Disables geolocation, microphone, camera
✅ **Content-Security-Policy**: Comprehensive CSP with restricted sources

## ⚠️ GitHub Pages Cache Limitation

**Issue**: GitHub Pages serves all assets with only **10-minute cache TTL**  
**Impact**: ~5.3 MB of assets re-downloaded on every visit after 10 minutes  
**Solution**: Requires server-side configuration (not available on GitHub Pages)

## For Enhanced Security & Performance (Server Configuration)

If you use Cloudflare, Netlify, or custom hosting, add these headers:

### Cloudflare Pages (_headers file)

```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' medium.com api.behance.net; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests

# Cache Control for Performance (1 year for versioned assets)
/dist/scripts/*.js
  Cache-Control: public, max-age=31536000, immutable
  
/dist/styles/*.css
  Cache-Control: public, max-age=31536000, immutable
  
/dist/images/*
  Cache-Control: public, max-age=31536000, immutable

# HTML - Short cache with revalidation
/*.html
  Cache-Control: public, max-age=3600, must-revalidate
  
/
  Cache-Control: public, max-age=3600, must-revalidate
```

### Netlify (netlify.toml)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' medium.com api.behance.net; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"

# Cache versioned assets for 1 year (they have version numbers in filename)
[[headers]]
  for = "/dist/scripts/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/dist/styles/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/dist/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# HTML files - short cache with revalidation
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600, must-revalidate"

[[headers]]
  for = "/"
  [headers.values]
    Cache-Control = "public, max-age=3600, must-revalidate"
```

### Apache (.htaccess)

```apache
<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' medium.com api.behance.net; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
</IfModule>

# Cache Control for versioned assets (1 year)
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Versioned CSS/JS files (have version in filename)
  <FilesMatch "\.(js|css)$">
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  
  # Images
  <FilesMatch "\.(jpg|jpeg|png|gif|webp|svg|ico)$">
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  
  # HTML files - short cache with revalidation
  <FilesMatch "\.(html|htm)$">
    ExpiresDefault "access plus 1 hour"
    Header set Cache-Control "public, max-age=3600, must-revalidate"
  </FilesMatch>
</IfModule>
```

## GitHub Pages

**Current Behavior:**
- ✅ HTTPS (TLS 1.2+)
- ✅ Strict-Transport-Security header
- ✅ X-Content-Type-Options: nosniff
- ⚠️ **Cache-Control: max-age=600 (10 minutes only)**

**Limitations:**
GitHub Pages does not support:
- Custom Cache-Control headers
- .htaccess or server configuration files
- Custom _headers files

**Workaround:**
Your assets already use versioned filenames (e.g., `main.min.v1.0.522.js`), which is a best practice. When you update the version number:
1. Browsers will treat it as a new file
2. Old versions won't be requested
3. This provides cache-busting without relying on server headers

**To Improve Caching:**
Consider migrating to:
- **Cloudflare Pages** - Free, supports _headers file
- **Netlify** - Free tier, supports netlify.toml
- **Vercel** - Free tier, supports vercel.json
- **Custom hosting** with .htaccess support

The meta tags in HTML provide additional security layers.

## Cache Strategy Explained

### Why Long Cache Times are Safe

Your build system already implements **cache busting** with versioned filenames:
- `main.min.v1.0.522.js` (version in filename)
- `main.min.v1.0.522.css` (version in filename)
- `swiper.min.v1.0.522.js` (version in filename)

**Benefits:**
- ✅ When you update code, version number changes → new filename
- ✅ Browsers see new filename = new file (no cache issues)
- ✅ Old files can be cached forever without breaking updates
- ✅ Users only download assets once per version

### Recommended Cache Times

| Asset Type | Cache Duration | Reason |
|-----------|---------------|--------|
| Versioned JS/CSS | 1 year (immutable) | Filename changes on updates |
| Images | 1 year | Rarely change, content-addressed |
| HTML files | 1 hour | Contains references to versioned assets |
| index.html | 1 hour | Entry point, needs revalidation |

### Current GitHub Pages Impact

With 10-minute cache:
- User visits site → downloads 5.3 MB
- User returns 11 minutes later → downloads 5.3 MB again
- User returns 9 minutes later → uses cache ✓

With 1-year cache (on Cloudflare/Netlify):
- User visits site → downloads 5.3 MB
- User returns anytime → uses cache ✓
- You deploy new version → new filenames, user downloads only those files

## CSP Breakdown

Our Content Security Policy:
- `default-src 'self'` - Only allow resources from same origin
- `script-src 'self' 'unsafe-inline' cdn.jsdelivr.net` - Scripts from self, inline, and Swiper CDN
- `style-src 'self' 'unsafe-inline' cdn.jsdelivr.net fonts.googleapis.com` - Styles from self, inline, Swiper, and Google Fonts
- `img-src 'self' data: https:` - Images from self, data URLs, and any HTTPS
- `font-src 'self' fonts.gstatic.com` - Fonts from self and Google
- `connect-src 'self' medium.com api.behance.net` - API calls to Medium and Behance
- `frame-src 'none'` - No iframes allowed
- `object-src 'none'` - No Flash/plugins
- `upgrade-insecure-requests` - Auto-upgrade HTTP to HTTPS

## Testing

### Check CSP
```bash
curl -I https://craigmroberts.github.io/
```

### Test with SecurityHeaders.com
Visit: https://securityheaders.com/?q=https://craigmroberts.github.io/

### Test with Mozilla Observatory
Visit: https://observatory.mozilla.org/analyze/craigmroberts.github.io

## Expected Lighthouse Score Impact

Current Status:
- ✅ "Uses third-party cookies" - FIXED (logo now local)
- ✅ "Ensure CSP is effective against XSS attacks" - IMPROVED
- ⚠️ "Use a strong HSTS policy" - GitHub Pages handles this automatically
- ⚠️ "Ensure proper origin isolation with COOP" - Requires server headers (not available on GitHub Pages)
- ⚠️ "Mitigate clickjacking with XFO or CSP" - IMPROVED (meta tag added)
- ⚠️ **"Use efficient cache lifetimes" - Cannot fix on GitHub Pages** (requires server configuration)

### To Fix Cache Warnings

**Option 1: Migrate to Cloudflare Pages** (Recommended, Free)
1. Create Cloudflare account
2. Connect GitHub repository
3. Add `_headers` file with cache rules (provided above)
4. Result: ~5.3 MB saved on repeat visits

**Option 2: Use Netlify** (Free)
1. Create Netlify account
2. Connect GitHub repository
3. Add `netlify.toml` with cache rules (provided above)
4. Result: ~5.3 MB saved on repeat visits

**Option 3: Stay on GitHub Pages**
- Your versioned assets already work correctly
- Cache warning will persist in Lighthouse
- Performance impact is minimal for most users (10 minutes is reasonable)
- No action required if you're satisfied with current setup

## Notes

- `'unsafe-inline'` is used for inline scripts/styles (consider removing for stricter security)
- CSP can break functionality if too restrictive - test thoroughly
- GitHub Pages doesn't support custom server headers, so meta tags are the best option
