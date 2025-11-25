/**
 * Secret Scanner - Detects real classification markings to prevent actual classified data leaks
 * 
 * CRITICAL: This demo uses FICTIONAL data. If real classification markings are detected,
 * we MUST block the operation to prevent security violations.
 */

export interface SecretScanResult {
  hasSecrets: boolean;
  detectedPatterns: Array<{
    pattern: string;
    location: string;
    severity: 'critical' | 'high';
    message: string;
  }>;
}

const CLASSIFICATION_MARKING_PATTERNS = [
  // Official DoD/NATO classification markings
  { regex: /SECRET\/\//gi, name: 'Official SECRET marking', severity: 'critical' as const },
  { regex: /TOP\s+SECRET\/\//gi, name: 'Official TOP SECRET marking', severity: 'critical' as const },
  { regex: /CONFIDENTIAL\/\//gi, name: 'Official CONFIDENTIAL marking', severity: 'critical' as const },
  { regex: /(TS|S|C)\/\/\w+/gi, name: 'Official classification with caveats', severity: 'critical' as const },
  
  // Classification authority headers
  { regex: /CLASSIFIED\s+BY:/gi, name: 'Classification authority header', severity: 'critical' as const },
  { regex: /DERIVED\s+FROM:/gi, name: 'Derived classification header', severity: 'critical' as const },
  { regex: /DECLASSIFY\s+ON:/gi, name: 'Declassification date header', severity: 'critical' as const },
  
  // Department of Defense identifiers
  { regex: /DEPARTMENT\s+OF\s+DEFENSE/gi, name: 'DoD identifier', severity: 'high' as const },
  { regex: /\bDoD\b/g, name: 'DoD abbreviation', severity: 'high' as const },
  
  // Real API keys and tokens (common patterns)
  { regex: /sk-proj-[A-Za-z0-9]{32,}/g, name: 'OpenAI API key', severity: 'critical' as const },
  { regex: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Key', severity: 'critical' as const },
  { regex: /ghp_[A-Za-z0-9]{36}/g, name: 'GitHub Personal Access Token', severity: 'critical' as const },
  { regex: /glpat-[A-Za-z0-9_\-]{20}/g, name: 'GitLab Personal Access Token', severity: 'critical' as const },
  
  // Private keys
  { regex: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/gi, name: 'Private key', severity: 'critical' as const },
  { regex: /-----BEGIN\s+OPENSSH\s+PRIVATE\s+KEY-----/gi, name: 'SSH private key', severity: 'critical' as const },
];

export function scanForSecrets(content: string, filename: string): SecretScanResult {
  const detectedPatterns: SecretScanResult['detectedPatterns'] = [];
  
  for (const pattern of CLASSIFICATION_MARKING_PATTERNS) {
    const matches = content.match(pattern.regex);
    if (matches) {
      // Get first match for location context
      const firstMatch = matches[0];
      const matchIndex = content.indexOf(firstMatch);
      const lineNumber = content.substring(0, matchIndex).split('\n').length;
      
      detectedPatterns.push({
        pattern: pattern.name,
        location: `${filename}:${lineNumber}`,
        severity: pattern.severity,
        message: `Detected ${pattern.name}: "${firstMatch.substring(0, 30)}${firstMatch.length > 30 ? '...' : ''}"`
      });
    }
  }
  
  return {
    hasSecrets: detectedPatterns.length > 0,
    detectedPatterns
  };
}

export function getSecretScanBlockMessage(result: SecretScanResult): string {
  const criticalSecrets = result.detectedPatterns.filter(p => p.severity === 'critical');
  
  if (criticalSecrets.length > 0) {
    return `🚫 CRITICAL: Real classified data detected

This demo is for FICTIONAL data only. The following patterns suggest real classified information:

${criticalSecrets.map(s => `  • ${s.pattern} at ${s.location}`).join('\n')}

Action required:
1. Remove all real classification markings
2. Use only the provided BirdTurret demo files
3. Never paste actual classified documents

Security note: This demo sends content to OpenRouter (cloud LLM). Real classified data would be a serious security violation.`;
  }
  
  const highSecrets = result.detectedPatterns.filter(p => p.severity === 'high');
  
  if (highSecrets.length > 0) {
    return `⚠️ WARNING: Possible real data detected

Detected patterns that may indicate real content:

${highSecrets.map(s => `  • ${s.pattern} at ${s.location}`).join('\n')}

If this is fictional demo data, you can proceed.
If this is REAL data, remove it immediately - this demo uses cloud AI.`;
  }
  
  return 'Unknown security issue detected.';
}

