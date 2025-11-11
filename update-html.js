const fs = require('fs');
const path = require('path');

/**
 * Updates HTML file with versioned CSS and JS file references
 * @throws {Error} If files cannot be read or written
 */
async function updateHtml() {
  let version;
  try {
    // Get version from package.json
    const packageJson = JSON.parse(await fs.promises.readFile('./package.json', 'utf8'));
    version = packageJson.version;

    // Define paths
    const paths = {
      styles: path.resolve(__dirname, 'dist/styles'),
      scripts: path.resolve(__dirname, 'dist/scripts'),
      html: path.resolve(__dirname, 'index.html'),
      criticalCss: `./dist/styles/critical.min.v${version}.css`,
      nonCriticalCss: `./dist/styles/non-critical.min.v${version}.css`,
      js: `./dist/scripts/main.min.v${version}.js`,
      swiper: `./dist/scripts/swiper.min.v${version}.js`
    };

    // Ensure dist directories exist
    await Promise.all([
      ensureDirectoryExists(paths.styles),
      ensureDirectoryExists(paths.scripts)
    ]);

    // Delete old versioned files
    await Promise.all([
      deleteOldFiles(paths.styles, 'critical.min.v', version),
      deleteOldFiles(paths.styles, 'non-critical.min.v', version),
      deleteOldFiles(paths.styles, 'main.min.v', version),
      deleteOldFiles(paths.scripts, 'main.min.v', version),
      deleteOldFiles(paths.scripts, 'swiper.min.v', version)
    ]);

    // Update HTML content
    let htmlContent = await fs.promises.readFile(paths.html, 'utf8');
    
    // Update critical CSS reference (will be inlined later)
    // This replaces any main.min or critical.min CSS with critical CSS link
    htmlContent = htmlContent
      .replace(
        /<link[^>]*href=['"]\.\/dist\/styles\/(critical|main)\.min\.v\d+\.\d+\.\d+\.css['"][^>]*>/g,
        `<link rel="stylesheet" href="${paths.criticalCss}" />`
      );
    
    // Remove the old noscript tag with duplicate main.min CSS if it exists
    htmlContent = htmlContent.replace(
      /<noscript><link[^>]*href=['"]\.\/dist\/styles\/main\.min\.v\d+\.\d+\.\d+\.css['"][^>]*><\/noscript>/g,
      ''
    );
    
    // Add non-critical CSS reference after the critical CSS
    // Find the critical CSS link and add non-critical after it
    if (!htmlContent.includes('non-critical.min')) {
      htmlContent = htmlContent.replace(
        /(<link rel="stylesheet" href="\.\/dist\/styles\/critical\.min\.v\d+\.\d+\.\d+\.css" \/>)/,
        `$1\n  \n  <!-- Non-critical CSS - deferred -->\n  <link rel="preload" href="${paths.nonCriticalCss}" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n  <noscript><link rel="stylesheet" href="${paths.nonCriticalCss}" /></noscript>`
      );
    } else {
      // Update existing non-critical CSS reference
      htmlContent = htmlContent.replace(
        /<!-- Non-critical CSS - deferred -->[\s\S]*?<link[^>]*href=['"]\.\/dist\/styles\/non-critical\.min\.v\d+\.\d+\.\d+\.css['"][^>]*>[\s\S]*?(?:<noscript>.*?<\/noscript>)?/g,
        `<!-- Non-critical CSS - deferred -->\n  <link rel="preload" href="${paths.nonCriticalCss}" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n  <noscript><link rel="stylesheet" href="${paths.nonCriticalCss}" /></noscript>`
      );
    }

    // Update JS references - main.js only (Swiper is lazy loaded)
    htmlContent = htmlContent
      .replace(
        /<script[^>]*src=['"]\.\/dist\/scripts\/main\.min\.v\d+\.\d+\.\d+\.js['"][^>]*><\/script>/g,
        `<script defer src="${paths.js}"></script>`
      )
      .replace(
        /<link[^>]*rel="preload"[^>]*href=['"]\.\/dist\/scripts\/main\.min\.v\d+\.\d+\.\d+\.js['"][^>]*>/g,
        `<link rel="preload" href="${paths.js}" as="script" />`
      );
    
    // Remove any Swiper script tags since it's now lazy loaded
    htmlContent = htmlContent
      .replace(
        /<script[^>]*src=['"]\.\/dist\/scripts\/swiper\.min\.v\d+\.\d+\.\d+\.js['"][^>]*><\/script>/g,
        ''
      )
      .replace(
        /<link[^>]*rel="preload"[^>]*href=['"]\.\/dist\/scripts\/swiper\.min\.v\d+\.\d+\.\d+\.js['"][^>]*>/g,
        ''
      );

    // Verify changes - check for critical CSS link OR inline style tag
    const hasCriticalCSS = htmlContent.includes(paths.criticalCss) || htmlContent.includes('<style>:root{');
    if (!hasCriticalCSS || !htmlContent.includes(paths.js)) {
      throw new Error('Failed to update asset references in HTML');
    }

    await fs.promises.writeFile(paths.html, htmlContent, 'utf8');
    console.log(`Updated index.html with v${version}:
Critical CSS: ${paths.criticalCss}
Non-Critical CSS: ${paths.nonCriticalCss}
JS: ${paths.js}
Note: Swiper (${paths.swiper}) is lazy loaded when needed`);

  } catch (error) {
    console.error('Error updating HTML:', error);
    console.error('Current version:', version);
    process.exit(1);
  }
}

/**
 * Deletes old versioned files from a directory
 * @param {string} directory - Directory path
 * @param {string} filePrefix - File prefix to match
 * @param {string} currentVersion - Current version to keep
 */
async function deleteOldFiles(directory, filePrefix, currentVersion) {
  try {
    const files = await fs.promises.readdir(directory);
    
    for (const file of files) {
      if (file.startsWith(filePrefix) && 
          !file.endsWith(`v${currentVersion}.css`) && 
          !file.endsWith(`v${currentVersion}.js`)) {
        await fs.promises.unlink(path.join(directory, file));
        console.log(`Deleted old file: ${file}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting old files in ${directory}:`, error);
  }
}

async function ensureDirectoryExists(directory) {
  try {
    await fs.promises.access(directory);
  } catch {
    await fs.promises.mkdir(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
}

// Run the update
updateHtml();