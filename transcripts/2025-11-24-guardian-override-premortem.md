# Guardian Override UX: Pre-Mortem Session

**Date:** 2025-11-24  
**Context:** Before implementing the 3-tier override system, identify what will go wrong  
**Participants:** Sam (user behavior), Thorne (implementation reality), Morgan (policy edge cases), Raven (integration failures)  
**Method:** Pre-mortem ("Assume this failed spectacularly. Why?")  
**Status:** 🔍 Risk analysis complete

---

## Pre-Mortem Prompt

> "It's 3 months after launch. The Guardian override system is a disaster. Users hate it, security is compromised, and we're rewriting it. What went wrong?"

---

## Predicted Failures

### **THORNE** (Implementation Reality)

> "Okay, I'll start with the obvious: **The 'Apply Fix' buttons don't actually work reliably.**
> 
> **Problem 1: MDX parsing is fragile**
> 
> When Guardian suggests 'Move to HOW,' it needs to:
> 1. Parse the MDX to find the exact `<What>` block
> 2. Extract the content
> 3. Remove the `<What>` block
> 4. Insert a new `<How>` block in the right place
> 5. Preserve formatting, indentation, surrounding content
> 
> But MDX is complex:
> - Nested tags: `<What><details><summary>...</summary></details></What>`
> - Multi-line content with code blocks
> - Mixed syntax (markdown + JSX)
> - User might have typos: `<what>` (lowercase) or `<What >` (space before >)
> 
> Our regex-based parser will break on edge cases. User clicks 'Apply Fix 1' and... nothing happens. Or worse, it mangles their file.
> 
> **Problem 2: Concurrent edits**
> 
> User clicks 'Apply Fix 1' → We start parsing MDX → User switches to Monaco editor and starts typing → Our fix arrives and overwrites their new changes → User loses work → Rage quit.
> 
> We need edit locking or version tracking, which we don't have.
> 
> **Problem 3: Undo is broken**
> 
> User clicks 'Apply Fix 1' → Doesn't like the result → Wants to undo → But there's no undo stack in our demo IDE → They have to manually rewrite it or reload the file → Lost 10 minutes of work.
> 
> **Failure mode:** Users stop trusting 'Apply Fix' buttons. They manually edit instead, defeating the whole UX improvement."

### **SAM** (User Behavior)

> "I'll predict the human side: **Users will abuse declassify as a 'dismiss warning' button.**
> 
> **Problem 1: Justification fatigue**
> 
> First time: User writes thoughtful justification 'marketing-approved-2025-11-slide-12'
> Second time: User writes 'marketing-approved-v2'
> Third time: User writes 'marketing'
> Fourth time: User writes 'ok'
> 
> We said we'd validate justifications (3+ words), but that just trains users to write garbage: 'this is fine' or 'not actually classified'.
> 
> **Problem 2: Learned helplessness**
> 
> If Guardian blocks too often (high false positive rate), users learn: 'Guardian is annoying and wrong, I'll just declassify everything.'
> 
> They start adding `declassify='demo'` preemptively to avoid Guardian blocks. Audit trail is useless because every block is marked declassified.
> 
> **Problem 3: Social pressure**
> 
> User A: 'Hey, Guardian blocked my doc.'
> User B: 'Just add declassify="whatever", it goes through.'
> 
> Organizational culture shifts to 'Guardian is a checkbox, not a real security boundary.'
> 
> **Failure mode:** Declassify becomes meaningless. Security team can't distinguish legitimate disclosures from lazy overrides. Audit trail is polluted with junk justifications."

### **MORGAN** (Policy Edge Cases)

