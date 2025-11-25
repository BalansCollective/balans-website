# Design Session: Personal Clearance + Network Simulation

**Date:** 2025-11-23  
**Session Type:** Security Model + UX  
**Trigger:** Sam wants to simulate different networks/clearances and show information filtering  
**Participants:** Sam (Product Owner), Thorne (Implementation), Morgan (UX), Casey (Security)

---

## 🎯 Requirements

**From Sam:**
1. Simulate being on different networks (White/Yellow/Red)
2. Personal classification level (different users see different things)
3. Allow editing PUBLIC version of classified docs
4. Propagate edits to higher classifications (if secure)
5. Add Weaver to right sidebar
6. Show which (simulated) AI is being used

---

## 🔐 Casey's Security Model

### Personal Clearance Levels

**Clearance determines what you can SEE:**
- **Public** (lowest) - Can see PUBLIC content only
- **Confidential** - Can see PUBLIC + RESTRICTED content
- **Secret** - Can see PUBLIC + RESTRICTED + CLASSIFIED content

**Network determines what AI you can USE:**
- **White Network** - Can use OpenAI/Claude (PUBLIC content only)
- **Yellow Network** - Can use Red Forge LLM (PUBLIC + RESTRICTED)
- **Red Network** - No AI (PUBLIC + RESTRICTED + CLASSIFIED, human only)

**Combined filtering:**
```
User on Yellow Network with Confidential clearance:
- Can SEE: PUBLIC, RESTRICTED (but not CLASSIFIED)
- Can USE AI: Red Forge LLM (on PUBLIC + RESTRICTED content)
- CANNOT USE AI: OpenAI/Claude (network restriction)
- CANNOT SEE: CLASSIFIED content (clearance restriction)
```

---

### Edit Propagation Security Model

**Problem:** User edits PUBLIC version, should changes propagate to RESTRICTED/CLASSIFIED versions?

**Casey's Analysis:**

**Safe propagation (✅):**
```markdown
Original CLASSIFIED doc:
<Public>
API encrypts data.
</Public>

<Restricted>
Uses AES-256 in CBC mode.
</Restricted>

<Classified>
Key: HKDF-SHA256(salt="x7k2...")
</Classified>

User (Public clearance) edits PUBLIC section:
<Public>
API encrypts data using industry-standard algorithms.
</Public>

✅ SAFE: Change only affects PUBLIC section
✅ Propagation: Update PUBLIC section in all versions
✅ No leak: User never sees RESTRICTED/CLASSIFIED content
```

**Unsafe propagation (❌):**
```markdown
User (Public clearance) adds new content:
<Public>
API encrypts data.
New paragraph: Implementation uses hardware acceleration.
</Public>

❌ DANGER: "hardware acceleration" might be HOW detail
❌ Where to classify? User can't see RESTRICTED section to know
❌ Risk: User accidentally adds RESTRICTED info to PUBLIC section
```

**Solution: Whitelist-based propagation**
1. User edits PUBLIC content
2. AI reviews changes (Red Forge LLM)
3. AI flags: "New content detected: 'hardware acceleration'"
4. AI asks: "Is this PUBLIC or RESTRICTED information?"
5. User with higher clearance reviews (or auto-approve if pure typo fix)
6. Approved changes propagate to all versions

**Implementation:**
- Track edit type: `typo_fix` (safe), `content_addition` (needs review), `content_deletion` (needs review)
- Auto-approve typo fixes (spelling, grammar, formatting)
- Require review for content changes (new paragraphs, technical details)

---

## 🎨 Morgan's UX Design

### Top Bar: Personal Profile

```
┌──────────────────────────────────────────────────────────────┐
│ 🔥 Red Forge IDE                                              │
│                                                               │
│ 👤 Sam Lindgren                     🌐 Network: Yellow        │
│ 🔓 Clearance: Confidential          🤖 AI: Red Forge LLM     │
│                                                               │
│ [Change Network ▾]  [Change Clearance ▾]                     │
└──────────────────────────────────────────────────────────────┘
```

