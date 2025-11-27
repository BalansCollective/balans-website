/**
 * OpenRouter SSE Stream Parser
 * 
 * Handles Server-Sent Events streaming from OpenRouter API
 */

export interface OpenRouterConfig {
  apiKey: string;
  model: string; // e.g. "anthropic/claude-3.5-sonnet"
  baseURL?: string;
}

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterChunk {
  type: 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_start' | 'message_delta' | 'message_stop' | 'error';
  delta?: {
    type: 'text_delta';
    text: string;
  };
  error?: {
    message: string;
    type: string;
  };
}

export class OpenRouterClient {
  private config: OpenRouterConfig;
  
  constructor(config: OpenRouterConfig) {
    this.config = {
      ...config,
      baseURL: config.baseURL || 'https://openrouter.ai/api/v1'
    };
  }
  
  /**
   * Stream chat completions (SSE)
   */
  async *streamChat(
    messages: OpenRouterMessage[],
    options?: {
      temperature?: number;
      max_tokens?: number;
      model?: string; // Allow per-request model override
    }
  ): AsyncGenerator<string, void, unknown> {
    const modelToUse = options?.model || this.config.model; // Use override if provided
    
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Red Forge Demo - Weaver Assistant'
      },
      body: JSON.stringify({
        model: modelToUse, // Use per-request model
        messages,
        stream: true,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 4096
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }
    
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    // Parse SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove "data: " prefix
            
            // Check for end marker
            if (data === '[DONE]') {
              return;
            }
            
            try {
              const chunk = JSON.parse(data);
              
              // OpenRouter format: choices[0].delta.content
              if (chunk.choices && chunk.choices[0]?.delta?.content) {
                yield chunk.choices[0].delta.content;
              }
              
              // Handle errors
              if (chunk.error) {
                throw new Error(`OpenRouter error: ${chunk.error.message || JSON.stringify(chunk.error)}`);
              }
            } catch (parseError) {
              // Ignore JSON parse errors for non-JSON SSE messages
              if (parseError instanceof SyntaxError) {
                console.debug('Ignoring non-JSON SSE line:', data);
              } else {
                throw parseError;
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
  
  /**
   * Test API key validity
   */
  async testConnection(): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });
      
      if (response.ok) {
        return { valid: true };
      } else {
        return {
          valid: false,
          error: `API returned ${response.status}`
        };
      }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

