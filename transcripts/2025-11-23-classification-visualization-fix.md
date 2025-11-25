# Design Session: Classification Visualization UX Issues

**Date:** 2025-11-23  
**Session Type:** Emergency Design Review  
**Trigger:** User confusion about classification visualization in Red Forge IDE MDX preview  
**Participants:** Sam (Product Owner), Thorne (Implementation), Design Group (Morgan, Alex, Casey)

---

## 🚨 Problem Statement

**Sam's Feedback:**
> "I have no idea what the different shades of yellow mean. Bad design I think."

**Context:**
- MDX preview shows dual-line visualization (WHAT + HOW colors)
- Tooltip shows classification levels: "WHAT: CONFIDENTIAL / HOW: SECRET"
- BUT: User can't tell if a section is tagged as `<What>`, `<How>`, or untagged default
- Different opacities (60% vs 100%) signal default vs explicit, but this is too subtle

**Core Issue:** We're showing SECURITY LEVEL but not SEMANTIC TAG (what/how).

---

## 🎯 Design Group Analysis

### Morgan (UX Perspective)

**What Went Wrong:**
- We optimized for "security first" (show classification level)
- But users need to know "is this WHAT or HOW content?"
- Opacity difference (60% vs 100%) is too subtle - not discoverable
- Tooltip doesn't communicate the most important information: tag type

**What Users Actually Need:**
1. **Primary:** Is this `<What>` content or `<How>` content?
2. **Secondary:** What's the classification level?
3. **Tertiary:** Is this explicit or inherited?

**Current Design:**
```
Tooltip: "WHAT: CONFIDENTIAL / HOW: SECRET"
Visual: Two yellow lines (both same color = CONFIDENTIAL)
User thinks: "Why are there two yellow lines? What does this mean?"
```

**Better Design:**
```
Tooltip: "<What> content (CONFIDENTIAL)"
Visual: Blue icon 📘 + single blue line
User thinks: "Oh, this is WHAT content (capability), it's CONFIDENTIAL"
```

### Alex (Visual Design Perspective)

**Color Confusion:**
- Dual lines work when WHAT ≠ HOW (e.g., blue + yellow)
- But when WHAT = HOW (both yellow), it looks like one thick yellow line
- User can't tell if it's a `<What>` block, `<How>` block, or `<Classification>` block

**Proposed Visual Fix:**

**Option 1: Icon + Color**
```
📘 │ <What> content here (blue line)
🔧 │ <How> content here (yellow line)
⚠️ │ Untagged content (dimmed yellow line)
```

**Option 2: Label in Margin**
```
WHAT │ Content here (blue line)
HOW  │ Content here (yellow line)
DEFAULT │ Untagged (dimmed line)
```

**Option 3: Tooltip Shows Tag Type First**
```
Current: "WHAT: CONFIDENTIAL / HOW: SECRET"
Proposed: "<What> section • CONFIDENTIAL classification"
```

### Casey (Information Architecture Perspective)

**Hierarchy Problem:**
- We're presenting TWO classification levels (WHAT + HOW) in parallel
- But user is looking at ONE block of content at a time
- Each block should have ONE primary classification

**Conceptual Model:**
```markdown
<What>
  This block is WHAT content.
  Classification: UNCLASSIFIED (from WHAT frontmatter)
</What>

<How>
  This block is HOW content.
  Classification: CONFIDENTIAL (from HOW frontmatter)
</How>
```

**Current rendering shows BOTH lines even though content is only ONE type!**

**Root Cause:** We're treating dual classification as "show both lines always" instead of "show the relevant line for this content type."

---

## 💡 Proposed Solution (Consensus)

### Visual Design

**For `<What>` Blocks:**
- Show ONLY the WHAT classification line (single line, WHAT color)
- Icon in margin: 📘
- Tooltip: `"<What> content • UNCLASSIFIED"`

**For `<How>` Blocks:**
- Show ONLY the HOW classification line (single line, HOW color)
- Icon in margin: 🔧
- Tooltip: `"<How> content • CONFIDENTIAL"`

**For Untagged Blocks (Security-First Default):**
- Show single line in STRICTEST color (max of WHAT/HOW)
- Icon in margin: ⚠️ (dimmed)
- Tooltip: `"Untagged content • Defaults to CONFIDENTIAL (strictest)"`
- Opacity: 60% (dimmer) to signal "you should tag this"

**For Legacy `<Classification>` Blocks:**
- Show single line in classification color
- Icon in margin: 🔒
- Tooltip: `"<Classification> block • CONFIDENTIAL"`

---

## 🎨 Visual Examples

### Before (Confusing)
```
│ │ Public API description
│ │ [Two yellow lines, tooltip: "WHAT: CONFIDENTIAL / HOW: CONFIDENTIAL"]
│ │ User: "Why two lines if both are yellow?"
```

