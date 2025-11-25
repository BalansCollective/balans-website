/**
 * Declassify attribute validation
 * 
 * Ensures declassify justifications are meaningful and not just "override" or "ok"
 */

export interface DeclassifyValidation {
  isValid: boolean;
  reason?: string;
}

export function validateDeclassifyJustification(justification: string | undefined): DeclassifyValidation {
  if (!justification) {
    return {
      isValid: false,
      reason: 'Justification is required'
    };
  }
  
  const trimmed = justification.trim();
  
  // Must be at least 8 characters
  if (trimmed.length < 8) {
    return {
      isValid: false,
      reason: 'Justification too short (minimum 8 characters)'
    };
  }
  
  // Must contain at least 2 words (alphabetic)
  const words = trimmed.match(/[a-zA-Z]+/g) || [];
  if (words.length < 2) {
    return {
      isValid: false,
      reason: 'Justification must contain at least 2 words'
    };
  }
  
  // Blocklist of non-descriptive justifications
  const blocklist = [
    'whatever', 'asdfasdf', 'qwertyui', 'ok fine', 'this is fine',
    'ignore this', 'override', 'bypass', 'skip guardian', 'not classified'
  ];
  
  const lowerTrimmed = trimmed.toLowerCase();
  if (blocklist.some(blocked => lowerTrimmed.includes(blocked))) {
    return {
      isValid: false,
      reason: 'Justification appears generic or non-descriptive'
    };
  }
  
  // Valid!
  return { isValid: true };
}

export function getDeclassifyValidationMessage(validation: DeclassifyValidation): string {
  if (validation.isValid) {
    return '✓ Valid justification';
  }
  
  return `❌ Invalid justification: ${validation.reason}

Justification must be descriptive (8+ characters, 2+ words).

Examples:
✅ marketing-approved-2025-11
✅ partner-briefing-slide-12
✅ already-public-in-v1-conops
❌ ok
❌ whatever
❌ 12345678`;
}

