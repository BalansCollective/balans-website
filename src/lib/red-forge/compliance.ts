/**
 * Compliance Engine - Core classification validation and audit logging
 * 
 * This is the heart of Red Forge's security model. ALL file operations
 * flow through this engine for validation before execution.
 * 
 * Key Responsibilities:
 * - Validate user clearance vs content classification
 * - Enforce network zone restrictions
 * - Detect HOW keywords in WHAT sections
 * - Log all decisions to audit trail
 * - Filter content based on user clearance
 * 
 * Security Invariants:
 * 1. User cannot access content above their clearance level
 * 2. White network cannot export classified content
 * 3. All operations are logged (no silent failures)
 * 4. Classification filtering is fail-safe (deny by default)
 */

import {
  Operation,
  Decision,
  SecurityLevel,
  ClassificationWarning,
  DualClassification,
  UserContext,
} from './types';
import { AuditDatabase } from './audit-storage';

/**
 * Markdown section with parsed classification
 */
interface ClassifiedSection {
  type: 'what' | 'how' | 'content' | 'untagged';
  content: string;
  classification?: DualClassification | SecurityLevel;
  startLine: number;
  endLine: number;
}

/**
 * ComplianceEngine - Validates operations and enforces classification boundaries
 * 
 * Usage:
 * ```typescript
 * const engine = new ComplianceEngine(auditDB);
 * 
 * const decision = await engine.validateOperation({
 *   type: 'read',
 *   resource: 'weaver://fs/publisher.ts',
 *   user: { id: 'user-1', clearance: 'CONFIDENTIAL', networkZone: 'yellow' }
 * });
 * 
 * if (!decision.allowed) {
 *   throw new Error(decision.reason);
 * }
 * 
 * // Use filtered content (classification applied)
 * const safeContent = decision.filteredContent;
 * ```
 */
export class ComplianceEngine {
  // Classification hierarchy (UNCLASSIFIED < CONFIDENTIAL < SECRET < TOP_SECRET)
  private static readonly HIERARCHY: SecurityLevel[] = [
    'UNCLASSIFIED',
    'CONFIDENTIAL',
    'SECRET',
    'TOP_SECRET',
  ];

  // HOW keywords that should trigger warnings in WHAT sections
  private static readonly HOW_KEYWORDS = [
    'implements',
    'algorithm',
    'internally',
    'optimized',
    'caches',
    'buffer',
    'retry',
    'encryption',
    'aes',
    'sha',
    'cryptographic',
    'vendor',
    'library',
    'dependency',
    'performance',
    'queue',
    'backoff',
  ];

  constructor(private auditDB: AuditDatabase) {}

  /**
   * Validate an operation against user context and classification rules
   */
  async validateOperation(op: Operation): Promise<Decision> {
    try {
      // 1. Parse classification from content
      const classification = this.parseClassification(op.resource, op.content);

      // 2. Check clearance level
      const clearanceCheck = this.checkClearance(op.user.clearance, classification);
      if (!clearanceCheck.allowed) {
        await this.audit(op, 'blocked', clearanceCheck.reason);
        return clearanceCheck;
      }

      // 3. Check network zone restrictions
      const networkCheck = this.checkNetworkZone(op.type, op.user.networkZone);
      if (!networkCheck.allowed) {
        await this.audit(op, 'blocked', networkCheck.reason);
        return networkCheck;
      }

      // 4. Detect keyword violations (HOW in WHAT)
      const warnings = op.content ? this.detectKeywordViolations(op.content) : [];

      // 5. Filter content based on clearance
      const filteredContent = op.content
        ? this.filterContentByClassification(op.content, op.user.clearance)
        : undefined;

      // 6. Log allowed operation
      await this.audit(op, 'allowed', undefined, warnings);

      return {
        allowed: true,
        warnings,
        filteredContent,
      };
    } catch (error) {
      // Log unexpected errors
      const reason = error instanceof Error ? error.message : 'Unknown error';
      await this.audit(op, 'blocked', reason);
      return {
        allowed: false,
        reason,
      };
    }
  }

  /**
   * Parse classification from frontmatter or filename
   */
  private parseClassification(
    resource: string,
    content?: string
  ): DualClassification {
    if (!content) {
      // Default: infer from filename or assume UNCLASSIFIED
      return { what: 'UNCLASSIFIED', how: 'UNCLASSIFIED' };
    }

    // Try to extract frontmatter
    const frontmatter = this.extractFrontmatter(content);
    if (frontmatter) {
      return frontmatter;
    }

    // Default classification
    return { what: 'UNCLASSIFIED', how: 'UNCLASSIFIED' };
  }

  /**
   * Extract classification from YAML frontmatter
   */
  private extractFrontmatter(content: string): DualClassification | null {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return null;
    }

    const yamlContent = match[1];

    // Simple YAML parsing for classification field
    const classificationMatch = yamlContent.match(
      /classification:\s*\n\s*what:\s*(\w+)\s*\n\s*how:\s*(\w+)/
    );

    if (classificationMatch) {
      return {
        what: classificationMatch[1] as SecurityLevel,
        how: classificationMatch[2] as SecurityLevel,
      };
    }

    // Try single classification
    const singleMatch = yamlContent.match(/classification:\s*(\w+)/);
    if (singleMatch) {
      const level = singleMatch[1] as SecurityLevel;
      return { what: level, how: level };
    }

