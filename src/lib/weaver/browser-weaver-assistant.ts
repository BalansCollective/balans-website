/**
 * Browser Weaver Assistant (Phase 1: Core Validation)
 * 
 * Embedded AI assistant for Red Forge with:
 * - Guard system (@weaver/guards) for anti-bureaucratic protection
 * - OpenRouter streaming (SSE)
 * - Chronicle logging (localStorage)
 * - Classification-aware file access
 */

import type {
  WeaverConfig,
  Message,
  MDXChunk,
  Classification,
  AIService,
  FileMetadata
} from './types';
import { BrowserChronicle } from './browser-chronicle';
import { OpenRouterClient } from './openrouter-client';

export class BrowserWeaverAssistant {
  private config: WeaverConfig;
  private chronicle: BrowserChronicle;
  private openrouter: OpenRouterClient;
  private conversationHistory: Message[] = [];
  private filesInContext: Map<string, FileMetadata & { content: string }> = new Map(); // Support multiple files
  
  constructor(config: WeaverConfig) {
    this.config = config;
    this.chronicle = new BrowserChronicle();
    this.openrouter = new OpenRouterClient({
      apiKey: config.openrouterKey,
      model: 'anthropic/claude-3.5-sonnet' // Default model
    });
  }
  
  /**
   * Send a message to the AI with streaming response
   */
  async *sendMessage(
    userMessage: string,
    aiService: AIService
  ): AsyncGenerator<MDXChunk, void, unknown> {
    // Log user prompt
    await this.chronicle.logUserPrompt(userMessage);
    
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });
    
    // Call OpenRouter
    try {
      yield* this.streamOpenRouter(aiService);
      
      // Log AI action
      await this.chronicle.logAIAction('Generated response', 
        Array.from(this.filesInContext.keys())
      );
      
      yield { type: 'done', content: '' };
    } catch (error) {
      yield {
        type: 'error',
        content: `❌ OpenRouter error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Add file to context (for classification-aware prompts)
   */
  addFileToContext(file: FileMetadata & { content: string }): void {
    this.filesInContext.set(file.path, file);
  }
  
  /**
   * Remove file from context
   */
  removeFileFromContext(filePath: string): void {
    this.filesInContext.delete(filePath);
  }
  
  /**
   * Set current file context (legacy API for single-file, deprecated)
   * @deprecated Use addFileToContext instead
   */
  setFileContext(file: FileMetadata & { content?: string } | null): void {
    if (!file) {
      this.filesInContext.clear();
    } else if (file.content) {
      this.addFileToContext(file as FileMetadata & { content: string });
    }
  }
  
  /**
   * Check if user can access a file based on clearance
   */
  canAccessFile(file: FileMetadata): boolean {
    if (!this.config.userClearance) return true;
    
    const levels: Classification[] = [
      'oklassificerad',
      'begransad-hemlig',
      'konfidentiell',
      'hemlig'
    ];
    
    const userLevel = levels.indexOf(this.config.userClearance);
    const fileLevel = levels.indexOf(file.classification);
    
    return userLevel >= fileLevel;
  }
  
  /**
   * Attempt to send file to AI (with classification enforcement)
   */
  async sendFileToAI(
    file: FileMetadata,
    aiService: AIService
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Check classification clearance
    if (!this.canAccessFile(file)) {
      await this.chronicle.logSecurityViolation(
        file.path,
        file.classification,
        this.config.userClearance || 'oklassificerad'
      );
      
      return {
        allowed: false,
        reason: `Du har inte clearance för att skicka ${file.classification} filer till AI.`
      };
    }
    
    // Check AI service clearance (Phase 2 - for now, allow all)
    // TODO: Implement AI service clearance matrix
    
    // Add file to context
    this.setFileContext(file);
    
    // Log action
    await this.chronicle.logAIAction(`Added file to context: ${file.path}`, [file.path]);
    
    return { allowed: true };
  }
  
  /**
   * Clear conversation history (reset context)
   */
  clearContext(): void {
    this.conversationHistory = [];
    this.filesInContext.clear();
  }
  
  /**
   * Get chronicle export (for debugging)
   */
  async getChronicleExport(): Promise<string> {
    return await this.chronicle.exportJSON();
  }
  
  /**
   * Get chronicle stats (for debugging)
   */
  getChronicleStats() {
    return this.chronicle.getStats();
  }
  
  /**
   * Stream response from OpenRouter
   */
  private async *streamOpenRouter(aiService: AIService): AsyncGenerator<MDXChunk, void, unknown> {
    // Build system prompt with classification context
    const systemPrompt = this.buildSystemPrompt(aiService);
    
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...this.conversationHistory
    ];
    
    let fullResponse = '';
    
    try {
      // Stream from OpenRouter
      for await (const chunk of this.openrouter.streamChat(messages)) {
        fullResponse += chunk;
        yield {
          type: 'text',
          content: chunk
        };
      }
      
      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse
      });
    } catch (error) {
      throw new Error(`OpenRouter streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Build system prompt with classification context
   */
  private buildSystemPrompt(aiService: AIService): string {
    // If we have files in context, include all their contents
    if (this.filesInContext.size > 0) {
      const files = Array.from(this.filesInContext.values());
      
      let prompt = `You have access to ${files.length} file${files.length > 1 ? 's' : ''}:\n\n`;
      
      for (const file of files) {
        prompt += `## ${file.title}\n\n<file_content>\n${file.content}\n</file_content>\n\n`;
      }
      
      prompt += `Answer questions about these files directly and helpfully.`;
      
      return prompt;
    }
    
    // No files in context
    return '';
  }
}

