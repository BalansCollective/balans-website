import { describe, it, expect } from 'vitest';
import { validateFrontmatter, extractClassification, type ValidationContext } from '../frontmatter-validator';

describe('Frontmatter Validation', () => {
  describe('Basic Validation', () => {
    it('should pass for valid frontmatter', () => {
      const ctx: ValidationContext = {
        content: `---
classification: konfidentiell
classification_level: K
---

# Content`,
        filePath: 'konfidentiell/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should fail when frontmatter is missing', () => {
      const ctx: ValidationContext = {
        content: '# Just content without frontmatter',
        filePath: 'oklassificerad/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Ingen frontmatter');
    });
    
    it('should fail when classification is missing', () => {
      const ctx: ValidationContext = {
        content: `---
classification_level: K
---

# Content`,
        filePath: 'konfidentiell/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('classification'))).toBe(true);
    });
    
    it('should fail when classification_level is missing', () => {
      const ctx: ValidationContext = {
        content: `---
classification: konfidentiell
---

# Content`,
        filePath: 'konfidentiell/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('classification_level'))).toBe(true);
    });
  });
  
  describe('Classification ↔ Level Consistency', () => {
    it('should fail when classification and level mismatch', () => {
      const ctx: ValidationContext = {
        content: `---
classification: hemlig
classification_level: K
---

# Content`,
        filePath: 'hemlig/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Inkonsistens');
      expect(result.errors[0]).toContain('hemlig');
      expect(result.errors[0]).toContain('K');
    });
    
    it('should pass for correct O mapping', () => {
      const ctx: ValidationContext = {
        content: `---
classification: oklassificerad
classification_level: O
---`,
        filePath: 'oklassificerad/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true);
    });
    
    it('should pass for correct BH mapping', () => {
      const ctx: ValidationContext = {
        content: `---
classification: begransad-hemlig
classification_level: BH
---`,
        filePath: 'begransad-hemlig/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true);
    });
    
    it('should pass for correct EU-R mapping', () => {
      const ctx: ValidationContext = {
        content: `---
classification: eu-restricted
classification_level: EU-R
---`,
        filePath: 'eu-restricted/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true);
    });
  });
  
  describe('Folder ↔ Classification Match', () => {
    it('should fail when file in wrong folder', () => {
      const ctx: ValidationContext = {
        content: `---
classification: hemlig
classification_level: H
---`,
        filePath: 'oklassificerad/test.md',  // File in O folder but marked H
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Mappfel');
      expect(result.errors[0]).toContain('oklassificerad/');
      expect(result.errors[0]).toContain('hemlig');
    });
    
    it('should pass when folder matches classification', () => {
      const ctx: ValidationContext = {
        content: `---
classification: eu-restricted
classification_level: EU-R
---`,
        filePath: 'eu-restricted/eu-nato-training.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true);
    });
  });
  
  describe('Classification Downgrade Protection (CRITICAL)', () => {
    it('should BLOCK downgrade from H to K', () => {
      const ctx: ValidationContext = {
        content: `---
classification: konfidentiell
classification_level: K
---`,
        filePath: 'konfidentiell/test.md',
        originalClassification: 'hemlig',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('SÄKERHETSFEL');
      expect(result.errors[0]).toContain('HEMLIG → KONFIDENTIELL');
      expect(result.suggestedAction).toEqual({
        type: 'declassify',
        from: 'hemlig',
        to: 'konfidentiell'
      });
    });
    
    it('should BLOCK downgrade from BH to O', () => {
      const ctx: ValidationContext = {
        content: `---
classification: oklassificerad
classification_level: O
---`,
        filePath: 'oklassificerad/test.md',
        originalClassification: 'begransad-hemlig',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(false);
      expect(result.suggestedAction?.type).toBe('declassify');
      expect(result.suggestedAction?.from).toBe('begransad-hemlig');
      expect(result.suggestedAction?.to).toBe('oklassificerad');
    });
    
    it('should BLOCK downgrade from EU-R to O', () => {
      const ctx: ValidationContext = {
        content: `---
classification: oklassificerad
classification_level: O
---`,
        filePath: 'oklassificerad/test.md',
        originalClassification: 'eu-restricted',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(false);
      expect(result.suggestedAction?.from).toBe('eu-restricted');
    });
    
    it('should ALLOW same-level change (BH ↔ EU-R)', () => {
      const ctx: ValidationContext = {
        content: `---
classification: eu-restricted
classification_level: EU-R
---`,
        filePath: 'eu-restricted/test.md',
        originalClassification: 'begransad-hemlig',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true); // Same level (both 1)
    });
    
    it('should WARN on upgrade from K to H', () => {
      const ctx: ValidationContext = {
        content: `---
classification: hemlig
classification_level: H
---`,
        filePath: 'hemlig/test.md',
        originalClassification: 'konfidentiell',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true); // Allowed
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('UPPGRADERING');
    });
    
    it('should ALLOW no change (same classification)', () => {
      const ctx: ValidationContext = {
        content: `---
classification: konfidentiell
classification_level: K
---`,
        filePath: 'konfidentiell/test.md',
        originalClassification: 'konfidentiell',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });
  
  describe('EU-Specific Validation', () => {
    it('should warn if EU file lacks jurisdiction', () => {
      const ctx: ValidationContext = {
        content: `---
classification: eu-restricted
classification_level: EU-R
---`,
        filePath: 'eu-restricted/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true); // Warning, not error
      expect(result.warnings.some(w => w.includes('jurisdiction'))).toBe(true);
    });
    
    it('should warn if EU file lacks regulation', () => {
      const ctx: ValidationContext = {
        content: `---
classification: eu-restricted
classification_level: EU-R
jurisdiction: EU
---`,
        filePath: 'eu-restricted/test.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.includes('regulation'))).toBe(true);
    });
    
    it('should pass for complete EU frontmatter', () => {
      const ctx: ValidationContext = {
        content: `---
classification: eu-restricted
classification_level: EU-R
jurisdiction: EU
regulation: Council Decision 2013/488/EU
---`,
        filePath: 'eu-restricted/test.md',
        originalClassification: 'eu-restricted', // Same classification (no upgrade/downgrade)
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });
  
  describe('Declassified File Validation', () => {
    it('should fail if declassified file lacks declassified_from', () => {
      const ctx: ValidationContext = {
        content: `---
classification: oklassificerad
classification_level: O
---`,
        filePath: 'oklassificerad/test-deklassificerad.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('declassified_from'))).toBe(true);
    });
    
    it('should pass for complete declassified file', () => {
      const ctx: ValidationContext = {
        content: `---
classification: oklassificerad
classification_level: O
declassified_from: hemlig
declassified_date: 2025-11-27
original_file: secret-doc.md
---`,
        filePath: 'oklassificerad/secret-doc-deklassificerad.md',
        isNewFile: false
      };
      
      const result = validateFrontmatter(ctx);
      expect(result.valid).toBe(true);
    });
  });
  
  describe('extractClassification Helper', () => {
    it('should extract classification from valid frontmatter', () => {
      const content = `---
classification: eu-restricted
classification_level: EU-R
---`;
      
      const classification = extractClassification(content);
      expect(classification).toBe('eu-restricted');
    });
    
    it('should return null for missing frontmatter', () => {
      const content = '# No frontmatter';
      const classification = extractClassification(content);
      expect(classification).toBeNull();
    });
    
    it('should return null for malformed YAML', () => {
      const content = `---
this is not valid yaml
---`;
      const classification = extractClassification(content);
      expect(classification).toBeNull();
    });
  });
});

