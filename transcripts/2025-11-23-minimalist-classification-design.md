# Design Session: Minimalist Classification Visualization (From First Principles)

**Date:** 2025-11-23  
**Session Type:** Reset & Simplify  
**Trigger:** User confusion - "Too much going on, important things need HIGH contrast"  
**Participants:** Sam (Product Owner), Thorne (Implementation), Design Group (Morgan, Alex, Casey)

---

## 🎯 Core Problem (Restated)

**Sam's Insight:**
> "We need to start from scratch and be super minimalistic so that the important thing can be very high contrast and stand out."

**What's the MOST important thing users need to see?**

Not: "Is this WHAT or HOW?"  
Not: "What's the classification level?"  
**Answer:** "Can I safely share this line with AI?"

---

## 🧠 First Principles Analysis

### Morgan (User Mental Model)

**User's actual question when writing docs:**
> "If I copy this paragraph to Claude, will I leak secrets?"

**NOT asking:**
- "What's the semantic tag?" (WHAT/HOW)
- "What's the classification level?" (CONFIDENTIAL/SECRET)

**Actually asking:**
- "Is this safe to share?" (YES/NO)
- "Do I need approval?" (YES/NO)

**Insight:** We're showing TOO MUCH information. Users want a simple safety signal.

### Alex (Visual Hierarchy)

**Current design problem:**
- Too many visual elements competing for attention
- Icons (📘🔧⚠️🔒) + Colors (blue/yellow/red) + Lines + Tooltips + Opacity
- User's eye doesn't know where to look first

**Minimalist principle:**
- **ONE primary signal** (the most important thing)
- Everything else is secondary/tertiary

**Question:** What's the ONE thing we're communicating?

### Casey (Information Architecture)

**Real-world usage patterns:**

**Scenario 1: Writing documentation**
- User writes freely, tags `<What>` for public API, `<How>` for implementation
- Most content is BOTH (describes API with implementation hints)
- Untagged content = "I haven't decided yet" (should default to safest)

**Scenario 2: Preparing for AI collaboration**
- User wants to extract WHAT sections to send to Claude
- Needs to quickly scan: "Which paragraphs are safe to share?"
- Classification level matters LESS than "shareable yes/no"

**Scenario 3: Reviewing classified docs**
- User needs to know: "Where are the secrets?" (high-risk areas)
- Everything else can fade into background

**Key insight:** Different scenarios need different visual emphasis.

---

## 💡 Minimalist Design Proposal

### Primary Signal: "Shareable to AI?"

**Three states (visual priority order):**

1. **GREEN = Safe to share** (WHAT content, UNCLASSIFIED)
   - Low visual noise (no border, subtle icon)
   - Blends into background
   - Reason: This is "default/safe" state - shouldn't distract

2. **YELLOW = Needs review** (Untagged content, or mixed WHAT/HOW)
   - Medium contrast (yellow left border)
   - Icon: ⚠️
   - Reason: "You should tag this before sharing"

3. **RED = Cannot share** (HOW content with CONFIDENTIAL+, or explicit SECRET)
   - HIGH contrast (red left border + red tint)
   - Icon: 🔒
   - Reason: "Secrets here - do not copy to external AI"

### Visual Design (Minimalist)

**Safe content (GREEN):**
```
   This API encrypts data and returns a promise.
   [No border, no icon, clean text]
```

**Needs review (YELLOW):**
```
⚠️ │ This API encrypts data using AES-256.
    [Yellow line, warning icon, subtle yellow tint]
```

**Classified (RED):**
```
🔒 │ Implementation uses custom key derivation: HKDF-SHA256(salt, iterations=10000)
    [Red line, lock icon, light red tint, high contrast]
```

---

## 🎨 Detailed Visual Spec

### Safe Content (Default - Minimal Noise)

**When:**
- Tagged as `<What>` AND classification = UNCLASSIFIED
- Pure capability description, no implementation hints

**Visual:**
- No left border
- No icon (or very subtle 📘 on hover only)
- Normal text color
- No background tint

**Rationale:** Most docs should be safe - don't distract with visual noise.

---

### Needs Review (Medium Emphasis)

