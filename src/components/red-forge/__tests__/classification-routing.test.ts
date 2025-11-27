import { describe, it, expect } from 'vitest';

/**
 * Classification-based AI Service Routing Tests
 * 
 * Tests edge cases for how Red Forge routes AI requests based on
 * the highest classification level in the file context.
 */

type Classification = 'oklassificerad' | 'begransad-hemlig' | 'eu-restricted' | 'konfidentiell' | 'hemlig';
type AIService = 'claude-cloud' | 'saas-lumen' | 'forge-local' | 'forge-air-gap';

const CLASSIFICATION_LEVELS: Record<Classification, number> = {
  'oklassificerad': 0,
  'begransad-hemlig': 1,
  'eu-restricted': 1,  // 🇪🇺 Same handling level as BH
  'konfidentiell': 2,
  'hemlig': 3
};

const AI_SERVICE_LEVELS: Record<AIService, { level: number; name: string; maxClass: Classification }> = {
  'claude-cloud': { level: 0, name: 'Claude Cloud', maxClass: 'oklassificerad' },
  'saas-lumen': { level: 1, name: 'SaaS Lumen', maxClass: 'begransad-hemlig' },
  'forge-local': { level: 2, name: 'Red Forge Local', maxClass: 'konfidentiell' },
  'forge-air-gap': { level: 3, name: 'Red Forge Air-Gap', maxClass: 'hemlig' }
};

interface FileInContext {
  name: string;
  classification: Classification;
  content: string;
}

/**
 * Calculate highest classification from files in context
 */
function getHighestClassification(files: FileInContext[]): Classification {
  if (files.length === 0) return 'oklassificerad';
  
  const levels = files.map(f => CLASSIFICATION_LEVELS[f.classification]);
  const maxLevel = Math.max(...levels);
  
  return Object.entries(CLASSIFICATION_LEVELS)
    .find(([_, level]) => level === maxLevel)?.[0] as Classification || 'oklassificerad';
}

/**
 * Get minimum required AI service for files in context
 */
function getRequiredService(files: FileInContext[]): AIService | null {
  if (files.length === 0) return null;
  
  const highestClass = getHighestClassification(files);
  const highestLevel = CLASSIFICATION_LEVELS[highestClass];
  
  const services = Object.entries(AI_SERVICE_LEVELS)
    .sort((a, b) => a[1].level - b[1].level);
  
  for (const [key, info] of services) {
    if (info.level >= highestLevel) {
      return key as AIService;
    }
  }
  return null;
}

/**
 * Get available AI services for current context
 */
function getAvailableServices(files: FileInContext[]): AIService[] {
  if (files.length === 0) {
    // Empty context → All services available
    return Object.keys(AI_SERVICE_LEVELS) as AIService[];
  }
  
  const highestClass = getHighestClassification(files);
  const highestLevel = CLASSIFICATION_LEVELS[highestClass];
  
  return Object.entries(AI_SERVICE_LEVELS)
    .filter(([_, info]) => info.level >= highestLevel)
    .map(([key, _]) => key as AIService);
}

