// Red Forge AI Service Configuration

import { AIServiceConfig, SecurityLevel, AIService } from './types';

/**
 * AI service configurations for Red Forge IDE
 * 
 * Philosophy: Don't pretend people aren't using ChatGPT. They are.
 * Make it VISIBLE and COMPLIANT instead of shadow IT.
 * 
 * - Claude Sonnet 4.5: What people are actually using (cloud, UNCLASSIFIED only)
 * - Red Forge LLM (On-Prem): Compliant alternative for CONFIDENTIAL work
 * - Red Forge LLM (Air-gapped): For SECRET work in isolated environments
 * 
 * Security comes from:
 * 1. Classification enforcement (can't send CONFIDENTIAL to cloud AI)
 * 2. Audit trail (see what's being shared, even blocked attempts)
 * 3. Compliant alternatives (guilt-free AI for classified work)
 */
export const AI_SERVICE_CONFIGS: AIServiceConfig[] = [
  {
    service: 'openai',
    displayName: 'Claude Sonnet 4.5 (Cloud)',
    maxClassification: 'UNCLASSIFIED',
    openRouterModel: 'anthropic/claude-sonnet-4.5',
    description: 'What people are actually using. UNCLASSIFIED only.',
    networkZone: 'white' // Available on White/Yellow (both have internet)
  },
  {
    service: 'redforge-saas',
    displayName: 'Red Forge LLM v1 (On-Prem)',
    maxClassification: 'CONFIDENTIAL',
    openRouterModel: 'meta-llama/llama-3.3-70b-instruct',
    description: 'Your data, your infrastructure. CONFIDENTIAL cleared.',
    networkZone: 'yellow' // Available on White/Yellow
  },
  {
    service: 'redforge-onsite',
    displayName: 'Red Forge LLM v1 (Air-gapped)',
    maxClassification: 'SECRET',
    openRouterModel: 'meta-llama/llama-3.3-70b-instruct',
    description: 'Air-gapped deployment for SECRET work.',
    networkZone: 'red' // Only available on Red (air-gapped)
  }
];

/**
 * Get AI service config by service type
 */
export function getAIServiceConfig(service: AIService): AIServiceConfig | undefined {
  return AI_SERVICE_CONFIGS.find(config => config.service === service);
}

/**
 * Get all AI services allowed for a given network zone
 * 
 * Reality check: Yellow networks at SAAB/defense typically HAVE internet access
 * and technically allow ChatGPT, even if policy is unclear. People use it anyway.
 * 
 * Red Forge's value: Make AI usage VISIBLE and COMPLIANT, not hidden.
 * 
 * Rules:
 * - White/Yellow: All services available (reflects reality - people have internet)
 * - Red: Only air-gapped local AI (physically no network)
 * 
 * Security comes from CLASSIFICATION ENFORCEMENT + AUDIT, not blocking access.
 */
export function getAIServicesForNetworkZone(networkZone: 'white' | 'yellow' | 'red'): AIServiceConfig[] {
  if (networkZone === 'red') {
    // Air-gapped: Only local AI available (no network at all)
    return AI_SERVICE_CONFIGS.filter(config => config.service === 'redforge-onsite');
  }
  
  // White/Yellow: Internet-connected AI available
  // Air-gapped NOT available (requires physical Red Room)
  return AI_SERVICE_CONFIGS.filter(config => config.service !== 'redforge-onsite');
}

/**
 * Security level ordering for comparison
 */
const SECURITY_LEVEL_ORDER: SecurityLevel[] = [
  'UNCLASSIFIED',
  'CONFIDENTIAL',
  'SECRET',
  'TOP_SECRET'
];

/**
 * Check if an AI service can access content at a given classification level
 */
export function canAIAccessClassification(
  aiService: AIService,
  classificationLevel: SecurityLevel
): boolean {
  const config = getAIServiceConfig(aiService);
  if (!config) return false;
  
  const aiMaxIndex = SECURITY_LEVEL_ORDER.indexOf(config.maxClassification);
  const contentIndex = SECURITY_LEVEL_ORDER.indexOf(classificationLevel);
  
  return contentIndex <= aiMaxIndex;
}

