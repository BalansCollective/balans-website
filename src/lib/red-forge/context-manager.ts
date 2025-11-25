// Context Manager for Block-Based AI Context

import { ContextBlock, ChatMessage, AIService, SecurityLevel } from './types';
import { canAIAccessClassification, getAIServiceConfig } from './ai-service-config';

/**
 * Manages AI chat context with block-level classification tracking
 */
export class ContextManager {
  private blocks: ContextBlock[] = [];
  private messages: ChatMessage[] = [];
  private isTyping: boolean = false;
  private typingListeners: Set<(isTyping: boolean) => void> = new Set();
  private messageListeners: Set<() => void> = new Set();
  
  constructor() {
    // Start with typing indicator, add welcome message after delay
    this.isTyping = true;
    
    // Simulate Weaver typing (1.5 seconds delay)
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'system',
        content: `Välkommen till Red Forge IDE!

Jag är Weaver AI, din klassificeringsassistent.

**Prova detta:**
1. Öppna birdturret-v2 (helt oklass.)
2. Öppna birdturret-v3.5 (mixad klass.)
3. Öppna birdturret-v4 (konfidentiellt)

**Lägg märke till:**
• Färgkodade linjer (vad olika AI-tjänster ser)
• W:/H: klassificering i filträdet
• Försök dela filer med olika AI-nivåer

Ställ frågor när du är osäker!`,
        classificationLevel: 'UNCLASSIFIED',
        aiService: 'none',
        timestamp: new Date(),
        contextBlocks: []
      };
      
