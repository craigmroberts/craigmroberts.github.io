#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Update hero image to use picture element with WebP
html = html.replace(
  /<img([^>]*src="\.\/assets\/images\/hero-1\.png"[^>]*)>/g,
  `<picture>
      <source type="image/webp" srcset="./dist/images/hero-1.webp" />
      <img$1>
    </picture>`.replace(/\.\/assets\/images\/hero-1\.png/g, './dist/images/hero-1.png')
);

// Update all other image paths from assets/images to dist/images
html = html.replace(
  /src="\.\/assets\/images\//g,
  'src="./dist/images/'
);

// Update image paths in data-src (if any lazy loading)
html = html.replace(
  /data-src="\.\/assets\/images\//g,
  'data-src="./dist/images/'
);

fs.writeFileSync(indexPath, html, 'utf-8');

console.log('✅ Updated index.html to use optimized images from dist/images/');
