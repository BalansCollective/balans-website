---
session_id: "CLASSIFICATION-COLOR-SEMANTICS"
session_type: "Security UX Design Session"
date: "2025-11-23"
participants: ["Bruce Schneier", "Don Norman", "Edward Tufte", "Susan Kare", "Morgan (Balans)", "Thorne (Balans)"]
focus: "Choosing classification colors: Should SECRET be yellow (no-internet warning) or red (danger)?"
context: "Need to decide color mapping for U/C/S/TS classification levels. Current proposal: Blue/Yellow/Red/DarkRed. Question: Does yellow = 'caution/no-internet' make more sense than red = 'danger'?"
status: "IN_PROGRESS"
---

# Classification Color Semantics: Yellow vs. Red for SECRET

## 🎯 Problem Statement

**Current Color Mapping:**
- **UNCLASSIFIED** → Blue `#60a5fa`
- **CONFIDENTIAL** → Yellow `#facc15`
- **SECRET** → Red `#f87171`
- **TOP_SECRET** → Dark Red `#dc2626`

**User's Question:**
> "Can we have SECRET in yellow (no-internet warning) or do we need red?"

**Interpretation:**
- **Yellow** = "Caution: No internet allowed" (operational constraint)
- **Red** = "Danger: Serious security risk" (threat level)

---

## 🗣️ Session Transcript

### Opening: What Do Colors Mean?

**Don Norman:** *cognitive scientist, "The Design of Everyday Things"* Let's start with universal color semantics. What do these colors mean to most people?

**Universal Color Meanings:**
- 🔵 **Blue** = Neutral, safe, information, public
- 🟡 **Yellow** = Caution, warning, attention needed
- 🔴 **Red** = Danger, stop, error, prohibited
- ⚫ **Black/Dark** = Maximum restriction, highest severity

**Edward Tufte:** These are learned from traffic lights, warning labels, and decades of UI conventions. We can't fight them.

**Susan Kare:** Agreed. But context matters. In a *classification system*, what's the primary user need?

---

### Two Mental Models

**Morgan:** I think we're confusing two different mental models:

#### **Model A: Threat Level (Current)**
- Blue = No threat (public information)
- Yellow = Medium threat (internal only)
- Red = High threat (restricted access)
- Dark Red = Critical threat (maximum security)

**Semantics:** Color indicates **how dangerous** it is if this leaks.

---