> "Let me hit you with the edge cases that will bite us:
> 
> **Problem 1: Dual classification confusion**
> 
> Guardian detects: 'Performance metrics in WHAT section'
> 
> But the file has dual classification:
> ```
> ---
> classification:
>   what: UNCLASSIFIED
>   how: CONFIDENTIAL
> ---
> ```
> 
> User says: 'Wait, WHAT is already UNCLASSIFIED! Why is Guardian blocking me from sharing unclassified information?'
> 
> They're right. If WHAT is declared UNCLASSIFIED in frontmatter, then specific metrics in WHAT should be fine. Guardian is applying CONFIDENTIAL rules to UNCLASSIFIED content.
> 
> **Problem 2: Declassify conflicts with frontmatter**
> 
> User adds:
> ```
> <What declassify='marketing'>
>   Performance: 45ms latency
> </What>
> ```
> 
> But frontmatter says:
> ```
> classification:
>   what: CONFIDENTIAL
>   how: SECRET
> ```
> 
> What's the effective classification of that block? Is it:
> - UNCLASSIFIED (because declassified)?
> - CONFIDENTIAL (because frontmatter)?
> - Invalid (conflict)?
> 
> We never defined the precedence rules.
> 
> **Problem 3: Partial declassification**
> 
> User wants to share:
> ```
> <What>
>   Performance: 45ms latency (UNCLASSIFIED)
>   Implementation: Uses Kalman filter (CONFIDENTIAL)
> </What>
> ```
> 
> Guardian blocks the whole block. But user only wants to declassify the first sentence. Our UX doesn't support partial declassification within a block.
> 
> They'd have to split into:
> ```
> <What declassify='marketing'>Performance: 45ms latency</What>
> <How>Implementation: Uses Kalman filter</How>
> ```
> 
> But Guardian's suggested fix is all-or-nothing.
> 
> **Problem 4: Team disagreement**
> 
> Engineer adds `declassify='not-actually-classified'` because they believe it's safe.
> Security reviewer sees it in PR and says: 'This is absolutely classified, you can't share this.'
> 
> We have no workflow for resolving disputes. It's just git comments arguing back and forth.
> 
> **Failure mode:** Classification rules become unclear. Teams argue about what's classified. Guardian's suggestions don't match organizational policy. Legal gets involved."

### **RAVEN** (Integration Failures)

> "I'll focus on the system-level failures:
> 
> **Problem 1: AI safety review is unreliable**
> 
> Guardian uses OpenRouter LLM to detect classification violations. But:
> - Rate limits (429 errors during demo)
> - API downtime (Guardian fails open or closed?)
> - Cost ($0.50 per review × 100 reviews/day = $50/day for demo)
> - Latency (2-3 seconds per review = slow UX)
> - Inconsistency (same content reviewed twice, different results)
> 
> User experience:
> - 'Send to AI' → Loading spinner → '429 Rate Limit' → User stuck
> - 'Send to AI' → Guardian blocks → User fixes → Resend → Guardian approves same content → Confusion
> 
> **Problem 2: Offline mode doesn't work**
> 
> User wants to work on airplane (no internet). Red Forge demo requires OpenRouter API for Guardian. User is blocked from sending ANYTHING to AI, even UNCLASSIFIED content, because Guardian can't run.
> 
> We should have local fallback rules, but we don't.
> 
> **Problem 3: Justification isn't validated server-side**
> 
> User adds `declassify='x'` directly in Monaco editor (bypassing our modal). We only validate in the 'Apply Fix 3' button. But if they edit the file manually, they can add any justification or none at all.
> 
> Security team finds:
> ```
> <What declassify=''>Performance: 45ms latency</What>
> <What declassify='a'>Team: Project REDACTED</What>
> <What declassify='💩'>Architecture: [detailed diagram]</What>
> ```
> 
> Audit trail is useless.
> 
> **Problem 4: No rollback for bad declassifications**
> 
> Legal review happens 6 months later. They find: 'This declassification was wrong, this should never have been shared.'
> 
> But the doc is already:
> - Sent to external LLM (OpenAI)
> - Possibly used to train models (if no opt-out)
> - Shared with partners
> - Published on website
> 
> Can't unring the bell. We need to prevent bad declassifications upfront, not audit them later.
> 
> **Problem 5: Demo vs production confusion**
> 
> Red Forge demo uses FICTIONAL data (BirdTurret). Users understand it's a demo. But then they want to try it with REAL data (actual defense project).
> 
> They paste REAL SECRET code into the demo. Guardian runs on OpenRouter (cloud LLM). Now REAL classified data is:
> - Sent to external API
> - Logged by OpenRouter
> - Potentially used for model training
> 
> Catastrophic security violation. Demo becomes production by accident.
> 
> **Failure mode:** Infrastructure failures make Guardian unreliable. Users work around it. Security violations happen. Demo bleeds into production use."

### **SAM**

> "Okay, these are all terrifying and plausible. Let me synthesize what I'm hearing:
> 
> **Category 1: Implementation complexity**
> - MDX parsing is fragile
> - Concurrent edits cause data loss
> - No undo/redo
> 
> **Category 2: User behavior**
> - Justification fatigue → garbage justifications
> - High false positive rate → users ignore Guardian
> - Social pressure → declassify becomes 'dismiss button'
> 
> **Category 3: Policy ambiguity**
> - Dual classification confusion (WHAT=U, HOW=C, Guardian blocks WHAT)
> - Declassify precedence unclear (attribute vs frontmatter)
> - Partial declassification not supported
> - No dispute resolution workflow
> 
> **Category 4: Infrastructure**
> - AI review unreliable (rate limits, cost, latency)
> - No offline mode
> - No server-side validation
> - Demo bleeds into production
> 
> So... which of these do we HAVE to solve before MVP? Which can we defer?"

