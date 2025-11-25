# Red Forge IDE - TypeScript Tracer Architecture

> **Purpose**: This document preserves the Red Forge architecture across AI context refreshes. All design decisions, data flows, and implementation details are documented here.

**Version**: 0.1.0 (TypeScript Tracer - Browser Demo)  
**Last Updated**: 2025-11-23  
**Status**: In Development

---

## Executive Summary

Red Forge IDE is a classification-aware development environment for Swedish defense startups and contractors. This **TypeScript tracer bullet** implements the core compliance architecture in pure TypeScript for maximum development speed, before porting to Rust/WASM.

**Core Innovation**: All file operations flow through a compliance layer that validates, logs, and enforces classification boundaries in real-time.

**Key Insight**: People at SAAB/defense contractors are already using ChatGPT on Yellow networks (it's technically available, rules are unclear, it's too useful not to use). Red Forge doesn't pretend this isn't happening. Instead, we:
- **Make AI usage VISIBLE** (not shadow IT)
- **Provide COMPLIANT alternatives** (Red Forge on-prem for CONFIDENTIAL work)
- **AUDIT everything** (accountability, not surveillance)
- **Give guilt-free AI** (classification enforcement prevents misuse)

> "We're the 'security compromise' that's actually MORE secure because we stop people from using open models in secret."

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          Red Forge IDE (React)                           │
│                                                                          │
│  ┌────────────────────────────────────────┐  ┌─────────────────────┐   │
│  │         Editor Area                    │  │   Right Panel       │   │
│  │  ┌──────────────┐  ┌────────────────┐  │  │  ┌───────────────┐ │   │
│  │  │    Monaco    │  │  MDX Renderer  │  │  │  │ 🤖 Weaver AI  │ │   │
│  │  │    Editor    │  │  (Preview)     │  │  │  │   Assistant   │ │   │
│  │  └──────────────┘  └────────────────┘  │  │  ├───────────────┤ │   │
│  └────────────────────────────────────────┘  │  │ 📋 Audit      │ │   │
│                                              │  │    Trail      │ │   │
│                                              │  └───────────────┘ │   │
│          └──────────────┬────────────────┘       └───────┬────────┘   │
│                         │                                │            │
│                         └────────────┬───────────────────┘            │
│                                      │                                │
│                    ┌─────────────────▼───────────────────┐            │
│                    │  useComplianceContext (Hook)        │            │
│                    │  - Current user context             │            │
│                    │  - Network zone, clearance          │            │
│                    │  - AI provider selection            │            │
│                    └─────────────────┬───────────────────┘            │
└──────────────────────────────────────┼──────────────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │       ZenohClient (Mock)            │
                    │  - get(resource)                    │
                    │  - put(resource, content)           │
                    │  - delete(resource)                 │
                    │  - query(selector)                  │
                    │  - exportForAI(resource)            │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │      ComplianceEngine               │
                    │  - validateOperation()              │
                    │  - checkClassification()            │
                    │  - detectKeywords()                 │
                    │  - audit()                          │
                    │  - extractWhatSections()            │
                    │  - checkAISafety()                  │
                    └──────────┬────────────┬─────────────┘
                               │            │
                ┌──────────────▼────┐   ┌──▼──────────────┐
                │  MockStorage      │   │  AuditDatabase  │
                │  - In-memory FS   │   │  - IndexedDB    │
                │  - Demo files     │   │  - Persistence  │
                └───────────────────┘   └─────────────────┘
