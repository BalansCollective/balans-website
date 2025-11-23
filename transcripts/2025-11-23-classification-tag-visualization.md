# Design Group Session: Classification Tag Visualization System

**Date:** 2025-11-23  
**Participants:** Morgan (systems thinker), Raven (copywriter), Thorne (technical purist), Lyra (contrarian UX designer)  
**Topic:** How to visualize `<What>` / `<How>` inline tags vs. `<Classification>` sections in Red Forge IDE  
**Session Type:** Collaborative design with constructive disagreement

---

## 📋 Context

We're building the Red Forge IDE - a classification-aware development environment. We have two tagging systems:

**1. Inline `<What>` / `<How>` tags** (most common):
```markdown
<What>
The Publisher API allows you to send messages to topics.
Provides automatic serialization and QoS configuration.
</What>

<How>
Uses Zenoh PUT operation with MessagePack serialization.
Internal buffer: 1000 messages, 3 retries on failure.
</How>
```

**2. Custom `<Classification>` sections** (for overrides):
```markdown
<Classification what="SECRET" how="TOP_SECRET">
This section has different classification levels than document default.
Mixed content with custom WHAT and HOW levels.
</Classification>
```

**Current visualization:** Dual colored lines on the left (WHAT line + HOW line)

**Problem:** Should `<What>` / `<How>` tags use:
- **Semantic colors** (blue = what, yellow = how) regardless of actual classification?
- **Classification colors** (based on actual security level from frontmatter)?
- **Something else entirely**?

---

## 🗣️ Session Transcript

**Morgan:** Let's start with the user's workflow. They write documentation with inline `<What>` and `<How>` tags. The frontmatter declares the document's classification levels. What are they trying to *see* when they look at the preview?

**Raven:** They need to see **which dimension** they're reading. "Am I reading about capabilities (WHAT) or implementation details (HOW)?" That's the primary cognitive task.

**Lyra:** I disagree. The primary task is **security awareness**: "What classification level is this content?" If I'm reading HOW content classified as SECRET, I need to know that immediately.

**Thorne:** Both are important. The question is: can one visual system communicate both dimension (what/how) AND security level (U/C/S/TS)?

**Morgan:** Let's look at the data. In a typical document:
- Frontmatter: `what: UNCLASSIFIED, how: CONFIDENTIAL`
- 80% of content uses inline `<What>` and `<How>` tags (inherit from frontmatter)
- 20% uses explicit `<Classification>` sections (override default)

So the common case is: "I know the classification already (it's in the frontmatter), I just need to know which dimension I'm reading."

**Raven:** Exactly! If I've already seen the frontmatter says HOW is CONFIDENTIAL, I don't need every `<How>` tag to scream "THIS IS CONFIDENTIAL" at me. I just need to know "this is implementation details, not capabilities."

**Lyra:** But what if the document has 50 pages? You scroll down, you've forgotten the frontmatter. You need the classification visible inline.

**Thorne:** *pulls up classification-system.md* The dual classification system came from US classified documents. They use **inline markings** like "(S)" or "(U)" on every paragraph because you can't trust readers to remember the header.

**Morgan:** That's a good point. But those markings are *text*, not color. Color is ambient - you see it peripherally. Text is explicit - you have to read it.

**Raven:** What if we use **both**? Semantic color (blue/yellow for what/how) as the primary visual, and actual classification level in a tooltip or subtle indicator?

**Lyra:** Okay, let me sketch this:

**Option A: Semantic Color Lines**
```
<What>                  │ Blue line (semantic: "this is WHAT content")
API is public
</What>

<How>                   │ Yellow line (semantic: "this is HOW content")
Secret algorithm
</How>
```

- **Pro:** Instant dimension recognition
- **Con:** No security level visible
- **Fix:** Hover tooltip shows classification

---

**Option B: Classification Color Lines**
```
<What>                  │ Blue line (UNCLASSIFIED from frontmatter)
API is public
</What>

<How>                   │ Red line (SECRET from frontmatter)
Secret algorithm
</How>
```

- **Pro:** Security level always visible
- **Con:** Dimension meaning requires memorization ("which dimension is blue again?")

---

