/**
 * Browser Guards
 * 
 * Wrapper for @weaver/guards to make it browser-friendly
 */

import { GuardSystem } from '@weaver/guards';
import type { GuardResult } from './types';

export class BrowserGuards {
  private guards: GuardSystem;
  
  constructor() {
    this.guards = new GuardSystem({
      fileCreationLimits: {
        maxFilesPerHour: 0, // Disabled for browser
        maxFilesPerCommand: 0,
        maxNestingDepth: 0,
        enabled: false
      },
      philosophicalQuarantine: {
        enabled: true,
        triggerWords: [
          'recursive refinement',
          'comprehensive system',
          'complete implementation',
          'future-proof architecture',
          'enterprise-grade'
        ],
        action: 'warn',
        requireOverride: false
      },
      bureaucraticDetection: {
        enabled: true,
        metaFileThreshold: 2,
        rapidCreationWindow: 120,
        rapidCreationThreshold: 5
      },
      realityAnchors: {
        enabled: false, // Simplified for browser demo
        requireConcreteExample: false,
        requireManualValidation: false,
        requireRecentHumanInput: false,
        humanInputTimeoutMinutes: 5
      }
    });
  }
  
  /**
   * Check if prompt should be blocked or warned
   */
  checkPrompt(prompt: string): GuardResult {
    const result = this.guards.checkPrompt(prompt);
    
    return {
      allowed: !result.blocked,
      blocked: result.blocked,
      warnings: result.warnings.map(w => ({
        message: w.message,
        pattern: w.pattern || 'unknown',
        severity: w.severity || 0.5
      })),
      reason: result.blocked ? result.warnings[0]?.message : undefined
    };
  }
  
  /**
   * Get session statistics (for debugging)
   */
  getStats() {
    return this.guards.getSessionStats();
  }
}

