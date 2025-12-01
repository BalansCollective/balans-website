/**
 * Shared classification constants for Red Forge demo
 * 
 * Swedish Reality (ISM-2022): ALL classified content MUST be air-gapped.
 * No SaaS, no on-prem with internet. Only: Cloud (unclassified) or Air-gap (all classified).
 * 
 * Deployment Modes:
 * - BLACK PC (internet): Claude Cloud available, Forge Air-gap disabled
 * - RED PC (air-gap): ONLY Forge Air-gap (Claude not available)
 */

export type Classification = 
  | 'oklassificerad' 
  | 'begransad-hemlig' 
  | 'eu-restricted'      // 🇪🇺 EU RESTRICTED - handled same as BH but legally distinct
  | 'konfidentiell' 
  | 'hemlig';

export type AIService = 
  | 'forge-llama-3.3-70b'      // Llama 3.3 70B (best quality)
  | 'forge-qwen-32b'            // Qwen2.5-Coder 32B (code-specialized)
  | 'forge-deepseek-33b'        // DeepSeek Coder 33B (alternative)
  | 'forge-lumen';              // Internal Red Forge Lumen (domain-tuned)

/**
 * Detect deployment environment
 * RED PC: All models available (air-gapped, local inference only)
 */
export function getDeploymentMode(): 'red-pc' | 'demo' {
  // In real deployment, check for:
  // - Environment variable: FORGE_DEPLOYMENT_MODE=red-pc
  // - Local LLM availability: fetch('http://localhost:11434/api/tags') (Ollama)
  // - Network connectivity: !navigator.onLine
  
  if (typeof window === 'undefined') return 'demo';
  
  // For demo: allow all models
  return 'demo';
}

/**
 * Get available AI services (all local models on RED PC)
 */
export function getAvailableAIServices(mode: ReturnType<typeof getDeploymentMode>): AIService[] {
  // RED PC: All local models available
  return [
    'forge-llama-3.3-70b',
    'forge-qwen-32b', 
    'forge-deepseek-33b',
    'forge-lumen'
  ];
}

export const CLASSIFICATION_LEVELS: Record<Classification, number> = {
  'oklassificerad': 0,
  'begransad-hemlig': 1,
  'eu-restricted': 1,    // 🇪🇺 Same handling level as BH per Swedish regulation
  'konfidentiell': 2,
  'hemlig': 3
};

export const AI_SERVICE_LEVELS: Record<AIService, { 
  level: number; 
  name: string; 
  maxClass: Classification; 
  description: string;
  modelId: string;
}> = {
  'forge-llama-3.3-70b': { 
    level: 1, 
    name: 'Llama 3.3 70B', 
    maxClass: 'hemlig',
    description: 'Best general-purpose model (70B parameters, air-gapped)',
    modelId: 'meta-llama/llama-3.3-70b-instruct'
  },
  'forge-qwen-32b': { 
    level: 1, 
    name: 'Qwen2.5-Coder 32B', 
    maxClass: 'hemlig',
    description: 'Code-specialized model (faster, excellent for TypeScript/Rust)',
    modelId: 'qwen/qwen2.5-coder-32b-instruct'
  },
  'forge-deepseek-33b': { 
    level: 1, 
    name: 'DeepSeek Coder 33B', 
    maxClass: 'hemlig',
    description: 'Alternative code model (good for complex refactoring)',
    modelId: 'deepseek-ai/deepseek-coder-33b-instruct'
  },
  'forge-lumen': { 
    level: 1, 
    name: 'Red Forge Lumen', 
    maxClass: 'hemlig',
    description: 'Internal domain-tuned model (Swedish defense + ISM-2022 aware)',
    modelId: 'forge/lumen-v1'
  }
};

/**
 * Map classification to minimum required service level (Swedish ISM-2022 compliance)
 * ALL classified content requires air-gapped local models (level 1)
 */
export const AI_SERVICE_LEVELS_MAP: Record<Classification, number> = {
  'oklassificerad': 1,      // Even unclassified uses local (no cloud on RED PC)
  'begransad-hemlig': 1,    // MUST be air-gapped
  'eu-restricted': 1,       // MUST be air-gapped
  'konfidentiell': 1,       // MUST be air-gapped
  'hemlig': 1               // MUST be air-gapped
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

