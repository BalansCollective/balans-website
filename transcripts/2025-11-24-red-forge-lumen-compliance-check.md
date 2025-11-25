# Red Forge MVP - Lumen Compliance Update

**Date:** 2025-11-24  
**Purpose:** Align implementation plans with `red-forge-system.md` Lumen specifications

---

## Compliance Summary

### ✅ Already Compliant:
- MDX parser with `<What>` and `<How>` tags
- WHAT/HOW dual classification system
- Visual indicators (colored lines, tooltips)
- Swedish classification levels (ES/BH/K/H/KH)
- Audit trail (Chronicle logging)
- Three network zones concept (White/Yellow/Red)

### ⚠️ Gaps to Address:
1. Network zone visualization in UI
2. "Extract for AI" declassification workflow
3. Green/red preview modal (show what's sent vs excluded)
4. BankID authentication (or document as future work)
5. Deployment model (webapp → desktop app → physical setup)

---

## Updated Features (Lumen-Aligned)

### 1. Network Zone Indicator

**Add to header** (`RedForgeIDEPage.tsx`):

```tsx
// Compute current network zone based on AI service
const getNetworkZone = (aiService: AIService): 'white' | 'yellow' | 'red' => {
  const config = getAIServiceConfig(aiService);
  if (!config) return 'white';
  
  if (config.displayName.includes('Cloud') || config.displayName.includes('Claude')) {
    return 'white'; // Internet-connected
  } else if (config.displayName.includes('SaaS') || config.displayName.includes('On-Prem')) {
    return 'yellow'; // Internal secure network
  } else {
    return 'red'; // Air-gapped (aspirational)
  }
};

// In header render:
<div className="flex items-center space-x-3">
  <div className="text-xl font-bold text-orange-500">Red Forge</div>
  
  {/* Network Zone Indicator */}
  <div className="flex items-center space-x-2">
    <span className="text-xs text-gray-500">Network:</span>
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
      networkZone === 'white' ? 'bg-blue-500/30 text-blue-300 border border-blue-500' :
      networkZone === 'yellow' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500' :
      'bg-red-500/30 text-red-300 border border-red-500'
    }`}>
      {networkZone === 'white' ? '🌐 White (Internet)' :
       networkZone === 'yellow' ? '🏢 Yellow (On-Prem)' :
       '🔒 Red (Air-Gap)'}
    </span>
  </div>
</div>
```

---

### 2. "Extract for AI" Workflow

**New context menu option** in file tree:

```tsx
// FileTreeItem.tsx - Add context menu
const handleContextMenu = (e: React.MouseEvent) => {
  e.preventDefault();
  
  setContextMenu({
    visible: true,
    x: e.clientX,
    y: e.clientY,
    options: [
      {
        label: '📤 Extract for AI (WHAT only)',
        onClick: () => handleExtractForAI(file),
        disabled: file.classification.what !== 'UNCLASSIFIED'
      },
      {
        label: '📂 Open in Editor',
        onClick: () => onSelectFile(file)
      },
      {
        label: '📋 Copy Path',
        onClick: () => navigator.clipboard.writeText(file.name)
      }
    ]
  });
};

const handleExtractForAI = async (file: ClassifiedFile) => {
  // Parse MDX, extract only <What> sections
  const parsed = parseMDX(file.content);
  const whatSections = parsed.blocks.filter(b => b.type === 'what');
  const extractedContent = whatSections.map(b => b.content).join('\n\n');
  
  // Calculate tokens/cost
  const tokens = estimateTokens(extractedContent);
  const cost = calculateCost(tokens, selectedAIService);
  
  // Show declassification preview modal
  setDeclassificationRequest({
    file: file.name,
    fullContent: file.content,
    extractedContent, // Only WHAT
    excludedContent: parsed.blocks.filter(b => b.type === 'how').map(b => b.content).join('\n\n'),
    classification: file.classification,
    destination: file.classification.what === 'UNCLASSIFIED' ? 'white' : 'yellow',
    tokens,
    cost
  });
};
```

---

### 3. Declassification Preview Modal

**New modal component** (`DeclassificationPreviewModal.tsx`):

```tsx
interface DeclassificationRequest {
  file: string;
  fullContent: string;
  extractedContent: string; // What will be sent (WHAT sections)
  excludedContent: string;  // What will be excluded (HOW sections)
  classification: { what: SecurityLevel; how: SecurityLevel };
  destination: 'white' | 'yellow';
  tokens: number;
  cost: number;
}

