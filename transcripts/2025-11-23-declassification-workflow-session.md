---
session_id: "RED-FORGE-DECLASSIFICATION-WORKFLOW"
session_type: "Security UX Design Session"
date: "2025-11-23"
participants: ["Bruce Schneier", "Susan Kare", "Dieter Rams", "Edward Tufte", "Morgan (Balans)", "Thorne (Balans)"]
focus: "Designing safe declassification workflow for AI collaboration with classified content"
context: "Users need to work on SECRET content with Claude 4.5, but sending classified content directly to AI is prohibited. Need workflow to safely declassify sections for AI review."
status: "IN_PROGRESS"
---

# Declassification Workflow: Safe AI Collaboration with Classified Content

## 🎯 Problem Statement

**User Goal:**
> "I'm writing SECRET documentation. I want Claude to help me improve the WHAT sections (which are UNCLASSIFIED), but I can't send the whole document because it contains SECRET HOW sections."

**Current State:**
- User has a file with mixed classification (`what: U, how: S`)
- Sending entire file to AI = security violation
- Manually copy-pasting WHAT sections = tedious, error-prone
- No visual way to verify "what am I about to send to the AI?"

**Desired Workflow:**
1. Right-click on file → "Load to Unclassified Weaver/Assistant"
2. System **automatically extracts** only UNCLASSIFIED content
3. User **reviews** what will be sent (safety check)
4. User **approves** → Content sent to Claude
5. Claude's response is **imported back** into document (at appropriate classification level)

---

## 🗣️ Session Transcript

### Opening: The Core Security Challenge

**Bruce Schneier:** *security expert, author of "Applied Cryptography"* Let's start with threat modeling. What's the worst-case scenario if this workflow fails?

**Morgan:** User accidentally sends SECRET content to Claude (external API). That content:
1. Leaves their computer (data exfiltration)
2. Goes to Anthropic servers (third-party storage)
3. May be used for training (disclosure)
4. Can't be recalled (irreversible)