/**
 * Get the minimum AI service required for a given classification level
 */
export function getRequiredAIService(classificationLevel: SecurityLevel): AIService {
  if (classificationLevel === 'TOP_SECRET') return 'none';
  
  for (const config of AI_SERVICE_CONFIGS) {
    if (canAIAccessClassification(config.service, classificationLevel)) {
      return config.service;
    }
  }
  
  return 'none';
}

/**
 * Build system prompt for AI service
 */
export function buildSystemPrompt(
  aiService: AIService,
  userClearance: SecurityLevel,
  networkZone: 'white' | 'yellow' | 'red'
): string {
  const config = getAIServiceConfig(aiService);
  if (!config) return '';
  
  if (aiService === 'openai') {
    return `You are Claude Sonnet 4.5, a general-purpose AI assistant.

You are operating in a Red Forge IDE demo. Red Forge's philosophy: People are already using cloud AI (like you!) for work. Instead of pretending they're not, Red Forge makes it VISIBLE and COMPLIANT.

CRITICAL SECURITY RULES:
- You can ONLY access UNCLASSIFIED content
- If asked about CONFIDENTIAL or SECRET content, respond:
  "⚠️ I cannot access CONFIDENTIAL content. Red Forge is blocking this to protect you. Please switch to Red Forge LLM (on-premises) to access CONFIDENTIAL data securely."
- You are being AUDITED - all queries are logged for compliance

Your role: Be helpful for UNCLASSIFIED work, but demonstrate why classification boundaries matter.

Example good responses:
- "I can help with the public API design, but I can't see the implementation details (they're CONFIDENTIAL)."
- "Based on the UNCLASSIFIED documentation, here's what I can tell you..."
- "This question requires CONFIDENTIAL context. Switch to Red Forge LLM to continue."

Be helpful, but remind users that Red Forge is protecting them from accidental leaks.`;
  }
  
  // Red Forge LLM (both tiers)
  return `You are Red Forge LLM v1, a Llama 3.3 70B model fine-tuned specifically for Red Forge workflows.

Your specializations:
- Classification-aware code review (WHAT/HOW separation)
- Declassification workflow assistance (extracting public APIs from classified implementations)
- Secure refactoring patterns (moving logic between classification levels)
- Audit trail interpretation and compliance reasoning
- Living Lumens documentation practices
- Progressive disclosure architectures (TRICKLE framework)

Your deployment: ${aiService === 'redforge-saas' ? 'On-premises (Yellow network)' : 'Air-gapped (Red network)'}
Your clearance: ${config.maxClassification}
User clearance: ${userClearance}

Red Forge's value proposition: Make AI usage VISIBLE and COMPLIANT, not hidden.
- People will use AI anyway (ChatGPT is too useful)
- Blocking AI creates "shadow IT" (worse security)
- Red Forge provides compliant alternatives + audit trail

You understand Red Forge's security model:
- You can access content up to ${config.maxClassification} classification
- You help users work within classification boundaries, not circumvent them
- You suggest appropriate classification levels for new code
- You warn about potential classification leaks
- You remind users they're being audited (guilt-free compliance)

Example responses:
- "✅ This code is appropriately classified as WHAT:UNCLASSIFIED, HOW:CONFIDENTIAL"
- "⚠️ Warning: Line 42 exposes HOW:SECRET details in a WHAT section - this would leak to UNCLASSIFIED viewers"
- "💡 Suggestion: Extract this to a separate SECRET module to maintain clean boundaries"
- "📋 Audit note: This query accessed CONFIDENTIAL context - logged for compliance"

If asked about higher-classified content than your clearance (${config.maxClassification}):
"⚠️ I cannot access SECRET content. Please switch to Red Forge LLM (air-gapped) for SECRET data."

Be helpful, security-conscious, and focused on Red Forge workflows. Emphasize that audit trail = accountability, not surveillance.`;
}