```

### AI Assistant Integration

The Weaver AI assistant panel provides block-based context management with OpenRouter integration:

**AI Service Tiers**:
- **Claude Sonnet 4.5 (Cloud)**: User's current AI of choice, UNCLASSIFIED only
- **Red Forge LLM v1 (On-Prem)**: Llama 3.3 70B fine-tuned for Red Forge workflows, CONFIDENTIAL clearance
- **Red Forge LLM v1 (Air-gapped)**: Same model, SECRET clearance, air-gapped deployment

**Block-Based Context** (`ContextManager`):
```typescript
interface ContextBlock {
  id: string;
  content: string;
  classificationLevel: SecurityLevel;
  source: 'user_message' | 'ai_response' | 'file_read' | 'code_selection';
  timestamp: Date;
  fileReference?: string;
  hidden?: boolean; // If hidden due to AI service downgrade
}
```

**Key Features**:
- ✅ **Surgical context filtering**: Only show blocks visible to selected AI
- ✅ **Soft delete on downgrade**: Hide classified blocks when switching to more open AI
- ✅ **Context restoration**: Reveal blocks when upgrading to higher-clearance AI
- ✅ **Block provenance**: Track where each block came from (file read, user message, etc.)
- ✅ **Warning on downgrade**: Show modal with list of blocks to be hidden

**OpenRouter Integration** (`openrouter-client.ts`):
- Fallback to mock responses if no API key provided
- System prompts tailored per AI service
- Automatic block filtering based on AI clearance
- Real-time responses from Claude/Llama models

**Red Forge LLM Training**:
Fine-tuned on Red Forge workflows (not customer domains):
- Classification-aware code review (WHAT/HOW separation)
- Declassification workflow assistance
- Secure refactoring patterns (moving logic between classification levels)
- Audit trail interpretation and compliance reasoning
- Living Lumens documentation practices
- Progressive disclosure architectures (TRICKLE framework)

**Network Zone Mapping** (reality-based):
- 🌐 **White Network**: Development/testing (internet access)
  - Available AI: ALL (Claude, Red Forge SaaS, Red Forge on-site)
  - Reality: Standard dev environment
  
- 🏢 **Yellow Network**: Corporate/SAAB network (internet access via VPN/firewall)
  - Available AI: ALL (Claude, Red Forge SaaS, Red Forge on-site)
  - Reality: ChatGPT technically available, rules unclear, people use it anyway
  - **Red Forge value**: Make this usage VISIBLE and COMPLIANT
  
- 🔒 **Red Network**: Air-gapped/classified (NO network)
  - Available AI: Red Forge on-site ONLY (physically isolated)
  - Reality: No external access possible

**Security Model**:
- ❌ **Don't** rely on network restrictions (people will find workarounds)
- ✅ **Do** enforce classification at the data layer (can't send CONFIDENTIAL to cloud AI)
- ✅ **Do** audit everything (visibility = accountability)
- ✅ **Do** provide compliant alternatives (guilt-free AI for classified work)

---

## Data Flow

### Read Operation (File Open)

```typescript
// User clicks file in tree
onClick(fileId) {
  // 1. Request through ZenohClient
  const content = await zenohClient.get(`weaver://fs/${filename}`);
  
  // 2. ZenohClient validates with ComplianceEngine
  const decision = await complianceEngine.validateOperation({
    type: 'read',
    resource: `weaver://fs/${filename}`,
    user: { id: 'user-1', clearance: 'CONFIDENTIAL', networkZone: 'yellow' }
  });
  
  // 3. ComplianceEngine checks classification
  const fileClassification = parseClassification(filename);
  if (fileClassification.how > user.clearance) {
    // BLOCKED: Log to audit trail
    await auditDB.add({
      timestamp: new Date(),
      operation: 'read',
      resource: filename,
      decision: 'blocked',
      reason: 'Insufficient clearance for HOW content'
    });
    throw new Error('Access denied');
  }
  
  // 4. ALLOWED: Filter content based on clearance
  const filtered = filterContentByClassification(content, user.clearance);
  
  // 5. Log to audit trail
  await auditDB.add({
    timestamp: new Date(),
    operation: 'read',
    resource: filename,
    decision: 'allowed',
    classification: fileClassification
  });
  
  // 6. Return filtered content
  return filtered;
}
```

### Write Operation (File Save)

```typescript
// User saves file
onSave(filename, content) {
  // 1. Validate through ComplianceEngine
  const decision = await complianceEngine.validateOperation({
    type: 'write',
    resource: `weaver://fs/${filename}`,
    content: content,
    user: currentUser
  });
  
  // 2. Check for HOW keywords in WHAT sections
  const warnings = detectKeywordViolations(content);
  if (warnings.length > 0) {
    // Show warnings to user, but allow save
    showWarningDialog(warnings);
  }
  
  // 3. Save to mock storage
  await mockStorage.put(filename, content);
  
  // 4. Audit log
  await auditDB.add({
    timestamp: new Date(),
    operation: 'write',
    resource: filename,
    decision: 'allowed',
    warnings: warnings
  });
}
```

### Extract for AI (Declassification)

```typescript
// User right-clicks and selects "Extract for AI"
onExtractForAI(filename) {
  // 1. Parse WHAT sections only
  const whatSections = extractWhatSections(content);
  
  // 2. Detect HOW keywords that leaked into WHAT
  const leaks = detectKeywordsInWhat(whatSections);
  
  // 3. Show preview modal with warnings
  showPreviewModal({
    content: whatSections,
    warnings: leaks,
    onConfirm: async () => {
      // 4. Log declassification decision
      await auditDB.add({
        timestamp: new Date(),
        operation: 'export',
        resource: filename,
        decision: 'allowed',
        user_confirmed: true,
        warnings: leaks
      });
      
      // 5. Send to AI (simulated)
      await sendToAI(whatSections, { networkZone: 'yellow' });
    }
  });
}
```

---

## Component Responsibilities

### Frontend Components

#### `RedForgeIDEPage.tsx`
- Main IDE layout (file tree, editor, right panel with tabs)
- Network zone selector (White/Yellow/Red)
- Personal clearance selector (U/C/S/TS)
- AI provider indicator (OpenAI, Red Forge LLM, None)
- Orchestrates file operations through ZenohClient
- Displays compliance warnings
- Right panel with Weaver AI and Audit tabs

#### `WeaverAssistant.tsx` ⭐ NEW
- AI chat interface in right panel
- Context-aware suggestions based on current file
- Network zone badge (shows which AI is active)
- Automatic WHAT extraction before sending queries
- Classification warnings displayed inline
- All queries logged to audit trail
- Simulated responses for demo (OpenAI/Red Forge LLM/Disabled)

#### `MDXRenderer.tsx`
- Parses `<What>`, `<How>`, `<Content>` tags
- Applies visual encoding (lines, icons, tints)
- Syntax highlighting for code blocks
- Right-click "Extract for AI" menu
- "Ask Weaver" context menu for selected text

#### `AuditTrailPanel.tsx`
- Live stream of audit events in right panel tab
- Last 20 operations shown
- Color-coded by decision (green/red/yellow)
- Expandable detail view
- Export to JSON button

#### `SecuritySimulator.tsx`
- Pre-defined scenarios (Startup, SAAB, Air-gapped)
- Shows what content is accessible
- Explains filtering logic
- Demonstrates AI access restrictions per network

### Core Libraries

#### `ComplianceEngine` (`src/lib/red-forge/compliance.ts`)
**Responsibility**: Validate all operations against user context and classification rules.

```typescript
class ComplianceEngine {
  constructor(private auditDB: AuditDatabase) {}
  
