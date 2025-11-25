/**
 * Red Forge KISS - File Manifest Test
 * 
 * Verifies FILE_MANIFEST matches actual demo files.
 */

import fs from 'fs';
import path from 'path';

// FILE_MANIFEST from DemoDataLoader.ts (must match exactly)
const FILE_MANIFEST = {
  OPEN: ['README.md', 'v1-concept-summary.md'],
  BH: ['cost-analysis.md', 'v2-multi-tower-overview.md'],
  K: ['v3-5-shotgun-integration-specs.md'],
  H: ['v4-guardian-protocol-implementation.md']
};

console.log('🧪 Testing File Manifest vs Actual Files\n');

const demoDir = path.join(process.cwd(), 'public/red-forge-demo');
let allMatch = true;

for (const [folder, files] of Object.entries(FILE_MANIFEST)) {
  console.log(`📁 ${folder}/`);
  
  for (const file of files) {
    const filePath = path.join(demoDir, folder, file);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      const stats = fs.statSync(filePath);
      console.log(`  ✅ ${file} (${stats.size} bytes)`);
    } else {
      console.log(`  ❌ ${file} MISSING!`);
      allMatch = false;
    }
  }
  
  // Check for extra files not in manifest
  const actualFiles = fs.readdirSync(path.join(demoDir, folder))
    .filter(f => f.endsWith('.md'));
  
  const extra = actualFiles.filter(f => !files.includes(f));
  if (extra.length > 0) {
    console.log(`  ⚠️  Extra files (not in manifest): ${extra.join(', ')}`);
  }
}

console.log('\n📊 Summary:');
console.log(`  Total files in manifest: ${Object.values(FILE_MANIFEST).flat().length}`);

if (allMatch) {
  console.log('\n✅ All manifest files exist! DemoDataLoader will work correctly.');
} else {
  console.log('\n❌ Some files missing - update FILE_MANIFEST!');
  process.exit(1);
}