describe('Classification-based AI Service Routing', () => {
  describe('Empty Context', () => {
    it('should allow all AI services when context is empty', () => {
      const files: FileInContext[] = [];
      const available = getAvailableServices(files);
      
      expect(available).toHaveLength(4);
      expect(available).toContain('claude-cloud');
      expect(available).toContain('saas-lumen');
      expect(available).toContain('forge-local');
      expect(available).toContain('forge-air-gap');
    });
    
    it('should return null required service when context is empty', () => {
      const files: FileInContext[] = [];
      const required = getRequiredService(files);
      
      expect(required).toBeNull();
    });
  });
  
  describe('Single File Context', () => {
    it('should require Claude Cloud for oklassificerad file', () => {
      const files: FileInContext[] = [
        { name: 'v1.md', classification: 'oklassificerad', content: 'test' }
      ];
      
      const required = getRequiredService(files);
      expect(required).toBe('claude-cloud');
      
      const available = getAvailableServices(files);
      expect(available).toHaveLength(4); // All services can handle O
    });
    
    it('should require SaaS Lumen for begransad-hemlig file', () => {
      const files: FileInContext[] = [
        { name: 'v2.md', classification: 'begransad-hemlig', content: 'test' }
      ];
      
      const required = getRequiredService(files);
      expect(required).toBe('saas-lumen');
      
      const available = getAvailableServices(files);
      expect(available).toHaveLength(3); // Claude Cloud blocked
      expect(available).not.toContain('claude-cloud');
    });
    
    it('should require SaaS Lumen for eu-restricted file (🇪🇺)', () => {
      const files: FileInContext[] = [
        { name: 'eu-nato-training.md', classification: 'eu-restricted', content: 'test' }
      ];
      
      const required = getRequiredService(files);
      expect(required).toBe('saas-lumen');
      
      const available = getAvailableServices(files);
      expect(available).toHaveLength(3); // Same as BH - Claude Cloud blocked
      expect(available).not.toContain('claude-cloud');
    });
    
    it('should treat EU RESTRICTED same as BH for access control', () => {
      const euFile: FileInContext[] = [
        { name: 'eu.md', classification: 'eu-restricted', content: 'test' }
      ];
      const bhFile: FileInContext[] = [
        { name: 'bh.md', classification: 'begransad-hemlig', content: 'test' }
      ];
      
      const euRequired = getRequiredService(euFile);
      const bhRequired = getRequiredService(bhFile);
      
      expect(euRequired).toBe(bhRequired); // Both require SaaS Lumen
      
      const euAvailable = getAvailableServices(euFile);
      const bhAvailable = getAvailableServices(bhFile);
      
      expect(euAvailable).toEqual(bhAvailable); // Same available services
    });
    
    it('should require Red Forge Local for konfidentiell file', () => {
      const files: FileInContext[] = [
        { name: 'v3.md', classification: 'konfidentiell', content: 'test' }
      ];
      
      const required = getRequiredService(files);
      expect(required).toBe('forge-local');
      
      const available = getAvailableServices(files);
      expect(available).toHaveLength(2); // Only Local + Air-Gap
      expect(available).toContain('forge-local');
      expect(available).toContain('forge-air-gap');
    });
    
    it('should require Air-Gap for hemlig file', () => {
      const files: FileInContext[] = [
        { name: 'v4.md', classification: 'hemlig', content: 'test' }
      ];
      
      const required = getRequiredService(files);
      expect(required).toBe('forge-air-gap');
      
      const available = getAvailableServices(files);
      expect(available).toHaveLength(1); // Only Air-Gap
      expect(available).toEqual(['forge-air-gap']);
    });
  });
  
  describe('Mixed Classification Context (EDGE CASE)', () => {
    it('should use highest classification when mixing O + BH', () => {
      const files: FileInContext[] = [
        { name: 'v1.md', classification: 'oklassificerad', content: 'test' },
        { name: 'v2.md', classification: 'begransad-hemlig', content: 'test' }
      ];
      
      const highest = getHighestClassification(files);
      expect(highest).toBe('begransad-hemlig');
      
      const required = getRequiredService(files);
      expect(required).toBe('saas-lumen');
      
      const available = getAvailableServices(files);
      expect(available).not.toContain('claude-cloud'); // Blocked by BH
    });
    
    it('should use highest classification when mixing O + K', () => {
      const files: FileInContext[] = [
        { name: 'v1.md', classification: 'oklassificerad', content: 'test' },
        { name: 'v3.md', classification: 'konfidentiell', content: 'test' }
      ];
      
      const highest = getHighestClassification(files);
      expect(highest).toBe('konfidentiell');
      
      const required = getRequiredService(files);
      expect(required).toBe('forge-local');
      
      const available = getAvailableServices(files);
      expect(available).toHaveLength(2); // Only Local + Air-Gap
    });
    
    it('should use highest classification when mixing BH + K + H', () => {
      const files: FileInContext[] = [
        { name: 'v2.md', classification: 'begransad-hemlig', content: 'test' },
        { name: 'v3.md', classification: 'konfidentiell', content: 'test' },
        { name: 'v4.md', classification: 'hemlig', content: 'test' }
      ];
      
      const highest = getHighestClassification(files);
      expect(highest).toBe('hemlig');
      
      const required = getRequiredService(files);
      expect(required).toBe('forge-air-gap');
      
      const available = getAvailableServices(files);
      expect(available).toEqual(['forge-air-gap']); // Only Air-Gap allowed
    });
    
    it('should use highest classification when ALL files are same level', () => {
      const files: FileInContext[] = [
        { name: 'file1.md', classification: 'konfidentiell', content: 'test' },
        { name: 'file2.md', classification: 'konfidentiell', content: 'test' },
        { name: 'file3.md', classification: 'konfidentiell', content: 'test' }
      ];
      
      const highest = getHighestClassification(files);
      expect(highest).toBe('konfidentiell');
      
      const required = getRequiredService(files);
      expect(required).toBe('forge-local');
    });
  });
  
  describe('Context Clear Behavior', () => {
    it('should reset to all services available after clearing context', () => {
      // Start with H-file in context
      let files: FileInContext[] = [
        { name: 'v4.md', classification: 'hemlig', content: 'test' }
      ];
      
      let available = getAvailableServices(files);
      expect(available).toEqual(['forge-air-gap']); // Locked to Air-Gap
      
      // Clear context
      files = [];
      
      available = getAvailableServices(files);
      expect(available).toHaveLength(4); // All services available again
      expect(available).toContain('claude-cloud');
    });
    
    it('should allow downgrade to Claude Cloud after clearing H-file', () => {
      // H-file in context → Air-Gap only
      let files: FileInContext[] = [
        { name: 'v4.md', classification: 'hemlig', content: 'test' }
      ];
      
      let required = getRequiredService(files);
      expect(required).toBe('forge-air-gap');
      
      // Clear context
      files = [];
      
      required = getRequiredService(files);
      expect(required).toBeNull(); // No required service
      
      const available = getAvailableServices(files);
      expect(available).toContain('claude-cloud'); // Downgrade allowed
    });
  });
  
  describe('Future Feature: Selective File Removal (NOT IMPLEMENTED YET)', () => {
    it.skip('should allow downgrade when removing highest classified file', () => {
      // Start: O + H files → Air-Gap required
      let files: FileInContext[] = [
        { name: 'v1.md', classification: 'oklassificerad', content: 'test' },
        { name: 'v4.md', classification: 'hemlig', content: 'test' }
      ];
      
      let required = getRequiredService(files);
      expect(required).toBe('forge-air-gap');
      
      // Remove H-file, keep O-file
      files = files.filter(f => f.classification !== 'hemlig');
      
      required = getRequiredService(files);
      expect(required).toBe('claude-cloud'); // Should downgrade to Cloud
      
      const available = getAvailableServices(files);
      expect(available).toHaveLength(4); // All services available for O
    });
    
    it.skip('should maintain highest class when removing lower classified file', () => {
      // Start: O + K files → Local required
      let files: FileInContext[] = [
        { name: 'v1.md', classification: 'oklassificerad', content: 'test' },
        { name: 'v3.md', classification: 'konfidentiell', content: 'test' }
      ];
      
      let required = getRequiredService(files);
      expect(required).toBe('forge-local');
      
      // Remove O-file, keep K-file
      files = files.filter(f => f.classification !== 'oklassificerad');
      
      required = getRequiredService(files);
      expect(required).toBe('forge-local'); // Still Local (K-file remains)
      
      const available = getAvailableServices(files);
      expect(available).toHaveLength(2); // Local + Air-Gap
    });
  });
  
  describe('Edge Cases: Duplicate Files', () => {
    it('should handle duplicate files with same classification', () => {
      const files: FileInContext[] = [
        { name: 'v1.md', classification: 'oklassificerad', content: 'test' },
        { name: 'v1.md', classification: 'oklassificerad', content: 'test' } // Duplicate
      ];
      
      const highest = getHighestClassification(files);
      expect(highest).toBe('oklassificerad');
      
      const required = getRequiredService(files);
      expect(required).toBe('claude-cloud');
    });
    
    it('should handle same filename with different classification (should not happen, but defensive)', () => {
      const files: FileInContext[] = [
        { name: 'test.md', classification: 'oklassificerad', content: 'v1' },
        { name: 'test.md', classification: 'hemlig', content: 'v4' }
      ];
      
      const highest = getHighestClassification(files);
      expect(highest).toBe('hemlig'); // Highest wins
      
      const required = getRequiredService(files);
      expect(required).toBe('forge-air-gap');
    });
  });
  
  describe('Edge Cases: Empty/Invalid Content', () => {
    it('should handle empty file content', () => {
      const files: FileInContext[] = [
        { name: 'empty.md', classification: 'konfidentiell', content: '' }
      ];
      
      const highest = getHighestClassification(files);
      expect(highest).toBe('konfidentiell');
      
      const required = getRequiredService(files);
      expect(required).toBe('forge-local');
    });
    
    it('should handle very large file content', () => {
      const largeContent = 'x'.repeat(1_000_000); // 1MB
      const files: FileInContext[] = [
        { name: 'large.md', classification: 'begransad-hemlig', content: largeContent }
      ];
      
      const highest = getHighestClassification(files);
      expect(highest).toBe('begransad-hemlig');
      
      const required = getRequiredService(files);
      expect(required).toBe('saas-lumen');
    });
  });
});

