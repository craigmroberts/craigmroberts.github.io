#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONFIG = {
  inputDir: 'assets/images',
  outputDir: 'dist/images',
  formats: ['webp', 'jpg'], // WebP + original format fallback
  quality: {
    webp: 85,
    jpeg: 85,
    png: 90,
  },
  // Generate responsive sizes for content images
  responsiveSizes: {
    'brand/lifestyle': [400, 800, 1200],
    'medium': [400, 800],
    'hero': [800, 1200, 1600],
  },
};

// Track optimization stats
const stats = {
  processed: 0,
  originalSize: 0,
  optimizedSize: 0,
  errors: [],
};

/**
 * Get the appropriate sizes for a given image path
 */
function getSizesForPath(imagePath) {
  for (const [pathSegment, sizes] of Object.entries(CONFIG.responsiveSizes)) {
    if (imagePath.includes(pathSegment)) {
      return sizes;
    }
  }
  return null; // No responsive sizes needed
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath) {
  try {
    const relativePath = path.relative(CONFIG.inputDir, inputPath);
    const parsed = path.parse(relativePath);
    const outputDir = path.join(CONFIG.outputDir, parsed.dir);
    
    ensureDir(outputDir);

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    stats.originalSize += originalStats.size;

    // Skip SVG files - copy them directly
    if (parsed.ext.toLowerCase() === '.svg') {
      const outputPath = path.join(outputDir, parsed.base);
      fs.copyFileSync(inputPath, outputPath);
      console.log(`📋 Copied: ${relativePath}`);
      return;
    }

    // For WebP source files, copy directly and generate responsive sizes only
    if (parsed.ext.toLowerCase() === '.webp') {
      const outputPath = path.join(outputDir, parsed.base);
      fs.copyFileSync(inputPath, outputPath);
      
      const originalStats = fs.statSync(inputPath);
      stats.originalSize += originalStats.size;
      stats.optimizedSize += originalStats.size;
      
      // Generate responsive WebP sizes if needed
      const sizes = getSizesForPath(relativePath);
      if (sizes) {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        for (const width of sizes) {
          if (width < metadata.width) {
            const responsivePath = path.join(
              outputDir,
              `${parsed.name}-${width}w.webp`
            );
            await sharp(inputPath)
              .resize(width, null, {
                withoutEnlargement: true,
                fit: 'inside',
              })
              .webp({ quality: CONFIG.quality.webp })
              .toFile(responsivePath);
            
            const responsiveStats = fs.statSync(responsivePath);
            stats.optimizedSize += responsiveStats.size;
          }
        }
      }
      
      console.log(`✅ ${relativePath} (WebP source - copied)`);
      stats.processed++;
      return;
    }

    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const sizes = getSizesForPath(relativePath);

    // Generate WebP version(s)
    if (sizes) {
      // Generate responsive images
      for (const width of sizes) {
        if (width < metadata.width) {
          // WebP responsive
          const webpPath = path.join(
            outputDir,
            `${parsed.name}-${width}w.webp`
          );
          await sharp(inputPath)
            .resize(width, null, {
              withoutEnlargement: true,
              fit: 'inside',
            })
            .webp({ quality: CONFIG.quality.webp })
            .toFile(webpPath);

          const webpStats = fs.statSync(webpPath);
          stats.optimizedSize += webpStats.size;
        }
      }
    }

    // Generate full-size WebP
    const webpPath = path.join(outputDir, `${parsed.name}.webp`);
    await image
      .clone()
      .webp({ quality: CONFIG.quality.webp })
      .toFile(webpPath);

    const webpStats = fs.statSync(webpPath);
    stats.optimizedSize += webpStats.size;

    // Optimize original format
    const optimizedPath = path.join(outputDir, parsed.base);
    const isJpg = ['.jpg', '.jpeg'].includes(parsed.ext.toLowerCase());
    const isPng = parsed.ext.toLowerCase() === '.png';

    if (isJpg) {
      await image
        .clone()
        .jpeg({
          quality: CONFIG.quality.jpeg,
          progressive: true,
          mozjpeg: true,
        })
        .toFile(optimizedPath);
    } else if (isPng) {
      await image
        .clone()
        .png({
          quality: CONFIG.quality.png,
          compressionLevel: 9,
          progressive: true,
        })
        .toFile(optimizedPath);
    }

    const optimizedStats = fs.statSync(optimizedPath);
    stats.optimizedSize += optimizedStats.size;

    const savings = (
      ((originalStats.size - webpStats.size) / originalStats.size) *
      100
    ).toFixed(1);

    console.log(
      `✅ ${relativePath} → WebP (${savings}% smaller)`
    );
    stats.processed++;
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
    stats.errors.push({ file: inputPath, error: error.message });
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Starting image optimization...\n');

  // Clean output directory
  if (fs.existsSync(CONFIG.outputDir)) {
    fs.rmSync(CONFIG.outputDir, { recursive: true });
  }
  ensureDir(CONFIG.outputDir);

  // Find all images
  const patterns = [
    `${CONFIG.inputDir}/**/*.jpg`,
    `${CONFIG.inputDir}/**/*.jpeg`,
    `${CONFIG.inputDir}/**/*.png`,
    `${CONFIG.inputDir}/**/*.webp`,
    `${CONFIG.inputDir}/**/*.svg`,
  ];

  const images = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { nodir: true });
    images.push(...matches);
  }

  console.log(`Found ${images.length} images to process\n`);

  // Process images in parallel (batches of 5)
  const batchSize = 5;
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    await Promise.all(batch.map(optimizeImage));
  }

  // Print summary
  console.log('\n📊 Optimization Summary:');
  console.log(`   Processed: ${stats.processed} images`);
  console.log(
    `   Original size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(
    `   Optimized size: ${(stats.optimizedSize / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(
    `   Total savings: ${(
      ((stats.originalSize - stats.optimizedSize) / stats.originalSize) *
      100
    ).toFixed(1)}%`
  );

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  ${stats.errors.length} errors occurred:`);
    stats.errors.forEach(({ file, error }) => {
      console.log(`   ${file}: ${error}`);
    });
  }

  console.log('\n✨ Image optimization complete!');
}

main().catch(console.error);
