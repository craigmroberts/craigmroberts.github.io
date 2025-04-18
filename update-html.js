const fs = require('fs');
const path = require('path');

// Get the version from package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version;

// Define the paths
const htmlFilePath = path.resolve(__dirname, 'index.html');
const cssFilePath = `./dist/styles/main.min.v${version}.css`;

// Read the HTML file
let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

// Replace the old CSS file reference with the new versioned file
htmlContent = htmlContent.replace(
  /<link rel="stylesheet" href="\.\/dist\/styles\/main\.min\.v[\d.]+\.css" \/>/,
  `<link rel="stylesheet" href="${cssFilePath}" />`
);

// Write the updated HTML back to the file
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');

console.log(`Updated index.html with CSS file: ${cssFilePath}`);