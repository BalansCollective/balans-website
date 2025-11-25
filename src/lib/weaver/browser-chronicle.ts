/**
 * Browser Chronicle
 * 
 * localStorage-based chronicle for session tracking (Phase 1 MVP)
 */

import type { ChronicleEntry, ChronicleFilter } from './types';

export class BrowserChronicle {
  private prefix = 'chronicle:';
  
  /**
   * Log user prompt
   */
  async logUserPrompt(prompt: string, tags?: string[]): Promise<void> {
    const entry: ChronicleEntry = {
      timestamp: Date.now(),
      type: 'user_prompt',
      prompt,
      tags: tags || []
    };
    
    this.saveEntry(entry);
  }
  
  /**
   * Log AI action
   */
  async logAIAction(action: string, files?: string[]): Promise<void> {
    const entry: ChronicleEntry = {
      timestamp: Date.now(),
      type: 'ai_action',
      action,
      files: files || []
    };
    
    this.saveEntry(entry);
  }
  
  /**
   * Log guard block
   */
  async logGuardBlock(pattern: string, severity: number): Promise<void> {
    const entry: ChronicleEntry = {
      timestamp: Date.now(),
      type: 'guard_block',
      pattern,
      severity
    };
    
    this.saveEntry(entry);
  }
  
  /**
   * Log security violation
   */
  async logSecurityViolation(
    attemptedFile: string,
    fileClassification: string,
    userClearance: string
  ): Promise<void> {
    const entry: ChronicleEntry = {
      timestamp: Date.now(),
      type: 'security_violation',
      attempted_file: attemptedFile,
      file_classification: fileClassification as any,
      user_clearance: userClearance as any
    };
    
    this.saveEntry(entry);
  }
  
  /**
   * Query chronicle entries
   */
  async query(filters?: ChronicleFilter): Promise<ChronicleEntry[]> {
    const entries: ChronicleEntry[] = [];
    
    // Read all chronicle entries from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const entry = JSON.parse(data) as ChronicleEntry;
            entries.push(entry);
          } catch (e) {
            console.warn('Failed to parse chronicle entry:', key, e);
          }
        }
      }
    }
    
    // Apply filters
    let filtered = entries;
    
    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(e => e.type === filters.type);
      }
      
      if (filters.startTime) {
        filtered = filtered.filter(e => e.timestamp >= filters.startTime!);
      }
      
      if (filters.endTime) {
        filtered = filtered.filter(e => e.timestamp <= filters.endTime!);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter(e => 
          e.tags?.some(tag => filters.tags!.includes(tag))
        );
      }
    }
    
    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  /**
   * Export all entries as JSON
   */
  async exportJSON(): Promise<string> {
    const entries = await this.query();
    return JSON.stringify(entries, null, 2);
  }
  
  /**
   * Clear all chronicle entries
   */
  async clear(): Promise<void> {
    const keys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => localStorage.removeItem(key));
  }
  
  /**
   * Get storage usage stats
   */
  getStats() {
    let count = 0;
    let totalSize = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        count++;
        const data = localStorage.getItem(key);
        if (data) {
          totalSize += data.length;
        }
      }
    }
    
    return {
      entryCount: count,
      totalBytes: totalSize,
      totalKB: Math.round(totalSize / 1024 * 10) / 10
    };
  }
  
  private saveEntry(entry: ChronicleEntry): void {
    const key = `${this.prefix}${entry.timestamp}`;
    localStorage.setItem(key, JSON.stringify(entry));
  }
}

