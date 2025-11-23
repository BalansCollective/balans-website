// Red Forge IDE Type Definitions

export type SecurityLevel = 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';

export interface DualClassification {
  what: SecurityLevel;  // Capability/interface classification
  how: SecurityLevel;   // Implementation classification
}

export interface ClassifiedFile {
  id: string;
  name: string;
  content: string;
  language: 'typescript' | 'python' | 'rust' | 'markdown';
  dualClassification?: DualClassification;
  classification?: SecurityLevel; // For legacy single classification
  lastModified: Date;
}

export interface NetworkZone {
  type: 'white' | 'yellow' | 'red';
  allowedAI: 'external' | 'onprem' | 'none';
  internetAccess: boolean;
}

export interface ClassificationWarning {
  type: 'keyword_detection' | 'paste_protection' | 'untagged_content';
  severity: 'high' | 'medium' | 'low';
  message: string;
  location?: {
    line: number;
    column: number;
  };
}