      this.messages.push(welcomeMessage);
      this.isTyping = false;
      this.notifyTypingChange();
      this.notifyMessageChange(); // Notify React to re-render!
    }, 1500);
  }
  
  /**
   * Subscribe to message changes
   */
  onMessageChange(listener: () => void): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }
  
  /**
   * Notify all listeners about message changes
   */
  private notifyMessageChange(): void {
    this.messageListeners.forEach(listener => listener());
  }
  
  /**
   * Check if AI is currently typing
   */
  getIsTyping(): boolean {
    return this.isTyping;
  }
  
  /**
   * Set typing state
   */
  setIsTyping(typing: boolean): void {
    this.isTyping = typing;
    this.notifyTypingChange();
  }
  
  /**
   * Subscribe to typing state changes
   */
  onTypingChange(listener: (isTyping: boolean) => void): () => void {
    this.typingListeners.add(listener);
    return () => this.typingListeners.delete(listener);
  }
  
  /**
   * Notify all listeners about typing state change
   */
  private notifyTypingChange(): void {
    this.typingListeners.forEach(listener => listener(this.isTyping));
  }
  
  /**
   * Add a new context block
   */
  addBlock(block: Omit<ContextBlock, 'id' | 'timestamp'>): ContextBlock {
    const newBlock: ContextBlock = {
      ...block,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    
    this.blocks.push(newBlock);
    return newBlock;
  }
  
  /**
   * Add a user message (automatically creates context block)
   */
  addUserMessage(
    content: string,
    classificationLevel: SecurityLevel,
    aiService: AIService
  ): ChatMessage {
    // Create context block for user message
    const block = this.addBlock({
      content,
      classificationLevel,
      source: 'user_message'
    });
    
    // Create chat message
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      classificationLevel,
      aiService,
      timestamp: new Date(),
      contextBlocks: [block.id]
    };
    
    this.messages.push(message);
    this.notifyMessageChange();
    return message;
  }
  
  /**
   * Add an AI response (automatically creates context block)
   */
  addAIResponse(
    content: string,
    classificationLevel: SecurityLevel,
    aiService: AIService,
    usedBlockIds: string[]
  ): ChatMessage {
    // Create context block for AI response
    const block = this.addBlock({
      content,
      classificationLevel,
      source: 'ai_response'
    });
    
    // Create chat message
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      classificationLevel,
      aiService,
      timestamp: new Date(),
      contextBlocks: [...usedBlockIds, block.id]
    };
    
    this.messages.push(message);
    this.notifyMessageChange();
    return message;
  }
  
  /**
   * Add a system message (e.g., file shared notification)
   */
  addSystemMessage(
    content: string,
    classificationLevel: SecurityLevel
  ): ChatMessage {
    // Create chat message (no context block needed for system messages)
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'system',
      content,
      classificationLevel,
      aiService: 'none',
      timestamp: new Date(),
      contextBlocks: []
    };
    
    this.messages.push(message);
    this.notifyMessageChange();
    return message;
  }
  
  /**
   * Update an existing system message (for progressive status updates)
   */
  updateSystemMessage(
    messageId: string,
    newContent: string
  ): boolean {
    const message = this.messages.find(m => m.id === messageId);
    if (message && message.role === 'system') {
      message.content = newContent;
      this.notifyMessageChange(); // Notify React to re-render!
      return true;
    }
    return false;
  }
  
  /**
   * Remove a message by ID (for cleanup)
   */
  removeMessage(messageId: string): boolean {
    const index = this.messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      this.messages.splice(index, 1);
      return true;
    }
    return false;
  }
  
  /**
   * Add file content as context block
   */
  addFileContext(
    content: string,
    classificationLevel: SecurityLevel,
    fileName: string
  ): ContextBlock {
    return this.addBlock({
      content,
      classificationLevel,
      source: 'file_read',
      fileReference: fileName
    });
  }
  
  /**
   * Add code selection as context block
   */
  addCodeSelection(
    content: string,
    classificationLevel: SecurityLevel,
    fileName: string
  ): ContextBlock {
    return this.addBlock({
      content,
      classificationLevel,
      source: 'code_selection',
      fileReference: fileName
    });
  }
  
  /**
   * Get all context blocks visible to a given AI service
   */
  getVisibleBlocks(aiService: AIService): ContextBlock[] {
    return this.blocks.filter(block =>
      !block.hidden && canAIAccessClassification(aiService, block.classificationLevel)
    );
  }
  
  /**
   * Get all context blocks (including hidden)
   */
  getAllBlocks(): ContextBlock[] {
    return [...this.blocks];
  }
  
  /**
   * Get blocks that would be hidden when switching to a new AI service
   */
  getBlocksToHide(newAIService: AIService): ContextBlock[] {
    return this.blocks.filter(block =>
      !block.hidden && !canAIAccessClassification(newAIService, block.classificationLevel)
    );
  }
  
  /**
   * Get blocks that would be revealed when switching to a new AI service
   */
  getBlocksToReveal(newAIService: AIService): ContextBlock[] {
    return this.blocks.filter(block =>
      block.hidden && canAIAccessClassification(newAIService, block.classificationLevel)
    );
  }
  
  /**
   * Switch to a new AI service
   * 
   * SECURITY: If downgrading (new AI can't access existing content), CLEAR EVERYTHING.
   * Rationale: "A chat becomes infected with secrets the moment something classified enters it."
   * No rewind, no hiding - just full reset. Simpler = more secure.
   */
  switchAIService(
    newAIService: AIService
  ): { hidden: ContextBlock[]; revealed: ContextBlock[]; chatReset: boolean } {
    const toHide = this.getBlocksToHide(newAIService);
    const toReveal = this.getBlocksToReveal(newAIService);
    
    // If we're hiding ANY blocks (downgrade scenario), clear EVERYTHING
    if (toHide.length > 0) {
      // SECURITY: Full reset - no exceptions
      this.messages = [];
      this.blocks = [];
      
      // Add system message explaining the reset
      this.addSystemMessage(
        `🔄 Chat cleared due to AI service change\n\nYou switched to ${newAIService} which cannot access previously discussed classified content.\n\nFor security, the entire conversation has been cleared.\n\nYou can now share content appropriate for ${newAIService}.`,
        'UNCLASSIFIED'
      );
      
      return { hidden: toHide, revealed: [], chatReset: true };
    }
    
    // Reveal blocks that are now accessible (upgrade scenario - safe)
    for (const block of toReveal) {
      block.hidden = false;
    }
    
    return { hidden: [], revealed: toReveal, chatReset: false };
  }
  
  /**
   * Get the highest classification level in current context
   */
  getHighestClassification(): SecurityLevel {
    const levels: SecurityLevel[] = ['UNCLASSIFIED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'];
    let highest: SecurityLevel = 'UNCLASSIFIED';
    
    for (const block of this.blocks) {
      if (!block.hidden) {
        const currentIndex = levels.indexOf(block.classificationLevel);
        const highestIndex = levels.indexOf(highest);
        if (currentIndex > highestIndex) {
          highest = block.classificationLevel;
        }
      }
    }
    
    return highest;
  }
  
  /**
   * Get all chat messages
   */
  getMessages(): ChatMessage[] {
    return [...this.messages];
  }
  
  /**
   * Clear all context (hard reset)
   */
  reset(): void {
    this.blocks = [];
    this.messages = [];
  }
  
  /**
   * Get context statistics
   */
  getStats() {
    const visible = this.blocks.filter(b => !b.hidden);
    const hidden = this.blocks.filter(b => b.hidden);
    
    return {
      totalBlocks: this.blocks.length,
      visibleBlocks: visible.length,
      hiddenBlocks: hidden.length,
      totalMessages: this.messages.length,
      highestClassification: this.getHighestClassification(),
      blocksBySource: {
        user_message: this.blocks.filter(b => b.source === 'user_message').length,
        ai_response: this.blocks.filter(b => b.source === 'ai_response').length,
        file_read: this.blocks.filter(b => b.source === 'file_read').length,
        code_selection: this.blocks.filter(b => b.source === 'code_selection').length
      }
    };
  }
}