**Dropdowns:**

**Network Selector:**
```
🌐 White Network (Internet)
   ✅ OpenAI/Claude available
   ❌ Red Forge LLM (requires Yellow)
   
🏢 Yellow Network (Internal) ← Selected
   ❌ OpenAI/Claude (blocked)
   ✅ Red Forge LLM available
   
🔒 Red Network (Air-Gapped)
   ❌ OpenAI/Claude (blocked)
   ❌ Red Forge LLM (blocked)
   ✅ Human review only
```

**Clearance Selector:**
```
🟢 Public (UNCLASSIFIED)
   Can see: PUBLIC content
   
🟡 Confidential ← Selected
   Can see: PUBLIC, RESTRICTED
   
🔴 Secret
   Can see: PUBLIC, RESTRICTED, CLASSIFIED
```

---

### Main Editor: Content Filtering

**View Mode: "Show as [Clearance Level]"**

```
┌─────────────────────────────────────────────────────────────┐
│ File: crypto-api.md                    View as: Confidential │
│                                                              │
│ [Edit Mode]  [Preview Mode]  [All Content]                  │
└─────────────────────────────────────────────────────────────┘

# Crypto API Documentation

🌐 │ API encrypts data using industry-standard algorithms.
    [Visible: You have PUBLIC clearance]

🏢 │ Implementation uses AES-256 in CBC mode with PKCS7 padding.
    [Visible: You have CONFIDENTIAL clearance]

🔒 │ [REDACTED - Requires SECRET clearance]
    [Hidden: Classified content exists but you cannot see it]
```

