/**
 * MDX Content Filter - Remove sections above AI's clearance
 * 
 * Filters out <How>, <What>, and content based on classification levels
 * Ensures AI only sees what it's cleared to access
 */

import { SecurityLevel } from './types';

const SECURITY_LEVELS: SecurityLevel[] = ['UNCLASSIFIED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'];

/**
 * Check if a classification level is accessible at a given clearance
 */
function canAccessLevel(contentLevel: SecurityLevel, clearanceLevel: SecurityLevel): boolean {
  const contentIndex = SECURITY_LEVELS.indexOf(contentLevel);
  const clearanceIndex = SECURITY_LEVELS.indexOf(clearanceLevel);
  return contentIndex <= clearanceIndex;
}

interface MDXSection {
  type: 'WHAT' | 'HOW' | 'UNTAGGED';
  content: string;
  startLine: number;
  endLine: number;
}

/**
 * Parse MDX content into sections with classification tags
 */
export function parseMDXSections(content: string): MDXSection[] {
  const lines = content.split('\n');
  const sections: MDXSection[] = [];
  let currentSection: Partial<MDXSection> | null = null;
  let lineNumber = 0;

  for (const line of lines) {
    lineNumber++;
    
    // Start of WHAT section
    if (line.trim() === '<What>') {
      if (currentSection?.content) {
        sections.push(currentSection as MDXSection);
      }
      currentSection = {
        type: 'WHAT',
        content: '',
        startLine: lineNumber
      };
      continue;
    }
    
    // Start of HOW section
    if (line.trim() === '<How>') {
      if (currentSection?.content) {
        sections.push(currentSection as MDXSection);
      }
      currentSection = {
        type: 'HOW',
        content: '',
        startLine: lineNumber
      };
      continue;
    }
    
    // End of section
    if (line.trim() === '</What>' || line.trim() === '</How>') {
      if (currentSection) {
        currentSection.endLine = lineNumber;
        sections.push(currentSection as MDXSection);
        currentSection = null;
      }
      continue;
    }
    
    // Content line
    if (currentSection) {
      currentSection.content += line + '\n';
    } else {
      // Untagged content
      if (!currentSection || currentSection.type !== 'UNTAGGED') {
        if (currentSection?.content) {
          sections.push(currentSection as MDXSection);
        }
        currentSection = {
          type: 'UNTAGGED',
          content: '',
          startLine: lineNumber
        };
      }
      currentSection.content += line + '\n';
    }
  }
  
  // Add final section
  if (currentSection?.content) {
    currentSection.endLine = lineNumber;
    sections.push(currentSection as MDXSection);
  }
  
  return sections;
}

/**
 * Filter MDX content based on AI's maximum clearance
 * 
 * Rules:
 * - WHAT sections: Use file's WHAT classification (usually UNCLASSIFIED)
 * - HOW sections: Use file's HOW classification (CONFIDENTIAL or SECRET)
 * - UNTAGGED: Inherit from frontmatter default (usually UNCLASSIFIED)
 */
export function filterMDXContent(
  content: string,
  aiMaxClearance: SecurityLevel
): { filtered: string; removedSections: number } {
  const sections = parseMDXSections(content);
  let removedCount = 0;
  
  // Extract actual classification from frontmatter
  const fileClassification = extractFrontmatterClassification(content);
  const whatLevel: SecurityLevel = fileClassification?.what || 'UNCLASSIFIED';
  const howLevel: SecurityLevel = fileClassification?.how || 'CONFIDENTIAL';
  
  const filteredSections = sections.filter(section => {
    // WHAT sections: Use file's WHAT classification (usually UNCLASSIFIED)
    if (section.type === 'WHAT') {
      const canAccess = canAccessLevel(whatLevel, aiMaxClearance);
      if (!canAccess) removedCount++;
      return canAccess;
    }
    
    // HOW sections: Use file's HOW classification (CONFIDENTIAL or SECRET)
    if (section.type === 'HOW') {
      const canAccess = canAccessLevel(howLevel, aiMaxClearance);
      if (!canAccess) removedCount++;
      return canAccess;
    }
    
    // UNTAGGED sections: Default to WHAT classification (safe default)
    const canAccess = canAccessLevel(whatLevel, aiMaxClearance);
    if (!canAccess) removedCount++;
    return canAccess;
  });
  
  // Reconstruct content
  const filtered = filteredSections
    .map(s => s.content.trim())
    .join('\n\n')
    .trim();
  
  return { filtered, removedSections: removedCount };
}

/**
 * Extract frontmatter classification from MDX
 */
export function extractFrontmatterClassification(content: string): {
  what: SecurityLevel;
  how: SecurityLevel;
} | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  
  const frontmatter = frontmatterMatch[1];
  const whatMatch = frontmatter.match(/what:\s*(\w+)/);
  const howMatch = frontmatter.match(/how:\s*(\w+)/);
  
  if (whatMatch && howMatch) {
    return {
      what: whatMatch[1] as SecurityLevel,
      how: howMatch[1] as SecurityLevel
    };
  }
  
  return null;
}

/**
 * Get a human-readable description of what was filtered
 */
export function getFilteredContentDescription(
  originalContent: string,
  filteredContent: string,
  aiMaxClearance: SecurityLevel
): string {
  const originalSections = parseMDXSections(originalContent);
  const whatCount = originalSections.filter(s => s.type === 'WHAT').length;
  const howCount = originalSections.filter(s => s.type === 'HOW').length;
  const untaggedCount = originalSections.filter(s => s.type === 'UNTAGGED').length;
  
  const { removedSections } = filterMDXContent(originalContent, aiMaxClearance);
  
  if (removedSections === 0) {
    return `Full content (${whatCount} WHAT sections, ${howCount} HOW sections)`;
  }
  
  return `Filtered content: ${whatCount} WHAT sections included, ${removedSections} HOW sections removed (above ${aiMaxClearance} clearance)`;
}

