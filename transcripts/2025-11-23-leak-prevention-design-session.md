# Design Group Session: Preventing Accidental Information Leakage

**Date:** 2025-11-23  
**Participants:** Morgan (systems thinker), Raven (copywriter), Thorne (technical purist), Lyra (contrarian UX designer)  
**Topic:** Designing classification visualization to **prevent accidental leaks** to lower classification levels  
**Session Type:** Security-focused design with threat modeling  
**Context:** Follow-up to classification tag visualization session

---

## 📋 Problem Statement

**The Core Risk:**
> When writing classified documentation, the biggest threat isn't intentional leakage - it's **accidental mixing** of WHAT and HOW content at different classification levels.

**Real-World Scenario:**
```markdown
<What>
The Publisher API allows sending messages to topics.
Uses advanced queueing for reliability.        <-- ⚠️ LEAK!
</What>
```

**What went wrong?**
- "Uses advanced queueing" is **HOW** content (implementation detail)
- Accidentally placed in `<What>` section (capability description)
- If WHAT=UNCLASSIFIED and HOW=SECRET, this **leaks SECRET information** into UNCLASSIFIED section

**The Question:**
How do we design the UI to make these accidents **visible and preventable**?

---

## 🗣️ Session Transcript

**Morgan:** Let's start with threat modeling. What are the ways information leaks happen in classified documentation?

**Thorne:** *pulls up security incident reports* The most common pattern: "Invisible escalation." Someone writes in what they think is an unclassified section, but they accidentally include details that are classified higher. The visual system doesn't warn them.

**Raven:** That's because most classification systems are **passive**. They mark what you've already written, but they don't **prevent** you from writing the wrong thing in the wrong place.

**Lyra:** Can we even do that? We're not building an AI content filter. We're building a visualization system.

**Morgan:** Right, but we can design the visualization to make leaks **obvious**. Like how a spell checker doesn't prevent typos, but red squiggles make them hard to miss.

**Thorne:** Here's the threat model:

### **Threat #1: Accidental HOW in WHAT Section**

```markdown
<What>
The Publisher uses a priority queue with exponential backoff.
                         ^^^^^^^^^^^^^ HOW detail in WHAT section
</What>
```

**Risk:** If WHAT=U and HOW=S, this leaks SECRET implementation into UNCLASSIFIED capability docs.

**Attack Vector:** Writer doesn't realize "priority queue with exponential backoff" is implementation detail.

---

### **Threat #2: Forgetting to Tag Mixed Content**

```markdown
The Publisher API sends messages (WHAT: U) using Zenoh PUT (HOW: C).
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
No tag! System defaults to max(U,C)=C, but writer thinks it's U.
```

**Risk:** Writer assumes untagged = unclassified. Content gets shared at UNCLASSIFIED level, but contains CONFIDENTIAL details.

**Attack Vector:** Cognitive bias - "I didn't mark it classified, so it must be safe."

---

### **Threat #3: Copy-Paste from Higher Classification**

```markdown
<Classification what="U" how="S">
The algorithm uses AES-256 with custom key derivation...
</Classification>

[Later, writer copy-pastes to UNCLASSIFIED section]

<What>
The algorithm uses AES-256 with custom key derivation...
                                  ^^^^^^^^^^^^^^^^^^^^
HOW:SECRET content in WHAT:U section!
</What>
```

**Risk:** Copy-paste inherits content but not classification. Writer doesn't notice.

**Attack Vector:** Muscle memory - Ctrl+C, Ctrl+V happens faster than thinking.

---

**Lyra:** Okay, so we have three threat vectors. How do we defend against each?

**Raven:** For Threat #1 (HOW in WHAT section), what if we use **AI assistance**? Claude could flag sentences that look like implementation details in WHAT sections.

**Thorne:** *skeptical* That requires an LLM call on every keystroke. Too slow, too expensive, and LLMs make mistakes.

**Morgan:** What if we use **keyword heuristics** instead? Certain words are strong signals:
- **HOW keywords:** "uses", "implements", "algorithm", "internally", "calls", "function", "class", "method"
- **WHAT keywords:** "allows", "provides", "enables", "supports", "interface", "API", "capability"