### After (Clear)
```
📘 │ Public API description
    [Single blue line, tooltip: "<What> content • UNCLASSIFIED"]
    User: "This is WHAT content (capability), it's unclassified"

🔧 │ Uses AES-256 encryption
    [Single yellow line, tooltip: "<How> content • CONFIDENTIAL"]
    User: "This is HOW content (implementation), it's confidential"

⚠️ │ Some untagged paragraph
    [Single yellow line (dimmed), tooltip: "Untagged • Defaults to CONFIDENTIAL"]
    User: "I should tag this as WHAT or HOW"
```

---

## 🔧 Implementation Changes

### 1. Parsing Logic (No Change)
- Still parse `<What>`, `<How>`, and `<Classification>` tags
- Still apply frontmatter defaults

### 2. Rendering Logic (CHANGE)

**Before:**
```typescript
// Always show dual lines (WHAT + HOW)
const whatStyle = getClassificationStyle(block.what);
const howStyle = getClassificationStyle(block.how);
// Render both lines
```

**After:**
```typescript
interface ClassificationBlock {
  type: 'what' | 'how' | 'classification' | 'untagged';
  level: SecurityLevel; // The actual classification level for THIS block
  content: string;
  isDefault: boolean;
}

// Render single line based on block type
const getBlockStyle = (block: ClassificationBlock) => {
  if (block.type === 'what') return { icon: '📘', color: CLASSIFICATION_COLORS[block.level] };
  if (block.type === 'how') return { icon: '🔧', color: CLASSIFICATION_COLORS[block.level] };
  if (block.type === 'untagged') return { icon: '⚠️', color: CLASSIFICATION_COLORS[block.level], opacity: 0.6 };
  return { icon: '🔒', color: CLASSIFICATION_COLORS[block.level] };
};
```

### 3. Tooltip Text (CHANGE)

**Before:**
```typescript
<span>WHAT: {block.what}</span> / <span>HOW: {block.how}</span>
```

**After:**
```typescript
{block.type === 'what' && <span>📘 &lt;What&gt; content • {block.level}</span>}
{block.type === 'how' && <span>🔧 &lt;How&gt; content • {block.level}</span>}
{block.type === 'untagged' && <span>⚠️ Untagged • Defaults to {block.level}</span>}
{block.type === 'classification' && <span>🔒 &lt;Classification&gt; • {block.level}</span>}
```

---

## 📊 User Testing Scenarios

### Scenario 1: User Opens `red-forge-overview.md`

**Expected Behavior:**
- Sees 📘 icon next to "Red Forge provides..." section
- Hovers: Tooltip says `"<What> content • UNCLASSIFIED"`
- Blue line on left
- User understands: "This is describing WHAT the system does (capability)"

**Expected Behavior:**
- Sees 🔧 icon next to "Implementation uses..." section
- Hovers: Tooltip says `"<How> content • CONFIDENTIAL"`
- Yellow line on left
- User understands: "This is describing HOW it's implemented (internal details)"

### Scenario 2: User Sees Untagged Content

**Expected Behavior:**
- Sees ⚠️ icon (dimmed) next to untagged paragraph
- Hovers: Tooltip says `"Untagged content • Defaults to CONFIDENTIAL (strictest)"`
- Dimmed yellow line on left (60% opacity)
- User understands: "I should tag this as WHAT or HOW to control its classification"

### Scenario 3: User Opens Legacy Doc

**Expected Behavior:**
- Sees 🔒 icon next to `<Classification level="CONFIDENTIAL">` section
- Hovers: Tooltip says `"<Classification> block • CONFIDENTIAL"`
- Single yellow line on left
- User understands: "This uses legacy single-classification tagging"

---

## ✅ Design Group Consensus

**Vote:**
- Morgan: ✅ YES (this fixes the confusion)
- Alex: ✅ YES (icons + single line = clear hierarchy)
- Casey: ✅ YES (matches user mental model)

**Unanimous approval:** Change from "dual lines always" to "single line for content type."

---

## 🚨 Breaking Change Assessment

**Does this break existing design decisions?**

**NO** - This refines the visualization, doesn't contradict security model:
- ✅ Still supports dual WHAT/HOW classification (in frontmatter)
- ✅ Still defaults untagged to strictest (security-first)
- ✅ Still shows explicit vs inherited (via opacity)
- ✅ Still supports legacy single classification

**What changes:**
- Visual: Two lines → One line (per content block)
- Tooltip: Shows tag type first, classification second
- Icons: Added to margin for quick scanning

---

## 📋 Action Items for Thorne

- [ ] Update `ClassificationBlock` interface to include `type: 'what' | 'how' | 'untagged' | 'classification'`
- [ ] Modify parsing logic to set `type` field based on tag
- [ ] Update rendering to show single line + icon based on `type`
- [ ] Update tooltip text to show tag type first
- [ ] Test with all three demo files
- [ ] Update design tokens to include icons

---

## 🎯 Expected Outcome

**Before:** "I have no idea what the different shades of yellow mean."  
**After:** "📘 means WHAT (capability), 🔧 means HOW (implementation), ⚠️ means I should tag it."

**User can now:**
1. Instantly identify content type (icon)
2. See classification level (color)
3. Know if they need to tag (dimmed = untagged)

---

**Design Group: APPROVED ✅**  
**Ready for implementation.**