**Option C: Dual Lines (Both Dimensions Always Shown)**
```
<What>                  ││ Blue (WHAT: U) + Gray (HOW: N/A)
API is public
</What>

<How>                   ││ Gray (WHAT: N/A) + Red (HOW: S)
Secret algorithm
</How>

<Classification what="U" how="S">
Mixed content           ││ Blue (WHAT: U) + Red (HOW: S)
</Classification>
```

- **Pro:** Consistent system, always shows both dimensions
- **Con:** Visual noise, gray lines feel incomplete

---

**Thorne:** *skeptical* Option C is technically consistent, but it feels wrong. If I'm reading `<What>` content, why show the HOW dimension at all?

**Morgan:** Because classification is fundamentally dual-dimensional. Even if you're only reading WHAT content, the HOW classification still exists. Showing it as gray communicates "this section doesn't contain HOW information, but if it did, it would be classified at level X."

**Lyra:** That's way too abstract. Users don't think like that.

**Raven:** What if the problem is our tagging model itself? We're asking users to tag content as `<What>` or `<How>`, but reality is messier. What about mixed paragraphs?

**Lyra:** *pauses* That's actually the core issue. Look at this example:

```markdown
The Publisher API allows sending messages (WHAT: capability),
implemented using Zenoh PUT with MessagePack (HOW: implementation).
```

That's ONE sentence with BOTH dimensions. How do we tag that?

**Thorne:** We don't. We require users to split it:

```markdown
<What>
The Publisher API allows sending messages.
</What>

<How>
Implemented using Zenoh PUT with MessagePack.
</How>
```

**Raven:** But that breaks natural writing flow! Real documentation mixes WHAT and HOW fluidly.

**Morgan:** *thinking* What if mixed content defaults to BOTH classifications? Like:

```markdown
The Publisher API allows sending messages (WHAT: U),
implemented using Zenoh PUT with MessagePack (HOW: C).
```

→ This paragraph gets classified as `max(WHAT, HOW) = CONFIDENTIAL` because it contains HOW information.

**Lyra:** Okay, now we're getting somewhere. So the rules are:
1. **Pure `<What>` sections**: Classified at WHAT level
2. **Pure `<How>` sections**: Classified at HOW level
3. **Mixed or untagged**: Classified at `max(WHAT, HOW)` (strictest)

**Thorne:** That's "secure by default" - mixed content is treated as sensitive unless explicitly separated.

**Raven:** I like it, but it doesn't answer our visualization question. How do we show this?

**Morgan:** Let's map it out:

| Content Type | Classification Level | Visual |
|--------------|---------------------|--------|
| `<What>` tag | WHAT from frontmatter | Single line (WHAT color) |
| `<How>` tag | HOW from frontmatter | Single line (HOW color) |
| Untagged | `max(WHAT, HOW)` | Single line (strictest color) with warning icon |
| `<Classification>` | Explicit override | Dual lines (WHAT + HOW colors) |

**Lyra:** Wait, so inline tags get **single lines** and explicit sections get **dual lines**? That's visually inconsistent.

**Thorne:** But it's semantically consistent. Single-dimension content (pure WHAT or pure HOW) gets one line. Multi-dimension content (mixed) gets two lines.

**Raven:** What about the warning icon for untagged content? That feels punitive.

**Morgan:** It's not punitive, it's informative. "Hey, you forgot to tag this, so we're treating it as sensitive by default."

**Lyra:** Okay, but what about long documents where most content IS properly tagged? You don't want warning icons everywhere just because someone forgot the frontmatter.

**Thorne:** If frontmatter exists, untagged content inherits `max(WHAT, HOW)` silently (no warning). If frontmatter is MISSING, show warning. Sound good?

**Raven:** Yes! So the full system is:

**With frontmatter** (`what: U, how: C`):
- `<What>` → Blue line (U)
- `<How>` → Yellow line (C)
- Untagged → Yellow line (max = C, inherited)
- `<Classification what="S" how="TS">` → Red + Dark red dual lines

**Without frontmatter** (defaults to U/U):
- `<What>` → Blue line (U)
- `<How>` → Blue line (U)  
- Untagged → ⚠️ Warning + blue line

**Morgan:** I think we have consensus. But I want to test one more edge case. What if frontmatter says `what: SECRET, how: UNCLASSIFIED`? (Unusual, but possible - secret capability, public implementation)

