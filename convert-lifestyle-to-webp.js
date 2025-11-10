#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Convert large lifestyle JPGs to WebP in the source directory
const lifestyleDir = 'assets/images/brand/lifestyle';
const filesToConvert = [
  'protectapet.jpg',
  'pangaia.jpg', 
  'st-john.jpg',
  'pucci.jpg',
  'rhino-greenhouses.jpg',
  'and-sons.jpg',
  'new-era.jpg',
  'rad.jpg',
  'bad-monday.jpg',
  'pandco.jpg',
  'kjaer-weis.jpg',
  'indu.jpg',
  'goose-and-gander.jpg',
  'pattern.jpg'
];

async function convertToWebP(filename) {
  const inputPath = path.join(lifestyleDir, filename);
  const outputPath = path.join(lifestyleDir, filename.replace('.jpg', '.webp'));
  
  // Skip if already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping ${filename} (WebP already exists)`);
    return;
  }
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  ${filename} not found, skipping`);
    return;
  }
  
  try {
    const originalStats = fs.statSync(inputPath);
    
    await sharp(inputPath)
      .webp({ quality: 82, effort: 6 })
      .toFile(outputPath);
    
    const webpStats = fs.statSync(outputPath);
    const savings = ((originalStats.size - webpStats.size) / originalStats.size * 100).toFixed(1);
    const originalKB = (originalStats.size / 1024).toFixed(1);
    const webpKB = (webpStats.size / 1024).toFixed(1);
    
    console.log(`✅ ${filename}: ${originalKB} KB → ${webpKB} KB (${savings}% savings)`);
    
    // Delete the original JPG
    fs.unlinkSync(inputPath);
    console.log(`   🗑️  Deleted ${filename}`);
    
  } catch (error) {
    console.error(`❌ Error converting ${filename}:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Converting lifestyle images to WebP...\n');
  
  for (const file of filesToConvert) {
    await convertToWebP(file);
  }
  
  console.log('\n✨ Conversion complete!');
  console.log('💡 Run "npm run build" to regenerate optimized output.');
}

main().catch(console.error);