If you type HOW keywords in a `<What>` section, highlight them yellow: "⚠️ Possible implementation detail in capability section?"

**Lyra:** That's better, but still noisy. What if "allows" and "uses" are in the same sentence?

**Raven:** Then we need **stronger visual separation**. Right now, `<What>` and `<How>` tags are invisible in the editor (only visible in preview). What if we made them **visually distinct in edit mode**?

**Thorne:** Like syntax highlighting? `<What>` sections have blue background tint, `<How>` sections have yellow tint?

**Morgan:** Yes! And untagged content has a **red tint** with a warning: "Untagged content defaults to CONFIDENTIAL (max classification). Tag explicitly as `<What>` or `<How>`."

**Lyra:** *pauses* Wait, that's actually brilliant. Let me sketch this:

---

## 🎨 Visual Proposal: Edit Mode Classification Awareness

### **Option A: Background Tints (Ambient Awareness)**

**Edit Mode View:**
```
┌─────────────────────────────────────────────┐
│ <What>                                      │
│ ┌─────────────────────────────────────────┐│
│ │ The Publisher API allows sending messages││ ← Blue tint (WHAT section)
│ │ to topics. Uses advanced queueing.       ││ ← "Uses" highlighted yellow (⚠️)
│ └─────────────────────────────────────────┘│
│ </What>                                     │
│                                             │
│ <How>                                       │
│ ┌─────────────────────────────────────────┐│
│ │ Implements Zenoh PUT with priority queue ││ ← Yellow tint (HOW section)
│ │ and exponential backoff (3 retries).     ││
│ └─────────────────────────────────────────┘│
│ </How>                                      │
│                                             │
│ Untagged content here...                    │ ← Red tint (UNTAGGED - defaults to max)
│ ⚠️ Warning: Tag as <What> or <How>         │
└─────────────────────────────────────────────┘
```

**Behavior:**
- `<What>` sections: **Light blue background** `rgba(96, 165, 250, 0.1)`
- `<How>` sections: **Light yellow background** `rgba(250, 204, 21, 0.1)`
- Untagged: **Light red background** `rgba(239, 68, 68, 0.1)` with inline warning
- HOW keywords in WHAT sections: **Yellow highlight** with tooltip

---

### **Option B: Left Border + Icon (Explicit Marking)**

**Edit Mode View:**
```
┌─────────────────────────────────────────────┐
│ <What>                                      │
│ │ 📘 The Publisher API allows sending      │ ← Blue border + book icon
│ │    messages to topics.                    │
│ │    Uses advanced queueing. ⚠️            │ ← Warning icon (HOW keyword)
│ </What>                                     │
│                                             │
│ <How>                                       │
│ │ 🔧 Implements Zenoh PUT with priority    │ ← Yellow border + wrench icon
│ │    queue and exponential backoff.        │
│ </How>                                      │
│                                             │
│ ⚠️ Untagged content here...                │ ← Red border + warning icon
└─────────────────────────────────────────────┘
```

**Behavior:**
- `<What>` sections: **Blue left border** (3px) + 📘 book icon
- `<How>` sections: **Yellow left border** (3px) + 🔧 wrench icon
- Untagged: **Red left border** (3px) + ⚠️ warning icon
- Less invasive than full background tint

---

### **Option C: Inline Badges (Maximalist Approach)**

**Edit Mode View:**
```
┌─────────────────────────────────────────────┐
│ <What> [WHAT: UNCLASSIFIED]                │ ← Inline badge
│ The Publisher API allows sending messages   │
│ to topics. Uses advanced queueing. ⚠️HOW   │ ← Inline warning
│ </What>                                     │
│                                             │
│ <How> [HOW: CONFIDENTIAL]                  │ ← Inline badge
│ Implements Zenoh PUT with priority queue    │
│ and exponential backoff (3 retries).        │
│ </How>                                      │
│                                             │
│ [⚠️ UNTAGGED → MAX: CONFIDENTIAL]          │ ← Inline warning
│ This content needs tagging!                 │
└─────────────────────────────────────────────┘
```

**Behavior:**
- Every section has classification badge
- Untagged content has prominent warning
- Most explicit, but noisiest

