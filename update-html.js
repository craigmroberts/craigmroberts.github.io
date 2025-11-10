const fs = require('fs');
const path = require('path');

/**
 * Updates HTML file with versioned CSS and JS file references
 * @throws {Error} If files cannot be read or written
 */
async function updateHtml() {
  try {
    // Get version from package.json
    const packageJson = JSON.parse(await fs.promises.readFile('./package.json', 'utf8'));
    const version = packageJson.version;

    // Define paths
    const paths = {
      styles: path.resolve(__dirname, 'dist/styles'),
      scripts: path.resolve(__dirname, 'dist/scripts'),
      html: path.resolve(__dirname, 'index.html'),
      css: `./dist/styles/main.min.v${version}.css`,
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
      deleteOldFiles(paths.styles, 'main.min.v', version),
      deleteOldFiles(paths.scripts, 'main.min.v', version),
      deleteOldFiles(paths.scripts, 'swiper.min.v', version)
    ]);

    // Update HTML content
    let htmlContent = await fs.promises.readFile(paths.html, 'utf8');
    
    // Update CSS references - both standard and preload
    htmlContent = htmlContent
      .replace(
        /<link[^>]*href=['"]\.\/dist\/styles\/main\.min\.v\d+\.\d+\.\d+\.css['"][^>]*>/g,
        `<link rel="stylesheet" href="${paths.css}" />`
      )
      .replace(
        /<link[^>]*rel="preload"[^>]*href=['"]\.\/dist\/styles\/main\.min\.v\d+\.\d+\.\d+\.css['"][^>]*>/g,
        `<link rel="preload" href="${paths.css}" as="style" />`
      );

    // Update JS references - both standard and preload
    htmlContent = htmlContent
      .replace(
        /<script[^>]*src=['"]\.\/dist\/scripts\/main\.min\.v\d+\.\d+\.\d+\.js['"][^>]*><\/script>/g,
        `<script defer src="${paths.js}"></script>`
      )
      .replace(
        /<script[^>]*src=['"]\.\/dist\/scripts\/swiper\.min\.v\d+\.\d+\.\d+\.js['"][^>]*><\/script>/g,
        `<script defer src="${paths.swiper}"></script>`
      )
      .replace(
        /<link[^>]*rel="preload"[^>]*href=['"]\.\/dist\/scripts\/main\.min\.v\d+\.\d+\.\d+\.js['"][^>]*>/g,
        `<link rel="preload" href="${paths.js}" as="script" />`
      )
      .replace(
        /<link[^>]*rel="preload"[^>]*href=['"]\.\/dist\/scripts\/swiper\.min\.v\d+\.\d+\.\d+\.js['"][^>]*>/g,
        `<link rel="preload" href="${paths.swiper}" as="script" />`
      );

    // Verify changes
    if (!htmlContent.includes(paths.css) || !htmlContent.includes(paths.js) || !htmlContent.includes(paths.swiper)) {
      throw new Error('Failed to update asset references in HTML');
    }

    await fs.promises.writeFile(paths.html, htmlContent, 'utf8');
    console.log(`Updated index.html with v${version}:
CSS: ${paths.css}
JS: ${paths.js}
Swiper: ${paths.swiper}`);

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