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

export interface FileModification {
  originalFile: {
    name: string;
    content: string;
    classification: Classification;
  };
  modifiedFile: {
    name: string;
    content: string;
    classification: Classification;
  };
  changes: Array<{
    line: number;
    oldContent: string;
    newContent: string;
    reason: string;
  }>;
  classificationImpact?: {
    original: Classification;
    proposed: Classification;
    reasoning: string;
  };
}

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
   * Get files currently in context
   */
  getFileContext(): Array<FileMetadata & { content: string }> {
    return Array.from(this.filesInContext.values());
  }
  
  /**
   * Propose file modifications based on user request using Cline V4A patch format
   */
  async proposeFileModifications(
    file: FileMetadata & { content: string },
    request: string
  ): Promise<FileModification> {
    // Detect if user explicitly requests declassification
    const isDeclassifyRequest = /declassif|downgrad|lower.*classification|reduce.*classification/i.test(request);
    
    // Use Cline's exact apply_patch tool description
    const systemPrompt = `This is a custom utility that makes it more convenient to add, remove, move, or edit code in a single file. \`apply_patch\` effectively allows you to execute a diff/patch against a file, but the format of the diff specification is unique to this task, so pay careful attention to these instructions.

To modify the file, pass a message of the following structure:

%%bash
apply_patch <<"EOF"
*** Begin Patch
[YOUR_PATCH]
*** End Patch
EOF

Where [YOUR_PATCH] is the actual content of your patch, specified in the following V4A diff format.

*** [ACTION] File: [path/to/file] -> ACTION can be one of Add, Update, or Delete. 

For each snippet of code that needs to be changed, repeat the following:
[context_before] -> See below for further instructions on context.
- [old_code] -> Precede the old code with a minus sign.
+ [new_code] -> Precede the new, replacement code with a plus sign.
[context_after] -> See below for further instructions on context.

For instructions on [context_before] and [context_after]:
- By default, show 3 lines of code immediately above and 3 lines immediately below each change. If a change is within 3 lines of a previous change, do NOT duplicate the first change's [context_after] lines in the second change's [context_before] lines.
- If 3 lines of context is insufficient to uniquely identify the snippet of code within the file, use the @@ operator to indicate the class or function to which the snippet belongs. For instance, we might have:
@@ class BaseClass
[3 lines of pre-context]
- [old_code]
+ [new_code]
[3 lines of post-context]

- If a code block is repeated so many times in a class or function such that even a single @@ statement and 3 lines of context cannot uniquely identify the snippet of code, you can use multiple \`@@\` statements to jump to the right context. For instance:

@@ class BaseClass
@@ 	def method():
[3 lines of pre-context]
- [old_code]
+ [new_code]
[3 lines of post-context]

Note, then, that we do not use line numbers in this diff format, as the context is enough to uniquely identify code. An example of a message that you might pass, in order to apply a patch, is shown below.

%%bash
apply_patch <<"EOF"
*** Begin Patch
*** Update File: pygorithm/searching/binary_search.py
@@ class BaseClass
@@     def search():
-          pass
+          raise NotImplementedError()

@@ class Subclass
@@     def search():
-          pass
+          raise NotImplementedError()

*** End Patch
EOF

USER REQUEST: ${request}
FILE TO MODIFY: ${file.title}
CLASSIFICATION: ${file.classification.toUpperCase()} ${isDeclassifyRequest ? '(declassification requested)' : '(maintain or upgrade only)'}

CURRENT FILE CONTENT:
${file.content}
`;

    try {
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: request }
      ];

      let fullResponse = '';
      let retries = 0;
      const maxRetries = 2;

      while (retries <= maxRetries) {
        try {
          for await (const chunk of this.openrouter.streamChat(messages)) {
            fullResponse += chunk;
          }
          break; // Success, exit retry loop
        } catch (streamError) {
          retries++;
          if (retries > maxRetries) {
            throw streamError;
          }
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          fullResponse = ''; // Reset for retry
        }
      }

      // Strip everything before %%bash and after EOF
      const bashStart = fullResponse.indexOf('%%bash');
      const eofEnd = fullResponse.lastIndexOf('EOF');
      
      if (bashStart !== -1 && eofEnd !== -1) {
        fullResponse = fullResponse.substring(bashStart, eofEnd + 3); // Keep "EOF"
      }

      // Strip markdown code blocks if AI wrapped the patch
      fullResponse = fullResponse
        .replace(/^```(?:bash|text)?\s*\n/m, '')  // Remove opening ```bash or ```
        .replace(/\n```\s*$/m, '')                // Remove closing ```
        .replace(/^%%bash\s*\n/m, '')             // Remove %%bash line
        .replace(/^apply_patch\s*<<\s*"?EOF"?\s*\n/m, '')  // Remove bash heredoc
        .replace(/\nEOF\s*$/m, '')                // Remove EOF marker
        .trim();

      // Parse V4A patch using Cline's parser
      // @ts-ignore - Dynamic import from local path
      const { PatchParser, applyPatch } = await import('@/lib/patch-parser/src/index');
      
      const lines = fullResponse.split('\n');
      const parser = new PatchParser(lines, { [file.title]: file.content });
      const { patch, fuzz } = parser.parse();

      // Apply patch
      const results = applyPatch(patch, { [file.title]: file.content });
      const result = results.find(r => r.path === file.title);

      if (!result || result.deleted) {
        throw new Error('Patch did not produce modified content');
      }

      // Extract classification/filename hints from comments
      const classificationMatch = fullResponse.match(/<!--\s*Classification:\s*(\w+)\s+to\s+(\w+)\s*\(reason:\s*([^)]+)\)/i);
      const filenameMatch = fullResponse.match(/<!--\s*Filename:\s*([^\s]+)\s*-->/i);

      // Build line-by-line changes for UI
      const originalLines = file.content.split('\n');
      const modifiedLines = result.newContent!.split('\n');
      const changes: Array<{ line: number; oldContent: string; newContent: string; reason: string }> = [];

      // Find diffs
      for (let i = 0; i < Math.max(originalLines.length, modifiedLines.length); i++) {
        const oldLine = originalLines[i] || '';
        const newLine = modifiedLines[i] || '';
        if (oldLine !== newLine) {
          changes.push({
            line: i + 1,
            oldContent: oldLine,
            newContent: newLine,
            reason: `Line ${i + 1} modified per user request`
          });
        }
      }

      // Determine classification impact
      let classificationImpact = undefined;
      if (classificationMatch) {
        classificationImpact = {
          original: file.classification,
          proposed: classificationMatch[2].toLowerCase().replace(/[^a-z-]/g, '-') as Classification,
          reasoning: classificationMatch[3]
        };
      }

      return {
        originalFile: {
          name: file.title,
          content: file.content,
          classification: file.classification
        },
        modifiedFile: {
          name: filenameMatch?.[1] || file.title,
          content: result.newContent!,
          classification: classificationImpact?.proposed || file.classification
        },
        changes,
        classificationImpact
      };
    } catch (error) {
      throw new Error(`Failed to propose modifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
   * Build system prompt with classification context and demo features
   */
  private buildSystemPrompt(aiService: AIService): string {
    let prompt = `Du är Weaver AI, en assistent i Red Forge-demon.

**DEMO-FUNKTIONER:**

1. **Klassificeringsbaserad AI-routing:**
   - Claude Cloud (O): Endast oklassificerat innehåll
   - SaaS Lumen (BH): Begränsad Hemlig och lägre
   - Red Forge Local (K): Konfidentiell och lägre
   - Red Forge Air-Gap (H): Hemlig innehåll

2. **Deklassificering:**
   - Användare kan högerklicka filer för att deklassificera
   - Diff-editor öppnas direkt för manuell redigering
   - "🤖 AI-hjälp" knapp föreslår redaktioner
   - Spara till arbetsyta eller ladda ner efter granskning

3. **Fil-kontext:**
   - Användare skickar explicit filer till dig via "Skicka till AI"
   - Du kan endast läsa filer de godkänt
   - Respektera klassificeringsnivåer

**AKTUELL AI-TJÄNST:** ${aiService}

`;

    // If we have files in context, include all their contents
    if (this.filesInContext.size > 0) {
      const files = Array.from(this.filesInContext.values());
      
      prompt += `\n**FILER I KONTEXT (${files.length}):**\n\n`;
      
      for (const file of files) {
        prompt += `## ${file.title}\n**Klassificering:** ${file.classification.toUpperCase()}\n\n<file_content>\n${file.content}\n</file_content>\n\n`;
      }
      
      prompt += `Svara på frågor om dessa filer direkt och hjälpsamt. Du får diskutera all information i dessa filer eftersom användaren explicit har gett dig åtkomst.`;
    } else {
      prompt += `\n**INGEN FIL-KONTEXT:** Användaren har inte skickat några filer till dig än. Be dem klicka "Skicka till AI" för att ge dig åtkomst.`;
    }
    
    return prompt;
  }
}