---

**Raven:** I vote Option A (background tints). It's ambient - you see it peripherally without it screaming at you. Option C is too noisy.

**Thorne:** I vote Option B (left border + icon). Background tints might interfere with syntax highlighting for code blocks inside `<What>` sections.

**Lyra:** I vote Option A, but with **both** background tint AND left border. Redundant visual cues reduce accidents.

**Morgan:** *thinking* Let's test cognitive load. Which option makes it **hardest to accidentally write HOW content in WHAT section**?

**Lyra:** Option A. The background tint is always visible. You can't ignore it. Option B only shows the border on the left - easy to miss when you're focused on typing in the middle.

**Thorne:** But what about **color blindness**? Blue/yellow tints won't work for deuteranopia (red-green color blindness).

**Morgan:** Add **icons** to the tints. Blue tint + 📘 book icon for WHAT. Yellow tint + 🔧 wrench icon for HOW. Red tint + ⚠️ warning for untagged.

**Raven:** Okay, so **Option A + icons**. That's redundant encoding (color + icon + position).

---

## 🎯 Decision: Defending Against Threat #1

### ✅ Agreed Upon: Edit Mode Visual Encoding

**System:** Background tint + left border + icon (triple encoding)

**`<What>` Sections:**
- Background: Light blue tint `rgba(96, 165, 250, 0.08)`
- Left border: Blue `#60a5fa` (3px)
- Icon: 📘 (top-left corner)
- Tooltip: "WHAT: Capability/interface documentation (UNCLASSIFIED)"

**`<How>` Sections:**
- Background: Light yellow tint `rgba(250, 204, 21, 0.08)`
- Left border: Yellow `#facc15` (3px)
- Icon: 🔧 (top-left corner)
- Tooltip: "HOW: Implementation details (CONFIDENTIAL)"

**Untagged Sections:**
- Background: Light red tint `rgba(239, 68, 68, 0.08)`
- Left border: Red `#ef4444` (3px)
- Icon: ⚠️ (top-left corner)
- Inline warning: "⚠️ Untagged content defaults to CONFIDENTIAL (max classification). Add `<What>` or `<How>` tag."

**Keyword Highlighting (Optional AI Assist):**
- HOW keywords in `<What>` sections: Yellow underline + tooltip: "⚠️ Possible implementation detail in capability section?"
- WHAT keywords in `<How>` sections: Blue underline + tooltip: "ℹ️ This looks like capability description - should it be in `<What>` section?"

---

**Morgan:** Okay, we've solved Threat #1 (accidental HOW in WHAT). What about Threat #2 (forgetting to tag)?

**Thorne:** We already solved it - untagged content gets **red tint** with warning. Hard to miss.

**Lyra:** But what if the writer *intentionally* leaves it untagged because they think "I'll tag it later"? We need to make tagging **frictionless**.

**Raven:** Add a **quick-tag button** in the warning:

```
⚠️ Untagged content (defaults to CONFIDENTIAL)
[Tag as WHAT] [Tag as HOW] [Mark as mixed]
```

Click the button → wraps selection in appropriate tag.

**Morgan:** Good. But we need **undo** support. If you accidentally click "Tag as WHAT" when you meant "Tag as HOW", you should be able to undo easily.

**Thorne:** Standard Ctrl+Z should work. No custom undo logic needed.

---

## 🎯 Decision: Defending Against Threat #2

### ✅ Agreed Upon: Frictionless Tagging

**Untagged Content Warning:**
```
┌─────────────────────────────────────────────┐
│ ⚠️ Untagged content (defaults to max: CONFIDENTIAL) │
│ This content needs explicit tagging!         │
│                                             │
│ [🔵 Tag as WHAT] [🟡 Tag as HOW] [🔴 Mark as mixed] │
│                                             │
│ The Publisher API uses Zenoh PUT...        │ ← Red tint background
└─────────────────────────────────────────────┘
```

**Button Behavior:**
- **Tag as WHAT**: Wraps content in `<What>...</What>`
- **Tag as HOW**: Wraps content in `<How>...</How>`
- **Mark as mixed**: Wraps in `<Classification what="?" how="?">...</Classification>` with placeholders for user to fill
- All actions are **undoable** with Ctrl+Z

