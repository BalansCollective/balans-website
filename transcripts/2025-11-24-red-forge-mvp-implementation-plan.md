# Red Forge MVP - Implementation Plan (Based on Cline Study)

**Date:** 2025-11-24  
**Context:** Studied Cline's codebase to understand file access, streaming, and approval UX

---

## What We Learned from Cline

### ✅ Good Patterns to Copy:
1. **Markdown streaming** with `react-remark` + `useEffect` (automatic re-render)
2. **Auto-approve system** with granular settings (read vs edit, local vs external)
3. **Clean UI** for approval prompts (file path, reason, buttons)
4. **Code highlighting** with `rehype-highlight` in markdown

### ❌ Missing in Cline (Red Forge needs):
1. **Classification-based permissions** (Cline only has workspace-based)
2. **Cost display** (Cline doesn't show token/cost estimates)
3. **Security clearance enforcement** (hard blocks, not just approvals)
4. **Audit trail** (Cline logs actions but not for compliance)

---

## Red Forge MVP Architecture

### Tech Stack (React + TypeScript):
```
Frontend:
- React 18 + TypeScript
- Monaco Editor (VS Code editor component)
- react-remark (markdown streaming)
- Tailwind CSS (styling)

Backend:
- Node.js + Express (file system operations)
- OpenRouter API (LLM routing)
- SQLite (audit trail storage)

File Structure:
red-forge-mvp/
├── src/
│   ├── components/
│   │   ├── FileTree.tsx
│   │   ├── MonacoEditor.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── AuditTrail.tsx
│   │   ├── ApprovalModal.tsx
│   │   └── MarkdownRenderer.tsx
│   ├── lib/
│   │   ├── forge-protocol.ts  # Classification enforcement
│   │   ├── context-manager.ts  # AI context with clearance
│   │   ├── file-access.ts      # File read/write with approval
│   │   └── cost-calculator.ts  # Token/cost estimation
│   ├── types/
│   │   ├── classification.ts
│   │   └── ai-service.ts
│   └── App.tsx
├── server/
│   ├── index.ts
│   ├── routes/
│   │   ├── files.ts
│   │   ├── ai.ts
│   │   └── audit.ts
│   └── db/
│       └── audit-trail.ts
└── package.json
```

---

## Core Features (MVP)

### 1. Context Loading Modes (from Design Session)

```typescript
enum ContextMode {
  UNRESTRICTED = "unrestricted", // ES auto-load
  STRICT = "strict",             // ES audit-logged, BH/K/H explicit
  PARANOID = "paranoid"          // Everything explicit
}

interface ContextLoadRequest {
  filePath: string;
  classification: SwedishClassification;
  sizeBytes: number;
  reason: string; // From AI request
}

interface ContextLoadResponse {
  allowed: boolean;
  requiresApproval: boolean;
  estimatedTokens: number;
  estimatedCost: number;
  warnings?: string[];
}
```

### 2. File Access Flow

```typescript
// file-access.ts
class FileAccessManager {
  async requestFileAccess(
    file: string,
    aiService: AIService,
    mode: ContextMode,
    reason: string
  ): Promise<FileAccessResult> {
    
    // 1. Load file metadata
    const metadata = await this.getFileMetadata(file);
    const classification = metadata.frontmatter.classification;
    
    // 2. Check clearance (hard block)
    if (classification > aiService.maxClassification) {
      return {
        allowed: false,
        reason: `AI clearance insufficient (${aiService.maxClassification} < ${classification})`,
        canOverride: false
      };
    }
    
    // 3. Check user clearance (hard block)
    if (classification > this.userClearance) {
      return {
        allowed: false,
        reason: `User clearance insufficient (${this.userClearance} < ${classification})`,
        canOverride: false
      };
    }
    
    // 4. Check auto-approve based on mode
    const autoApproved = this.checkAutoApprove(classification, mode);
    
    if (autoApproved) {
      await this.auditLog({
        operation: "file_read",
        file,
        classification,
        aiService: aiService.name,
        mode,
        autoApproved: true
      });
      
      const content = await fs.readFile(file, 'utf-8');
      return {
        allowed: true,
        content,
        requiresApproval: false
      };
    }
    
    // 5. Requires user approval
    const tokens = this.estimateTokens(await fs.stat(file).size);
    const cost = this.estimateCost(tokens, aiService);
    
    return {
      allowed: false,
      requiresApproval: true,
      approvalPrompt: {
        file,
        classification,
        reason,
        tokens,
        cost,
        aiService: aiService.name
      }
    };
  }
  
  checkAutoApprove(classification: SwedishClassification, mode: ContextMode): boolean {
    switch (mode) {
      case ContextMode.UNRESTRICTED:
        return classification === "EJ_SEKRETESS";
      case ContextMode.STRICT:
        return false; // All explicit
      case ContextMode.PARANOID:
        return false; // All explicit
    }
  }
}
```

### 3. Approval Modal UI (React)

```tsx
// ApprovalModal.tsx
interface ApprovalModalProps {
  request: FileAccessRequest;
  onApprove: () => void;
  onPreview: () => void;
  onReject: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  request,
  onApprove,
  onPreview,
  onReject
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md">
        <h3 className="text-lg font-semibold text-orange-400 mb-2">
          ⚠️ AI vill läsa fil
        </h3>
        
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <strong>Fil:</strong> {request.file}
          </div>
          <div>
            <strong>Klassificering:</strong> {request.classification}
          </div>
          <div>
            <strong>AI-tjänst:</strong> {request.aiService}
          </div>
          <div>
            <strong>Anledning:</strong> {request.reason}
          </div>
          <div className="pt-2 border-t border-gray-700">
            <strong>Kostnad:</strong> ~{request.tokens.toLocaleString()} tokens (${request.cost.toFixed(2)})
          </div>
        </div>
        
        <div className="flex space-x-2 mt-6">
          <button
            onClick={onReject}
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
          >
            Avbryt
          </button>
          <button
            onClick={onPreview}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Preview
          </button>
          <button
            onClick={onApprove}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Läs fil
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 4. Markdown Streaming (from Cline)

```tsx
// MarkdownRenderer.tsx
import { useRemark } from 'react-remark';
import rehypeHighlight from 'rehype-highlight';
import { useEffect } from 'react';

interface MarkdownRendererProps {
  markdown: string; // Streams in incrementally
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const [reactContent, setMarkdown] = useRemark({
    remarkPlugins: [],
    rehypePlugins: [rehypeHighlight as any]
  });
  
  useEffect(() => {
    setMarkdown(markdown || ''); // Re-renders on every update
  }, [markdown, setMarkdown]);
  
  return (
    <div className="prose prose-invert max-w-none">
      {reactContent}
    </div>
  );
};
```

### 5. Chat Panel with Streaming

```tsx
// ChatPanel.tsx
import { useState, useEffect, useRef } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string; // May be partial during streaming
  complete: boolean;
}

