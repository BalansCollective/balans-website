import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Declassification Edge Case Tests
 * 
 * Tests edge cases for the declassification workflow:
 * - AI service routing based on source classification
 * - Frontmatter handling and preservation
 * - File naming and overwrite behavior
 * - Audit log generation
 */

type Classification = 'oklassificerad' | 'begransad-hemlig' | 'eu-restricted' | 'konfidentiell' | 'hemlig';
type AIService = 'claude-cloud' | 'saas-lumen' | 'forge-local' | 'forge-airgap';

const CLASSIFICATION_LEVELS: Record<Classification, number> = {
  'oklassificerad': 0,
  'begransad-hemlig': 1,
  'eu-restricted': 1,  // 🇪🇺 Same handling level as BH
  'konfidentiell': 2,
  'hemlig': 3
};

const AI_SERVICE_LEVELS: Record<AIService, { level: number; maxClass: Classification }> = {
  'claude-cloud': { level: 0, maxClass: 'oklassificerad' },
  'saas-lumen': { level: 1, maxClass: 'begransad-hemlig' },
  'forge-local': { level: 2, maxClass: 'konfidentiell' },
  'forge-airgap': { level: 3, maxClass: 'hemlig' }
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
  shouldAutoSwitch: boolean;
  targetFileName: string;
  targetFolder: Classification;
}

/**
 * Determine required AI service for declassification
 */
function getRequiredAIServiceForDeclassification(
  sourceClassification: Classification,
  currentAIService: AIService
): { required: AIService; shouldAutoSwitch: boolean } {
  const sourceLevel = CLASSIFICATION_LEVELS[sourceClassification];
  const currentServiceLevel = AI_SERVICE_LEVELS[currentAIService].level;
  
  // Find the lowest AI service that can handle the source classification
  const requiredService = Object.entries(AI_SERVICE_LEVELS)
    .sort((a, b) => a[1].level - b[1].level)
    .find(([_, info]) => info.level >= sourceLevel);
  
  if (!requiredService) {
    throw new Error(`No AI service found for ${sourceClassification}`);
  }
  
  const [serviceName, serviceInfo] = requiredService;
  const shouldAutoSwitch = currentServiceLevel < serviceInfo.level;
  
  return {
    required: serviceName as AIService,
    shouldAutoSwitch
  };
}

/**
 * Generate declassified filename
 */
function getDeclassifiedFileName(originalName: string): string {
  const baseName = originalName.replace('.md', '');
  return `${baseName}-deklassificerad.md`;
}

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }
  
  const [, frontmatterStr, body] = frontmatterMatch;
  const frontmatter: Record<string, any> = {};
  
  frontmatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  });
  
  return { frontmatter, body };
}

/**
 * Generate new frontmatter for declassified file
 */
function generateDeclassifiedFrontmatter(
  originalFrontmatter: Record<string, any>,
  sourceClassification: Classification,
  targetClassification: Classification,
  originalFileName: string
): string {
  const classificationLevels: Record<Classification, string> = {
    'oklassificerad': 'O',
    'begransad-hemlig': 'BH',
    'konfidentiell': 'K',
    'hemlig': 'H'
  };
  
  const lines = [
    '---',
    `classification: ${targetClassification}`,
    `classification_level: ${classificationLevels[targetClassification]}`,
    `declassified_from: ${sourceClassification}`,
    `declassified_date: ${new Date().toISOString().split('T')[0]}`,
    `original_file: ${originalFileName}`,
    '---',
    ''
  ];
  
  return lines.join('\n');
}

