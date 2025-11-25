/**
 * Audit Storage Layer - IndexedDB wrapper for persistent audit trail
 * 
 * This module provides an immutable audit log using IndexedDB. All operations
 * (read, write, export, etc.) are logged here for compliance and forensics.
 * 
 * Key Features:
 * - Persistent storage (survives page refreshes)
 * - Immutable entries (no updates/deletes)
 * - Real-time change notifications
 * - JSON export for external analysis
 */

import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { AuditEntry } from './types';

/**
 * IndexedDB schema definition
 */
interface AuditDBSchema extends DBSchema {
  auditLog: {
    key: string;
    value: AuditEntry;
    indexes: {
      'by-timestamp': Date;
      'by-operation': string;
      'by-decision': string;
      'by-user': string;
    };
  };
}

/**
 * AuditDatabase - Manages persistent audit trail using IndexedDB
 * 
 * Usage:
 * ```typescript
 * const db = await AuditDatabase.create();
 * await db.add({
 *   timestamp: new Date(),
 *   operation: 'read',
 *   resource: 'weaver://fs/publisher.ts',
 *   decision: 'allowed',
 *   user: { id: 'user-1', clearance: 'CONFIDENTIAL', networkZone: 'yellow' }
 * });
 * 
 * const recent = await db.getRecent(20);
 * const json = await db.exportJSON();
 * ```
 */
export class AuditDatabase {
  private db: IDBPDatabase<AuditDBSchema>;
  private changeListeners: Set<(entry: AuditEntry) => void> = new Set();

  private constructor(db: IDBPDatabase<AuditDBSchema>) {
    this.db = db;
  }

  /**
   * Create and initialize the audit database
   */
  static async create(): Promise<AuditDatabase> {
    const db = await openDB<AuditDBSchema>('red-forge-audit', 1, {
      upgrade(db) {
        // Create audit log object store
        const store = db.createObjectStore('auditLog', {
          keyPath: 'id',
          autoIncrement: true,
        });

        // Create indexes for efficient queries
        store.createIndex('by-timestamp', 'timestamp');
        store.createIndex('by-operation', 'operation');
        store.createIndex('by-decision', 'decision');
        store.createIndex('by-user', 'user.id');
      },
    });

    return new AuditDatabase(db);
  }

  /**
   * Add a new audit entry (immutable, no updates allowed)
   */
  async add(entry: Omit<AuditEntry, 'id'>): Promise<string> {
    const id = this.generateId();
    const fullEntry: AuditEntry = {
      ...entry,
      id,
      // Ensure timestamp is a Date object
      timestamp: entry.timestamp instanceof Date ? entry.timestamp : new Date(entry.timestamp),
    };

    await this.db.add('auditLog', fullEntry);

    // Notify listeners
    this.notifyListeners(fullEntry);

    return id;
  }

  /**
   * Get all audit entries (newest first)
   */
  async getAll(): Promise<AuditEntry[]> {
    const entries = await this.db.getAll('auditLog');
    return entries.reverse(); // Newest first
  }

  /**
   * Get the N most recent audit entries
   */
  async getRecent(n: number): Promise<AuditEntry[]> {
    const all = await this.getAll();
    return all.slice(0, n);
  }

  /**
   * Get entries by operation type
   */
  async getByOperation(operation: string): Promise<AuditEntry[]> {
    return await this.db.getAllFromIndex('auditLog', 'by-operation', operation);
  }

  /**
   * Get entries by decision (allowed/blocked)
   */
  async getByDecision(decision: 'allowed' | 'blocked'): Promise<AuditEntry[]> {
    return await this.db.getAllFromIndex('auditLog', 'by-decision', decision);
  }

  /**
   * Get entries in a time range
   */
  async getByTimeRange(start: Date, end: Date): Promise<AuditEntry[]> {
    const all = await this.db.getAll('auditLog');
    return all.filter(
      (entry) => entry.timestamp >= start && entry.timestamp <= end
    );
  }

  /**
   * Export entire audit log as JSON
   */
  async exportJSON(): Promise<string> {
    const entries = await this.getAll();
    return JSON.stringify(
      entries,
      (key, value) => {
        // Convert Date objects to ISO strings for JSON
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      },
      2
    );
  }

  /**
   * Get audit statistics
   */
  async getStats(): Promise<{
    total: number;
    allowed: number;
    blocked: number;
    byOperation: Record<string, number>;
    byUser: Record<string, number>;
  }> {
    const all = await this.getAll();

    const stats = {
      total: all.length,
      allowed: all.filter((e) => e.decision === 'allowed').length,
      blocked: all.filter((e) => e.decision === 'blocked').length,
      byOperation: {} as Record<string, number>,
      byUser: {} as Record<string, number>,
    };

    // Count by operation type
    all.forEach((entry) => {
      stats.byOperation[entry.operation] =
        (stats.byOperation[entry.operation] || 0) + 1;
      stats.byUser[entry.user.id] = (stats.byUser[entry.user.id] || 0) + 1;
    });

    return stats;
  }

  /**
   * Subscribe to real-time audit changes
   */
  onChange(listener: (entry: AuditEntry) => void): () => void {
    this.changeListeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.changeListeners.delete(listener);
    };
  }

  /**
   * Clear all audit entries (DANGEROUS - only for testing)
   */
  async clear(): Promise<void> {
    await this.db.clear('auditLog');
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
  }

  // ========================================================================
  // Private helpers
  // ========================================================================

  private generateId(): string {
    // Generate a unique ID: timestamp + random
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private notifyListeners(entry: AuditEntry): void {
    this.changeListeners.forEach((listener) => {
      try {
        listener(entry);
      } catch (error) {
        console.error('Error in audit change listener:', error);
      }
    });
  }
}

/**
 * Global singleton instance (lazy-initialized)
 */
let globalAuditDB: AuditDatabase | null = null;

/**
 * Get or create the global audit database instance
 */
export async function getAuditDB(): Promise<AuditDatabase> {
  if (!globalAuditDB) {
    globalAuditDB = await AuditDatabase.create();
  }
  return globalAuditDB;
}

