# Image Optimization Guide

## Overview

This project now includes automatic image optimization that converts and compresses images during the build process.

## Features

✅ **WebP Conversion** - All JPG/PNG images are converted to WebP format
✅ **Compression** - Images are compressed with optimal quality settings
✅ **Responsive Images** - Multiple sizes generated for different screen sizes
✅ **Fallbacks** - Original formats preserved for browser compatibility
✅ **SVG Support** - SVG files are copied without modification

## Build Process

Images are automatically optimized when you run:

```bash
npm run build
```

Or manually optimize images:

```bash
npm run build:images
```

### What Happens

1. **Input**: Reads all images from `assets/images/`
2. **Processing**:
   - Converts JPG/PNG → WebP (85% quality)
   - Optimizes original format (85% quality for JPG, 90% for PNG)
   - Generates responsive sizes for content images:
     - Brand lifestyle images: 400w, 800w, 1200w
     - Medium articles: 400w, 800w
     - Hero images: 800w, 1200w, 1600w
   - Copies SVG files unchanged
3. **Output**: Saves optimized images to `dist/images/`

## Usage in HTML

### Simple Image (Auto-converted)

```html
<!-- Before optimization -->
<img src="./assets/images/hero-1.png" alt="Hero" />

<!-- After build (automatically updated) -->
<img src="./dist/images/hero-1.png" alt="Hero" />
```

Browsers will automatically request the `.webp` version if supported.

### Picture Element with WebP (Recommended)

For critical images, use the `<picture>` element:

```html
<picture>
  <source type="image/webp" srcset="./dist/images/hero-1.webp" />
  <img src="./dist/images/hero-1.png" alt="Hero" fetchpriority="high" />
</picture>
```

### Responsive Images

```html
<picture>
  <source
    type="image/webp"
    srcset="
      ./dist/images/brand/lifestyle/patou-400w.webp 400w,
      ./dist/images/brand/lifestyle/patou-800w.webp 800w,
      ./dist/images/brand/lifestyle/patou.webp 1200w
    "
    sizes="(max-width: 768px) 100vw, 50vw"
  />
  <img
    src="./dist/images/brand/lifestyle/patou.jpg"
    alt="Patou"
    loading="lazy"
  />
</picture>
```

## Usage in JavaScript

### Helper Functions

The project includes image helper utilities in `assets/scripts/helpers/dom/imageHelper.js`:

```javascript
import { createPicture, toWebP, upgradeImages } from './helpers/dom/imageHelper.js';

// Create a picture element with WebP support
const picture = createPicture({
  src: 'brand/lifestyle/patou',  // Path without extension
  alt: 'Patou Brand',
  fallbackExt: 'jpg',
  sizes: [400, 800, 1200],  // Responsive sizes
  className: 'brand-image',
  lazy: true,
  fetchPriority: 'auto'
});

// Convert image path to WebP
const webpPath = toWebP('./assets/images/photo.jpg');
// Returns: './dist/images/photo.webp'

// Upgrade all images in a container
upgradeImages(document.querySelector('.gallery'));
```

## File Sizes & Savings

After optimization, expect:

- **WebP savings**: 20-60% smaller than JPG/PNG
- **Hero images**: Up to 90% smaller (large PNGs)
- **Brand logos (PNG)**: 40-55% smaller
- **Lifestyle photos**: 10-30% smaller

Example from build:

```
Original size: 8.33 MB
WebP versions: ~4-5 MB (40-50% smaller)
```

## Configuration

Edit `optimize-images.js` to customize:

```javascript
const CONFIG = {
  inputDir: 'assets/images',
  outputDir: 'dist/images',
  quality: {
    webp: 85,     // WebP quality (0-100)
    jpeg: 85,     // JPEG quality (0-100)
    png: 90,      // PNG quality (0-100)
  },
  responsiveSizes: {
    'brand/lifestyle': [400, 800, 1200],  // Widths in pixels
    'medium': [400, 800],
    'hero': [800, 1200, 1600],
  },
};
```

## Browser Support

- **WebP**: Chrome, Edge, Firefox, Safari 14+, Opera
- **Fallback**: JPG/PNG for older browsers
- **Responsive**: All modern browsers support `srcset` and `sizes`

## Git & Deployment

Optimized images in `dist/images/` are **not committed** to git (see `.gitignore`).

### GitHub Pages Deployment

Images are optimized during build, so ensure your deployment includes:

```bash
npm install
npm run build
```

The `dist/images/` directory will be generated fresh on each deployment.

## Performance Benefits

✅ **Faster Load Times** - Smaller file sizes = faster downloads
✅ **Better Core Web Vitals** - Improved LCP (Largest Contentful Paint)
✅ **Reduced Bandwidth** - Save data for users on mobile networks
✅ **SEO Benefits** - Google favors fast-loading sites

### Lighthouse Improvements

Expected score improvements:

- **Performance**: +10-20 points from image optimization alone
- **LCP**: 30-50% faster load times for large images
- **Total Page Size**: 40-60% reduction in image data

## Troubleshooting

### Images not loading after build

1. Check that `dist/images/` exists and contains files
2. Verify paths use `./dist/images/` not `./assets/images/`
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

### WebP not working in older browsers

- Fallback images are automatic when using `<picture>` elements
- Older Safari versions (<14) will use JPG/PNG fallbacks

### Build fails with sharp errors

```bash
# Reinstall sharp
npm uninstall sharp
npm install sharp
```

### Want to skip image optimization during development

```bash
# Build without images
npm run build:css && npm run build:js && npm run update:html
```

## Additional Tools

### View WebP in Finder (Mac)

Install WebP Quick Look plugin:

```bash
brew install webpquicklook
qlmanage -r
```

### Analyze Image Sizes

```bash
# Compare original vs optimized
du -sh assets/images
du -sh dist/images
```

### Check WebP Support

Visit your site and open DevTools Network tab to see which format is loaded.

## Future Enhancements

Potential improvements:

- [ ] AVIF format support (even better compression)
- [ ] Automatic image blur placeholders (LQIP)
- [ ] Cloudinary/CDN integration
- [ ] WebP generation on-demand
- [ ] Image sprite generation for icons