---

## Risk Mitigation Strategy

### **CRITICAL (Must Fix Before MVP)**

**1. Prevent demo → production data leak**

**Mitigation:**
- Add big scary warning banner: '⚠️ DEMO ONLY - DO NOT USE WITH REAL CLASSIFIED DATA'
- Modal on first load: 'This is a demonstration using fictional BirdTurret data. Never paste real classified information.'
- Detect patterns of real classified data (e.g., actual SECRET markings, DoD document headers) and hard block

**Why critical:** Legal liability, security violation, career-ending mistake for user.

**2. Fail gracefully when AI review unavailable**

**Mitigation:**
- If OpenRouter API fails → Show clear error: 'Guardian AI unavailable. You can continue editing but cannot send to AI until Guardian is restored.'
- Add 'Offline Mode' toggle: Disables AI features, allows editing/preview only
- Cache last 10 Guardian reviews locally (IndexedDB) for offline reference

**Why critical:** Demo must work during live presentation. Can't rely on external API 100%.

**3. Validate declassify attribute on parse (not just on button click)**

**Mitigation:**
- MDX parser checks: `declassify` attribute must be ≥8 characters, contain letters (not just symbols)
- Show warning in preview if invalid: '⚠️ Invalid declassify justification (too short or empty)'
- Block sending to AI if any declassify attributes are invalid

**Why critical:** Audit trail must be meaningful. Can't allow `declassify=''` or `declassify='x'`.

### **HIGH PRIORITY (Fix Before Public Release)**

**4. Clarify dual classification + declassify precedence**

**Mitigation:**
- Document rule clearly: 
  - Frontmatter `what: UNCLASSIFIED` → WHAT blocks default to UNCLASSIFIED
  - Adding `declassify=` to already-UNCLASSIFIED block is redundant but allowed
  - Guardian should NOT block UNCLASSIFIED content (false positive)
- Update AI safety review prompt to respect frontmatter classification
- Add visual indicator: If WHAT is UNCLASSIFIED by frontmatter, show different icon (🌐 not 🔓)

**Why high priority:** Users will be confused and frustrated by blocking unclassified content. Erodes trust in Guardian.

**5. Add undo for 'Apply Fix' actions**

**Mitigation:**
- Store previous file content before applying fix
- Add 'Undo Last Fix' button (appears for 10 seconds after fix applied)
- Or use Monaco editor's built-in undo stack (if we can integrate it)

**Why high priority:** Users will lose work and blame the tool. Reduces willingness to use 'Apply Fix' buttons.

**6. Rate limit Guardian reviews (prevent cost explosion)**

**Mitigation:**
- Max 50 Guardian reviews per day per demo session
- Show counter: 'Guardian reviews: 23/50 today'
- If limit reached: 'Guardian review limit reached. You can still edit and preview, but cannot send new content to AI until tomorrow.'

**Why high priority:** Demo should not cost $100/day in API fees. Need to control costs.

### **MEDIUM PRIORITY (Can Defer to v2)**

**7. Support partial declassification within blocks**

**Mitigation (deferred):**
- For now, require users to split blocks manually
- Document pattern: 'To declassify part of a block, split into separate <What> and <How> tags'
- Future: Support sentence-level declassification: `<What><span declassify='...'>This sentence</span> but not this one</What>`

**Why deferrable:** Workaround exists (manual split). Complex to implement. Not blocking core use case.

**8. Team dispute resolution workflow**

**Mitigation (deferred):**
- For now, disputes resolved via git PR comments (standard code review)
- Document pattern: 'If security reviewer disagrees with declassification, request changes in PR'
- Future: Add 'Require Security Approval' flag for sensitive repos

**Why deferrable:** Demo is single-user. Team workflows are production concern.

**9. Improve Guardian false positive rate**

**Mitigation (deferred):**
- For now, accept some false positives (better safe than sorry)
- Collect data: Log all declassifications with justifications
- Analyze patterns: Which justifications are most common? Which are disputes?
- Future: Fine-tune AI safety review based on real usage patterns

**Why deferrable:** Need real usage data to improve. Can't optimize pre-launch.