**When:**
- Untagged content (user hasn't decided WHAT vs HOW)
- Mixed WHAT/HOW (both attributes present)
- WHAT content with CONFIDENTIAL classification (needs review before sharing)

**Visual:**
- **Yellow left border** (3px, `#facc15`)
- **Warning icon** ⚠️ in margin (always visible, not just hover)
- **Subtle yellow tint** (`bg-yellow-950/5`)
- **Dimmed opacity** (80%) to signal "incomplete"

**Tooltip (on hover):**
```
⚠️ Untagged content
• WHAT: ? • HOW: ?
• Defaults to CONFIDENTIAL (strictest)
• Tag as <What> or <How> before sharing
```

**Rationale:** Makes untagged content obvious - encourages users to tag explicitly.

---

### Classified (High Emphasis - Stand Out)

**When:**
- HOW content (implementation details)
- Any content with SECRET or TOP_SECRET classification
- Explicit `<Classification level="SECRET">`

**Visual:**
- **Red left border** (5px - thicker than yellow, `#f87171`)
- **Lock icon** 🔒 in margin (always visible, bright red)
- **Red background tint** (`bg-red-950/10` - noticeable but readable)
- **Full opacity** (100% - demands attention)

**Tooltip (on hover):**
```
🔒 <How> content • CONFIDENTIAL
• Implementation details
• Do NOT share with external AI
• Requires approval for declassification
```

**Rationale:** Secrets should JUMP out. Can't miss them.

---

## 📊 Visual Hierarchy (Minimalist)

**Priority 1 (Highest contrast):** RED = Secrets/HOW content  
**Priority 2 (Medium contrast):** YELLOW = Untagged/needs review  
**Priority 3 (Low contrast):** GREEN/None = Safe WHAT content  

**User's eye naturally goes to:** RED first → YELLOW second → Ignores green

---

## 🔧 Implementation Rules

### Tagging Model (Support BOTH WHAT and HOW)

**Option A: Single tag with both attributes**
```markdown
<Content what="UNCLASSIFIED" how="CONFIDENTIAL">
This API encrypts data using AES-256.
</Content>
```

**Option B: Nested tags (NOT RECOMMENDED - too complex)**
```markdown
<What>
  <How>Mixed content here</How>
</What>
```

**Option C: Separate blocks (forces splitting - NOT RECOMMENDED)**
```markdown
<What>This API encrypts data</What>
<How>using AES-256</How>
```

**DECISION:** Use Option A - single tag with both attributes.

**Shorthand for common cases:**
```markdown
<What>Pure capability</What>  → what="from frontmatter", how="UNCLASSIFIED"
<How>Pure implementation</How> → what="UNCLASSIFIED", how="from frontmatter"
<Content what="U" how="C">Mixed</Content> → Explicit both
(Untagged content) → Defaults to both=CONFIDENTIAL (strictest from frontmatter)
```

---

## 🎨 Decision Matrix (What Visual to Show)

| Content Type | WHAT Level | HOW Level | Visual | Icon | Priority |
|--------------|------------|-----------|--------|------|----------|
| `<What>` pure | UNCLASSIFIED | - | None | 📘 (hover only) | 3 (low) |
| `<What>` pure | CONFIDENTIAL+ | - | Yellow border | ⚠️ | 2 (medium) |
| `<How>` pure | - | Any | Red border | 🔒 | 1 (high) |
| `<Content>` mixed | UNCLASSIFIED | UNCLASSIFIED | None | 📘 (hover) | 3 (low) |
| `<Content>` mixed | UNCLASSIFIED | CONFIDENTIAL+ | Red border | 🔒 | 1 (high) |
| `<Content>` mixed | CONFIDENTIAL+ | CONFIDENTIAL+ | Red border | 🔒 | 1 (high) |
| Untagged | (defaults) | (strictest) | Yellow border | ⚠️ | 2 (medium) |

**Rule:** If ANY part is HOW or CONFIDENTIAL+, show RED (highest sensitivity).

---

## 🧪 User Testing Scenarios

### Scenario 1: Writing API docs

```markdown
<What>
## encrypt(data: bytes) -> bytes

Encrypts arbitrary data and returns encrypted bytes.
</What>

   [Visual: Clean, no border, no icon - safe content]
   [User: "This is safe to share"]

<How>
Internally uses AES-256 in CBC mode with PKCS7 padding.
Key derivation: HKDF-SHA256 with 10,000 iterations.
</How>

🔒 │ [Visual: Red border, lock icon, red tint - HIGH CONTRAST]
    [User: "I can't miss this - it's a secret"]
```

### Scenario 2: Untagged content

```markdown
The API provides encryption capabilities using industry-standard algorithms.

⚠️ │ [Visual: Yellow border, warning icon, subtle tint]
    [User: "I should tag this - is it WHAT or HOW?"]
    [Hovers: "Untagged content • Defaults to CONFIDENTIAL • Tag before sharing"]
```

### Scenario 3: Mixed content

```markdown
<Content what="UNCLASSIFIED" how="CONFIDENTIAL">
Encrypts data using AES-256 (military-grade encryption).
</Content>

🔒 │ [Visual: Red border - even though WHAT is U, HOW is C]
    [User: "There's implementation detail here - can't share raw"]
    [Hovers: "<Content> WHAT:U / HOW:C • Contains implementation hints"]
```

---

## ✅ Design Group Consensus

**Vote on minimalist approach:**
- Sam: ✅ YES (high contrast for secrets = good)
- Morgan: ✅ YES (simpler hierarchy, clearer priority)
- Alex: ✅ YES (less visual noise, secrets stand out)
- Casey: ✅ YES (matches user mental model)

**Unanimous:** Simplify to three states (Safe/Review/Classified), prioritize RED for secrets.

---

## 📋 Implementation Checklist

- [ ] Support `<Content what="..." how="...">` tag (both attributes)
- [ ] Support `<What>` shorthand (what=frontmatter, how=U)
- [ ] Support `<How>` shorthand (what=U, how=frontmatter)
- [ ] Untagged defaults to both=strictest
- [ ] Render logic: If HOW=CONFIDENTIAL+ → RED (high priority)
- [ ] Render logic: If untagged → YELLOW (medium priority)
- [ ] Render logic: If WHAT=U AND HOW=U → None (low priority)
- [ ] Icons: 🔒 for RED, ⚠️ for YELLOW, 📘 for hover-only
- [ ] Thicker border for RED (5px) vs YELLOW (3px)
- [ ] Red background tint more noticeable than yellow
- [ ] Tooltip shows tag type + classification + action hint

---

## 🎯 Key Principles (Don't Violate)

1. **Secrets must be HIGH CONTRAST** (can't miss RED)
2. **Safe content should fade into background** (no visual noise)
3. **Untagged content should nag user** (yellow = "please tag this")
4. **Default to strictest** (security-first)
5. **Support mixed WHAT/HOW** (most content is both)

---

**Design Group: APPROVED ✅**  
**Ready for implementation (from scratch).**

