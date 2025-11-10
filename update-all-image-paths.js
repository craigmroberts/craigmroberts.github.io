#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function updateFiles() {
  console.log('🔄 Updating image paths in JS files...\n');

  // Find all JS files
  const jsFiles = await glob('assets/**/*.js');

  let filesUpdated = 0;

  for (const file of jsFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    const original = content;

    // Update all assets/images paths to dist/images
    content = content.replace(/\.\/assets\/images\//g, './dist/images/');
    content = content.replace(/"assets\/images\//g, '"dist/images/');
    content = content.replace(/'assets\/images\//g, "'dist/images/");

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✅ Updated: ${path.relative(process.cwd(), file)}`);
      filesUpdated++;
    }
  }

  // Update HTML snippets
  const htmlFiles = await glob('snippets/**/*.html');
  
  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    const original = content;

    content = content.replace(/\.\/assets\/images\//g, './dist/images/');
    content = content.replace(/"assets\/images\//g, '"dist/images/');

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✅ Updated: ${path.relative(process.cwd(), file)}`);
      filesUpdated++;
    }
  }

  console.log(`\n✨ Updated ${filesUpdated} files`);
}

updateFiles().catch(console.error);
