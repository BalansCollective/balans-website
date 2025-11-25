/**
 * Mock Storage - In-memory filesystem for demo purposes
 * 
 * This module simulates a persistent filesystem using an in-memory Map.
 * In production, this would be replaced with actual file I/O or a backend API.
 * 
 * Features:
 * - CRUD operations (create, read, update, delete)
 * - Resource naming: weaver://fs/{filename}
 * - Metadata tracking (last modified, classification)
 * - Initialized with demo files from DemoData.ts
 */

import { ClassifiedFile, DualClassification, SecurityLevel } from './types';
import { DEMO_FILES } from '../../components/red-forge-advanced/DemoData';

/**
 * File metadata stored with content
 */
interface StoredFile {
  name: string;
  content: string;
  language: string;
  dualClassification?: DualClassification;
  classification?: SecurityLevel;
  lastModified: Date;
}

/**
 * MockStorage - Simulates a persistent filesystem
 * 
 * Usage:
 * ```typescript
 * const storage = new MockStorage();
 * 
 * // Store a file
 * await storage.put('weaver://fs/publisher.ts', content);
 * 
 * // Read a file
 * const content = await storage.get('weaver://fs/publisher.ts');
 * 
 * // List all files
 * const files = await storage.list('weaver://fs/*');
 * 
 * // Delete a file
 * await storage.delete('weaver://fs/publisher.ts');
 * ```
 */
export class MockStorage {
  private storage: Map<string, StoredFile> = new Map();

  constructor() {
    // Initialize with demo files
    this.initializeDemoFiles();
  }

  /**
   * Store or update a file
   */
  async put(resource: string, content: string, metadata?: Partial<StoredFile>): Promise<void> {
    const filename = this.extractFilename(resource);
    const existing = this.storage.get(resource);

    this.storage.set(resource, {
      name: filename,
      content,
      language: metadata?.language || existing?.language || this.detectLanguage(filename),
      dualClassification: metadata?.dualClassification || existing?.dualClassification,
      classification: metadata?.classification || existing?.classification,
      lastModified: new Date(),
    });
  }

  /**
   * Read a file's content
   */
  async get(resource: string): Promise<string> {
    const file = this.storage.get(resource);
    if (!file) {
      throw new Error(`File not found: ${resource}`);
    }
    return file.content;
  }

  /**
   * Get full file metadata
   */
  async getMetadata(resource: string): Promise<StoredFile> {
    const file = this.storage.get(resource);
    if (!file) {
      throw new Error(`File not found: ${resource}`);
    }
    return { ...file };
  }

  /**
   * Check if a file exists
   */
  async exists(resource: string): Promise<boolean> {
    return this.storage.has(resource);
  }

  /**
   * Delete a file
   */
  async delete(resource: string): Promise<void> {
    if (!this.storage.has(resource)) {
      throw new Error(`File not found: ${resource}`);
    }
    this.storage.delete(resource);
  }

  /**
   * List files matching a pattern
   * @param selector - Glob pattern (e.g., "weaver://fs/*" or "weaver://fs/*.md")
   */
  async list(selector: string): Promise<string[]> {
    // Simple glob matching
    const pattern = selector
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    const regex = new RegExp(`^${pattern}$`);

    return Array.from(this.storage.keys()).filter((resource) =>
      regex.test(resource)
    );
  }

  /**
   * Get all files as ClassifiedFile array (for UI)
   */
  async getAllFiles(): Promise<ClassifiedFile[]> {
    const files: ClassifiedFile[] = [];
    
    for (const [resource, stored] of this.storage.entries()) {
      files.push({
        id: this.resourceToId(resource),
        name: stored.name,
        content: stored.content,
        language: stored.language as any,
        dualClassification: stored.dualClassification,
        classification: stored.classification,
        lastModified: stored.lastModified,
      });
    }

    return files;
  }

  /**
   * Clear all files (for testing)
   */
  async clear(): Promise<void> {
    this.storage.clear();
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byLanguage: Record<string, number>;
    byClassification: Record<string, number>;
  }> {
    const stats = {
      totalFiles: this.storage.size,
      totalSize: 0,
      byLanguage: {} as Record<string, number>,
      byClassification: {} as Record<string, number>,
    };

    for (const file of this.storage.values()) {
      stats.totalSize += file.content.length;
      
      stats.byLanguage[file.language] = (stats.byLanguage[file.language] || 0) + 1;
      
      const classification = file.classification || 
        `${file.dualClassification?.what}/${file.dualClassification?.how}`;
      stats.byClassification[classification] = 
        (stats.byClassification[classification] || 0) + 1;
    }

    return stats;
  }

  // ========================================================================
  // Private helpers
  // ========================================================================

  private initializeDemoFiles(): void {
    for (const file of DEMO_FILES) {
      const resource = this.idToResource(file.id, file.name);
      this.storage.set(resource, {
        name: file.name,
        content: file.content,
        language: file.language,
        dualClassification: file.dualClassification,
        classification: file.classification,
        lastModified: file.lastModified,
      });
    }
  }

  private extractFilename(resource: string): string {
    // Extract filename from "weaver://fs/filename.ext"
    const parts = resource.split('/');
    return parts[parts.length - 1];
  }

  private idToResource(id: string, filename: string): string {
    return `weaver://fs/${filename}`;
  }

  private resourceToId(resource: string): string {
    // Simple ID generation from resource
    return resource.replace('weaver://fs/', '').replace(/[^a-z0-9]/gi, '-');
  }

  private detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      py: 'python',
      rs: 'rust',
      md: 'markdown',
    };
    return languageMap[ext || ''] || 'text';
  }
}

/**
 * Global singleton instance
 */
let globalStorage: MockStorage | null = null;

/**
 * Get or create the global storage instance
 */
export function getStorage(): MockStorage {
  if (!globalStorage) {
    globalStorage = new MockStorage();
  }
  return globalStorage;
}

