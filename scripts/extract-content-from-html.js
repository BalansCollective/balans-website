/**
 * Extract content from old HTML files to create proper i18n JSON files
 * 
 * This script reads the balans-website-old HTML files and extracts:
 * - Swedish content (from .sv-text spans)
 * - English content (from .en-text spans)
 * 
 * Outputs proper translation JSON files for react-i18next
 */

const fs = require('fs');
const path = require('path');

// File paths
const oldDir = path.join(__dirname, '../../balans-website-old');
const outputDir = path.join(__dirname, '../public/locales');

// Read and parse HTML file
function extractContentFromHTML(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  
  const content = {
    sv: {},
    en: {}
  };
  
  // Extract hero content
  const heroTitleMatch = html.match(/<h1[^>]*>\s*<span class="sv-text">(.*?)<\/span>\s*<span class="en-text[^>]*>(.*?)<\/span>/s);
  if (heroTitleMatch) {
    content.sv.hero_title = heroTitleMatch[1].trim();
    content.en.hero_title = heroTitleMatch[2].trim();
  }
  
  // Extract all sv-text / en-text pairs
  const pairs = [];
  const regex = /<span class="sv-text">(.*?)<\/span>\s*<span class="en-text[^>]*>(.*?)<\/span>/gs;
  let match;
  while ((match = regex.exec(html)) !== null) {
    pairs.push({
      sv: match[1].trim(),
      en: match[2].trim()
    });
  }
  
  return { content, pairs };
}

// Main execution
console.log('Extracting content from HTML files...\n');

// Extract from index.html
const indexPath = path.join(oldDir, 'index.html');
if (fs.existsSync(indexPath)) {
  console.log('Processing index.html...');
  const { pairs } = extractContentFromHTML(indexPath);
  console.log(`Found ${pairs.length} translation pairs in index.html`);
  console.log('First 5 pairs:');
  pairs.slice(0, 5).forEach((pair, i) => {
    console.log(`${i + 1}. SV: "${pair.sv.substring(0, 50)}..."`);
    console.log(`   EN: "${pair.en.substring(0, 50)}..."\n`);
  });
}

console.log('\n✅ Extraction complete');
console.log('\nNext steps:');
console.log('1. Review the extracted pairs above');
console.log('2. Manually structure them into proper JSON with semantic keys');
console.log('3. Update public/locales/{sv,en}/homepage.json with real content');

