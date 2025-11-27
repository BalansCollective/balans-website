/**
 * Frontmatter Validation for Red Forge
 * 
 * Validates that markdown files have correct frontmatter and prevents
 * accidental classification downgrades (security critical).
 */

import matter from 'gray-matter';
import { CLASSIFICATION_LEVELS, type Classification } from './classification-constants';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestedAction?: {
    type: 'declassify';
    from: Classification;
    to: Classification;
  };
}

export interface ValidationContext {
  content: string;
  filePath: string;
  originalClassification?: Classification;
  isNewFile: boolean;
}

const CLASSIFICATION_LEVEL_MAP: Record<Classification, string> = {
  'oklassificerad': 'O',
  'begransad-hemlig': 'BH',
  'eu-restricted': 'EU-R',
  'konfidentiell': 'K',
  'hemlig': 'H'
};

const FOLDER_CLASSIFICATION_MAP: Record<string, Classification> = {
  'oklassificerad': 'oklassificerad',
  'begransad-hemlig': 'begransad-hemlig',
  'eu-restricted': 'eu-restricted',
  'konfidentiell': 'konfidentiell',
  'hemlig': 'hemlig'
};

/**
 * Validate frontmatter and classification changes
 */
export function validateFrontmatter(ctx: ValidationContext): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Parse frontmatter
  let frontmatter: Record<string, any>;
  let body: string;
  
  try {
    const parsed = matter(ctx.content);
    frontmatter = parsed.data;
    body = parsed.content;
  } catch (error) {
    return {
      valid: false,
      errors: ['❌ Kunde inte parsa frontmatter - ogiltig YAML syntax'],
      warnings: []
    };
  }
  
  // 1. Check frontmatter exists
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    errors.push('❌ Ingen frontmatter hittad - varje .md-fil måste ha frontmatter');
    return { valid: false, errors, warnings };
  }
  
  // 2. Check required fields
  if (!frontmatter.classification) {
    errors.push('❌ Saknas required field: classification');
  }
  if (!frontmatter.classification_level) {
    errors.push('❌ Saknas required field: classification_level');
  }
  
  // If missing required fields, stop here
  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }
  
  const newClassification = frontmatter.classification as Classification;
  
  // 3. Check classification ↔ level match
  const expectedLevel = CLASSIFICATION_LEVEL_MAP[newClassification];
  if (frontmatter.classification_level !== expectedLevel) {
    errors.push(
      `❌ Inkonsistens: classification="${newClassification}" ` +
      `men classification_level="${frontmatter.classification_level}" ` +
      `(förväntat: "${expectedLevel}")`
    );
  }
  
  // 4. Check folder ↔ classification match
  const pathParts = ctx.filePath.split('/');
  const folder = pathParts[0];  // e.g., "eu-restricted"
  const expectedClassification = FOLDER_CLASSIFICATION_MAP[folder];
  
  if (expectedClassification && newClassification !== expectedClassification) {
    errors.push(
      `❌ Mappfel: Fil ligger i "${folder}/" ` +
      `men har classification="${newClassification}" ` +
      `(förväntat: "${expectedClassification}")`
    );
  }
  
  // 5. CRITICAL: Check for classification downgrades
  if (!ctx.isNewFile && ctx.originalClassification) {
    const originalLevel = CLASSIFICATION_LEVELS[ctx.originalClassification];
    const newLevel = CLASSIFICATION_LEVELS[newClassification];
    
    if (newLevel < originalLevel) {
      // BLOCK: Attempted downgrade
      return {
        valid: false,
        errors: [
          `🚨 SÄKERHETSFEL: Försök att sänka klassificering från ` +
          `${ctx.originalClassification.toUpperCase()} → ${newClassification.toUpperCase()}`,
          '',
          '✅ RÄTT METOD:',
          '1. Högerklicka på filen i filträdet',
          '2. Välj "Deklassificera till..."',
          '3. Granska AI-föreslagna redigeringar',
          '4. Godkänn ändringar',
          '5. Ny fil skapas automatiskt'
        ],
        warnings: [],
        suggestedAction: {
          type: 'declassify',
          from: ctx.originalClassification,
          to: newClassification
        }
      };
    }
    
    if (newLevel > originalLevel) {
      // WARN: Upgrade (allowed but logged)
      warnings.push(
        `⚠️ UPPGRADERING: ${ctx.originalClassification.toUpperCase()} → ${newClassification.toUpperCase()}`,
        'Verifiera att innehållet motiverar högre klassificering.',
        'Loggas i audit trail.'
      );
    }
  } else if (!ctx.isNewFile && !ctx.originalClassification) {
    // No original classification found - warn but allow
    warnings.push(
      '⚠️ Ingen ursprunglig klassificering hittad',
      'Kan inte verifiera om detta är en nedgradering.',
      'Om filen tidigare var högre klassificerad, använd deklassificeringsflödet.'
    );
  }
  
  // 6. EU-specific validation
  if (newClassification === 'eu-restricted') {
    if (!frontmatter.jurisdiction) {
      warnings.push('⚠️ EU-fil rekommenderas ha "jurisdiction: EU"');
    }
    if (!frontmatter.regulation) {
      warnings.push('⚠️ EU-fil rekommenderas ha "regulation" (t.ex. Council Decision 2013/488/EU)');
    }
  }
  
  // 7. Declassified file validation
  const isDeclassified = ctx.filePath.includes('-deklassificerad.md');
  if (isDeclassified) {
    if (!frontmatter.declassified_from) {
      errors.push('❌ Deklassificerad fil saknar "declassified_from"');
    }
    if (!frontmatter.declassified_date) {
      errors.push('❌ Deklassificerad fil saknar "declassified_date"');
    }
    if (!frontmatter.original_file) {
      errors.push('❌ Deklassificerad fil saknar "original_file"');
    }
  }
  
  return { 
    valid: errors.length === 0, 
    errors, 
    warnings 
  };
}

/**
 * Extract classification from frontmatter (for comparison)
 */
export function extractClassification(content: string): Classification | null {
  try {
    const { data } = matter(content);
    return data.classification as Classification || null;
  } catch {
    return null;
  }
}

