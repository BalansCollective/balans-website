import { describe, it, expect } from 'vitest';

/**
 * Declassification Tests (Swedish ISM-2022 - RED PC)
 * 
 * All models are air-gapped local. Declassification uses same models.
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

const AI_SERVICE_LEVELS: Record<AIService, { level: number; maxClass: Classification }> = {
  'forge-llama-3.3-70b': { level: 1, maxClass: 'hemlig' },
  'forge-qwen-32b': { level: 1, maxClass: 'hemlig' },
  'forge-deepseek-33b': { level: 1, maxClass: 'hemlig' },
  'forge-lumen': { level: 1, maxClass: 'hemlig' }
};

interface DeclassificationRequest {
  sourceFile: {
    name: string;
    classification: Classification;
    content: string;
  };
  targetClassification: Classification;
  currentAIService: AIService;
}

interface DeclassificationResult {
  requiredAIService: AIService;
  canProceed: boolean;
  reason: string;
}

/**
 * Get required AI service for declassification (all local models can handle)
 */
function getRequiredAIServiceForDeclassification(
  sourceClassification: Classification,
  currentService: AIService
): DeclassificationResult {
  const sourceLevel = CLASSIFICATION_LEVELS[sourceClassification];
  const serviceLevel = AI_SERVICE_LEVELS[currentService].level;

  // All services can handle all classifications on RED PC
  if (serviceLevel >= 1) {
    return {
      requiredAIService: currentService,
      canProceed: true,
      reason: 'Current service can handle source classification'
    };
  }

  // Fallback to Llama (but this shouldn't happen on RED PC)
  return {
    requiredAIService: 'forge-llama-3.3-70b',
    canProceed: true,
    reason: 'Using default Llama model'
  };
}

describe('Declassification (RED PC)', () => {
  describe('Service Requirements', () => {
    it('should allow any local model for declassification', () => {
      const result = getRequiredAIServiceForDeclassification('hemlig', 'forge-llama-3.3-70b');
      expect(result.canProceed).toBe(true);
      expect(result.requiredAIService).toBe('forge-llama-3.3-70b');
    });

    it('should allow Qwen for declassification', () => {
      const result = getRequiredAIServiceForDeclassification('konfidentiell', 'forge-qwen-32b');
      expect(result.canProceed).toBe(true);
      expect(result.requiredAIService).toBe('forge-qwen-32b');
    });

    it('should allow Lumen for declassification', () => {
      const result = getRequiredAIServiceForDeclassification('begransad-hemlig', 'forge-lumen');
      expect(result.canProceed).toBe(true);
      expect(result.requiredAIService).toBe('forge-lumen');
    });
  });

  describe('Declassification Workflow', () => {
    it('should support HEMLIG → OKLASSIFICERAD', () => {
      const request: DeclassificationRequest = {
        sourceFile: {
          name: 'classified.ts',
          classification: 'hemlig',
          content: 'secret code here'
        },
        targetClassification: 'oklassificerad',
        currentAIService: 'forge-llama-3.3-70b'
      };

      const result = getRequiredAIServiceForDeclassification(
        request.sourceFile.classification,
        request.currentAIService
      );

      expect(result.canProceed).toBe(true);
    });

    it('should support KONFIDENTIELL → BEGRANSAD-HEMLIG', () => {
      const request: DeclassificationRequest = {
        sourceFile: {
          name: 'confidential.ts',
          classification: 'konfidentiell',
          content: 'confidential code'
        },
        targetClassification: 'begransad-hemlig',
        currentAIService: 'forge-qwen-32b'
      };

      const result = getRequiredAIServiceForDeclassification(
        request.sourceFile.classification,
        request.currentAIService
      );

      expect(result.canProceed).toBe(true);
    });

    it('should support EU-RESTRICTED → OKLASSIFICERAD', () => {
      const request: DeclassificationRequest = {
        sourceFile: {
          name: 'eu-doc.ts',
          classification: 'eu-restricted',
          content: 'EU restricted content'
        },
        targetClassification: 'oklassificerad',
        currentAIService: 'forge-lumen'
      };

      const result = getRequiredAIServiceForDeclassification(
        request.sourceFile.classification,
        request.currentAIService
      );

      expect(result.canProceed).toBe(true);
    });
  });

  describe('Model Choice for Declassification', () => {
    it('should allow user to choose Llama for quality', () => {
      const result = getRequiredAIServiceForDeclassification('hemlig', 'forge-llama-3.3-70b');
      expect(result.requiredAIService).toBe('forge-llama-3.3-70b');
      // User chose Llama for best quality declassification
    });

    it('should allow user to choose Qwen for speed', () => {
      const result = getRequiredAIServiceForDeclassification('konfidentiell', 'forge-qwen-32b');
      expect(result.requiredAIService).toBe('forge-qwen-32b');
      // User chose Qwen for faster iteration
    });

    it('should allow user to choose Lumen for domain expertise', () => {
      const result = getRequiredAIServiceForDeclassification('begransad-hemlig', 'forge-lumen');
      expect(result.requiredAIService).toBe('forge-lumen');
      // User chose Lumen for Swedish defense terminology awareness
    });
  });
});