  async validateOperation(op: Operation): Promise<Decision> {
    // 1. Check clearance vs classification
    const classification = this.parseClassification(op);
    if (classification.how > op.user.clearance) {
      await this.audit({ ...op, decision: 'blocked', reason: 'Insufficient clearance' });
      return { allowed: false, reason: 'Insufficient clearance for HOW content' };
    }
    
    // 2. Check network zone restrictions
    if (op.type === 'export' && op.user.networkZone === 'white') {
      await this.audit({ ...op, decision: 'blocked', reason: 'Cannot export from White network' });
      return { allowed: false, reason: 'External network cannot export classified content' };
    }
    
    // 3. Detect keyword violations (HOW in WHAT)
    const warnings = this.detectKeywords(op.content);
    
    // 4. Log decision
    await this.audit({ ...op, decision: 'allowed', warnings });
    
    return { allowed: true, warnings };
  }
  
  private parseClassification(op: Operation): DualClassification {
    // Parse frontmatter or inline tags
    const frontmatter = extractFrontmatter(op.content);
    return frontmatter.classification || { what: 'UNCLASSIFIED', how: 'UNCLASSIFIED' };
  }
  
  private detectKeywords(content: string): ClassificationWarning[] {
    // Detect HOW keywords in WHAT sections
    const howKeywords = ['implements', 'algorithm', 'internally', 'optimized', 'buffer', 'cache'];
    const warnings: ClassificationWarning[] = [];
    
    // Parse <What> sections
    const whatSections = extractWhatSections(content);
    for (const section of whatSections) {
      for (const keyword of howKeywords) {
        if (section.includes(keyword)) {
          warnings.push({
            type: 'keyword_detection',
            severity: 'high',
            message: `HOW keyword "${keyword}" found in WHAT section`,
            location: findLocation(section, keyword)
          });
        }
      }
    }
    
    return warnings;
  }
  
