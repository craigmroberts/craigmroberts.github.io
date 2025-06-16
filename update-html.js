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
      js: `./dist/scripts/main.min.v${version}.js`
    };

    // Ensure dist directories exist
    await Promise.all([
      ensureDirectoryExists(paths.styles),
      ensureDirectoryExists(paths.scripts)
    ]);

    // Delete old versioned files
    await Promise.all([
      deleteOldFiles(paths.styles, 'main.min.v', version),
      deleteOldFiles(paths.scripts, 'main.min.v', version)
    ]);

    // Update HTML content
    let htmlContent = await fs.promises.readFile(paths.html, 'utf8');
    
    // Update file references
    htmlContent = htmlContent
      .replace(
        /<link rel="stylesheet" href="\.\/dist\/styles\/main\.min\.v[\d.]+\.css" \/>/,
        `<link rel="stylesheet" href="${paths.css}" />`
      )
      .replace(
        /<script src="\.\/dist\/scripts\/main\.min\.v[\d.]+\.js"><\/script>/,
        `<script src="${paths.js}"></script>`
      );

    await fs.promises.writeFile(paths.html, htmlContent, 'utf8');
    console.log(`Updated index.html with CSS file: ${paths.css} and JS file: ${paths.js}`);

  } catch (error) {
    console.error('Error updating HTML:', error);
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