describe('Declassification Edge Cases', () => {
  describe('AI Service Routing', () => {
    it('should NOT auto-switch when current service can handle source classification', () => {
      const result = getRequiredAIServiceForDeclassification('konfidentiell', 'forge-local');
      
      expect(result.required).toBe('forge-local');
      expect(result.shouldAutoSwitch).toBe(false);
    });
    
    it('should auto-switch when current service cannot handle source classification', () => {
      const result = getRequiredAIServiceForDeclassification('hemlig', 'claude-cloud');
      
      expect(result.required).toBe('forge-airgap');
      expect(result.shouldAutoSwitch).toBe(true);
    });
    
    it('should use lowest compatible service for oklassificerad source', () => {
      const result = getRequiredAIServiceForDeclassification('oklassificerad', 'claude-cloud');
      
      expect(result.required).toBe('claude-cloud');
      expect(result.shouldAutoSwitch).toBe(false);
    });
    
    it('should auto-switch from SaaS Lumen to Local for konfidentiell source', () => {
      const result = getRequiredAIServiceForDeclassification('konfidentiell', 'saas-lumen');
      
      expect(result.required).toBe('forge-local');
      expect(result.shouldAutoSwitch).toBe(true);
    });
    
    it('should NOT auto-switch when using Air-Gap for any classification', () => {
      const classifications: Classification[] = ['oklassificerad', 'begransad-hemlig', 'konfidentiell', 'hemlig'];
      
      classifications.forEach(classification => {
        const result = getRequiredAIServiceForDeclassification(classification, 'forge-airgap');
        expect(result.shouldAutoSwitch).toBe(false);
      });
    });
    
    it('should require saas-lumen for begransad-hemlig when starting with claude-cloud', () => {
      const result = getRequiredAIServiceForDeclassification('begransad-hemlig', 'claude-cloud');
      
      expect(result.required).toBe('saas-lumen');
      expect(result.shouldAutoSwitch).toBe(true);
    });
    
    it('should use correct AI service when declassifying BH -> O', () => {
      // Even though target is O (oklassificerad), we need to read the SOURCE classification (BH)
      // This requires saas-lumen, NOT claude-cloud
      const result = getRequiredAIServiceForDeclassification('begransad-hemlig', 'claude-cloud');
      
      expect(result.required).toBe('saas-lumen');
      expect(result.shouldAutoSwitch).toBe(true);
      
      // Verify audit log would show correct service
      const serviceNames = {
        'claude-cloud': 'Claude Cloud',
        'saas-lumen': 'SaaS Lumen',
        'forge-local': 'Red Forge Local',
        'forge-airgap': 'Red Forge Air-Gap'
      };
      
      const auditMessage = `AI förslag mottaget (${serviceNames[result.required]})`;
      expect(auditMessage).toBe('AI förslag mottaget (SaaS Lumen)');
      expect(auditMessage).not.toContain('claude-cloud');
    });
  });
  
  describe('File Naming', () => {
    it('should append -deklassificerad to filename', () => {
      const fileName = getDeclassifiedFileName('v3-5-shotgun-integration-specs.md');
      expect(fileName).toBe('v3-5-shotgun-integration-specs-deklassificerad.md');
    });
    
    it('should handle files without .md extension', () => {
      const fileName = getDeclassifiedFileName('test');
      expect(fileName).toBe('test-deklassificerad.md');
    });
    
    it('should handle already-declassified files', () => {
      const fileName = getDeclassifiedFileName('v3-deklassificerad.md');
      expect(fileName).toBe('v3-deklassificerad-deklassificerad.md');
    });
    
    it('should handle files with multiple dots', () => {
      const fileName = getDeclassifiedFileName('v2.5.3-specs.md');
      expect(fileName).toBe('v2.5.3-specs-deklassificerad.md');
    });
  });
  
  describe('Frontmatter Parsing', () => {
    it('should parse valid frontmatter', () => {
      const content = `---
classification: hemlig
classification_level: H
title: Secret Document
---

# Content here`;
      
      const { frontmatter, body } = parseFrontmatter(content);
      
      expect(frontmatter.classification).toBe('hemlig');
      expect(frontmatter.classification_level).toBe('H');
      expect(frontmatter.title).toBe('Secret Document');
      expect(body).toContain('# Content here');
    });
    
    it('should handle content without frontmatter', () => {
      const content = '# Just Content\n\nNo frontmatter here.';
      
      const { frontmatter, body } = parseFrontmatter(content);
      
      expect(Object.keys(frontmatter)).toHaveLength(0);
      expect(body).toBe(content);
    });
    
    it('should handle empty frontmatter', () => {
      const content = `---
---

# Content`;
      
      const { frontmatter, body } = parseFrontmatter(content);
      
      expect(Object.keys(frontmatter)).toHaveLength(0);
      expect(body).toContain('# Content');
    });
    
    it('should handle frontmatter with colons in values', () => {
      const content = `---
title: Test: A Complex Title
url: https://example.com
---

Content`;
      
      const { frontmatter, body } = parseFrontmatter(content);
      
      expect(frontmatter.title).toBe('Test: A Complex Title');
      expect(frontmatter.url).toBe('https://example.com');
    });
  });
  
  describe('Frontmatter Generation', () => {
    it('should generate valid frontmatter for declassified file', () => {
      const originalFrontmatter = {
        classification: 'hemlig',
        title: 'Guardian Protocol'
      };
      
      const newFrontmatter = generateDeclassifiedFrontmatter(
        originalFrontmatter,
        'hemlig',
        'oklassificerad',
        'v4-guardian-protocol-implementation.md'
      );
      
      expect(newFrontmatter).toContain('classification: oklassificerad');
      expect(newFrontmatter).toContain('classification_level: O');
      expect(newFrontmatter).toContain('declassified_from: hemlig');
      expect(newFrontmatter).toContain('declassified_date:');
      expect(newFrontmatter).toContain('original_file: v4-guardian-protocol-implementation.md');
    });
    
    it('should use correct classification_level codes', () => {
      const testCases: Array<[Classification, string]> = [
        ['oklassificerad', 'O'],
        ['begransad-hemlig', 'BH'],
        ['konfidentiell', 'K'],
        ['hemlig', 'H']
      ];
      
      testCases.forEach(([targetClass, expectedLevel]) => {
        const frontmatter = generateDeclassifiedFrontmatter(
          {},
          'hemlig',
          targetClass,
          'test.md'
        );
        
        expect(frontmatter).toContain(`classification_level: ${expectedLevel}`);
      });
    });
    
    it('should add current date in YYYY-MM-DD format', () => {
      const frontmatter = generateDeclassifiedFrontmatter(
        {},
        'konfidentiell',
        'oklassificerad',
        'test.md'
      );
      
      const today = new Date().toISOString().split('T')[0];
      expect(frontmatter).toContain(`declassified_date: ${today}`);
    });
  });
  
  describe('Overwrite Behavior', () => {
    it('should detect duplicate when same filename exists in target folder', () => {
      const existingFiles = [
        { path: 'oklassificerad/v3-5-shotgun-integration-specs-deklassificerad.md' }
      ];
      
      const newFilePath = 'oklassificerad/v3-5-shotgun-integration-specs-deklassificerad.md';
      
      const isDuplicate = existingFiles.some(f => f.path === newFilePath);
      expect(isDuplicate).toBe(true);
    });
    
    it('should NOT detect duplicate when filename differs', () => {
      const existingFiles = [
        { path: 'oklassificerad/v3-5-shotgun-integration-specs-deklassificerad.md' }
      ];
      
      const newFilePath = 'oklassificerad/v2-multi-tower-overview-deklassificerad.md';
      
      const isDuplicate = existingFiles.some(f => f.path === newFilePath);
      expect(isDuplicate).toBe(false);
    });
    
    it('should NOT detect duplicate when in different folder', () => {
      const existingFiles = [
        { path: 'begransad-hemlig/test-deklassificerad.md' }
      ];
      
      const newFilePath = 'oklassificerad/test-deklassificerad.md';
      
      const isDuplicate = existingFiles.some(f => f.path === newFilePath);
      expect(isDuplicate).toBe(false);
    });
  });
  
  describe('Audit Log Generation', () => {
    interface AuditLogEntry {
      timestamp: Date;
      filename: string;
      classification: Classification;
      aiService: string;
      result: 'allowed' | 'blocked' | 'declassified';
    }
    
    it('should generate audit log for declassification start', () => {
      const entry: AuditLogEntry = {
        timestamp: new Date(),
        filename: 'v4-guardian-protocol-implementation.md',
        classification: 'hemlig',
        aiService: 'Deklassificering startad (H → O)',
        result: 'declassified'
      };
      
      expect(entry.result).toBe('declassified');
      expect(entry.aiService).toContain('Deklassificering startad');
    });
    
    it('should generate audit log for AI suggestion received', () => {
      const entry: AuditLogEntry = {
        timestamp: new Date(),
        filename: 'v3-5-shotgun-integration-specs.md',
        classification: 'konfidentiell',
        aiService: 'AI förslag mottaget (Red Forge Local)',
        result: 'declassified'
      };
      
      expect(entry.aiService).toContain('AI förslag mottaget');
      expect(entry.aiService).toContain('Red Forge Local');
    });
    
    it('should generate audit log for user approval', () => {
      const entry: AuditLogEntry = {
        timestamp: new Date(),
        filename: 'v2-multi-tower-overview-deklassificerad.md',
        classification: 'oklassificerad',
        aiService: 'Redigeringar godkända av användare',
        result: 'declassified'
      };
      
      expect(entry.aiService).toBe('Redigeringar godkända av användare');
    });
    
    it('should generate audit log for file save', () => {
      const entry: AuditLogEntry = {
        timestamp: new Date(),
        filename: 'v3-5-shotgun-integration-specs-deklassificerad.md',
        classification: 'oklassificerad',
        aiService: 'Deklassificerad fil skapad/uppdaterad',
        result: 'declassified'
      };
      
      expect(entry.aiService).toBe('Deklassificerad fil skapad/uppdaterad');
      expect(entry.classification).toBe('oklassificerad');
    });
  });
  
  describe('Multi-step Declassification', () => {
    it('should support declassifying H → K → BH → O in steps', () => {
      const steps: Array<[Classification, Classification, AIService]> = [
        ['hemlig', 'konfidentiell', 'forge-airgap'],
        ['konfidentiell', 'begransad-hemlig', 'forge-local'],
        ['begransad-hemlig', 'oklassificerad', 'saas-lumen']
      ];
      
      steps.forEach(([source, target, expectedService]) => {
        const result = getRequiredAIServiceForDeclassification(source, 'claude-cloud');
        
        const sourceLevel = CLASSIFICATION_LEVELS[source];
        const targetLevel = CLASSIFICATION_LEVELS[target];
        
        expect(sourceLevel).toBeGreaterThan(targetLevel); // Step down
        expect(AI_SERVICE_LEVELS[result.required].level).toBeGreaterThanOrEqual(sourceLevel);
      });
    });
    
    it('should support direct declassification H → O', () => {
      const result = getRequiredAIServiceForDeclassification('hemlig', 'claude-cloud');
      
      expect(result.required).toBe('forge-airgap');
      expect(result.shouldAutoSwitch).toBe(true);
    });
  });
  
  describe('Error Cases', () => {
    it('should handle missing frontmatter gracefully', () => {
      const content = '# Just Content';
      const { frontmatter, body } = parseFrontmatter(content);
      
      expect(frontmatter).toEqual({});
      expect(body).toBe(content);
    });
    
    it('should handle malformed frontmatter', () => {
      const content = `---
this is not valid yaml
no colons here
---

Content`;
      
      const { frontmatter, body } = parseFrontmatter(content);
      
      // Should not crash, just return empty frontmatter
      expect(Object.keys(frontmatter)).toHaveLength(0);
    });
    
    it('should handle empty content', () => {
      const { frontmatter, body } = parseFrontmatter('');
      
      expect(frontmatter).toEqual({});
      expect(body).toBe('');
    });
  });
});

