# Red Forge MVP - Evolution from Advanced Mode (MDX-based)

**Date:** 2025-11-24  
**Realization:** We already have MDX parser, classification blocks, and React UI!

---

## What We Already Have ✅

### 1. MDX Parser (`MDXRenderer.tsx`)
- Parses `<What>` and `<How>` tags
- Frontmatter classification defaults
- Visual indicators (colored lines, tooltips)
- Syntax highlighting (Prism)
- Swedish classification levels support

### 2. Classification System
- `design-tokens.ts` - Colors for ES/BH/K/H/KH
- `types.ts` - SecurityLevel, AIService, etc.
- `compliance-engine.ts` - Classification checks
- `context-manager.ts` - Block-level tracking

### 3. UI Components
- `RedForgeIDEPage.tsx` - Main layout
- `FileTreeItem.tsx` - File browser
- `WeaverAssistant.tsx` - Chat panel
- `AuditTrailPanel.tsx` - Audit log

---

## What We Need to Add 🔧

### 1. Streaming Markdown in Chat

**Current:** Static messages only  
**Need:** Incremental updates as AI writes

```tsx
// WeaverAssistant.tsx - ADD streaming support
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  complete: boolean; // NEW: Track if streaming is done
}

const [messages, setMessages] = useState<Message[]>([]);

// When AI responds, create incomplete message
const assistantId = Date.now().toString();
setMessages(prev => [...prev, {
  id: assistantId,
  role: 'assistant',
  content: '', // Empty initially
  complete: false
}]);

// Stream response chunks
const response = await fetch('/api/chat/stream', {
  method: 'POST',
  body: JSON.stringify({ message: userInput })
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader!.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  
  // Update message incrementally
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
```

**Render with markdown:**
```tsx
{messages.map(msg => (
  <div key={msg.id} className={getMessageClass(msg.role)}>
    <MDXRenderer content={msg.content} /> {/* Already supports markdown! */}
    {!msg.complete && <span className="animate-pulse">▊</span>}
  </div>
))}
```

---

### 2. File Access Approval Modal

**New component:** `FileAccessApprovalModal.tsx`

