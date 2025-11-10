# Security Headers Configuration

## Implemented in HTML

The following security headers are implemented via `<meta>` tags in `index.html`:

✅ **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
✅ **X-Frame-Options**: `SAMEORIGIN` - Prevents clickjacking
✅ **Referrer-Policy**: `strict-origin-when-cross-origin` - Protects referrer information
✅ **Permissions-Policy**: Disables geolocation, microphone, camera
✅ **Content-Security-Policy**: Comprehensive CSP with restricted sources

## For Enhanced Security (Server Configuration)

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
```

## GitHub Pages

GitHub Pages automatically provides:
- ✅ HTTPS (TLS 1.2+)
- ✅ Strict-Transport-Security header
- ✅ X-Content-Type-Options: nosniff

The meta tags in HTML provide additional security layers.

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

After implementation:
- ✅ "Uses third-party cookies" - FIXED (logo now local)
- ✅ "Ensure CSP is effective against XSS attacks" - IMPROVED
- ⚠️ "Use a strong HSTS policy" - Requires server headers (GitHub Pages handles this)
- ⚠️ "Ensure proper origin isolation with COOP" - Requires server headers
- ⚠️ "Mitigate clickjacking with XFO or CSP" - IMPROVED (meta tag added)

## Notes

- `'unsafe-inline'` is used for inline scripts/styles (consider removing for stricter security)
- CSP can break functionality if too restrictive - test thoroughly
- GitHub Pages doesn't support custom server headers, so meta tags are the best option
