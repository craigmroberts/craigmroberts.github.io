const fs = require('fs');
const path = require('path');

// Get the version from package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version;

// Define the paths
const distStylesDir = path.resolve(__dirname, 'dist/styles');
const distScriptsDir = path.resolve(__dirname, 'dist/scripts');
const htmlFilePath = path.resolve(__dirname, 'index.html');
const cssFilePath = `./dist/styles/main.min.v${version}.css`;
const jsFilePath = `./dist/scripts/main.min.v${version}.js`;

// Helper function to delete old versioned files
function deleteOldFiles(directory, filePrefix) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    if (file.startsWith(filePrefix) && !file.endsWith(`v${version}.css`) && !file.endsWith(`v${version}.js`)) {
      fs.unlinkSync(path.join(directory, file));
      console.log(`Deleted old file: ${file}`);
    }
  });
}

// Delete old CSS and JS files
deleteOldFiles(distStylesDir, 'main.min.v');
deleteOldFiles(distScriptsDir, 'main.min.v');

// Read the HTML file
let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

// Replace the old CSS file reference with the new versioned file
htmlContent = htmlContent.replace(
  /<link rel="stylesheet" href="\.\/dist\/styles\/main\.min\.v[\d.]+\.css" \/>/,
  `<link rel="stylesheet" href="${cssFilePath}" />`
);

// Replace the old JS file reference with the new versioned file
htmlContent = htmlContent.replace(
  /<script src="\.\/dist\/scripts\/main\.min\.v[\d.]+\.js"><\/script>/,
  `<script src="${jsFilePath}"></script>`
);

// Write the updated HTML back to the file
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');

console.log(`Updated index.html with CSS file: ${cssFilePath} and JS file: ${jsFilePath}`);