  private async audit(entry: AuditEntry) {
    await this.auditDB.add({
      timestamp: new Date(),
      ...entry
    });
  }
}
```

#### `ZenohClient` (`src/lib/red-forge/zenoh-client.ts`)
**Responsibility**: Mock Zenoh operations with compliance interception.

```typescript
class ZenohClient {
  constructor(
    private compliance: ComplianceEngine,
    private storage: MockStorage,
    private userContext: UserContext
  ) {}
  
  async get(resource: string): Promise<string> {
    const decision = await this.compliance.validateOperation({
      type: 'read',
      resource,
      user: this.userContext
    });
    
    if (!decision.allowed) {
      throw new Error(decision.reason);
    }
    
    const content = await this.storage.get(resource);
    
    // Filter content based on clearance
    return this.filterByClassification(content, this.userContext.clearance);
  }
  
  async put(resource: string, content: string): Promise<void> {
    const decision = await this.compliance.validateOperation({
      type: 'write',
      resource,
      content,
      user: this.userContext
    });
    
    if (!decision.allowed) {
      throw new Error(decision.reason);
    }
    
    await this.storage.put(resource, content);
  }
  
  private filterByClassification(content: string, clearance: SecurityLevel): string {
    // Remove sections above clearance level
    const parsed = parseMarkdownWithClassification(content);
    return parsed.filter(section => section.classification.how <= clearance)
      .map(s => s.content)
      .join('\n\n');
  }
}
```

#### `AuditDatabase` (`src/lib/red-forge/audit-storage.ts`)
**Responsibility**: Persistent audit trail using IndexedDB.

```typescript
class AuditDatabase {
  private db: IDBPDatabase;
  
  async add(entry: AuditEntry): Promise<void> {
    await this.db.add('auditLog', {
      id: generateId(),
      timestamp: entry.timestamp,
      operation: entry.operation,
      resource: entry.resource,
      decision: entry.decision,
      reason: entry.reason,
      warnings: entry.warnings,
      user: entry.user
    });
  }
  
  async getRecent(n: number): Promise<AuditEntry[]> {
    return await this.db.getAll('auditLog', undefined, n);
  }
  