#### **Model B: Operational Constraint (User's Proposal)**
- Blue = Internet OK (can send to AI, share externally)
- Yellow = No internet (work offline only, no external services)
- Red = ??? (what's worse than "no internet"?)

**Semantics:** Color indicates **what you're allowed to do** with this content.

---

**Bruce Schneier:** Model B is interesting, but it breaks down at RED. What's more restrictive than "no internet"?

**Thorne:** Maybe:
- Yellow = No internet
- Red = No copying/pasting (must air-gap)
- Dark Red = No digital storage (paper only)

**Don Norman:** That's too abstract. Most users won't understand "air-gap" or "paper only" from color alone.

**Susan Kare:** And it's not standard. Every other classification system uses **threat level**, not **operational constraint**.

---

### Real-World Reference: US Classification Colors

**Bruce Schneier:** Let's look at how the US government does it:

**Official US Document Markings:**
- **UNCLASSIFIED** → No special color (black text on white)
- **CONFIDENTIAL** → No official color (but often blue in practice)
- **SECRET** → No official color (but often red/orange in practice)
- **TOP SECRET** → No official color (but often red in practice)

**Key Insight:** Official documents don't use color for classification - they use **text labels** ("TOP SECRET" in all caps). Color is a UI affordance, not a standard.

**Edward Tufte:** So we have freedom to choose. The question is: what serves users best?

---

### User Need Analysis

**Morgan:** Let's think about what users need to see at a glance:

**Scenario 1: Writing Documentation**
- User is typing in a `<How>` section
- They need to know: "How sensitive is this content?"
- **Current (Red):** "This is dangerous - be very careful"
- **Proposed (Yellow):** "This is offline-only - don't send to AI"

**Scenario 2: Reviewing Document**
- User scrolls through a long document
- They need to quickly identify: "Where are the sensitive parts?"
- **Current (Red):** Red sections jump out as "high risk"
- **Proposed (Yellow):** Yellow sections feel like "warnings" (less urgent than red)

**Scenario 3: Extracting for AI**
- User wants to send UNCLASSIFIED content to Claude
- They need to see: "What's safe to send?"
- **Current (Red excluded):** Green (safe) vs. Red (excluded) - high contrast
- **Proposed (Yellow excluded):** Green (safe) vs. Yellow (excluded) - medium contrast

---

**Don Norman:** I vote for **red = SECRET** because:
1. **Perceptual salience:** Red grabs attention more than yellow
2. **Established convention:** Red = danger/restricted in most UIs
3. **Visual hierarchy:** Green (safe) → Yellow (caution) → Red (danger) is natural progression

**Susan Kare:** I agree, but I want to add **nuance**. What if we use:
- **Yellow** = "Caution: Review before sharing" (CONFIDENTIAL)
- **Red** = "Stop: Do not share externally" (SECRET)
- **Dark Red** = "Stop: Maximum restriction" (TOP SECRET)

The **yellow** stage is "think carefully", the **red** stage is "do not proceed".

---

### The "No Internet" Signal

**Thorne:** I think the user's instinct about "no internet" is good, but it should be an **additional signal**, not the primary color.

**Proposal:** Add an icon + tooltip overlay:

```
┌─────────────────────────────────┐
│ <How>                           │
│ │ Secret implementation details │ ← Red line (SECRET)
│ │ 🚫🌐 Offline only             │ ← Icon: "No internet"
│ │                               │
│ │ Uses AES-256 with custom key  │
│ │ derivation algorithm...       │
└─────────────────────────────────┘
```

**Icon Meanings:**
- 🌐 = "Internet OK" (UNCLASSIFIED)
- 🚫🌐 = "No internet" (CONFIDENTIAL and above)
- 🔒🚫🌐 = "No internet + no external storage" (SECRET and above)

**Bruce Schneier:** I like this. Color indicates **threat level** (universal), icon indicates **operational constraint** (specific).

**Edward Tufte:** Agreed. Color is ambient (you see it peripherally), icon is explicit (you read it when you need details).

---

## 🎯 Decision: Hybrid System

### ✅ Agreed Upon: Color + Icon System

**Colors indicate threat level:**
- 🔵 **UNCLASSIFIED** = Blue (safe, public)
- 🟡 **CONFIDENTIAL** = Yellow (caution, internal only)
- 🔴 **SECRET** = Red (danger, restricted access)
- 🔴 **TOP_SECRET** = Dark Red (maximum danger, highest restriction)

**Icons indicate operational constraint:**
- 🌐 **UNCLASSIFIED** = "Internet OK - can share with external AI"
- 🚫🌐 **CONFIDENTIAL** = "No internet - work offline only"
- 🔒🚫🌐 **SECRET** = "Air-gapped - no external services"
- ⛔🔒🚫🌐 **TOP SECRET** = "Maximum restriction - no digital export"

---

### Visual Implementation

#### **In Edit Mode:**

```
<What> section (UNCLASSIFIED):
┌─────────────────────────────────┐
│ 🌐 WHAT: UNCLASSIFIED          │ ← Blue line + internet icon
│ The Publisher API allows...     │
└─────────────────────────────────┘

<How> section (CONFIDENTIAL):
┌─────────────────────────────────┐
│ 🚫🌐 HOW: CONFIDENTIAL         │ ← Yellow line + no-internet icon
│ Uses Zenoh PUT operation...     │
└─────────────────────────────────┘

<How> section (SECRET):
┌─────────────────────────────────┐
│ 🔒🚫🌐 HOW: SECRET             │ ← Red line + lock+no-internet icon
│ Custom key derivation with...   │
└─────────────────────────────────┘
```

---

#### **In Declassification Preview:**

```
┌────────────────────────────────────────────┐
│ 🔓 Declassification Preview               │
│                                           │
│ ✅ SAFE TO SEND (450 tokens) 🌐          │ ← Green + internet OK
│ ┌─────────────────────────────────────────┐│
│ │ <What> UNCLASSIFIED content...        ││
│ └─────────────────────────────────────────┘│
│                                           │
│ 🔒 EXCLUDED (1200 tokens) 🚫🌐           │ ← Red + no internet
│ ┌─────────────────────────────────────────┐│
│ │ <How> SECRET content [REDACTED]       ││
│ └─────────────────────────────────────────┘│
└────────────────────────────────────────────┘
```

---

### Tooltip Behavior

**Hover over classification line:**

```
┌─────────────────────────────────────┐
│ SECRET                              │
│ ─────────────────────────────────   │
│ Threat Level: High                  │
│ Operational Constraint:             │
│ • No internet access                │
│ • No external AI services           │
│ • Work offline only                 │
│                                     │
│ If this content leaks:              │
│ • Serious damage to national        │
│   security                          │
│ • Criminal penalties may apply      │
└─────────────────────────────────────┘
```

**Don Norman:** Perfect. The tooltip explains **both** the threat and the operational constraint. Color is the ambient signal, tooltip is the detailed explanation.

---

## 💡 Key Insights

**Bruce Schneier's Contribution:**
> "Color alone can't communicate both threat level AND operational constraint. We need a hybrid system: color for threat (universal), icon for constraint (specific)."

**Don Norman's Contribution:**
> "Red has stronger perceptual salience than yellow. For SECRET content, we want maximum attention-grabbing. Red is the right choice."

**Edward Tufte's Contribution:**
> "Layered encoding: Color (ambient) → Icon (explicit) → Tooltip (detailed). Each layer adds specificity without overwhelming the primary view."

**Susan Kare's Contribution:**
> "Icons must be instantly recognizable. 🌐 = internet, 🚫🌐 = no internet, 🔒 = locked. These are universal symbols that need no explanation."

---

## 📋 Final Color + Icon Mapping

| Classification | Color | Icon | Meaning |
|----------------|-------|------|---------|
| **UNCLASSIFIED** | 🔵 Blue `#60a5fa` | 🌐 | Internet OK - Share freely |
| **CONFIDENTIAL** | 🟡 Yellow `#facc15` | 🚫🌐 | No internet - Internal only |
| **SECRET** | 🔴 Red `#f87171` | 🔒🚫🌐 | Air-gapped - No external services |
| **TOP_SECRET** | 🔴 Dark Red `#dc2626` | ⛔🔒🚫🌐 | Maximum restriction - No digital export |

---

## 🤔 Still Debating:

1. **Should icons be always visible or hover-only?** (Always = more clutter, Hover = less discoverable)
2. **Should we use emoji or SVG icons?** (Emoji = universal but inconsistent, SVG = consistent but requires design)
3. **Should "No internet" disable network features in the IDE?** (Auto-disconnect when viewing SECRET content?)

---

## 📝 Action Items:

1. **Thorne**: Update `design-tokens.ts` to keep RED for SECRET (no change needed)
2. **Susan**: Design icon set (🌐, 🚫🌐, 🔒, ⛔) as SVG
3. **Morgan**: Add icon rendering to classification lines
4. **Don**: Design tooltip content for each classification level
5. **Bruce**: Write operational constraint descriptions (what "no internet" means in practice)

---

## 🔗 References

- `balans-website/src/lib/red-forge/design-tokens.ts` - Current color mapping
- `balans-website/transcripts/2025-11-23-declassification-workflow-session.md` - Declassification workflow
- US Government Classification Guide - Standard markings and procedures

---

**Session End: 2025-11-23 23:45**  
**Next Session: Icon design workshop**

---

## 📊 Appendix: Perceptual Testing

### **Color Salience Test**

**Question:** Which color grabs your attention first in a document?

**Test Setup:** Show users a document with blue, yellow, and red sections. Track eye movements.

**Predicted Results:**
1. **Red** noticed first (85% of users)
2. **Yellow** noticed second (60% of users)
3. **Blue** noticed third (40% of users)

**Conclusion:** Red is most salient → Best for SECRET (needs maximum attention)

---

### **Operational Constraint Clarity Test**

**Question:** What does this color mean to you?

**Test A: Color only**
- Show red section, ask: "What does this mean?"
- Expected answers: "Dangerous", "Don't share", "Restricted"
- Few users say: "No internet allowed" (not intuitive)

**Test B: Color + Icon**
- Show red section with 🚫🌐 icon, ask: "What does this mean?"
- Expected answers: "No internet", "Offline only", "Can't send externally"
- Icon makes operational constraint explicit

**Conclusion:** Need icon to communicate operational constraint, color alone isn't enough

---

**End of Design Session**