**Lyra:** That's... weird. Why would capabilities be secret but implementation be public?

**Thorne:** Adversarial robustness? "We have a system that does X (secret), here's how it works (public for transparency)."

**Raven:** Or patent protection. "This product does X (trade secret), implementation is open source."

**Morgan:** Fair. So:
- `<What>` → Red line (S)
- `<How>` → Blue line (U)
- Untagged → Red line (max = S)

The visual still works.

**Lyra:** Okay, final proposal. Let me summarize:

---

## 🎯 Decisions Made

### ✅ Agreed Upon:

**1. Tagging Model:**
- `<What>` tags = capability/interface information
- `<How>` tags = implementation/algorithm information  
- `<Classification what="X" how="Y">` = explicit override for mixed content
- Untagged = inherits `max(WHAT, HOW)` from frontmatter (secure by default)

**2. Visualization System:**

**Single-Line (Dimension-Specific Content):**
- `<What>` content → **Single colored line** matching WHAT classification level
- `<How>` content → **Single colored line** matching HOW classification level
- Untagged content → **Single colored line** matching `max(WHAT, HOW)` level
- Line is **dimmed (60% opacity)** if inherited from frontmatter, **full opacity (100%)** if explicitly tagged

**Dual-Line (Mixed Content):**
- `<Classification what="X" how="Y">` → **Two colored lines** (left=WHAT, right=HOW)
- Both lines at **full opacity (100%)**
- Background tint matches HOW level (since HOW is typically more sensitive)

**3. Color Mapping:**
- **UNCLASSIFIED** → Blue `#60a5fa`
- **CONFIDENTIAL** → Yellow `#facc15`
- **SECRET** → Red `#f87171`
- **TOP_SECRET** → Dark Red `#dc2626`

**4. Tooltip Behavior:**
- Hover over line → Show classification level + dimension
- Single line: "WHAT: UNCLASSIFIED (inherited)"
- Dual lines: "WHAT: UNCLASSIFIED / HOW: CONFIDENTIAL"

**5. Warning Indicators:**
- If **no frontmatter** exists → Show ⚠️ icon + message at top
- Individual untagged sections → No warning if frontmatter exists (silent inheritance)

---

### 🤔 Still Debating:

1. **Should we support inline mixed tagging?** (e.g., `<What>API</What> using <How>Zenoh</How>` in same paragraph)
2. **Should untagged content have a "tag me" button** in edit mode?
3. **How to handle classification downgrades** (e.g., SECRET → CONFIDENTIAL after review)?

---

### 📝 Action Items:

1. **Thorne**: Implement single-line vs. dual-line rendering logic in `MDXRenderer.tsx`
2. **Morgan**: Update demo content to show all edge cases (pure WHAT, pure HOW, mixed, untagged)
3. **Lyra**: Design "tag me" UI for untagged content (if we decide to add it)
4. **Raven**: Write user documentation explaining when to use `<What>`, `<How>`, vs. `<Classification>`

---

## 💡 Key Insights

**Morgan's Contribution:**
> "Single-dimension content (pure WHAT or pure HOW) should get single lines. Multi-dimension content (mixed) should get dual lines. The visual structure reflects the semantic structure."

**Lyra's Contribution:**
> "Real documentation mixes WHAT and HOW fluidly. Our tagging system needs to handle mixed content gracefully, not force artificial separation."

**Thorne's Contribution:**
> "Secure by default: untagged content inherits the strictest classification. If you want lower classification, you must tag explicitly."

**Raven's Contribution:**
> "Inherited classification should be visually distinct from explicit classification (dimmed lines). Users need to see what they explicitly marked vs. what the system inferred."

---

## 🔗 References

- `compression/99-output/lumens/classification-system.md` - Dual classification framework
- `compression/1-sources/deep-research/md/dual-classification.md` - Research on WHAT/HOW split
- `balans-website/src/lib/red-forge/design-tokens.ts` - Classification colors
- `balans-website/src/components/red-forge/MDXRenderer.tsx` - Current implementation

---

## 🚧 Next Session Topics

1. **Edit mode UI** - How to help users tag content (autocomplete? hints? linting?)
2. **Classification workflows** - How to request upgrades/downgrades
3. **Cross-document references** - What happens when linking to content with different classification?
4. **AI assistance** - Can Claude auto-tag WHAT vs. HOW content?