### **LOW PRIORITY (Known Limitations)**

**10. MDX parsing edge cases**

**Acceptance:**
- Document limitations: 'Works with well-formed MDX. If auto-fix fails, edit manually.'
- Add fallback: If auto-fix fails, show 'Could not apply fix automatically. Here's the suggested change: [code snippet]. Copy/paste manually.'

**Why low priority:** Perfect parsing is hard. Manual fallback is acceptable for demo.

**11. Concurrent edit conflicts**

**Acceptance:**
- Document: 'Save your work before clicking Apply Fix'
- Add warning: If file modified since Guardian review, show 'File changed. Review again?'

**Why low priority:** Single-user demo. Concurrent edits rare. Production problem, not demo problem.

**12. No offline Guardian**

**Acceptance:**
- Document: 'Requires internet connection for Guardian AI review'
- Show clear error if offline: 'No internet connection. Guardian unavailable.'

**Why low priority:** Offline mode is complex. Most demos happen online. Acceptable limitation.

---

## Updated Design Decisions (Post-Risk Analysis)

### **1. Declassify Validation (Stricter)**

**Requirements:**
- Minimum 8 characters (not just 3 words)
- Must contain at least 2 alphabetic words (not just `declassify='12345678'`)
- No profanity or obvious junk (`declassify='asdfasdf'`, `declassify='whatever'`)

**Validation locations:**
- 'Apply Fix 3' button modal (pre-validation)
- MDX parser on render (warn if invalid)
- AI send blocker (cannot send if invalid declassify present)

**User feedback:**
```
❌ Invalid justification: "ok fine"

Justification must be descriptive (8+ characters, 2+ words).

Examples:
✅ marketing-approved-2025-11
✅ partner-briefing-slide-12
✅ already-public-in-v1-conops
❌ ok
❌ whatever
❌ 12345678
```

### **2. Guardian Failure Modes**

**If OpenRouter API fails:**
```
⚠️ Guardian AI Unavailable

Cannot perform safety review. Choose one:

1. [Edit Only] - Continue editing without AI features
2. [Retry] - Try Guardian again
3. [Basic Check] - Skip AI review (no classification validation)

Note: Basic Check allows UNCLASSIFIED content only.
```

**If rate limit exceeded:**
```
⚠️ Guardian Review Limit Reached (50/50 today)

You can still:
- Edit files
- Preview locally
- Save work

You cannot:
- Send to external AI
- Get new Guardian reviews

Limit resets in: 4 hours 32 minutes
```

### **3. Demo Safety Banner (Prevent Real Data Leaks)**

**On first load (modal):**
```
┌─ ⚠️ RED FORGE DEMO - READ BEFORE USING ─────────────────┐
│                                                          │
│  This is a DEMONSTRATION using fictional data.          │
│                                                          │
│  ❌ DO NOT paste real classified information            │
│  ❌ DO NOT use with actual defense projects             │
│  ❌ DO NOT assume demo security = production security   │
│                                                          │
│  This demo sends content to OpenRouter (cloud LLM).     │
│  Real classified data would be a security violation.    │
│                                                          │
│  [I Understand - Show Demo]                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Persistent banner (top of IDE):**
```
⚠️ DEMO ONLY - Fictional BirdTurret data - Do not use real classified info
```

**Secret scanner (basic patterns):**
- Detect: `SECRET//`, `CONFIDENTIAL//`, `TOP SECRET//` (actual classification markings)
- Detect: `DoD`, `DEPARTMENT OF DEFENSE`, `CLASSIFIED BY:`
- If detected → Hard block: '🚫 Real classification markings detected. This demo is for fictional data only.'

### **4. Dual Classification + Guardian Rules**

**Clarified precedence:**

**Rule 1:** Frontmatter classification is the default for all blocks
```yaml
classification:
  what: UNCLASSIFIED
  how: CONFIDENTIAL
```
→ All `<What>` blocks default to UNCLASSIFIED
→ All `<How>` blocks default to CONFIDENTIAL

**Rule 2:** Guardian respects frontmatter defaults
- If `<What>` content and frontmatter `what: UNCLASSIFIED` → Guardian should NOT block (false positive)
- Exception: If specific patterns detected (API keys, PII) → Block regardless of frontmatter

**Rule 3:** Declassify attribute overrides Guardian concern, not frontmatter
- `<What declassify='..'>` means: "Guardian flagged this, but I'm documenting why it's safe to share"
- Does NOT change the frontmatter classification
- Just documents why this specific block is shareable despite Guardian's concern

