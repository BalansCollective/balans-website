/**
 * File Hash Cache - Skip AI review for previously approved files
 */

import { AIService, SecurityLevel } from './types';

interface FileHashEntry {
  hash: string;
  filename: string;
  aiApproved: boolean;
  approvedBy: AIService;
  timestamp: Date;
  classification: { what: SecurityLevel; how: SecurityLevel };
}

class FileHashCache {
  private cache: Map<string, FileHashEntry> = new Map();
  private readonly STORAGE_KEY = 'red-forge-file-hash-cache';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Generate simple hash of file content
   */
  private simpleHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Check if file has been reviewed before
   */
  isApproved(content: string, aiService: AIService): boolean {
    const hash = this.simpleHash(content);
    const entry = this.cache.get(hash);
    
    if (!entry) return false;
    
    // Check if approved by same or higher AI
    if (entry.approvedBy === aiService) return true;
    
    // If approved by higher clearance AI, also valid
    const clearanceLevels: Record<AIService, number> = {
      'openai': 1,
      'redforge-saas': 2,
      'redforge-onsite': 3,
      'none': 0
    };
    
    return clearanceLevels[entry.approvedBy] >= clearanceLevels[aiService];
  }

  /**
   * Mark file as approved by AI
   */
  markApproved(
    content: string,
    filename: string,
    aiService: AIService,
    classification: { what: SecurityLevel; how: SecurityLevel }
  ): void {
    const hash = this.simpleHash(content);
    
    this.cache.set(hash, {
      hash,
      filename,
      aiApproved: true,
      approvedBy: aiService,
      timestamp: new Date(),
      classification
    });
    
    this.saveToStorage();
  }

  /**
   * Get cached entry if exists
   */
  getCached(content: string): FileHashEntry | null {
    const hash = this.simpleHash(content);
    return this.cache.get(hash) || null;
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const entries: [string, FileHashEntry][] = JSON.parse(stored);
        this.cache = new Map(entries.map(([k, v]) => [k, {
          ...v,
          timestamp: new Date(v.timestamp)
        }]));
      }
    } catch (error) {
      console.error('Failed to load file hash cache:', error);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const entries = Array.from(this.cache.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save file hash cache:', error);
    }
  }
}

export const fileHashCache = new FileHashCache();