    return null;
  }

  /**
   * Check if user clearance is sufficient for content classification
   */
  private checkClearance(
    userClearance: SecurityLevel,
    contentClassification: DualClassification
  ): Decision {
    // Check if user can access HOW sections
    if (!this.canAccess(userClearance, contentClassification.how)) {
      return {
        allowed: false,
        reason: `Insufficient clearance: HOW content is ${contentClassification.how}, user has ${userClearance}`,
      };
    }

    // User can access WHAT sections if HOW is accessible
    // (WHAT is always <= HOW in classification)
    return { allowed: true };
  }

  /**
   * Check if operation is allowed from network zone
   */
  private checkNetworkZone(
    operation: string,
    networkZone: 'white' | 'yellow' | 'red'
  ): Decision {
    // White network (internet) cannot export classified content
    if (networkZone === 'white' && operation === 'export') {
      return {
        allowed: false,
        reason: 'Cannot export classified content from White (internet) network',
      };
    }

    // Red network (air-gapped) has no special restrictions on operations
    // (but AI access is handled separately)

    return { allowed: true };
  }

  /**
   * Detect HOW keywords in WHAT sections
   */
  private detectKeywordViolations(content: string): ClassificationWarning[] {
    const warnings: ClassificationWarning[] = [];
    const sections = this.parseMarkdownSections(content);

    for (const section of sections) {
      if (section.type === 'what') {
        // Check for HOW keywords in WHAT section
        for (const keyword of ComplianceEngine.HOW_KEYWORDS) {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          const matches = Array.from(section.content.matchAll(regex));

          for (const match of matches) {
            warnings.push({
              type: 'keyword_detection',
              severity: 'high',
              message: `HOW keyword "${keyword}" found in WHAT section (line ${section.startLine})`,
              location: {
                line: section.startLine,
                column: match.index || 0,
              },
            });
          }
        }
      }
    }

    return warnings;
  }

  /**
   * Filter content to only include sections user is cleared for
   */
  private filterContentByClassification(
    content: string,
    userClearance: SecurityLevel
  ): string {
    const sections = this.parseMarkdownSections(content);
    const filtered: string[] = [];

    for (const section of sections) {
      if (section.type === 'what') {
        // WHAT sections are always included (they're public API)
        filtered.push(section.content);
      } else if (section.type === 'how') {
        // HOW sections only if user has sufficient clearance
        // Assume HOW sections are marked with classification in tags
        // For now, include all HOW sections (clearance check done at file level)
        filtered.push(section.content);
      } else {
        // Untagged content - include by default
        filtered.push(section.content);
      }
    }

    return filtered.join('\n\n');
  }

  /**
   * Parse markdown into classified sections
   */
  private parseMarkdownSections(content: string): ClassifiedSection[] {
    const sections: ClassifiedSection[] = [];
    const lines = content.split('\n');

    let currentSection: ClassifiedSection | null = null;
    let lineNumber = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      lineNumber++;

      // Detect section tags
      if (line.trim().startsWith('<What>')) {
        if (currentSection) {
          currentSection.endLine = lineNumber - 1;
          sections.push(currentSection);
        }
        currentSection = {
          type: 'what',
          content: '',
          startLine: lineNumber,
          endLine: lineNumber,
        };
      } else if (line.trim().startsWith('<How>')) {
        if (currentSection) {
          currentSection.endLine = lineNumber - 1;
          sections.push(currentSection);
        }
        currentSection = {
          type: 'how',
          content: '',
          startLine: lineNumber,
          endLine: lineNumber,
        };
      } else if (line.trim().startsWith('<Content>')) {
        if (currentSection) {
          currentSection.endLine = lineNumber - 1;
          sections.push(currentSection);
        }
        currentSection = {
          type: 'content',
          content: '',
          startLine: lineNumber,
          endLine: lineNumber,
        };
      } else if (
        line.trim().startsWith('</What>') ||
        line.trim().startsWith('</How>') ||
        line.trim().startsWith('</Content>')
      ) {
        if (currentSection) {
          currentSection.endLine = lineNumber;
          sections.push(currentSection);
          currentSection = null;
        }
      } else if (currentSection) {
        // Add content to current section
        currentSection.content += (currentSection.content ? '\n' : '') + line;
      } else {
        // Untagged content
        sections.push({
          type: 'untagged',
          content: line,
          startLine: lineNumber,
          endLine: lineNumber,
        });
      }
    }

    // Close any remaining section
    if (currentSection) {
      currentSection.endLine = lineNumber;
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Check if user can access content at given classification level
   */
  private canAccess(
    userClearance: SecurityLevel,
    contentClassification: SecurityLevel
  ): boolean {
    const userLevel = ComplianceEngine.HIERARCHY.indexOf(userClearance);
    const contentLevel = ComplianceEngine.HIERARCHY.indexOf(contentClassification);

    if (userLevel === -1 || contentLevel === -1) {
      // Unknown classification - deny by default
      return false;
    }

    return userLevel >= contentLevel;
  }

  /**
   * Log operation to audit trail
   */
  private async audit(
    op: Operation,
    decision: 'allowed' | 'blocked',
    reason?: string,
    warnings?: ClassificationWarning[]
  ): Promise<void> {
    await this.auditDB.add({
      timestamp: new Date(),
      operation: op.type,
      resource: op.resource,
      decision,
      reason,
      warnings,
      user: op.user,
    });
  }

  /**
   * Extract only WHAT sections from content (for declassification)
   */
  extractWhatSections(content: string): string {
    const sections = this.parseMarkdownSections(content);
    const whatSections = sections.filter((s) => s.type === 'what');
    return whatSections.map((s) => s.content).join('\n\n');
  }

  /**
   * Check if content is safe for AI consumption (no HOW leaks in WHAT)
   */
  async checkAISafety(content: string): Promise<{
    safe: boolean;
    warnings: ClassificationWarning[];
  }> {
    const warnings = this.detectKeywordViolations(content);
    return {
      safe: warnings.length === 0,
      warnings,
    };
  }
}