export const DeclassificationPreviewModal: React.FC<{
  request: DeclassificationRequest | null;
  onApprove: () => void;
  onReject: () => void;
}> = ({ request, onApprove, onReject }) => {
  if (!request) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] flex flex-col">
        <h3 className="text-lg font-semibold text-orange-400 mb-3">
          📤 Extract for AI - Preview
        </h3>
        
        {/* File info */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
          <div>
            <span className="text-sm text-gray-400">Fil:</span>
            <span className="text-gray-200 font-mono ml-2">{request.file}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Destination:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
              request.destination === 'white' 
                ? 'bg-blue-500/30 text-blue-300'
                : 'bg-yellow-500/30 text-yellow-300'
            }`}>
              {request.destination === 'white' ? '🌐 White Network (External AI)' : '🏢 Yellow Network (On-Prem AI)'}
            </span>
          </div>
        </div>
        
        {/* Split preview: Green (sent) vs Red (excluded) */}
        <div className="flex-1 flex space-x-4 overflow-hidden">
          {/* What will be SENT (green) */}
          <div className="flex-1 flex flex-col border border-green-500/30 rounded bg-green-500/5">
            <div className="bg-green-500/20 px-3 py-2 border-b border-green-500/30">
              <span className="text-sm font-semibold text-green-300">
                ✅ Skickas till AI ({request.tokens} tokens, ${request.cost.toFixed(3)})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <MDXRenderer content={request.extractedContent} />
            </div>
          </div>
          
          {/* What will be EXCLUDED (red) */}
          <div className="flex-1 flex flex-col border border-red-500/30 rounded bg-red-500/5">
            <div className="bg-red-500/20 px-3 py-2 border-b border-red-500/30">
              <span className="text-sm font-semibold text-red-300">
                ❌ Exkluderas (HOW-sektioner)
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 opacity-60">
              <MDXRenderer content={request.excludedContent} />
            </div>
          </div>
        </div>
        
        {/* Warnings (if any) */}
        {request.classification.how !== 'UNCLASSIFIED' && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
            <span className="text-xs text-yellow-300">
              ⚠️ Varning: Filen innehåller HOW-sektioner ({request.classification.how}). 
              Endast WHAT-sektioner ({request.classification.what}) skickas till AI.
            </span>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex space-x-2 mt-6">
          <button
            onClick={onReject}
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
          >
            Avbryt
          </button>
          <button
            onClick={onApprove}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Godkänn & Skicka
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

### 4. Deployment Model (3 Tiers)

**Document explicitly:**

```markdown
## Red Forge Deployment Tiers

### Tier 1: KISS Demo (Current - Browser-Based)
**Purpose:** Proof of concept for RegPilot meeting, investor demos
**Platform:** Browser (HTML/React)
**Security:** Simulated (no real classification enforcement)
**Hardware:** Any device with browser
**Cost:** Free (demo only)
**Timeline:** Week 1 (done)

**Features:**
- ✅ MDX rendering with classification blocks
- ✅ Simulated AI responses
- ✅ Audit trail visualization
- ✅ Swedish classification levels
- ❌ No real file system
- ❌ No authentication
- ❌ No network enforcement

---

### Tier 2: MVP (Desktop App for Sam)
**Purpose:** Real tool for daily work, dogfooding
**Platform:** Tauri (Rust + React) or VSCode Extension
**Security:** Real enforcement, local filesystem
**Hardware:** Developer laptop/desktop
**Cost:** Development time (2-3 weeks)
**Timeline:** Week 2-4

**Features:**
- ✅ Real filesystem integration
- ✅ File access approval workflow
- ✅ OpenRouter API for real LLM responses
- ✅ Markdown streaming
- ✅ Context loading modes
- ✅ Cost calculator
- ❌ No BankID (basic auth OK)
- ❌ No physical security (software-only)
- ❌ No network zones (simulated in UI)