---

**Session End: 2025-11-23 21:15**  
**Next Session: TBD (after implementation complete)**

---

## 📊 Appendix: Visual Examples

### Example 1: Pure WHAT Content

```markdown
<What>
The Publisher API allows you to send messages to a topic.
Provides automatic type serialization and QoS configuration.
</What>
```

**Visual:**
```
│ The Publisher API allows you to send messages...
│ (Single blue line, WHAT: UNCLASSIFIED)
```

---

### Example 2: Pure HOW Content

```markdown
<How>
Implementation uses Zenoh PUT operation with MessagePack serialization.
Internal buffer size: 1000 messages. Retries up to 3 times on network failure.
</How>
```

**Visual:**
```
│ Implementation uses Zenoh PUT operation with...
│ (Single yellow line, HOW: CONFIDENTIAL)
```

---

### Example 3: Mixed Content (Explicit Classification)

```markdown
<Classification what="UNCLASSIFIED" how="SECRET">
The Publisher uses a custom queueing algorithm (WHAT: queue exists, HOW: algorithm details).
Priority levels: LOW=0.1, NORMAL=0.5, HIGH=0.9, CRITICAL=1.0 (HOW: specific values).
External systems can check queue depth via /metrics endpoint (WHAT: observable behavior).
</Classification>
```

**Visual:**
```
││ The Publisher uses a custom queueing algorithm...
││ (Dual lines: left=blue WHAT:U, right=red HOW:S)
││ Background tint: red (matches HOW level)
```

---

### Example 4: Untagged Content (Inherits from Frontmatter)

```markdown
---
classification:
  what: UNCLASSIFIED
  how: CONFIDENTIAL
---

# Publisher Overview

The Publisher component manages message routing and delivery.
It integrates with Zenoh's session management system.
```

**Visual:**
```
│ # Publisher Overview
│ (Single dimmed yellow line, 60% opacity - inherited max(U,C)=C)
│
│ The Publisher component manages message routing...
│ (Single dimmed yellow line, 60% opacity - inherited)
```

---

### Example 5: Missing Frontmatter (Warning)

```markdown
# Publisher API

The Publisher allows sending messages.
```

**Visual:**
```
⚠️ Warning: No classification frontmatter found. Content defaults to UNCLASSIFIED/UNCLASSIFIED.

│ # Publisher API
│ (Single blue line with warning icon)
```

---

## 🎨 Implementation Notes

### Rendering Logic (Pseudocode)

```typescript
function renderBlock(block: ContentBlock, frontmatter: Classification) {
  // Determine classification
  if (block.tag === 'What') {
    classification = frontmatter.what;
    showSingleLine(classification, 'WHAT', isInherited=true);
  }
  else if (block.tag === 'How') {
    classification = frontmatter.how;
    showSingleLine(classification, 'HOW', isInherited=true);
  }
  else if (block.tag === 'Classification') {
    showDualLine(block.what, block.how, isInherited=false);
  }
  else {
    // Untagged - inherit max
    classification = max(frontmatter.what, frontmatter.how);
    showSingleLine(classification, 'MIXED', isInherited=true);
  }
}

function showSingleLine(level, dimension, isInherited) {
  const color = CLASSIFICATION_COLORS[level];
  const opacity = isInherited ? 0.6 : 1.0;
  return (
    <div className="relative pl-4">
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: color, opacity }}
        title={`${dimension}: ${level} ${isInherited ? '(inherited)' : ''}`}
      />
      {content}
    </div>
  );
}

function showDualLine(whatLevel, howLevel, isInherited=false) {
  const whatColor = CLASSIFICATION_COLORS[whatLevel];
  const howColor = CLASSIFICATION_COLORS[howLevel];
  return (
    <div className="relative pl-6">
      <div 
        className="absolute left-0 w-[2px]"
        style={{ backgroundColor: whatColor }}
        title={`WHAT: ${whatLevel}`}
      />
      <div 
        className="absolute left-[3px] w-[3px]"
        style={{ backgroundColor: howColor }}
        title={`HOW: ${howLevel}`}
      />
      {content}
    </div>
  );
}
```

---

**End of Design Session**

