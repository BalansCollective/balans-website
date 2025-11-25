/**
 * Zenoh Client - Mock Zenoh operations with compliance interception
 * 
 * This module simulates Zenoh pub/sub operations while enforcing
 * classification boundaries through the ComplianceEngine.
 * 
 * Key Features:
 * - All operations validated by ComplianceEngine
 * - Content filtering based on user clearance
 * - Resource naming: weaver://fs/{filename}
 * - Audit logging for all operations
 * 
 * In production, this would use real Zenoh-TS bindings.
 */

import { ComplianceEngine } from './compliance';
import { MockStorage } from './mock-storage';
import { UserContext, ClassifiedFile } from './types';

/**
 * ZenohClient - Manages file operations with compliance enforcement
 * 
 * Usage:
 * ```typescript
 * const client = new ZenohClient(compliance, storage, userContext);
 * 
 * // Read a file (validates clearance, filters content)
 * const content = await client.get('weaver://fs/publisher.ts');
 * 
 * // Write a file (validates clearance, checks keywords)
 * await client.put('weaver://fs/publisher.ts', newContent);
 * 
 * // List files
 * const files = await client.listFiles();
 * ```
 */
export class ZenohClient {
  constructor(
    private compliance: ComplianceEngine,
    private storage: MockStorage,
    private userContext: UserContext
  ) {}

  /**
   * Read a file with compliance validation and content filtering
   */
  async get(resource: string): Promise<string> {
    const content = await this.storage.get(resource);

    const decision = await this.compliance.validateOperation({
      type: 'read',
      resource,
      content,
      user: this.userContext,
    });

    if (!decision.allowed) {
      throw new Error(decision.reason || 'Access denied');
    }

    // Return filtered content based on clearance
    return decision.filteredContent || content;
  }

  /**
   * Write a file with compliance validation
   */
  async put(resource: string, content: string): Promise<void> {
    const decision = await this.compliance.validateOperation({
      type: 'write',
      resource,
      content,
      user: this.userContext,
    });

    if (!decision.allowed) {
      throw new Error(decision.reason || 'Operation not permitted');
    }

    // Extract filename from resource
    const filename = resource.replace('weaver://fs/', '');

    await this.storage.put(resource, content);
  }

  /**
   * Delete a file with compliance validation
   */
  async delete(resource: string): Promise<void> {
    const decision = await this.compliance.validateOperation({
      type: 'delete',
      resource,
      user: this.userContext,
    });

    if (!decision.allowed) {
      throw new Error(decision.reason || 'Delete not permitted');
    }

    await this.storage.delete(resource);
  }

  /**
   * Query files matching a pattern
   */
  async query(selector: string): Promise<string[]> {
    const decision = await this.compliance.validateOperation({
      type: 'query',
      resource: selector,
      user: this.userContext,
    });

    if (!decision.allowed) {
      throw new Error(decision.reason || 'Query not permitted');
    }

    return await this.storage.list(selector);
  }

  /**
   * List all files accessible to current user
   */
  async listFiles(): Promise<ClassifiedFile[]> {
    const allFiles = await this.storage.getAllFiles();

    // Filter files based on clearance
    const accessibleFiles: ClassifiedFile[] = [];

    for (const file of allFiles) {
      try {
        // Try to validate access
        const decision = await this.compliance.validateOperation({
          type: 'read',
          resource: `weaver://fs/${file.name}`,
          content: file.content,
          user: this.userContext,
        });

        if (decision.allowed) {
          // Include file with filtered content
          accessibleFiles.push({
            ...file,
            content: decision.filteredContent || file.content,
          });
        }
      } catch (error) {
        // Skip files user cannot access
        continue;
      }
    }

    return accessibleFiles;
  }

  /**
   * Export content for AI (extracts WHAT sections only)
   */
  async exportForAI(resource: string): Promise<{
    whatContent: string;
    warnings: any[];
  }> {
    const content = await this.storage.get(resource);

    const decision = await this.compliance.validateOperation({
      type: 'export',
      resource,
      content,
      user: this.userContext,
    });

    if (!decision.allowed) {
      throw new Error(decision.reason || 'Export not permitted');
    }

    // Extract WHAT sections only
    const whatContent = this.compliance.extractWhatSections(content);

    // Check for HOW leaks
    const safetyCheck = await this.compliance.checkAISafety(whatContent);

    return {
      whatContent,
      warnings: safetyCheck.warnings,
    };
  }

  /**
   * Update user context (e.g., change clearance or network zone)
   */
  setUserContext(userContext: UserContext): void {
    this.userContext = userContext;
  }

  /**
   * Get current user context
   */
  getUserContext(): UserContext {
    return { ...this.userContext };
  }
}