---

### Tier 3: Production (Physical RED Network)
**Purpose:** SAAB customers, defense contractors, FMV compliance
**Platform:** Stationary workstations (Mac Studio, Desktop, Linux)
**Security:** Full Lumen spec (air-gap, physical locks, Chronicle)
**Hardware:** 170,000 SEK setup per Lumen
**Cost:** Starter Kit (150,000 SEK) + hardware
**Timeline:** Month 3+ (after customer validation)

**Features (per Lumen spec):**
- ✅ Three network zones (White/Yellow/Red)
- ✅ Stationary workstations (bolted to desks)
- ✅ Physical security (locked room, badge access)
- ✅ Zenoh data diodes (inbound/outbound)
- ✅ BankID authentication
- ✅ Chronicle audit trail (FMV-compliant)
- ✅ On-prem AI (Red Forge LLM on Yellow Network)
- ✅ Two-person rule, phone locker, bag check

---

## Current Focus: Tier 2 (MVP for Sam)

**Goal:** Build something you'll actually use for daily work.

**Must-Haves:**
1. Real filesystem (read/write files)
2. File access approval (context loading modes)
3. OpenRouter integration (real AI responses)
4. Markdown streaming (Cline-style)
5. Cost transparency (show tokens/cost before sending)

**Nice-to-Haves:**
6. Preview mode (first 50 lines)
7. Network zone simulation
8. Declassification workflow

**Defer to Tier 3:**
- BankID authentication
- Physical security
- Zenoh diodes
- Multi-workstation setup
- FMV certification
```

---

## Revised Implementation Timeline

### Week 1-2: MVP Core (Tier 2)
- [ ] Tauri setup or VSCode extension scaffold
- [ ] Real filesystem integration
- [ ] File access approval modal
- [ ] Context loading modes (Unrestricted/Strict/Paranoid)
- [ ] OpenRouter API integration
- [ ] Markdown streaming

### Week 3: MVP Polish
- [ ] Cost calculator
- [ ] Preview mode
- [ ] Network zone UI (simulated)
- [ ] Audit trail improvements
- [ ] Dogfooding on real work

### Week 4+: Production Path (Tier 3)
- [ ] Declassification preview modal
- [ ] "Extract for AI" workflow
- [ ] BankID research
- [ ] Physical setup documentation
- [ ] Customer pilots

---

## Lumen Compliance Checklist

### Core Concepts ✅
- [x] WHAT/HOW dual classification
- [x] Three network zones (White/Yellow/Red)
- [x] MDX with inline tags
- [x] Swedish classification levels
- [x] Audit trail (Chronicle)

### UI/UX ⏳
- [x] Visual indicators (colored lines)
- [x] Classification badges
- [x] File tree
- [x] Chat panel
- [ ] Network zone indicator (add to header)
- [ ] "Extract for AI" context menu
- [ ] Declassification preview modal

### Backend ⏳
- [x] MDX parser
- [x] Compliance engine (classification checks)
- [x] Context manager
- [ ] Real filesystem
- [ ] OpenRouter integration
- [ ] Cost calculator
- [ ] Zenoh diodes (Tier 3)

### Security ❌ (Defer to Tier 3)
- [ ] BankID authentication
- [ ] Physical security (stationary workstations)
- [ ] Network enforcement (air-gap)
- [ ] Two-person rule
- [ ] FMV compliance

---

## Next Actions

**Immediate (this week):**
1. Add network zone indicator to KISS demo (cosmetic improvement)
2. Draft declassification preview modal design (for Tier 2)
3. Research Tauri vs VSCode extension (platform decision)

**Short-term (next 2 weeks):**
1. Start Tier 2 MVP (desktop app)
2. Real filesystem + approval workflow
3. OpenRouter integration

**Decision needed from Sam:**
- Desktop app (Tauri) or VSCode extension for Tier 2?
- Focus on RegPilot meeting first (polish KISS demo) or skip to Tier 2?

**End of compliance update.**



