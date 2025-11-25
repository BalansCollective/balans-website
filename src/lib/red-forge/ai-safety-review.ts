/**
 * AI Safety Layer 2 - Content Review
 * Detects mistagging, keyword leaks, and classification errors
 */

import { AIService, SecurityLevel } from './types';

export interface SafetyWarning {
  severity: 'low' | 'medium' | 'high';
  message: string;
  detectedIn: 'WHAT' | 'HOW' | 'frontmatter';
  suggestedFix?: string;
}

export interface SafetyReviewResult {
  approved: boolean;
  warnings: SafetyWarning[];
  reasoning: string;
  apiFailure?: boolean; // NEW: Indicates if API call failed
  fallbackUsed?: boolean; // NEW: Indicates heuristic fallback was used
}

// Rate limiting state (in-memory for demo, would use localStorage for production)
const rateLimiter = {
  count: 0,
  limit: 50, // Max 50 reviews per day
  resetDate: new Date().toDateString()
};

export function getRateLimitStatus(): { remaining: number; total: number; resetIn: string } {
  const today = new Date().toDateString();
  if (rateLimiter.resetDate !== today) {
    rateLimiter.count = 0;
    rateLimiter.resetDate = today;
  }
  
  const remaining = Math.max(0, rateLimiter.limit - rateLimiter.count);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilReset = tomorrow.getTime() - now.getTime();
  const hoursUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60));
  const minutesUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    remaining,
    total: rateLimiter.limit,
    resetIn: `${hoursUntilReset}h ${minutesUntilReset}min`
  };
}

function incrementRateLimit() {
  rateLimiter.count++;
}

/**
 * AI-powered Layer 2 safety review
 * Uses OpenRouter to detect classification errors
 */
export async function performAISafetyReview(
  content: string,
  filename: string,
  declaredClassification: { what: SecurityLevel; how: SecurityLevel },
  targetAI: AIService,
  apiKey: string | null
): Promise<SafetyReviewResult> {
  // Check rate limit first
  const rateLimit = getRateLimitStatus();
  if (rateLimit.remaining === 0) {
    // Rate limit exceeded - use heuristic fallback
    const heuristicWarnings = performHeuristicReview(content, declaredClassification);
    return {
      approved: heuristicWarnings.every(w => w.severity !== 'high'),
      warnings: [
        {
          severity: 'medium',
          message: `Guardian AI review limit reached (${rateLimit.total}/${rateLimit.total} today). Using basic checks only. Limit resets in: ${rateLimit.resetIn}`,
          detectedIn: 'frontmatter'
        },
        ...heuristicWarnings
      ],
      reasoning: 'Rate limit exceeded - heuristic fallback',
      fallbackUsed: true
    };
  }
  
  // If no API key, use heuristic fallback
  if (!apiKey) {
    const heuristicWarnings = performHeuristicReview(content, declaredClassification);
    return {
      approved: heuristicWarnings.every(w => w.severity !== 'high'),
      warnings: [
        {
          severity: 'low',
          message: 'Guardian AI unavailable (no API key). Using basic checks only.',
          detectedIn: 'frontmatter'
        },
        ...heuristicWarnings
      ],
      reasoning: 'No API key - heuristic fallback',
      fallbackUsed: true
    };
  }

  // Build safety review prompt
  const systemPrompt = `You are a classification security reviewer for Red Forge IDE.

Your job: Detect if content is CORRECTLY tagged as WHAT (capability) vs HOW (implementation).

Common mistakes:
- Specific performance metrics in WHAT sections (should be HOW)
- Implementation details in WHAT sections (should be HOW)
- Reverse: Generic capabilities in HOW sections (should be WHAT)

Declared classification: WHAT=${declaredClassification.what}, HOW=${declaredClassification.how}

Respond in JSON:
{
  "approved": true/false,
  "warnings": [
    {
      "severity": "low|medium|high",
      "message": "Description of issue",
      "detectedIn": "WHAT|HOW|frontmatter",
      "suggestedFix": "How to fix it"
    }
  ],
  "reasoning": "Brief explanation"
}`;

  const userPrompt = `Review this file for classification errors:

Filename: ${filename}
Declared: WHAT=${declaredClassification.what}, HOW=${declaredClassification.how}
Target AI: ${targetAI}

Content:
${content}`;

  try {
    // Increment rate limit counter
    incrementRateLimit();
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://balans.se',
        'X-Title': 'Red Forge IDE Safety Review'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct', // Same model as Red Forge SaaS
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1, // Low temperature for consistent safety reviews
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      // API error - use heuristic fallback
      const heuristicWarnings = performHeuristicReview(content, declaredClassification);
      return {
        approved: heuristicWarnings.every(w => w.severity !== 'high'),
        warnings: [
          {
            severity: 'medium',
            message: `Guardian AI temporarily unavailable (API error ${response.status}). Using basic checks only.`,
            detectedIn: 'frontmatter',
            suggestedFix: 'You can continue with basic checks or retry later when AI review is available.'
          },
          ...heuristicWarnings
        ],
        reasoning: `API error ${response.status} - heuristic fallback`,
        apiFailure: true,
        fallbackUsed: true
      };
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content || '';
    
    // Parse JSON response
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI response not in expected JSON format');
    }

    const result = JSON.parse(jsonMatch[0]) as SafetyReviewResult;
    return result;

  } catch (error) {
    console.error('AI safety review failed:', error);
    
    // Fallback: use heuristic review
    const heuristicWarnings = performHeuristicReview(content, declaredClassification);
    return {
      approved: heuristicWarnings.every(w => w.severity !== 'high'),
      warnings: [
        {
          severity: 'medium',
          message: `Guardian AI error: ${error instanceof Error ? error.message : 'Unknown error'}. Using basic checks only.`,
          detectedIn: 'frontmatter',
          suggestedFix: 'You can continue with basic checks. AI review will be available again when connectivity is restored.'
        },
        ...heuristicWarnings
      ],
      reasoning: 'API failure - heuristic fallback',
      apiFailure: true,
      fallbackUsed: true
    };
  }
}

/**
 * Simple keyword-based heuristics (backup if AI review fails)
 */
export function performHeuristicReview(
  content: string,
  declaredClassification: { what: SecurityLevel; how: SecurityLevel }
): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  // Extract WHAT and HOW sections
  const whatMatch = content.match(/<What>([\s\S]*?)<\/What>/i);
  const howMatch = content.match(/<How>([\s\S]*?)<\/How>/i);

  if (whatMatch) {
    const whatContent = whatMatch[1];
    
    // Check for specific metrics in WHAT (likely HOW)
    const specificMetrics = [
      /\d+\.\d+%\s*(accuracy|precision|recall)/i,
      /\d+\s*(ms|seconds?|minutes?)\s*(latency|response|detection)/i,
      /\d+\s*(meters?|km|feet)\s*(range|distance)/i
    ];

    for (const pattern of specificMetrics) {
      if (pattern.test(whatContent)) {
        warnings.push({
          severity: 'medium',
          message: `Specific metric detected in WHAT section: "${whatContent.match(pattern)?.[0]}" - consider moving to HOW`,
          detectedIn: 'WHAT',
          suggestedFix: 'Move specific performance metrics to HOW section'
        });
      }
    }
  }

  return warnings;
}

