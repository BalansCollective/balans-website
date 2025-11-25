# Guardian Override UX Design Session

**Date:** 2025-11-24  
**Context:** Red Forge shows "Override & dela ändå" button but it's not implemented - should we allow overrides at all?  
**Participants:** Sam (vision), Thorne (UX/security), Morgan (compliance/policy)  
**Status:** 🎨 Design decisions documented

---

## Problem Statement

**Current broken UX:**

```
User writes:
  <What>Performance: 45ms latency, 99.9% accuracy</What>

Flow:
1. User clicks "Send to AI"
2. Guardian AI reviews content
3. Detects: "Specific performance metrics in WHAT sections"
4. Blocks with message: "🚫 Blockerad: Specific performance metrics in WHAT sections
   
   💡 [Override & dela ändå] [Avbryt]"

Problem: "Override & dela ändå" button doesn't work - it's just text!
```

**User's insight:** "Maybe we can add override options to the MDX instead of letting override happen in the chat?"

**Core tension:**
- Guardian exists to prevent classification leaks
- But false positives happen (not all metrics are classified)
- Users need escape hatch for legitimate disclosures
- Escape hatch can't undermine Guardian's purpose

---

## Design Group Discussion

### **SAM** (Product Vision)

> "Okay, so we have a fake button. That's embarrassing. But before we implement it, let's ask: WHY would someone override Guardian?
> 
> **Legitimate reasons:**
> - False positive (metric isn't actually classified)
> - Intentional declassification (marketing wants to share this)
> - Document is already public (updating old CONOPS)
> 
> **Illegitimate reasons:**
> - User doesn't understand classification rules
> - User is frustrated and clicking through warnings
> - User is malicious (trying to leak)
> 
> If we make override too easy, we train users to ignore Guardian. If we make it too hard, they'll work around it (copy content to external LLM without Guardian). We need the Goldilocks zone."

### **THORNE** (UX + Security)

> "Here's what bothers me: the override happens AFTER Guardian catches the violation. That's reactive defense. We're playing whack-a-mole.
> 
> What if we shift left? Instead of 'Guardian blocks → user overrides,' what about 'Guardian suggests fix → user chooses → send clean version'?
> 
> **Proposed flow:**
> 
> 1. Guardian detects violation in MDX
> 2. Returns 3 options:
>    - **Fix A:** Move to HOW section (recommended)
>    - **Fix B:** Generalize the WHAT (remove specifics)
>    - **Fix C:** Explicitly declassify (with justification)
> 3. User picks a fix and updates the MDX file
> 4. Resend to AI (Guardian re-checks)
> 
> **Key insight:** User fixes the SOURCE document, not just bypassing Guardian for this one message. The MDX file in git becomes the audit trail."

### **MORGAN** (Compliance + Policy)

> "I like Thorne's direction, but we need to be careful with 'explicitly declassify.' That sounds like user can unilaterally decide what's classified. That's not how defense classification works.
> 
> In real classified environments:
> - Original Classification Authority (OCA) decides what's SECRET/CONFIDENTIAL
> - Derivative classifiers apply those rules
> - Declassification requires OCA approval (or 25-year auto-declassify)
> 
> But Red Forge is a DEMO. We're not handling REAL classified data. We're teaching the PATTERN. So we can simplify.
> 
> **Proposal:** Three-tier override system:
> 
> **Tier 1: No override needed** (Low severity)
> - Guardian suggests improvement but doesn't block
> - Example: 'Could be more precise' or 'Consider adding context'
> - User can ignore or apply suggestion
> 
> **Tier 2: Override with justification** (Medium severity)
> - Guardian blocks, offers 3 fixes (Move to HOW, Generalize, Declassify)
> - If user chooses 'Declassify,' requires `declassify="reason"` attribute
> - Logged in audit trail, visible in git history
> 
> **Tier 3: Hard block** (High severity)
> - Guardian blocks, NO override option
> - Example: Actual SECRET code snippets, crypto keys, PII
> - User MUST fix the content (can't just justify it away)
> 
> This way, we teach the right habits: 'You can declassify with justification, but you can't share crypto keys no matter what.'"

### **SAM**

> "I like the three-tier system. But let's ground this in the actual Red Forge use case. What are the REAL violations we expect?
> 
> **Common violations (Medium severity - allow override):**
> - Performance metrics in WHAT (might be marketing material)
> - Team names / project codenames (might be public knowledge)
> - Architecture diagrams (might be intentional disclosure for partners)
> 
> **Rare violations (High severity - hard block):**
> - Crypto keys, passwords, API tokens (never justified)
> - PII (names, addresses, unless consent documented)
> - Actual weapon specifications (if real defense data)
> 
> For the DEMO, we're mostly dealing with Medium severity. BirdTurret CONOPS is fictional - there's no REAL classified data. So the override flow is the main teaching moment."

### **THORNE**

> "Okay, so here's the concrete UX. When Guardian detects a Medium severity violation:
> 
> **Instead of showing:**
> ```
> 🚫 Blockerad: Specific performance metrics in WHAT sections
> 💡 [Override & dela ändå] [Avbryt]
> ```
> 
> **Show this:**
> ```
> 🛡️ Guardian Detected Classification Issue
> 
> Issue: Specific performance metrics (45ms latency, 99.9% accuracy) 
>        in WHAT section may reveal implementation details.
> 
> ┌─ Recommended Fixes ─────────────────────────────────┐
> │                                                      │
> │ 1. Move to HOW section (keeps specifics classified) │
> │    <How>Performance: 45ms latency, 99.9%...</How>   │
> │                                                      │
> │ 2. Generalize in WHAT (safe for public sharing)     │
> │    <What>Performance: Sub-second response...</What>  │
> │                                                      │
> │ 3. Explicitly declassify (requires justification)   │
> │    <What declassify="marketing-approved">            │
> │      Performance: 45ms latency, 99.9%...            │
> │    </What>                                           │
> │    Justification: [Text field]                       │
> │                                                      │
> └──────────────────────────────────────────────────────┘
> 
> [Apply Fix 1] [Apply Fix 2] [Apply Fix 3 & Justify] [Cancel]
> ```
> 
> **Buttons are REAL and functional:**
> - Fix 1/2: Update MDX content automatically, resubmit to Guardian
> - Fix 3: Show justification modal, then update MDX with `declassify` attribute
> - Cancel: Return to editing
> 
> **Key UX principle:** User never bypasses Guardian. They either fix the content or explicitly document why it's safe to share."

### **MORGAN**

> "Love it. But one addition: the `declassify` attribute should be VISIBLE in the MDX preview. Users need to see: 'This paragraph is marked as declassified.'
> 
> **Visual treatment for declassified blocks:**
> - Normal WHAT block: Blue line (UNCLASSIFIED)
> - Declassified WHAT block: Blue line + yellow warning stripe + 🔓 icon
> - Hover tooltip: 'Declassified: [justification]'
> 
> This way, when someone reviews the document later (or it goes through legal review), they can immediately see: 'Ah, this metric was intentionally disclosed for marketing, not an accidental leak.'"

### **THORNE**

> "Good catch. So declassified blocks are visually distinct. Let me sketch the full flow:
> 
> **Normal classification enforcement:**
> ```
> <What>Sub-second response time</What>  → Blue line (safe)
> <How>45ms average latency</How>        → Orange line (implementation detail)
> ```
> 
> **Declassified disclosure:**
> ```
> <What declassify="partner-briefing-2025-11">
>   Response time: 45ms average, 99.9% accuracy in field tests
> </What>
> ```
> 
> **Visual in preview:**
> - Left border: Blue + yellow warning stripe (dual color)
> - Icon: 🔓 (unlocked)
> - Hover: 'Declassified for partner-briefing-2025-11'
> 
> **Audit trail:**
> - Git commit shows who added `declassify` attribute
> - Justification is in the attribute (searchable, reviewable)
> - Legal/security can grep for `declassify=` to find all intentional disclosures"

### **SAM**

> "Perfect. Now, what about High severity violations? How do we handle hard blocks?
> 
> Example: User accidentally pastes an API key into WHAT section. Guardian detects it. What happens?"

### **MORGAN**

> "Hard block means NO declassify option. Guardian shows:
> 
> ```
> 🚫 CRITICAL: API key detected in WHAT section
> 
> This cannot be shared. Remove the API key immediately.
> 
> Detected pattern: sk-proj-xxxxxxxxxxxxx
> Location: Line 42 in <What> block
> 
> [Remove & Retry] [Cancel]
> ```
> 
> No justification field, no override button. User MUST fix it.
> 
> **High severity triggers:**
> - Regex matches for keys: `sk-proj-`, `AKIA`, `ghp_`, etc.
> - PII patterns: Email addresses, phone numbers (unless in contact section)
> - Crypto material: `-----BEGIN PRIVATE KEY-----`
> - Banned terms: Nuclear material formulas, export-controlled tech specs
> 
> For the demo, we can simulate this with placeholder detection. In production, you'd integrate with secret scanners (GitGuardian, TruffleHog)."

### **THORNE**

> "Agreed. So our severity tiers:
> 
> **Low (Suggestion only):**
> - Guardian shows suggestion in chat
> - User can ignore
> - No blocking
> 
> **Medium (Soft block with fixes):**
> - Guardian blocks send
> - Shows 3 fix options (Move to HOW, Generalize, Declassify)
> - User picks a fix, updates MDX, resends
> 
> **High (Hard block):**
> - Guardian blocks send
> - Shows error + specific pattern detected
> - No declassify option
> - User MUST remove the sensitive data
> 
> **Implementation note:** Severity is determined by the AI safety review. We'll need to update `ai-safety-review.ts` to return severity level, not just binary approved/rejected."

### **SAM**

> "Okay, I'm sold. One last question: What if the user disagrees with Guardian's assessment? Like, they think 'This metric isn't classified' but Guardian says it is?
> 
> In that case, the declassify option is the escape hatch. They add `declassify='not-actually-classified'` and document their reasoning. Later, if legal/security disagrees, they can review the git history and have a conversation.
> 
> But we need to make it CLEAR: declassify doesn't mean 'ignore Guardian.' It means 'document why this is safe to share despite Guardian's concern.'"

### **MORGAN**

> "Exactly. The key is: Guardian creates a decision point, not a bottleneck. User must consciously choose:
> 
> - 'Guardian is right, I'll fix this' (Move to HOW, Generalize)
> - 'Guardian is wrong, here's why' (Declassify with justification)
> - 'Guardian caught something critical, I need to remove it' (Hard block)
> 
> No clicking through warnings. No fake buttons. Every override is a documented decision."

---

## Design Decisions (Final)

### **1. Three-Tier Severity System**

**Low Severity (Suggestions):**
- Guardian shows improvement suggestions in chat
- Does NOT block sending to AI
- User can apply or ignore
- Examples: Vague language, missing context, unclear structure

**Medium Severity (Soft Block with Fixes):**
- Guardian blocks sending to AI
- Shows 3 fix options:
  1. **Move to HOW** (recommended for implementation details)
  2. **Generalize WHAT** (remove specifics, keep concept)
  3. **Declassify** (requires justification attribute)
- User picks a fix, updates MDX, resends
- Examples: Performance metrics in WHAT, team names, architecture diagrams

**High Severity (Hard Block):**
- Guardian blocks sending to AI
- Shows specific pattern detected + location
- NO declassify option
- User MUST remove sensitive data
- Examples: API keys, passwords, crypto keys, PII, actual SECRET code

### **2. Declassify Attribute Syntax**

**Attribute format:**
```markdown
<What declassify="brief-descriptive-reason">
  Content that would normally be classified...
</What>
```

**Examples:**
```markdown
<What declassify="marketing-approved-2025-11">
  Performance: 45ms latency, 99.9% accuracy
</What>

<What declassify="partner-briefing-slide-12">
  Architecture: Microservices with Zenoh pub/sub backbone
</What>

<What declassify="already-public-in-v1-conops">
  Previous system used shotgun-based interception
</What>
```

**Validation rules:**
- Justification must be 3+ words (not just "ok" or "override")
- Should reference WHY disclosure is safe (marketing, public info, partner brief)
- Git history preserves who added it, when, and in what context

### **3. Visual Treatment for Declassified Blocks**

**Normal WHAT block (UNCLASSIFIED):**
- Blue left border (4px, `#60a5fa`)
- No special indicators
- Tooltip: "WHAT: Public interface (UNCLASSIFIED)"

**Declassified WHAT block:**
- Dual-color left border: Blue + yellow warning stripe (2px blue, 2px yellow, alternating or side-by-side)
- 🔓 Icon in top-left corner
- Subtle yellow background tint (`bg-yellow-950/5`)
- Tooltip: "WHAT: Declassified - [justification]"

**Visual in Monaco editor:**
```
┃  <What declassify="marketing-approved">
┃    Performance: 45ms latency
┃  </What>
```
(┃ = dual-color border: blue + yellow)

**Visual in MDX preview:**
```
┌─ 🔓 WHAT (Declassified: marketing-approved) ──┐
│                                                │
│  Performance: 45ms latency, 99.9% accuracy    │
│                                                │
└────────────────────────────────────────────────┘
```

### **4. Guardian Blocking UX (Medium Severity)**

**Old broken UX:**
```
🚫 Blockerad: Specific performance metrics in WHAT sections

💡 [Override & dela ändå] [Avbryt]
```

**New functional UX:**
```
🛡️ Guardian Detected Classification Issue

Issue: Specific performance metrics (45ms latency, 99.9% accuracy) 
       in WHAT section may reveal implementation details.

Recommended Fixes:

1. Move to HOW section
   <How>Performance: 45ms latency, 99.9% accuracy</How>
   
2. Generalize in WHAT
   <What>Performance: Sub-second response time, high accuracy</What>
   
3. Explicitly declassify (requires justification)
   <What declassify="[reason]">Performance: 45ms latency...</What>

[Apply Fix 1] [Apply Fix 2] [Apply Fix 3] [Cancel]
```

**Button behaviors:**
- **Apply Fix 1/2:** Automatically update MDX content, resubmit to Guardian
- **Apply Fix 3:** Show justification modal:
  ```
  ┌─ Justify Declassification ──────────────────┐
  │                                              │
  │ Why is it safe to share this information?   │
  │                                              │
  │ [Text field: marketing-approved-2025-11]    │
  │                                              │
  │ Examples:                                    │
  │ - marketing-approved                         │
  │ - partner-briefing-slide-12                  │
  │ - already-public-in-v1-conops                │
  │                                              │
  │ [Confirm & Apply] [Cancel]                   │
  └──────────────────────────────────────────────┘
  ```
- **Cancel:** Return to editing (file not sent)

### **5. Guardian Blocking UX (High Severity)**

**Example: API key detected**
```
🚫 CRITICAL: API key detected in WHAT section

This cannot be shared. Remove the API key immediately.

Detected pattern: sk-proj-xxxxxxxxxxxxx
Location: Line 42 in <What> block

Security note: API keys must never be included in documentation,
even in classified sections. Use placeholder text instead.

[Remove & Retry] [Cancel]
```

**No declassify option for:**
- API keys, passwords, tokens
- Cryptographic keys or certificates
- PII (without documented consent)
- Real SECRET/TOP_SECRET code (if handling actual classified data)

### **6. Audit Trail Requirements**

**Git history captures:**
- Who added `declassify` attribute (commit author)
- When it was added (commit timestamp)
- Context (commit message, surrounding changes)
- Justification (in the attribute itself)

**Searchability:**
```bash
# Find all declassified content
git grep 'declassify='

# Find specific justification
git grep 'declassify="marketing-approved"'

# See when it was added
git log -p --all -S 'declassify="marketing-approved"'
```

**Legal/security review workflow:**
1. Export all declassified blocks: `git grep 'declassify=' > declassified-content.txt`
2. Review justifications for legitimacy
3. If questionable, check git blame to see who added it
4. Have conversation with team member about classification policy

### **7. Implementation Phases**

**Phase 1 (MVP - this week):**
- ✅ Remove fake "Override & dela ändå" button
- ✅ Implement Medium severity blocking with 3 fix options
- ✅ Add `declassify` attribute parsing in MDX parser
- ✅ Visual treatment for declassified blocks (dual-color border + 🔓 icon)
- ✅ Justification modal for Fix 3

**Phase 2 (Polish - next week):**
- Add High severity hard blocks (API key detection, etc.)
- Improve AI safety review to return severity levels
- Add hover tooltips showing justification
- Add audit trail export (list all declassified blocks)

**Phase 3 (Production - future):**
- Integrate with secret scanners (GitGuardian, TruffleHog)
- Add admin dashboard for reviewing declassifications
- Policy engine for custom classification rules
- RBAC for who can declassify what severity levels

---

## Key Principles (Summary)

1. **No fake buttons** - Every button does what it says
2. **Fix the source** - Update MDX file, not just bypass Guardian
3. **Document decisions** - Declassify requires justification
4. **Visible audit trail** - Git history + searchable attributes
5. **Graduated response** - Suggestions → Soft block → Hard block
6. **Teach correct habits** - Users learn classification through interaction

---

## API Changes Required

**Update `ai-safety-review.ts`:**
```typescript
export interface SafetyReviewResult {
  approved: boolean;
  severity: 'low' | 'medium' | 'high';
  warnings: Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    location?: { line: number; column: number };
    suggestedFixes?: Array<{
      type: 'move-to-how' | 'generalize' | 'declassify';
      description: string;
      replacement?: string; // Auto-generated fix
    }>;
  }>;
}
```

**Update `MDXRenderer.tsx`:**
```typescript
interface ClassificationBlockProps {
  type: 'what' | 'how' | 'untagged';
  level: SecurityLevel;
  content: string;
  declassify?: string; // Justification for declassification
}

// Parse declassify attribute
const whatRegex = /<What(?:\s+declassify="([^"]+)")?>(.+?)<\/What>/gis;
```

**Update `RedForgeIDEPage.tsx`:**
```typescript
// When Guardian blocks, show fix options
if (safetyResult.severity === 'medium') {
  showFixOptionsModal(safetyResult.warnings[0].suggestedFixes);
} else if (safetyResult.severity === 'high') {
  showHardBlockModal(safetyResult.warnings[0]);
}
```

---

## Success Metrics

**User behavior we want to see:**
- ✅ Users apply Fix 1/2 (move to HOW, generalize) > 70% of the time
- ✅ Declassify used sparingly (< 30% of Guardian blocks)
- ✅ Declassify justifications are descriptive (> 3 words, reference context)
- ✅ Zero hard block bypasses (users remove sensitive data)

**User behavior we want to avoid:**
- ❌ Users frustrated, work around Guardian (copy to external LLM)
- ❌ Users add generic justifications ("override", "ok", "ignore")
- ❌ Users habitually click Fix 3 without considering Fix 1/2

---

## Open Questions

1. **Justification validation:** Should we require specific keywords (e.g., "marketing", "public", "partner") or allow free-form text?
2. **Declassify review:** Should declassified blocks require periodic re-review (e.g., every 6 months)?
3. **Team vs individual declassify:** Should some declassifications require team lead approval?
4. **Demo vs production:** In demo, should we make hard blocks more lenient (educational mode)?

---

## Session Duration

~35 minutes (design discussion + API planning + UX sketches)

**Key Insight:** Override is not about bypassing Guardian - it's about documenting why Guardian's concern doesn't apply in this case. The `declassify` attribute makes that documentation explicit, searchable, and auditable.