  async exportJSON(): Promise<string> {
    const all = await this.db.getAll('auditLog');
    return JSON.stringify(all, null, 2);
  }
}
```

---

## Weaver AI Assistant Integration

### Overview

The Weaver AI assistant is integrated into the Red Forge IDE as a right panel tab, providing context-aware help while respecting classification boundaries.

### AI Provider Selection (Network-Based)

| Network Zone | AI Provider        | Authentication | API Access |
|--------------|-------------------|----------------|------------|
| White (🌐)   | OpenAI (cloud)    | API key        | Internet   |
| Yellow (🏢)  | Red Forge LLM     | BankID         | On-prem    |
| Red (🔒)     | Disabled          | N/A            | None       |

### Safety Features

**1. Automatic WHAT Extraction**
```typescript
// User asks: "How do I use the Publisher API?"
async function handleAIQuery(query: string, currentFile: string) {
  // 1. Extract WHAT sections from current file
  const whatContent = await zenohClient.exportForAI(currentFile);
  
  // 2. Check for HOW keyword leaks
  if (whatContent.warnings.length > 0) {
    showWarningDialog(whatContent.warnings);
  }
  
  // 3. Send to AI with WHAT context only
  const response = await sendToAI({
    query,
    context: whatContent.whatContent,
    networkZone: userContext.networkZone
  });
  
  // 4. Log to audit trail
  await auditDB.add({
    operation: 'ai_query',
    resource: currentFile,
    decision: 'allowed',
    user: userContext
  });
  
  return response;
}
```

**2. Network Zone Enforcement**
- White network: Queries go to OpenAI API (simulated in demo)
- Yellow network: Queries go to Red Forge LLM (simulated in demo)
- Red network: AI completely disabled, manual declassification only

**3. Audit Trail Integration**
All AI interactions are logged with full metadata.

### UI Layout

**Right Panel with Tabs**
```
┌─────────────────────────────┐
│ [🤖 Weaver] [📋 Audit]      │ ← Tabs
├─────────────────────────────┤
│  🏢 Yellow Network          │ ← Network indicator
│  🔥 Red Forge LLM Active    │
│                             │
│  💬 Chat History            │
│  User: How do I use...      │
│  Weaver: Based on WHAT...   │
│                             │
│  [ Type your question...  ] │ ← Input
│  [Send] [Extract WHAT]      │
│                             │
│  ⚠️ 2 HOW keywords detected │ ← Warnings
└─────────────────────────────┘
```

### Simulated AI Responses (Demo)

**OpenAI (White)**: Generic responses, no proprietary context  
**Red Forge LLM (Yellow)**: Context-aware using WHAT sections  
**Disabled (Red)**: AI panel shows "🔒 Air-gapped - AI Disabled"

---

## Classification System

### Dual WHAT/HOW Classification

**WHAT (Capability/Interface)**: What the system can do, observable from outside.
**HOW (Implementation)**: How it's built, internal details.

```markdown
---
classification:
  what: UNCLASSIFIED
  how: SECRET
---

<What>
This API allows publishing messages to topics with QoS guarantees.
</What>