**Bruce Schneier:** So the failure mode is **catastrophic and irreversible**. This means we need:
1. **Multiple confirmation steps** (fail-safe design)
2. **Visual preview** (human verification before send)
3. **Audit trail** (know what was sent, when, why)
4. **Conservative defaults** (when in doubt, DON'T send)

**Thorne:** Right. We can't trust automated extraction alone. The user must **see and approve** exactly what's being sent.

---

### Visual Design: Preview Before Send

**Susan Kare:** *interface design pioneer, original Mac icons* The preview is the most critical UI. It must be:
1. **Obvious** - user can't miss it
2. **Readable** - can actually review the content
3. **Color-coded** - instant visual verification of classification
4. **Reversible** - easy to cancel

Let me sketch the flow:

---

#### **Step 1: Right-Click Context Menu**

```
┌─────────────────────────────────┐
│ 📄 publisher-api.md             │
│                                 │
│ [Right-click menu]              │
│ ├─ Open                         │
│ ├─ Rename                       │
│ ├─ Delete                       │
│ ├─ ─────────────────            │
│ ├─ 🔓 Extract Unclassified for AI│ ← NEW
│ └─ 🔒 View Classification Summary│ ← NEW
└─────────────────────────────────┘
```

**Icon Choice:**
- 🔓 = "Opening" classified content (extracting UNCLASSIFIED parts)
- 🔒 = "Viewing" classification summary (read-only, safe)

---

#### **Step 2: Extraction Preview Modal**

```
┌────────────────────────────────────────────────────────────┐
│ 🔓 Declassification Preview                                │
│ ─────────────────────────────────────────────────────────  │
│                                                            │
│ File: publisher-api.md                                     │
│ Classification: WHAT: UNCLASSIFIED / HOW: SECRET           │
│                                                            │
│ ⚠️ CRITICAL: Review content before sending to AI          │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ 📘 Content to be sent (UNCLASSIFIED only):            ││
│ │                                                        ││
│ │ ─────────────────────────────────────────────────────  ││
│ │                                                        ││
│ │ <What>                                                 ││
│ │ The Publisher API allows sending messages to topics.  ││
│ │ Provides automatic type serialization and QoS config. ││
│ │ </What>                                                ││
│ │                                                        ││
│ │ <What>                                                 ││
│ │ Example usage:                                         ││
│ │ ```typescript                                          ││
│ │ const pub = node.createPublisher('topic', String);    ││
│ │ await pub.publish('hello');                           ││
│ │ ```                                                    ││
│ │ </What>                                                ││
│ │                                                        ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ 🔒 Content excluded (SECRET):                         ││
│ │                                                        ││
│ │ ─────────────────────────────────────────────────────  ││
│ │                                                        │
│ │ <How>                                                  ││
│ │ [REDACTED - Implementation details]                   ││
│ │ </How>                                                 ││
│ │                                                        ││
│ │ <How>                                                  ││
│ │ [REDACTED - Algorithm description]                    ││
│ │ </How>                                                 ││
│ │                                                        ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ✅ Safe to send: 450 tokens (UNCLASSIFIED)                │
│ 🔒 Excluded: 1200 tokens (SECRET)                         │
│                                                            │
│ [ Cancel ]  [ Copy to Clipboard ]  [ Send to Claude ] ── │
└────────────────────────────────────────────────────────────┘
```

**Dieter Rams:** *industrial designer, "less but better"* This is good, but it's too long. Users won't read all that text. Can we make it more scannable?

**Edward Tufte:** *information design expert* Add **visual density encoding**. Use color, size, and position to communicate hierarchy:

1. **Green section** (content to send) = larger, expanded by default
2. **Red section** (excluded content) = smaller, collapsed by default, shows only count
3. **Token counts** = large, bold (most important decision factor)

---

#### **Step 2 (Revised): Scannable Preview**

```
┌────────────────────────────────────────────────────────────┐
│ 🔓 Declassification Preview                     [×]        │
│ ─────────────────────────────────────────────────────────  │
│                                                            │
│ 📄 publisher-api.md                                        │
│ 🔵 WHAT: UNCLASSIFIED  /  🔴 HOW: SECRET                   │
│                                                            │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓│
│ ┃ ✅ SAFE TO SEND (450 tokens)                          ┃│
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ # Publisher API                                        ││ ← Blue bg tint
│ │                                                        ││
│ │ The Publisher API allows sending messages to topics.  ││
│ │ Provides automatic type serialization and QoS...      ││
│ │                                                        ││
│ │ [Expand to see full content ▼]                        ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ 🔒 EXCLUDED (1200 tokens SECRET)         [Show ▼]    ││ ← Red bg tint
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ⚠️  By clicking "Send", you confirm this content is       │
│     UNCLASSIFIED and safe to share with external AI.      │
│                                                            │
│              [ Cancel ]         [ Send to Claude ]         │
└────────────────────────────────────────────────────────────┘
```

**Susan Kare:** Much better. The green box with large token count is the first thing you see. If that number looks wrong, you immediately notice.

**Bruce Schneier:** I like the explicit confirmation text at the bottom. Users must read "UNCLASSIFIED and safe to share" before clicking Send. That's psychological priming.

---

### Edge Cases & Safety Mechanisms

**Bruce Schneier:** Okay, what are the edge cases where this workflow fails?

---

#### **Edge Case 1: Untagged Content**

**Scenario:**
```markdown
---
classification:
  what: UNCLASSIFIED
  how: SECRET
---

# Publisher API

This is untagged content!
```

**Question:** Is untagged content safe to send?

**Morgan:** No! Our threat model says untagged = `max(WHAT, HOW)` = SECRET by default.

**Solution:**
```
┌────────────────────────────────────────────────────────────┐
│ ⚠️  CANNOT EXTRACT                                         │
│                                                            │
│ This file contains untagged content (35% of document).     │
│ Untagged content defaults to SECRET classification.        │
│                                                            │
│ You must explicitly tag all content as <What> or <How>    │
│ before extracting for AI review.                           │
│                                                            │
│ [ Cancel ]  [ Open file and tag content ]                 │
└────────────────────────────────────────────────────────────┘
```

**Thorne:** Strict but necessary. Forces users to classify before sharing.

---

#### **Edge Case 2: No UNCLASSIFIED Content**

**Scenario:**
```markdown
---
classification:
  what: SECRET
  how: TOP_SECRET
---

<What>All SECRET</What>
<How>All TOP_SECRET</How>
```

**Solution:**
```
┌────────────────────────────────────────────────────────────┐
│ 🔒 NO UNCLASSIFIED CONTENT                                 │
│                                                            │
│ This file contains no UNCLASSIFIED sections.               │
│ Nothing can be safely sent to external AI.                 │
│                                                            │
│ Suggestion: Create a separate summary document with        │
│ UNCLASSIFIED overview, then request AI review on that.     │
│                                                            │
│ [ Cancel ]  [ Create summary document ]                   │
└────────────────────────────────────────────────────────────┘
```

**Susan Kare:** "Create summary document" is helpful affordance - guides user to safe workflow.

---

#### **Edge Case 3: Accidental HIGH Content in WHAT Section**

**Scenario:**
```markdown
<What>
The Publisher uses AES-256 with custom key derivation (SECRET detail!)
</What>
```

**Detection:** Keyword analysis flags "AES-256 with custom key derivation" as likely HOW content.

**Solution:**
```
┌────────────────────────────────────────────────────────────┐
│ ⚠️  POSSIBLE CLASSIFICATION ERROR                          │
│                                                            │
│ The following content is tagged as WHAT (UNCLASSIFIED)     │
│ but contains phrases that suggest HOW (implementation):    │
│                                                            │
│ • "uses AES-256 with custom key derivation"                │
│ • "implements priority queue"                              │
│                                                            │
│ Review carefully before sending.                           │
│                                                            │
│ [ Cancel and review ]  [ Override - send anyway ]          │
└────────────────────────────────────────────────────────────┘
```

**Bruce Schneier:** Good defense-in-depth. Keyword detection is imperfect, but it's an extra layer. And the warning is **blocking** - user must explicitly override.

---

### AI Response Import: The Return Journey

**Morgan:** Okay, we've solved extraction. Now: Claude responds with suggestions. How do we import that back safely?

**Thorne:** We need to track **where the response came from** (which sections were sent) and **what classification to apply** (same as source? or user-specified?).

---

#### **Step 3: AI Response Import Preview**

```
┌────────────────────────────────────────────────────────────┐
│ 🤖 Import AI Response                                      │
│ ─────────────────────────────────────────────────────────  │
│                                                            │
│ Claude reviewed UNCLASSIFIED content and suggests:         │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ "Consider adding error handling examples to the API    ││
│ │  documentation. Users might be confused about what     ││
│ │  happens when publish() fails due to network issues."  ││
│ │                                                        ││
│ │ Suggested addition:                                    ││
│ │                                                        ││
│ │ ```typescript                                          ││
│ │ try {                                                  ││
│ │   await pub.publish('hello');                         ││
│ │ } catch (err) {                                       ││
│ │   console.error('Publish failed:', err);              ││
│ │ }                                                      ││
│ │ ```                                                    ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ Classify this AI response as:                              │
│                                                            │
│ ○ WHAT: UNCLASSIFIED (capability example)                  │
│ ○ HOW: CONFIDENTIAL (implementation detail)                │
│ ○ Mixed - I'll tag manually                                │
│                                                            │
│ Insert at:                                                 │
│ ○ End of document                                          │
│ ○ After section: "Publisher API Overview"                  │
│ ○ I'll place manually (copy to clipboard)                  │
│                                                            │
│              [ Cancel ]           [ Import ]               │
└────────────────────────────────────────────────────────────┘
```

**Edward Tufte:** The classification choice must come **before** import. Don't let users import first and classify later - that's how mistakes happen.

**Dieter Rams:** Agreed. And "I'll tag manually" is the conservative default - puts responsibility on user to classify correctly.

---

### Audit Trail: Recording Declassification Events

**Bruce Schneier:** Every declassification must be **logged**. Not for surveillance, but for:
1. **Accountability** - if a leak happens, trace the source
2. **Review** - periodic audits to check if workflow is working
3. **Learning** - identify patterns (e.g., "users always extract WHAT sections from design docs")

---

#### **Audit Log Format**

```json
{
  "event": "declassification_preview",
  "timestamp": "2025-11-23T22:45:00Z",
  "file": "publisher-api.md",
  "classification": {
    "what": "UNCLASSIFIED",
    "how": "SECRET"
  },
  "extracted": {
    "sections": 3,
    "tokens": 450,
    "content_hash": "sha256:abc123..."
  },
  "excluded": {
    "sections": 2,
    "tokens": 1200
  },
  "user_action": "sent_to_ai",
  "ai_provider": "anthropic_claude_3.5",
  "warnings_shown": ["keyword_detection_triggered"],
  "warnings_overridden": []
}
```

**Storage:** Local only (`.weaver/audit/declassification.log`), never sent to servers.

**Bruce Schneier:** Good. This is a local audit trail, not telemetry. Users control it.

---

## 🎯 Decisions Made

### ✅ Agreed Upon: Declassification Workflow

**1. Extraction Flow:**
```
Right-click file
  → "Extract Unclassified for AI"
  → Preview modal (shows WHAT content, hides HOW content)
  → User reviews
  → Keyword detection warnings (if triggered)
  → User confirms
  → Content sent to Claude
```

**2. Import Flow:**
```
Claude responds
  → Import modal
  → User classifies AI response (WHAT/HOW/Mixed)
  → User chooses insertion point
  → Content imported with appropriate tags
```

**3. Safety Mechanisms:**
- **Untagged content = blocked** (must tag first)
- **No UNCLASSIFIED = blocked** (create summary document instead)
- **Keyword warnings = blocking** (must override explicitly)
- **Preview before send = mandatory** (can't skip)
- **Audit trail = automatic** (every extraction logged locally)

**4. Visual Reservations:**
- **Green box** = safe to send (UNCLASSIFIED)
- **Red box** = excluded (SECRET/CONFIDENTIAL/TOP_SECRET)
- **Blue background tint** = WHAT content
- **Yellow background tint** = HOW content (if imported)
- **Token counts** = large, bold (primary decision metric)

---

### 🚧 Reserved Visual Elements for Declassification

**Colors:**
- 🟢 **Green border/box** = "Safe to send" / "Extracted successfully"
- 🔴 **Red border/box** = "Blocked" / "Cannot send" / "Excluded"
- 🟡 **Yellow warning** = "Review required" / "Possible error"

**Icons:**
- 🔓 = "Declassifying" / "Extracting UNCLASSIFIED"
- 🔒 = "Classified" / "Excluded from extraction"
- 🤖 = "AI-generated content" / "Response from Claude"
- ⚠️ = "Warning" / "Review required"
- ✅ = "Safe" / "Approved" / "Verified"

**Action Verbs:**
- **Extract** = Pull out UNCLASSIFIED content for AI review
- **Send** = Transmit to external AI (irreversible action)
- **Import** = Bring AI response back into document
- **Override** = Explicitly bypass safety warning (requires justification)

---

## 🤔 Still Debating:

1. **Should keyword detection be opt-in or opt-out?** (Convenience vs. security)
2. **Should we support "partial send"?** (Select specific `<What>` sections, not all)
3. **Should AI responses be marked with metadata?** (e.g., `<!-- Generated by Claude 3.5 on 2025-11-23 -->`)
4. **Should we support "safe mode" where AI can't see filenames?** (Filenames might leak info)

---

## 💡 Key Insights

**Bruce Schneier's Contribution:**
> "Security workflows must be **fail-safe**, not fail-secure. If the user makes a mistake, the system should block the action, not allow it with a warning. Warnings are ignored; blocks force review."

**Susan Kare's Contribution:**
> "The preview modal is not just UI - it's the **psychological contract**. By showing exactly what will be sent, you transfer responsibility to the user. They can't claim 'I didn't know' if they approved the preview."

**Dieter Rams's Contribution:**
> "Good design is honest. Don't hide the excluded content - show it (collapsed), so users understand what's being filtered. Transparency builds trust in the automation."

**Edward Tufte's Contribution:**
> "Token counts are the most important metric. Make them **large, bold, and positioned first**. Users will make decisions based on that number more than anything else."

**Morgan's Contribution:**
> "Untagged content is the biggest risk. If we block extraction when ANY content is untagged, we force users to classify everything before sharing. That's tedious but necessary for security."

**Thorne's Contribution:**
> "Audit trails must be local-only. If users think we're logging to a server, they won't trust the system. Make it explicitly local (`.weaver/audit/`), and let users delete logs if they want."

---

## 📝 Action Items:

1. **Thorne**: Implement extraction logic (parse `<What>` tags, exclude `<How>` tags, detect untagged)
2. **Morgan**: Build preview modal UI (green/red boxes, token counts, expandable sections)
3. **Bruce**: Design keyword detection heuristics (HOW keywords in WHAT sections)
4. **Susan**: Create icon set for declassification workflow (🔓🔒🤖⚠️✅)
5. **Dieter**: Simplify modal layout (reduce text, increase scannability)
6. **Edward**: Design audit log visualization (for periodic review)

---

## 🔗 References

- `balans-website/transcripts/2025-11-23-leak-prevention-design-session.md` - Leak prevention workflow
- `balans-website/transcripts/2025-11-23-classification-tag-visualization.md` - WHAT/HOW tagging system
- `compression/99-output/lumens/classification-system.md` - Dual classification framework

---

## 🚧 Next Session Topics

1. **Partial extraction** - Select specific sections to send (not all WHAT content)
2. **AI response validation** - Detect if Claude accidentally generated classified content
3. **Cross-document references** - What happens when extracting from linked documents?
4. **Team workflows** - Multiple users collaborating on classified docs with AI assistance

---

**Session End: 2025-11-23 23:15**  
**Next Session: TBD (after extraction workflow implementation)**

---

## 📊 Appendix: Visual Mockups

### **Full Extraction Flow (Visual)**

```
Step 1: Right-Click
─────────────────────
┌───────────────────┐
│ 📄 publisher-api.md│
│                   │
│ [Context Menu]    │
│ 🔓 Extract for AI │ ← Click
└───────────────────┘

Step 2: Preview Modal
─────────────────────
┌─────────────────────────────────┐
│ 🔓 Declassification Preview     │
│                                 │
│ ✅ SAFE TO SEND (450 tokens)   │ ← Large green box
│ ┌─────────────────────────────┐│
│ │ <What>                      ││
│ │ The Publisher API...        ││ ← Blue tint
│ │ </What>                     ││
│ └─────────────────────────────┘│
│                                 │
│ 🔒 EXCLUDED (1200 tokens)      │ ← Red box (collapsed)
│                                 │
│ ⚠️  Confirm: UNCLASSIFIED only │
│                                 │
│ [ Cancel ]  [ Send to Claude ]  │
└─────────────────────────────────┘

Step 3: Sent Confirmation
──────────────────────────
┌─────────────────────────────────┐
│ ✅ Sent to Claude               │
│                                 │
│ 450 tokens sent                 │
│ Waiting for response...         │
│                                 │
│ [ View in Claude ]  [ Cancel ]  │
└─────────────────────────────────┘

Step 4: Import Response
────────────────────────
┌─────────────────────────────────┐
│ 🤖 Import AI Response           │
│                                 │
│ Claude suggests:                │
│ "Add error handling example..." │
│                                 │
│ Classify as:                    │
│ ● WHAT: UNCLASSIFIED            │ ← User selects
│ ○ HOW: CONFIDENTIAL             │
│ ○ Mixed (manual)                │
│                                 │
│ [ Cancel ]  [ Import ]          │
└─────────────────────────────────┘
```

---

**End of Design Session**