**Keyboard Shortcuts:**
- `Ctrl+Shift+W`: Wrap selection in `<What>` tags
- `Ctrl+Shift+H`: Wrap selection in `<How>` tags
- `Ctrl+Shift+M`: Wrap selection in `<Classification>` tags

---

**Lyra:** Okay, what about Threat #3 (copy-paste from higher classification)?

**Morgan:** That's the hardest one. Copy-paste happens at OS level - we don't control it.

**Thorne:** But we can detect it. If you paste content into a `<What>` section and it contains HOW keywords, show a warning:

```
⚠️ Pasted content may contain implementation details.
Did you copy this from a <How> section?

[Keep as-is] [Review and edit] [Undo paste]
```

**Raven:** That's annoying if you're pasting legitimate WHAT content that happens to use the word "uses".

**Lyra:** What if we make it **smarter**? Check if the pasted content has a **high density** of HOW keywords (≥3 per paragraph). Only warn if it's likely implementation content.

**Morgan:** Or, simpler: check if the clipboard contains `<How>` tags. If you copy from a `<How>` section and paste into a `<What>` section, always warn.

**Thorne:** That only works if the source document uses our tagging system. What if they're pasting from an external document?

**Raven:** Then we fall back to keyword heuristics. If paste contains ≥3 HOW keywords, warn.

---

## 🎯 Decision: Defending Against Threat #3

### ✅ Agreed Upon: Paste Detection with Smart Warnings

**Paste Behavior:**

**Case 1: Pasting into `<What>` section**
- **If clipboard contains `<How>` tags** → Always warn
- **If clipboard has ≥3 HOW keywords per 100 words** → Warn with medium confidence
- **Otherwise** → No warning (assume legitimate WHAT content)

**Case 2: Pasting into `<How>` section**
- **If clipboard contains `<What>` tags** → Suggest: "This looks like capability description. Should it be in `<What>` section?"
- **Otherwise** → No warning

**Case 3: Pasting into untagged section**
- **Always warn**: "Untagged content defaults to max classification. Tag explicitly before pasting sensitive content."

**Warning Dialog:**
```
┌─────────────────────────────────────────────┐
│ ⚠️ Possible Classification Mismatch        │
│                                             │
│ You pasted content that may contain         │
│ implementation details (HOW) into a         │
│ capability section (WHAT).                  │
│                                             │
│ Detection confidence: Medium                │
│ Keywords found: "implements", "algorithm",  │
│ "internally"                                │
│                                             │
│ [Undo paste] [Review manually] [Override]  │
└─────────────────────────────────────────────┘
```

---

**Morgan:** Okay, I think we have a solid threat defense system. Let me summarize:

---

## 📋 Final Threat Defense System

### **Defense Layer 1: Visual Encoding (Edit Mode)**
- **Background tints** (blue/yellow/red) make section type always visible
- **Left borders** (3px colored) provide redundant visual cue
- **Icons** (📘/🔧/⚠️) support color-blind users
- **Triple encoding** (color + border + icon) reduces accidents

### **Defense Layer 2: Real-Time Warnings**
- **Keyword highlighting** (HOW words in WHAT sections get yellow underline)
- **Untagged content warnings** (red tint + inline warning + quick-tag buttons)
- **Tooltips** explain classification levels on hover

### **Defense Layer 3: Paste Protection**
- **Clipboard analysis** detects cross-section copy-paste
- **Keyword density heuristics** flag likely implementation details
- **Warning dialogs** give user chance to review before accepting paste

### **Defense Layer 4: Frictionless Correction**
- **Quick-tag buttons** wrap content in appropriate tags with one click
- **Keyboard shortcuts** (Ctrl+Shift+W/H/M) for power users
- **Undo support** (Ctrl+Z) for accidental actions

---

## 🤔 Still Debating:

1. **Should we use AI (Claude) for keyword detection?** (More accurate but slower/expensive)
2. **Should warnings be dismissible?** (Better UX but might encourage ignoring warnings)
3. **Should we track "warning fatigue"?** (If user dismisses same warning 10 times, adjust sensitivity)
4. **Should export/publish require explicit "I reviewed classifications" confirmation?** (Security vs. friction tradeoff)