**Key UX elements:**
- **Visible content** - Normal text (you can see + edit)
- **[REDACTED]** - Placeholder (content exists but you can't see)
- **Icon indicator** - Shows classification level (🌐🏢🔒)
- **Edit restrictions** - Can only edit content you can see

---

### Right Sidebar: Weaver AI

```
┌─────────────────────────────────────────┐
│ 🕸️ Weaver AI                            │
├─────────────────────────────────────────┤
│ Current Context:                        │
│ • Network: Yellow (Red Forge LLM)       │
│ • Clearance: Confidential               │
│ • File: crypto-api.md                   │
│ • Visible: 2 sections (PUBLIC + RESTR)  │
│ • Hidden: 1 section (CLASSIFIED)        │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ > How can I make this function          │
│   UNCLASSIFIED?                         │
│                                         │
│ 🤖 Red Forge LLM analyzing...           │
│                                         │
│ To make this UNCLASSIFIED:              │
│ 1. Remove algorithm specifics (AES-256) │
│ 2. Remove mode details (CBC, PKCS7)     │
│ 3. Keep capability description only     │
│                                         │
│ Suggested edit:                         │
│ "Uses industry-standard encryption"     │
│                                         │
│ [Apply Suggestion]  [Ignore]            │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ 📊 Classification Status:               │
│ • PUBLIC: 45% of content                │
│ • RESTRICTED: 40% of content            │
│ • CLASSIFIED: 15% (hidden from you)     │
│                                         │
│ ⚠️ You have 3 untagged paragraphs       │
│ [Tag Content]                           │
└─────────────────────────────────────────┘
```

---

## 🧪 Demo Scenarios

### Scenario 1: User on Yellow Network (Confidential Clearance)

**Setup:**
- Network: Yellow (Red Forge LLM available)
- Clearance: Confidential (see PUBLIC + RESTRICTED)
- File: `crypto-api.md` (has PUBLIC + RESTRICTED + CLASSIFIED sections)

**What user sees:**
1. PUBLIC section (🌐) - Can see, can edit
2. RESTRICTED section (🏢) - Can see, can edit
3. CLASSIFIED section (🔒) - [REDACTED] placeholder

**AI interaction:**
1. User asks: "Explain this API"
2. Weaver shows: "🤖 Using Red Forge LLM (Yellow Network)"
3. AI response based on PUBLIC + RESTRICTED content only (no CLASSIFIED)
4. Chronicle logs: User=sam, Network=Yellow, Clearance=Confidential, Content=PUBLIC+RESTRICTED

---

### Scenario 2: User on White Network (Public Clearance)

**Setup:**
- Network: White (OpenAI/Claude available)
- Clearance: Public (see PUBLIC only)
- File: `crypto-api.md`

**What user sees:**
1. PUBLIC section (🌐) - Can see, can edit
2. [REDACTED] - Restricted content exists (can't see)
3. [REDACTED] - Classified content exists (can't see)

**AI interaction:**
1. User asks: "Explain this API"
2. Weaver shows: "🤖 Using OpenAI GPT-4 (White Network)"
3. AI response based on PUBLIC content only
4. User tries to ask about implementation
5. Weaver: "⚠️ Implementation details are RESTRICTED. Switch to Yellow Network to access."

---

### Scenario 3: Edit PUBLIC Content (Propagation)

**Setup:**
- User (Confidential clearance) edits PUBLIC section
- File has PUBLIC + RESTRICTED + CLASSIFIED versions

**Workflow:**
1. User edits PUBLIC section: Fixes typo "encyrpt" → "encrypt"
2. IDE detects: `typo_fix` (safe)
3. Auto-propagate to all versions
4. Chronicle logs: "Typo fix applied to PUBLIC section (auto-approved)"

**Alternative (content addition):**
1. User adds new sentence: "Uses hardware acceleration"
2. IDE detects: `content_addition` (needs review)
3. Weaver AI: "⚠️ New technical detail detected. Classify as PUBLIC or RESTRICTED?"
4. User (doesn't have authority): "I think it's PUBLIC"
5. IDE: "Flagged for review by user with SECRET clearance"
6. Pending review: Change NOT propagated until approved

---

## 📋 Implementation Checklist

### Phase 1: Network + Clearance Simulation (Today)

- [ ] Top bar: Network selector (White/Yellow/Red)
- [ ] Top bar: Clearance selector (Public/Confidential/Secret)
- [ ] Top bar: Current AI indicator (OpenAI/Red Forge/None)
- [ ] Content filtering: Show/hide sections based on clearance
- [ ] Content filtering: [REDACTED] placeholders for hidden content
- [ ] MDX renderer: Filter blocks by clearance level
- [ ] Update demo files: Add CLASSIFIED sections to existing files

### Phase 2: Weaver Integration (Today/Tomorrow)

- [ ] Right sidebar: Weaver panel (collapsible)
- [ ] Context display: Network, clearance, file, visible sections
- [ ] AI chat interface: Text input + response display
- [ ] AI indicator: Show which AI is being used (mock for now)
- [ ] Classification status: Show content breakdown (PUBLIC/RESTRICTED/CLASSIFIED)
- [ ] Warnings: Untagged content, classification suggestions

### Phase 3: Edit Propagation (Tomorrow)

- [ ] Detect edit type: typo_fix vs content_addition
- [ ] Auto-approve typo fixes (spelling, grammar, formatting)
- [ ] Flag content additions for review
- [ ] Weaver AI review: Suggest classification for new content
- [ ] Approval workflow: User with higher clearance reviews
- [ ] Chronicle logging: Track all edit propagations

---

## ✅ Next Steps (Priority Order)

1. **Network + Clearance selectors** (1 hour) - Top bar UI
2. **Content filtering logic** (1 hour) - Show/hide based on clearance
3. **Weaver sidebar** (2 hours) - Right panel with context + chat
4. **AI indicator** (30 min) - Show which AI is active
5. **Demo scenarios** (1 hour) - Test all combinations

**Estimated time: 5-6 hours**

Ready to start! 🚀


