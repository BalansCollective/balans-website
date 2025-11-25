/**
 * Browser Weaver Types
 * 
 * Shared interfaces for browser-embedded Weaver assistant
 */

export type Classification = 'oklassificerad' | 'begransad-hemlig' | 'konfidentiell' | 'hemlig';

export type AIService = 'claude-cloud' | 'saas-lumen' | 'forge-local' | 'forge-airgap';

export interface WeaverConfig {
  openrouterKey: string;
  userClearance?: Classification;
}

export interface MDXChunk {
  type: 'text' | 'error' | 'done';
  content: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChronicleEntry {
  timestamp: number;
  type: 'user_prompt' | 'ai_action' | 'guard_block' | 'security_violation';
  prompt?: string;
  action?: string;
  files?: string[];
  tags?: string[];
  pattern?: string;
  severity?: number;
  attempted_file?: string;
  file_classification?: Classification;
  user_clearance?: Classification;
}

export interface ChronicleFilter {
  type?: ChronicleEntry['type'];
  startTime?: number;
  endTime?: number;
  tags?: string[];
}

export interface FileMetadata {
  path: string;
  classification: Classification;
  title: string;
}

