const fs = require('fs');
const path = require('path');

const INDEX_HTML = path.join(__dirname, 'index.html');
const CRITICAL_CSS_PATTERN = /dist\/styles\/critical\.min\.v[\d.]+\.css/;

function inlineCriticalCSS() {
  // Read index.html
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  
  // Find the critical CSS filename
  const criticalCSSMatch = html.match(CRITICAL_CSS_PATTERN);
  
  if (!criticalCSSMatch) {
    console.log('⚠️  No critical CSS reference found in index.html');
    return;
  }
  
  const criticalCSSPath = path.join(__dirname, criticalCSSMatch[0]);
  
  if (!fs.existsSync(criticalCSSPath)) {
    console.log(`⚠️  Critical CSS file not found: ${criticalCSSPath}`);
    return;
  }
  
  // Read the critical CSS content
  const criticalCSS = fs.readFileSync(criticalCSSPath, 'utf8');
  
  // Create inline style tag
  const inlineStyle = `<style>${criticalCSS}</style>`;
  
  // Replace the critical CSS link with inline style
  // Escape special regex characters in the path
  const escapedPath = criticalCSSMatch[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const criticalLinkRegex = new RegExp(
    `<link[^>]*href=["']\\.\/${escapedPath}["'][^>]*\\/>`,
    'g'
  );
  
  html = html.replace(criticalLinkRegex, inlineStyle);
  
  // Also remove any noscript tag with critical CSS if it exists
  const noscriptRegex = new RegExp(
    `<noscript><style>${criticalCSS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</style></noscript>`,
    'g'
  );
  html = html.replace(noscriptRegex, '');
  
  // Write back to index.html
  fs.writeFileSync(INDEX_HTML, html, 'utf8');
  
  const sizeKB = (criticalCSS.length / 1024).toFixed(2);
  console.log(`✅ Inlined critical CSS (${sizeKB} KB) into index.html`);
  console.log(`   Removed: ${criticalCSSMatch[0]}`);
}

inlineCriticalCSS();
