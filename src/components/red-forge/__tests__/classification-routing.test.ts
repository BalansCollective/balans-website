import { describe, it, expect } from 'vitest';

/**
 * Classification-based AI Service Routing Tests (Swedish ISM-2022)
 * 
 * RED PC Reality: ALL models are air-gapped local.
 * No cloud services, no internet. Choice = performance/quality, not security level.
 */

type Classification = 'oklassificerad' | 'begransad-hemlig' | 'eu-restricted' | 'konfidentiell' | 'hemlig';
type AIService = 'forge-llama-3.3-70b' | 'forge-qwen-32b' | 'forge-deepseek-33b' | 'forge-lumen';

const CLASSIFICATION_LEVELS: Record<Classification, number> = {
  'oklassificerad': 0,
  'begransad-hemlig': 1,
  'eu-restricted': 1,  // 🇪🇺 Same handling level as BH
  'konfidentiell': 2,
  'hemlig': 3
};

const AI_SERVICE_LEVELS: Record<AIService, { level: number; name: string; maxClass: Classification }> = {
  'forge-llama-3.3-70b': { level: 1, name: 'Llama 3.3 70B', maxClass: 'hemlig' },
  'forge-qwen-32b': { level: 1, name: 'Qwen2.5-Coder 32B', maxClass: 'hemlig' },
  'forge-deepseek-33b': { level: 1, name: 'DeepSeek Coder 33B', maxClass: 'hemlig' },
  'forge-lumen': { level: 1, name: 'Red Forge Lumen', maxClass: 'hemlig' }
};

interface FileInContext {
  name: string;
  classification: Classification;
  content: string;
}

/**
 * Get available AI services (all local models available on RED PC)
 */
function getAvailableServices(_files: FileInContext[]): AIService[] {
  // RED PC: All local models always available (no routing by classification)
  return [
    'forge-llama-3.3-70b',
    'forge-qwen-32b',
    'forge-deepseek-33b',
    'forge-lumen'
  ];
}

/**
 * Validate service can handle classification (all can handle all)
 */
function canServiceHandleClassification(service: AIService, classification: Classification): boolean {
  const serviceLevel = AI_SERVICE_LEVELS[service].level;
  const classLevel = CLASSIFICATION_LEVELS[classification];
  return serviceLevel >= 1; // All services handle all classifications
}

describe('Classification Routing (RED PC - Air-Gapped)', () => {
  describe('Service Availability', () => {
    it('should allow all local models regardless of classification', () => {
      const oklassFiles = [{ name: 'test.ts', classification: 'oklassificerad' as Classification, content: '' }];
      const hemligFiles = [{ name: 'secret.ts', classification: 'hemlig' as Classification, content: '' }];

      const availableForO = getAvailableServices(oklassFiles);
      const availableForH = getAvailableServices(hemligFiles);

      expect(availableForO).toHaveLength(4);
      expect(availableForH).toHaveLength(4);
      expect(availableForO).toEqual(availableForH); // Same for both!
    });

    it('should always include all four local models', () => {
      const available = getAvailableServices([]);
      
      expect(available).toContain('forge-llama-3.3-70b');
      expect(available).toContain('forge-qwen-32b');
      expect(available).toContain('forge-deepseek-33b');
      expect(available).toContain('forge-lumen');
    });
  });

  describe('Classification Handling', () => {
    it('should allow any model for OKLASSIFICERAD', () => {
      expect(canServiceHandleClassification('forge-llama-3.3-70b', 'oklassificerad')).toBe(true);
      expect(canServiceHandleClassification('forge-qwen-32b', 'oklassificerad')).toBe(true);
      expect(canServiceHandleClassification('forge-lumen', 'oklassificerad')).toBe(true);
    });

    it('should allow any model for HEMLIG', () => {
      expect(canServiceHandleClassification('forge-llama-3.3-70b', 'hemlig')).toBe(true);
      expect(canServiceHandleClassification('forge-qwen-32b', 'hemlig')).toBe(true);
      expect(canServiceHandleClassification('forge-lumen', 'hemlig')).toBe(true);
    });

    it('should allow any model for EU-RESTRICTED', () => {
      expect(canServiceHandleClassification('forge-llama-3.3-70b', 'eu-restricted')).toBe(true);
      expect(canServiceHandleClassification('forge-qwen-32b', 'eu-restricted')).toBe(true);
    });
  });

  describe('Model Choice (User Preference, Not Security)', () => {
    it('should allow user to choose any model for any classification', () => {
      const files = [
        { name: 'unclass.ts', classification: 'oklassificerad' as Classification, content: '' },
        { name: 'secret.ts', classification: 'hemlig' as Classification, content: '' }
      ];

      // User can choose any model - it's about performance/quality, not security
      const available = getAvailableServices(files);
      
      expect(available).toHaveLength(4);
      // Choice is user preference: Llama (quality) vs Qwen (speed) vs Lumen (domain)
    });
  });

  describe('RED PC Reality', () => {
    it('should have NO internet-dependent services', () => {
      const available = getAvailableServices([]);
      
      // No 'claude-cloud', 'saas-lumen', etc.
      available.forEach(service => {
        expect(service).toMatch(/^forge-/);
      });
    });

    it('should treat all models as equally capable for security', () => {
      const services = Object.entries(AI_SERVICE_LEVELS);
      
      services.forEach(([_name, config]) => {
        expect(config.level).toBe(1); // All level 1 (air-gapped)
        expect(config.maxClass).toBe('hemlig'); // All handle HEMLIG
      });
    });
  });
});