```tsx
interface FileAccessRequest {
  file: string;
  classification: SecurityLevel;
  reason: string; // From AI: "User asked to fix calibration bug"
  sizeBytes: number;
  estimatedTokens: number;
  estimatedCost: number;
  aiService: string;
}

interface FileAccessApprovalModalProps {
  request: FileAccessRequest | null;
  onApprove: () => void;
  onPreview: () => void; // Show first 50 lines
  onReject: () => void;
}

export const FileAccessApprovalModal: React.FC<FileAccessApprovalModalProps> = ({
  request,
  onApprove,
  onPreview,
  onReject
}) => {
  if (!request) return null;
  
  const colors = CLASSIFICATION_COLORS[request.classification];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md shadow-xl">
        <h3 className="text-lg font-semibold text-orange-400 mb-3">
          ⚠️ AI vill läsa fil
        </h3>
        
        <div className="space-y-3 text-sm">
          {/* File info */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Fil:</span>
            <span className="text-gray-200 font-mono">{request.file}</span>
          </div>
          
          {/* Classification badge */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Klassificering:</span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${colors.bg} ${colors.text}`}>
              {colors.fullName} ({colors.label})
            </span>
          </div>
          
          {/* AI service */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">AI-tjänst:</span>
            <span className="text-gray-200">{request.aiService}</span>
          </div>
          
          {/* Reason */}
          <div>
            <span className="text-gray-400 block mb-1">Anledning:</span>
            <p className="text-gray-300 text-xs italic bg-gray-800 p-2 rounded">
              "{request.reason}"
            </p>
          </div>
          
          {/* Cost estimate */}
          <div className="pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Storlek:</span>
              <span className="text-gray-300">{(request.sizeBytes / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-400">Estimerad kostnad:</span>
              <span className="text-orange-400 font-semibold">
                ~{request.estimatedTokens.toLocaleString()} tokens (${request.estimatedCost.toFixed(3)})
              </span>
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex space-x-2 mt-6">
          <button
            onClick={onReject}
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700 transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={onPreview}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={onApprove}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
          >
            Läs fil
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

### 3. Context Loading Modes

**Add to `useComplianceContext.tsx`:**

```typescript
export enum ContextMode {
  UNRESTRICTED = 'unrestricted', // ES auto-load, rest explicit
  STRICT = 'strict',             // Everything explicit (except ES audit-logged)
  PARANOID = 'paranoid'          // Everything explicit, even ES
}

interface ComplianceContextValue {
  // ... existing fields
  contextMode: ContextMode;
  setContextMode: (mode: ContextMode) => void;
  requestFileAccess: (file: string, reason: string) => Promise<FileAccessResult>;
}

// In ComplianceProvider:
const [contextMode, setContextMode] = useState<ContextMode>(ContextMode.UNRESTRICTED);
const [pendingFileRequest, setPendingFileRequest] = useState<FileAccessRequest | null>(null);

const requestFileAccess = async (file: string, reason: string): Promise<FileAccessResult> => {
  // 1. Load file metadata
  const metadata = await loadFileMetadata(file);
  const classification = metadata.frontmatter.classification as SecurityLevel;
  
  // 2. Check clearance (hard block)
  if (!canAccessClassification(classification, selectedAIService)) {
    return {
      allowed: false,
      reason: `AI clearance insufficient for ${classification}`,
      canOverride: false
    };
  }
  
  // 3. Check auto-approve based on mode
  const autoApproved = checkAutoApprove(classification, contextMode);
  
  if (autoApproved) {
    // Auto-load and audit log
    const content = await loadFileContent(file);
    contextManager.addBlock(file, content, classification);
    auditDB.add({
      operation: 'file_read',
      file,
      classification,
      autoApproved: true,
      mode: contextMode
    });
    return { allowed: true, content };
  }
  
  // 4. Requires user approval - show modal
  const sizeBytes = await getFileSize(file);
  const estimatedTokens = Math.ceil(sizeBytes / 4); // Rough estimate
  const estimatedCost = (estimatedTokens / 1000000) * 3; // $3/M tokens
  
  setPendingFileRequest({
    file,
    classification,
    reason,
    sizeBytes,
    estimatedTokens,
    estimatedCost,
    aiService: getAIServiceConfig(selectedAIService)?.displayName || 'Unknown'
  });
  
  // Wait for user decision (handled by modal callbacks)
  return new Promise((resolve) => {
    // Store resolve function to call from modal callbacks
    fileAccessResolve.current = resolve;
  });
};

const checkAutoApprove = (classification: SecurityLevel, mode: ContextMode): boolean => {
  switch (mode) {
    case ContextMode.UNRESTRICTED:
      return classification === 'EJ_SEKRETESS';
    case ContextMode.STRICT:
      return false; // All explicit (even ES gets audit logged)
    case ContextMode.PARANOID:
      return false; // Everything explicit
  }
};
```

---

### 4. Real Filesystem Integration

**Two options:**

#### Option A: VSCode Extension API (if building extension)
```typescript
import * as vscode from 'vscode';

async function loadFileContent(relativePath: string): Promise<string> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) throw new Error('No workspace open');
  
  const uri = vscode.Uri.joinPath(workspaceFolder.uri, relativePath);
  const bytes = await vscode.workspace.fs.readFile(uri);
  return new TextDecoder().decode(bytes);
}

async function saveFileContent(relativePath: string, content: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) throw new Error('No workspace open');
  
  const uri = vscode.Uri.joinPath(workspaceFolder.uri, relativePath);
  const bytes = new TextEncoder().encode(content);
  await vscode.workspace.fs.writeFile(uri, bytes);
}
```

#### Option B: Node.js Backend (if standalone app)
```typescript
// server/routes/files.ts
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

router.get('/files/:path', async (req, res) => {
  const workspaceRoot = process.env.WORKSPACE_ROOT || process.cwd();
  const filePath = path.join(workspaceRoot, req.params.path);
  
  // Security: Ensure path is within workspace
  if (!filePath.startsWith(workspaceRoot)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    
    res.json({
      content,
      sizeBytes: stats.size,
      modified: stats.mtime
    });
  } catch (err) {
    res.status(404).json({ error: 'File not found' });
  }
});

router.post('/files/:path', async (req, res) => {
  const workspaceRoot = process.env.WORKSPACE_ROOT || process.cwd();
  const filePath = path.join(workspaceRoot, req.params.path);
  
  if (!filePath.startsWith(workspaceRoot)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    await fs.writeFile(filePath, req.body.content, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Write failed' });
  }
});

export default router;
```

---

### 5. Cost Calculator

**New file:** `lib/red-forge/cost-calculator.ts`

```typescript
interface CostEstimate {
  tokens: number;
  costUSD: number;
  model: string;
}

// Pricing per 1M tokens (as of 2024)
const MODEL_PRICING = {
  'claude-sonnet-4.5': { input: 3.00, output: 15.00 },
  'gpt-4': { input: 30.00, output: 60.00 },
  'llama-3.3-70b': { input: 0.50, output: 0.80 } // Red Forge LLM
};

export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters (for English/Swedish)
  // More accurate: use tiktoken library
  return Math.ceil(text.length / 4);
}

export function estimateFileTokens(sizeBytes: number): number {
  // Assume UTF-8, ~1.2 bytes per char on average for Swedish text
  const chars = sizeBytes / 1.2;
  return Math.ceil(chars / 4);
}

export function calculateCost(tokens: number, model: string, isOutput: boolean = false): number {
  const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING];
  if (!pricing) return 0;
  
  const pricePerMillion = isOutput ? pricing.output : pricing.input;
  return (tokens / 1_000_000) * pricePerMillion;
}

export function estimateFileAccessCost(
  fileSizeBytes: number,
  model: string
): CostEstimate {
  const tokens = estimateFileTokens(fileSizeBytes);
  const costUSD = calculateCost(tokens, model, false); // Input tokens
  
  return {
    tokens,
    costUSD,
    model
  };
}
```

---

### 6. Preview Mode

**Add to `FileAccessApprovalModal.tsx`:**

```tsx
const [showingPreview, setShowingPreview] = useState(false);
const [previewContent, setPreviewContent] = useState<string>('');

const handlePreview = async () => {
  setShowingPreview(true);
  
  // Load first 50 lines only
  const response = await fetch(`/api/files/${request.file}/preview`);
  const data = await response.json();
  
  setPreviewContent(data.preview);
};

// In modal render:
{showingPreview && (
  <div className="mt-4 border-t border-gray-700 pt-4">
    <h4 className="text-sm font-semibold text-gray-400 mb-2">
      Preview (första 50 raderna):
    </h4>
    <div className="bg-gray-950 p-3 rounded max-h-64 overflow-y-auto">
      <MDXRenderer content={previewContent} />
    </div>
    <div className="mt-2 text-xs text-gray-500">
      Vill du läsa hela filen? (Full kostnad: ${request.estimatedCost.toFixed(3)})
    </div>
  </div>
)}
```

---

## Implementation Timeline (Revised)

### Week 1: Core Additions
- [ ] Streaming markdown in chat (update `WeaverAssistant.tsx`)
- [ ] File access approval modal (`FileAccessApprovalModal.tsx`)
- [ ] Cost calculator (`cost-calculator.ts`)
- [ ] Preview mode

### Week 2: Context Management
- [ ] Context loading modes (Unrestricted/Strict/Paranoid)
- [ ] Auto-approve logic per mode
- [ ] Mode switcher UI

### Week 3: Filesystem & AI
- [ ] Real filesystem integration (Node.js backend or VSCode API)
- [ ] OpenRouter API integration for real LLM responses
- [ ] Streaming response handling

### Week 4: Polish & Testing
- [ ] Audit trail improvements
- [ ] Swedish classification refinements
- [ ] Dogfooding on real work
- [ ] Bug fixes

---

## Key Advantage: Evolving, Not Rewriting

**We're NOT building from scratch!**  
We're adding 4-5 new features to an existing, working system.

**Existing foundation:**
- MDX parser ✅
- Classification blocks ✅
- UI components ✅
- Design system ✅
- Types & validation ✅

**New additions:**
- Streaming ⏳
- File approval ⏳
- Context modes ⏳
- Real filesystem ⏳
- Cost calculator ⏳

**Total work: ~1-2 weeks** (not 4 weeks from scratch!)

---

## Next Decision

**What to do first:**
1. **Add streaming to existing demo** (prove it works with MDX)
2. **Build file approval modal** (critical UX piece)
3. **Real filesystem** (escape demo data prison)
4. **Something else?**

**End of revised plan.**



