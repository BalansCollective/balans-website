/**
 * Shared classification constants for Red Forge demo
 */

export type Classification = 
  | 'oklassificerad' 
  | 'begransad-hemlig' 
  | 'eu-restricted'      // 🇪🇺 EU RESTRICTED - handled same as BH but legally distinct
  | 'konfidentiell' 
  | 'hemlig';

export type AIService = 'claude-cloud' | 'saas-lumen' | 'forge-local' | 'forge-airgap';

export const CLASSIFICATION_LEVELS: Record<Classification, number> = {
  'oklassificerad': 0,
  'begransad-hemlig': 1,
  'eu-restricted': 1,    // 🇪🇺 Same handling level as BH per Swedish regulation
  'konfidentiell': 2,
  'hemlig': 3
};

export const AI_SERVICE_LEVELS: Record<AIService, { level: number; name: string; maxClass: Classification }> = {
  'claude-cloud': { level: 0, name: 'Claude Cloud', maxClass: 'oklassificerad' },
  'saas-lumen': { level: 1, name: 'SaaS Lumen', maxClass: 'begransad-hemlig' }, // Also handles EU-RESTRICTED
  'forge-local': { level: 2, name: 'Red Forge Local', maxClass: 'konfidentiell' },
  'forge-airgap': { level: 3, name: 'Red Forge Air-Gap', maxClass: 'hemlig' }
};

/**
 * Map classification to level number (for backwards compatibility)
 */
export const AI_SERVICE_LEVELS_MAP: Record<Classification, number> = {
  'oklassificerad': 0,
  'begransad-hemlig': 1,
  'eu-restricted': 1,     // 🇪🇺 Same level as BH
  'konfidentiell': 2,
  'hemlig': 3
};

/**
 * Get human-readable label for classification with jurisdiction indicator
 */
export function getClassificationLabel(classification: Classification): string {
  switch (classification) {
    case 'oklassificerad': return 'Oklassificerad';
    case 'begransad-hemlig': return 'Begränsad Hemlig';
    case 'eu-restricted': return '🇪🇺 EU RESTRICTED';
    case 'konfidentiell': return 'Konfidentiell';
    case 'hemlig': return 'Hemlig';
  }
}

/**
 * Get classification color for UI
 */
export function getClassificationColor(classification: Classification): string {
  switch (classification) {
    case 'oklassificerad': return 'text-green-400';
    case 'begransad-hemlig': return 'text-yellow-400';
    case 'eu-restricted': return 'text-blue-400'; // 🇪🇺 EU blue
    case 'konfidentiell': return 'text-orange-400';
    case 'hemlig': return 'text-red-400';
  }
}