<How>
Implementation uses Zenoh PUT with MessagePack serialization, 
AES-256-GCM encryption, and 3-retry exponential backoff.
</How>
```

### Security Levels

1. **UNCLASSIFIED**: Public information, shareable externally
2. **CONFIDENTIAL**: Internal company information
3. **SECRET**: Sensitive implementation details, competitive advantage
4. **TOP_SECRET**: National security, cryptographic keys

### Network Zones

1. **White Network (🌐)**: Internet-connected, OpenAI API access
2. **Yellow Network (🏢)**: On-premises, Red Forge LLM access
3. **Red Network (🔒)**: Air-gapped, no AI, manual declassification only

---

## File Structure

```
balans-website/
├── RED-FORGE-ARCHITECTURE.md           # This file
├── src/
│   ├── lib/red-forge/
│   │   ├── types.ts                     # All TypeScript interfaces
│   │   ├── design-tokens.ts             # Colors, icons, theme
│   │   ├── compliance.ts                # ComplianceEngine
│   │   ├── zenoh-client.ts              # Mock Zenoh with compliance
│   │   ├── mock-storage.ts              # In-memory filesystem
│   │   └── audit-storage.ts             # IndexedDB wrapper
│   ├── components/red-forge/
│   │   ├── DemoData.ts                  # Example classified files
│   │   ├── MDXRenderer.tsx              # Classification-aware markdown
│   │   ├── WeaverAssistant.tsx          # AI chat panel (NEW)
│   │   ├── AuditTrailPanel.tsx          # Audit stream panel (NEW)
│   │   └── SecuritySimulator.tsx        # Scenario testing
│   ├── hooks/
│   │   └── useComplianceContext.tsx     # React context for compliance
│   └── pages/
│       └── RedForgeIDEPage.tsx          # Main IDE layout (with right panel tabs)
└── package.json
```

---

## Security Rules

### Clearance Checks

```typescript
function canAccess(contentClassification: SecurityLevel, userClearance: SecurityLevel): boolean {
  const hierarchy = ['UNCLASSIFIED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'];
  const contentLevel = hierarchy.indexOf(contentClassification);
  const userLevel = hierarchy.indexOf(userClearance);
  return userLevel >= contentLevel;
}
```

### Network Zone Restrictions

| Network Zone | AI Access       | Export Allowed | Import Allowed |
|--------------|-----------------|----------------|----------------|
| White        | OpenAI (cloud)  | No             | Yes            |
| Yellow       | Red Forge LLM   | WHAT only      | Yes            |
| Red          | None            | No             | Manual review  |

### Keyword Detection

**HOW Keywords** (trigger warnings in WHAT sections):
- Technical: `implements`, `algorithm`, `internally`, `optimized`, `caches`, `buffers`
- Libraries: `uses [library]`, `depends on`, `integrates with`
- Numbers: Buffer sizes, retry counts, cryptographic parameters

**WHAT Keywords** (safe for WHAT sections):
- Capabilities: `allows`, `enables`, `provides`, `supports`
- Behavior: `returns`, `accepts`, `expects`, `produces`
- Contracts: `interface`, `API`, `contract`, `specification`

---

## Demo Scenarios

### 1. Startup Day 1 (White Network, UNCLASSIFIED)
- **Context**: New employee onboarding
- **Clearance**: UNCLASSIFIED
- **Network**: White (internet)
- **Can Access**: Public API docs, tutorials
- **Cannot Access**: Implementation details, internal architecture
- **AI**: Can use OpenAI for public content

### 2. SAAB Contractor (Yellow Network, CONFIDENTIAL)
- **Context**: External contractor working on integration
- **Clearance**: CONFIDENTIAL
- **Network**: Yellow (on-prem)
- **Can Access**: WHAT sections, public HOW up to CONFIDENTIAL
- **Cannot Access**: SECRET implementation details
- **AI**: Can use Red Forge LLM for CONFIDENTIAL WHAT sections

### 3. Air-gapped R&D (Red Network, SECRET)
- **Context**: Core team developing proprietary algorithms
- **Clearance**: SECRET
- **Network**: Red (air-gapped)
- **Can Access**: Everything up to SECRET
- **Cannot Access**: TOP_SECRET national security content
- **AI**: No AI, manual declassification only

---

## Success Metrics

### Demo Completeness
- [ ] User can switch network zones and see content filtering
- [ ] User can adjust personal clearance and observe access changes
- [ ] All file operations logged to audit trail
- [ ] Audit trail persists across page refreshes
- [ ] Extract for AI workflow functional with keyword detection
- [ ] Security scenarios pre-configured and demonstrable

### Code Quality
- [ ] All operations go through ComplianceEngine (no bypasses)
- [ ] Audit log is immutable (IndexedDB, no deletions)
- [ ] Classification parsing handles edge cases (untagged content, mixed sections)
- [ ] UI responds gracefully to blocked operations (error messages, not crashes)

### Documentation
- [ ] This architecture doc is complete and accurate
- [ ] All core classes have inline JSDoc comments
- [ ] Complex functions have explanatory comments
- [ ] Demo scenarios documented in SecuritySimulator

---

## Future Work (Post-TypeScript Tracer)

### Phase 2: Rust/WASM Compliance Core
- Port `ComplianceEngine` to Rust for performance + security
- Compile to WASM for browser execution
- Cryptographic verification of audit log integrity

### Phase 3: Real Zenoh Integration
- Replace mock Zenoh with real Zenoh-TS bindings
- Data diode enforcement (one-way flow Yellow → White)
- Chronicle integration (TimescaleDB audit backend)

### Phase 4: Red Forge LLM Integration
- Real on-premises LLM (not simulated)
- BankID authentication
- OTP USB for air-gapped scenarios

### Phase 5: Multi-Platform Desktop
- Tauri or Electron wrapper for desktop (Mac/Windows/Linux)
- Stationary workstation deployment
- Physical network separation enforcement

---

## References

- **Lumen**: `compression/99-output/lumens/red-forge-system.md` (complete system design)
- **WeaverMesh Architecture**: `compression/1-sources/not_classified/knowledge/weavermesh-architecture/`
- **Design Sessions**: `balans-website/transcripts/2025-11-23-*.md`
- **Handoff Docs**: `.coordination/outbox/thorne/RED-FORGE-*-HANDOFF.md`

---

**Last Context Refresh**: [Will be updated after each AI context window reset]
**Implementation Status**: Phase 1 (Architecture Doc) → Phase 2 (Compliance Engine) next

