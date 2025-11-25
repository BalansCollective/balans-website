// OpenRouter Client for Red Forge IDE

import { AIService, ContextBlock, SecurityLevel } from './types';
import { getAIServiceConfig, buildSystemPrompt, canAIAccessClassification } from './ai-service-config';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenRouterClient {
  private apiKey: string | null;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  
  constructor() {
    // Get API key from environment variable
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || null;
    console.log('🔑 OpenRouter API Key loaded:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT FOUND');
    console.log('📋 Available env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
  }
  
  /**
   * Check if OpenRouter is available (has API key)
   */
  isAvailable(): boolean {
    return this.apiKey !== null && this.apiKey !== '';
  }
  
  /**
   * Filter context blocks based on AI service's clearance
   */
  private filterContextBlocks(
    blocks: ContextBlock[],
    aiService: AIService
  ): ContextBlock[] {
    return blocks.filter(block => 
      !block.hidden && canAIAccessClassification(aiService, block.classificationLevel)
    );
  }
  
  /**
   * Build messages array for OpenRouter API
   */
  private buildMessages(
    userMessage: string,
    aiService: AIService,
    contextBlocks: ContextBlock[],
    userClearance: SecurityLevel,
    networkZone: 'white' | 'yellow' | 'red'
  ): OpenRouterMessage[] {
    const messages: OpenRouterMessage[] = [];
    
    // System prompt
    const systemPrompt = buildSystemPrompt(aiService, userClearance, networkZone);
    messages.push({
      role: 'system',
      content: systemPrompt
    });
    
    // Filter and add context blocks
    const visibleBlocks = this.filterContextBlocks(contextBlocks, aiService);
    
    for (const block of visibleBlocks) {
      if (block.source === 'user_message') {
        messages.push({
          role: 'user',
          content: block.content
        });
      } else if (block.source === 'ai_response') {
        messages.push({
          role: 'assistant',
          content: block.content
        });
      } else if (block.source === 'file_read' || block.source === 'code_selection') {
        // Include as user message with context
        messages.push({
          role: 'user',
          content: `[Context from ${block.fileReference || 'file'}]\n\n${block.content}`
        });
      }
    }
    
    // Current user message
    messages.push({
      role: 'user',
      content: userMessage
    });
    
    return messages;
  }
  
  /**
   * Send chat message to OpenRouter
   */
  async chat(
    userMessage: string,
    aiService: AIService,
    contextBlocks: ContextBlock[],
    userClearance: SecurityLevel,
    networkZone: 'white' | 'yellow' | 'red'
  ): Promise<string> {
    // Fallback to mock if no API key
    if (!this.isAvailable()) {
      return this.mockChat(userMessage, aiService, contextBlocks);
    }
    
    const config = getAIServiceConfig(aiService);
    if (!config) {
      throw new Error(`Unknown AI service: ${aiService}`);
    }
    
    const messages = this.buildMessages(
      userMessage,
      aiService,
      contextBlocks,
      userClearance,
      networkZone
    );
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Red Forge IDE Demo'
        },
        body: JSON.stringify({
          model: config.openRouterModel,
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }
      
      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenRouter API');
      }
      
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenRouter API error:', error);
      // Fallback to mock on error
      return this.mockChat(userMessage, aiService, contextBlocks);
    }
  }
  
  /**
   * Mock chat response (fallback when no API key or on error)
   */
  private mockChat(
    userMessage: string,
    aiService: AIService,
    contextBlocks: ContextBlock[]
  ): string {
    const config = getAIServiceConfig(aiService);
    if (!config) return 'Error: Unknown AI service';
    
    const visibleBlocks = this.filterContextBlocks(contextBlocks, aiService);
    const visibleCount = visibleBlocks.length;
    
    // Generate mock response based on service type
    if (aiService === 'openai') {
      return `[DEMO MODE - No API key] This is a simulated ${config.displayName} response.

I can see ${visibleCount} context blocks at UNCLASSIFIED level.

In the real demo with an OpenRouter API key, I would provide actual AI assistance for UNCLASSIFIED content.

Your message: "${userMessage}"`;
    }
    
    // Red Forge LLM mock
    return `[DEMO MODE - No API key] This is a simulated ${config.displayName} response.

I can see ${visibleCount} context blocks up to ${config.maxClassification} level.

As Red Forge LLM, I would help with:
- Classification-aware code review
- Declassification workflow assistance
- Secure refactoring patterns
- Audit trail interpretation

Your message: "${userMessage}"

To see real AI responses, add VITE_OPENROUTER_API_KEY to your .env.local file.`;
  }
}

export const openRouterClient = new OpenRouterClient();

