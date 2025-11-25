/**
 * Red Forge KISS - Enforcement Logic Test
 * 
 * Tests the classification enforcement rules.
 * This is the CRITICAL functionality for SAAB demo.
 */

// Classification levels (must match RedForgeKISSPage.tsx)
const levels = {
  'OPEN': 0,
  'BH': 1,
  'K': 2,
  'H': 3
};

// AI service security requirements
const services = [
  { id: 'claude-cloud', name: 'Claude Cloud', minLevel: 'OPEN' },
  { id: 'saas-lumen', name: 'SaaS Lumen', minLevel: 'BH' },
  { id: 'forge-local', name: 'Red Forge Local', minLevel: 'K' },
  { id: 'forge-airgap', name: 'Red Forge Air-Gap', minLevel: 'H' }
];

function canUseAIService(fileLevel, serviceLevelMin) {
  const fileIdx = levels[fileLevel] || 0;
  const serviceIdx = levels[serviceLevelMin] || 0;
  
  if (serviceIdx < fileIdx) {
    return {
      allowed: false,
      reason: `${fileLevel} files require higher security than ${serviceLevelMin}`
    };
  }
  
  return { allowed: true };
}

// Test cases
const tests = [
  // OPEN files - should work with all services
  { file: 'OPEN', service: 'OPEN', expected: true, desc: 'OPEN file → Claude Cloud' },
  { file: 'OPEN', service: 'BH', expected: true, desc: 'OPEN file → SaaS Lumen' },
  { file: 'OPEN', service: 'K', expected: true, desc: 'OPEN file → Red Forge Local' },
  { file: 'OPEN', service: 'H', expected: true, desc: 'OPEN file → Red Forge Air-Gap' },
  
  // BH files - blocked by OPEN services
  { file: 'BH', service: 'OPEN', expected: false, desc: 'BH file → Claude Cloud (BLOCKED)' },
  { file: 'BH', service: 'BH', expected: true, desc: 'BH file → SaaS Lumen' },
  { file: 'BH', service: 'K', expected: true, desc: 'BH file → Red Forge Local' },
  
  // K files - require K or H services
  { file: 'K', service: 'OPEN', expected: false, desc: 'K file → Claude Cloud (BLOCKED)' },
  { file: 'K', service: 'BH', expected: false, desc: 'K file → SaaS Lumen (BLOCKED)' },
  { file: 'K', service: 'K', expected: true, desc: 'K file → Red Forge Local' },
  { file: 'K', service: 'H', expected: true, desc: 'K file → Red Forge Air-Gap' },
  
  // H files - only air-gap
  { file: 'H', service: 'OPEN', expected: false, desc: 'H file → Claude Cloud (BLOCKED)' },
  { file: 'H', service: 'BH', expected: false, desc: 'H file → SaaS Lumen (BLOCKED)' },
  { file: 'H', service: 'K', expected: false, desc: 'H file → Red Forge Local (BLOCKED)' },
  { file: 'H', service: 'H', expected: true, desc: 'H file → Red Forge Air-Gap' },
];

console.log('🧪 Testing Red Forge Enforcement Logic\n');

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const result = canUseAIService(test.file, test.service);
  const success = result.allowed === test.expected;
  
  if (success) {
    console.log(`✅ ${test.desc}`);
    passed++;
  } else {
    console.log(`❌ ${test.desc}`);
    console.log(`   Expected: ${test.expected}, Got: ${result.allowed}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n✅ All enforcement tests passed! Logic is correct.');
} else {
  console.log('\n❌ Some tests failed - fix enforcement logic!');
  process.exit(1);
}

