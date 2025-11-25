/**
 * Red Forge KISS Demo Data Loader
 * 
 * Loads markdown files from /public/red-forge-demo/ with frontmatter parsing.
 * Implements retry logic for flaky conference WiFi + graceful degradation.
 * 
 * Architecture: Simple file manifest (6 files, manually maintained).
 * Future: If >10 files, auto-discover via directory API.
 */

import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

// ============================================================================
// Types
// ============================================================================

export interface DemoFile {
  path: string;
  name: string; // Actual filename (e.g., "v2-multi-tower-overview.md")
  classification: 'oklassificerad' | 'begransad-hemlig' | 'konfidentiell' | 'hemlig';
  classificationLevel: string;
  title: string; // Display title (now same as name for clarity)
  summary: string;
  content: string;
  frontmatter: Record<string, any>;
}

export interface DemoFileTree {
  oklassificerad: DemoFile[];
  'begransad-hemlig': DemoFile[];
  konfidentiell: DemoFile[];
  hemlig: DemoFile[];
}

// ============================================================================
// File Manifest
// ============================================================================

/**
 * Static file manifest.
 * 
 * NOTE: When adding new demo files, update this manifest manually.
 * This is KISS approach for 6 files — if >10 files, implement auto-discovery.
 */
const FILE_MANIFEST: Record<'oklassificerad' | 'begransad-hemlig' | 'konfidentiell' | 'hemlig', string[]> = {
  oklassificerad: ['README.md', 'v1-concept-summary.md'],
  'begransad-hemlig': ['cost-analysis.md', 'v2-multi-tower-overview.md'],
  konfidentiell: ['v3-5-shotgun-integration-specs.md'],
  hemlig: ['v4-guardian-protocol-implementation.md']
};

// ============================================================================
// File Loading (with retry logic)
// ============================================================================

/**
 * Load a single demo file from /public/red-forge-demo/
 * 
 * @param folder - Classification folder (OPEN/BH/K/H)
 * @param filename - Markdown filename
 * @returns DemoFile with parsed frontmatter and content
 * 
 * Error handling:
 * - Retries 3 times with exponential backoff (1s, 2s, 3s)
 * - Returns placeholder file if all retries fail
 * - Logs errors to console (for debugging)
 */
async function loadDemoFile(
  folder: 'oklassificerad' | 'begransad-hemlig' | 'konfidentiell' | 'hemlig',
  filename: string
): Promise<DemoFile> {
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  // Retry logic for transient network failures (conference WiFi!)
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`/red-forge-demo/${folder}/${filename}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${folder}/${filename}`);
      }
      
      const rawContent = await response.text();
      
      // Parse frontmatter using gray-matter
      const { data: frontmatter, content } = matter(rawContent);
      
      return {
        path: `${folder}/${filename}`,
        name: filename, // Actual filename from FILE_MANIFEST
        classification: folder,
        classificationLevel: frontmatter.classification_level || folder,
        title: filename, // Use actual filename for clarity
        summary: frontmatter.summary || '',
        content, // Clean markdown (no frontmatter)
        frontmatter
      };
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 3s
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  // All retries failed - return placeholder
  console.error(`Failed to load ${folder}/${filename}:`, lastError);
  return {
    path: `${folder}/${filename}`,
    name: filename,
    classification: folder,
    classificationLevel: folder,
    title: `[Missing File] ${filename}`,
    summary: 'File could not be loaded',
    content: `# File Not Found\n\nThis demo file is missing or could not be loaded.\n\n**Error:** ${lastError?.message}`,
    frontmatter: {}
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Load all demo files from /public/red-forge-demo/
 * 
 * @returns DemoFileTree with all files organized by classification
 * 
 * Performance:
 * - Loads all files in parallel (Promise.all)
 * - Typical load time: <500ms for 31KB total
 * - Includes retry logic for flaky WiFi
 * 
 * Usage:
 * ```typescript
 * const files = await loadDemoFiles();
 * console.log(files.K[0].title); // "BirdTurret V3.5"
 * ```
 */
export async function loadDemoFiles(): Promise<DemoFileTree> {
  const tree: DemoFileTree = {
    oklassificerad: [],
    'begransad-hemlig': [],
    konfidentiell: [],
    hemlig: []
  };
  
  // Load all files in parallel
  const promises: Promise<void>[] = [];
  
  for (const [folder, files] of Object.entries(FILE_MANIFEST)) {
    for (const filename of files) {
      promises.push(
        loadDemoFile(folder as any, filename).then(file => {
          tree[folder as keyof DemoFileTree].push(file);
        })
      );
    }
  }
  
  await Promise.all(promises);
  
  return tree;
}