---

## 💡 Key Insights

**Morgan's Contribution:**
> "Threat modeling first, UX second. We can't design leak-prevention without understanding how leaks happen. The three threats (accidental mixing, forgotten tagging, copy-paste) cover 90% of real-world incidents."

**Lyra's Contribution:**
> "Triple encoding (color + border + icon) is overkill for accessibility, but it's not overkill for security. Redundant cues prevent accidents when you're tired or distracted."

**Thorne's Contribution:**
> "Keyword heuristics are dumb but fast. They'll have false positives, but false positives are better than false negatives in security. Better to over-warn than under-warn."

**Raven's Contribution:**
> "Warnings must be **actionable**. Don't just say 'this might be wrong' - give the user a button to fix it. Frictionless correction prevents 'I'll fix it later' procrastination."

---

## 📝 Action Items:

1. **Thorne**: Implement edit mode visual encoding (background tints + borders + icons)
2. **Morgan**: Build keyword detection engine with HOW/WHAT keyword lists
3. **Lyra**: Design warning dialog mockups (paste detection, untagged content)
4. **Raven**: Write user-facing warning messages (clear, actionable, non-scary)

---

## 🔗 References

- `balans-website/transcripts/2025-11-23-classification-tag-visualization.md` - Previous design session
- `compression/99-output/lumens/classification-system.md` - Dual classification framework
- `compression/1-sources/deep-research/md/dual-classification.md` - Research on WHAT/HOW split

---

## 🚧 Next Session Topics

1. **Warning fatigue mitigation** - How to adjust sensitivity based on user behavior
2. **Bulk classification review** - Tools for reviewing entire documents for leaks
3. **AI-assisted classification** - Using Claude to auto-suggest WHAT vs. HOW tags
4. **Export safety** - Preventing accidental publication of classified content

---

**Session End: 2025-11-23 22:30**  
**Next Session: TBD (after threat defense implementation)**

---

## 📊 Appendix: Keyword Lists

### **HOW Keywords (Implementation Details)**

**Strong signals** (weight: 1.0):
- "implements", "implementation", "algorithm", "internally", "under the hood"
- "function", "method", "class", "module", "package"
- "calls", "invokes", "executes", "runs"
- "uses X library", "depends on", "requires"
- "optimized by", "cached using", "stored in"
- "encrypted with", "hashed using", "signed by"

**Medium signals** (weight: 0.5):
- "uses", "via", "through", "by calling"
- "configuration", "parameters", "settings"
- "protocol", "format", "encoding"
- "performance", "latency", "throughput"

### **WHAT Keywords (Capabilities/Interface)**

**Strong signals** (weight: 1.0):
- "allows", "enables", "provides", "supports", "offers"
- "API", "interface", "endpoint", "capability"
- "user can", "you can", "clients can"
- "feature", "functionality", "behavior"
- "returns", "accepts", "expects", "produces"

**Medium signals** (weight: 0.5):
- "available", "accessible", "exposed"
- "public", "external", "visible"
- "documented", "specified", "defined"

### **Scoring Algorithm**

```typescript
function calculateHOWLikelihood(text: string): number {
  let score = 0;
  const words = text.toLowerCase().split(/\s+/);
  
  for (const word of words) {
    if (HOW_KEYWORDS_STRONG.includes(word)) score += 1.0;
    if (HOW_KEYWORDS_MEDIUM.includes(word)) score += 0.5;
    if (WHAT_KEYWORDS_STRONG.includes(word)) score -= 0.5;
  }
  
  // Normalize by word count
  const density = score / (words.length / 100); // per 100 words
  
  if (density > 3.0) return 'high';      // Very likely HOW content
  if (density > 1.5) return 'medium';    // Possibly HOW content
  return 'low';                          // Likely WHAT content
}
```

**Thresholds:**
- **High (≥3.0)**: Always warn when in `<What>` section
- **Medium (≥1.5)**: Warn only on paste or when exporting
- **Low (<1.5)**: No warning

---

**End of Design Session**