export const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      complete: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Create assistant message placeholder
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      complete: false
    };
    setMessages(prev => [...prev, assistantMessage]);
    
    // Stream response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      
      // Update assistant message incrementally
      setMessages(prev => prev.map(msg => 
        msg.id === assistantId 
          ? { ...msg, content: msg.content + chunk }
          : msg
      ));
    }
    
    // Mark complete
    setMessages(prev => prev.map(msg =>
      msg.id === assistantId
        ? { ...msg, complete: true }
        : msg
    ));
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-3 rounded ${
              msg.role === 'user' 
                ? 'bg-blue-500/20 border-l-4 border-blue-500'
                : msg.role === 'system'
                ? 'bg-orange-500/20 border-l-4 border-orange-500'
                : 'bg-gray-800/50 border-l-4 border-purple-500'
            }`}
          >
            <MarkdownRenderer markdown={msg.content} />
            {!msg.complete && <span className="animate-pulse">▊</span>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about this file..."
            className="flex-1 bg-gray-800 text-gray-100 px-3 py-2 rounded border border-gray-700"
          />
          <button
            onClick={sendMessage}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## Implementation Timeline

### Week 1: Core Infrastructure
- [x] Design sessions complete
- [ ] React + TypeScript setup
- [ ] Monaco Editor integration
- [ ] File tree component
- [ ] Basic file read/write

### Week 2: Classification & Context
- [ ] Forge Protocol implementation
- [ ] Context loading modes
- [ ] Auto-approve logic
- [ ] Approval modal UI

### Week 3: AI Integration
- [ ] OpenRouter API integration
- [ ] Markdown streaming
- [ ] Chat panel with file context
- [ ] Cost calculation

### Week 4: Audit & Polish
- [ ] Audit trail database
- [ ] Audit trail UI
- [ ] Swedish classification levels
- [ ] Testing & bug fixes

---

## SAAB Demo vs MVP Differences

| Feature | SAAB Demo | MVP (for Sam) |
|---------|-----------|---------------|
| Modes | Strict only | All 3 modes |
| Files | 3 demo files | Real filesystem |
| AI | Simulated | Real LLMs (OpenRouter) |
| Preview | No | Yes |
| Cost display | Basic | Detailed with breakdown |
| Redaction | No | Yes (higher clearance hidden) |
| Audit export | JSON | JSON + PDF + FMV format |
| Markdown | Basic | Full streaming with syntax highlight |

---

## Next Steps

**User decision needed:**
1. Build SAAB demo first (2 days, validate need with RegPilot)?
2. Go straight to MVP (1-2 weeks, dogfood on real work)?
3. Something else?

**End of plan.**