**Visual representation:**
```
Frontmatter: what=UNCLASSIFIED, how=CONFIDENTIAL

<What>                          → Blue border (UNCLASSIFIED, no concerns)
<What declassify='...'>        → Blue+yellow border (UNCLASSIFIED, Guardian concern documented)
<How>                          → Orange border (CONFIDENTIAL, as expected)
<How declassify='...'>         → ERROR (Cannot declassify HOW - implementation details stay classified)
```

**New rule:** Cannot declassify HOW blocks
- HOW = implementation details, always classified
- If user wants to share HOW content → Move to WHAT + generalize
- Declassify only works on WHAT blocks

### **5. Simplified 'Apply Fix' UX (Acknowledge Parsing Limits)**

**New approach:**

Instead of auto-applying fixes (which can break), SHOW THE FIX and let user copy/paste:

```
🛡️ Guardian Detected Classification Issue

Issue: Specific performance metrics in WHAT section

┌─ Suggested Fix 1: Move to HOW ──────────────────────┐
│                                                      │
│ <How>                                                │
│   Performance: 45ms latency, 99.9% accuracy         │
│ </How>                                               │
│                                                      │
│ [Copy Fix] [Apply Automatically]                    │
└──────────────────────────────────────────────────────┘

┌─ Suggested Fix 2: Generalize WHAT ──────────────────┐
│                                                      │
│ <What>                                               │
│   Performance: Sub-second response, high accuracy   │
│ </What>                                              │
│                                                      │
│ [Copy Fix] [Apply Automatically]                    │
└──────────────────────────────────────────────────────┘

[Cancel]
```

**Button behaviors:**
- **Copy Fix**: Copies suggested MDX to clipboard, user pastes manually
- **Apply Automatically**: Attempts auto-fix, but shows 'Undo' button immediately
- **If auto-fix fails**: Fallback to showing diff and 'Copy Fix' option

**Benefit:** User always has manual fallback if auto-fix breaks.

---

## Success Metrics (Revised)

**Launch criteria (must achieve before calling MVP "done"):**

1. ✅ Demo safety banner shown on first load
2. ✅ Secret scanner blocks real classification markings
3. ✅ Declassify validation enforces 8+ chars, 2+ words
4. ✅ Guardian gracefully handles API failures
5. ✅ Rate limiting prevents cost explosion (50 reviews/day)
6. ✅ Dual classification rules documented and enforced
7. ✅ 'Copy Fix' fallback exists for all suggested fixes

**Post-launch monitoring:**

1. **False positive rate**: < 30% of Guardian blocks result in declassify
2. **Justification quality**: < 10% of declassifications flagged as low-quality in review
3. **User completion**: > 70% of users who start demo complete at least 3 send-to-AI actions
4. **Cost control**: < $5/day average API spend for Guardian reviews
5. **Security violations**: 0 reports of real classified data sent to demo

---

## Risks We Accept (For Demo)

**Acceptable limitations:**
1. MDX parsing edge cases (manual fallback available)
2. Concurrent edit conflicts (single-user demo)
3. No team dispute resolution (production feature)
4. Guardian false positives (better safe than sorry for demo)
5. No offline mode (internet required for demo)

**Unacceptable risks:**
1. Real classified data leak (MUST prevent)
2. Demo breaks during presentation (MUST handle API failures)
3. Cost explosion (MUST rate limit)
4. Meaningless audit trail (MUST validate justifications)

---

## Implementation Priority (Revised)

**Phase 1 (This Week - MVP Launch Blockers):**
1. Add demo safety banner + modal
2. Add secret scanner (basic patterns)
3. Implement declassify validation (8+ chars, 2+ words)
4. Handle Guardian API failures gracefully
5. Add rate limiting (50 reviews/day)
6. Implement 'Copy Fix' fallback for all suggested fixes

**Phase 2 (Next Week - Polish):**
7. Add undo for auto-applied fixes
8. Improve Guardian false positive rate (tune prompts)
9. Add dual classification rule enforcement
10. Add persistent warning banner (top of IDE)

**Phase 3 (Future - Production Features):**
11. Team dispute resolution workflow
12. Partial declassification within blocks
13. Offline Guardian (local rule engine)
14. Admin dashboard for declassification audit
15. Integration with enterprise secret scanners

---

## Session Duration

~40 minutes (pre-mortem + risk mitigation + revised design)

**Key Insight:** Every "convenient" feature creates an attack surface. Override isn't just UX - it's a security boundary. We need to make it safe BEFORE we make it smooth.

