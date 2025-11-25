# Design Session: Network Zone as Primary Classification

**Date:** 2025-11-23  
**Session Type:** Paradigm Shift  
**Trigger:** Sam's insight - "Do we do LLM level (open cloud, red forge, on-prem, airgapped)?"  
**Participants:** Sam (Product Owner), Thorne (Implementation), Design Group (Morgan, Alex, Casey)

---

## 🎯 The Insight

**Sam's Question:**
> "Do we do LLM level (open cloud, red forge, on-prem, airgapped)?"

**What this means:**
- Users don't think "WHAT vs HOW" or "CONFIDENTIAL vs SECRET"
- Users think "Can I send this to ChatGPT?" or "Can I send to Red Forge?" or "Can I send to on-prem?"
- **The network zone IS the classification!**

---

## 🧠 Reframing the Problem

### Morgan (User Mental Model - REVISED)

**User's ACTUAL workflow:**

1. Writing docs in Red Forge IDE
2. Wants to get AI help with specific sections
3. Asks: **"Which AI can I use for this paragraph?"**

**Not asking:**
- ❌ "Is this WHAT or HOW?" (too abstract)
- ❌ "Is this CONFIDENTIAL or SECRET?" (too formal)

**Actually asking:**
- ✅ "Can I send to OpenAI/Claude?" (White Network)
- ✅ "Can I send to Red Forge LLM?" (Yellow Network)
- ✅ "Can I send to on-prem AI?" (Yellow Network)
- ✅ "Cannot share with ANY AI?" (Red Network - air-gapped only)

**User mental model = Network zones, not classification levels!**

---

## 🎨 Network Zone Classification System

### Four Zones (In Order of Sensitivity)

#### 1. **WHITE NETWORK** 🌐 (Internet AI - OpenAI/Claude)

**Classification:** UNCLASSIFIED  
**AI Access:** External cloud AI (ChatGPT, Claude, Gemini)  
**Content:** Public information, open-source code, general knowledge  
**Visual:** No border, clean text (minimal noise)  

**Example:**
```markdown
This API provides encryption capabilities.
[No visual indicator - safe for any AI]
```

**Tooltip (on hover):**
```
🌐 White Network
• UNCLASSIFIED
• Safe for OpenAI/Claude
• No restrictions
```

---

#### 2. **YELLOW NETWORK** 🏢 (On-Prem AI / Red Forge LLM)

**Classification:** CONFIDENTIAL  
**AI Access:** Red Forge LLM (hosted in Sweden) OR on-prem AI (behind corporate firewall)  
**Content:** Business logic, internal architecture, algorithms (no company secrets)  
**Visual:** Yellow left border (3px) + 🏢 icon  

**Example:**
```markdown
🏢 │ Implementation uses AES-256 in CBC mode.
    [Yellow border - Red Forge/on-prem only]
```

**Tooltip (on hover):**
```
🏢 Yellow Network
• CONFIDENTIAL
• Send to Red Forge LLM or on-prem AI
• Do NOT send to OpenAI/Claude
```

---

#### 3. **RED NETWORK** 🔒 (Air-Gapped - Human Only)

**Classification:** SECRET / TOP_SECRET  
**AI Access:** NONE (no AI at all, human review only)  
**Content:** Classified data, cryptographic keys, defense systems, customer PII  
**Visual:** **Thick red border (5px) + 🔒 icon + red tint** ← HIGH CONTRAST  

**Example:**
```markdown
🔒 │ Encryption key derivation: HKDF-SHA256(secret_salt="x7k2...", iterations=10000)
    [Thick red border - NO AI access, human only]
```

**Tooltip (on hover):**
```
🔒 Red Network
• SECRET
• NO AI access (air-gapped)
• Human review only
• Requires declassification approval
```

---

#### 4. **NEEDS REVIEW** ⚠️ (Untagged / Unknown)

**Classification:** Unknown (defaults to CONFIDENTIAL for safety)  
**AI Access:** Blocked until tagged  
**Content:** User hasn't decided network zone yet  
**Visual:** Yellow border (dimmed 60%) + ⚠️ icon  

**Example:**
```markdown
⚠️ │ Some paragraph the user hasn't tagged yet.
    [Dimmed yellow - "please tag before using AI"]
```

**Tooltip (on hover):**
```
⚠️ Untagged content
• Classification unknown
• Defaults to Yellow Network (CONFIDENTIAL)
• Tag with network zone before AI collaboration
```

---

## 🔧 New Tagging Model (Network-First)

### Option A: Network Zone Tags

```markdown
<White>
This API provides encryption capabilities.
</White>

<Yellow>
Implementation uses AES-256 in CBC mode.
</Yellow>

<Red>
Encryption key: HKDF-SHA256(secret_salt="x7k2...", iterations=10000)
</Red>
```

**Shorthand:**
- `<White>` = UNCLASSIFIED, any AI
- `<Yellow>` = CONFIDENTIAL, Red Forge/on-prem only
- `<Red>` = SECRET, no AI

---

### Option B: AI Access Tags (More Direct)

```markdown
<OpenAI>
This API provides encryption capabilities.
</OpenAI>

<RedForge>
Implementation uses AES-256 in CBC mode.
</RedForge>

<NoAI>
Encryption key: HKDF-SHA256(secret_salt="x7k2...", iterations=10000)
</NoAI>
```

**Pros:** Extremely clear ("Can I send to OpenAI?" → Look for `<OpenAI>` tag)  
**Cons:** Less formal than classification levels  

---

### Option C: Hybrid (Network + Traditional Classification)

```markdown
<Content network="white" level="UNCLASSIFIED">
This API provides encryption capabilities.
</Content>

<Content network="yellow" level="CONFIDENTIAL">
Implementation uses AES-256 in CBC mode.
</Content>

<Content network="red" level="SECRET">
Encryption key: HKDF-SHA256(secret_salt="x7k2...", iterations=10000)
</Content>
```

**Pros:** Supports both mental models  
**Cons:** More verbose  

---

## 💡 Design Group Consensus

### Morgan (UX)

**STRONG YES to network-first model!**

**Rationale:**
- Users think in terms of "which AI can I use?"
- Network zones map 1:1 to AI access
- Simpler than WHAT/HOW dual classification
- Clearer than UNCLASSIFIED/CONFIDENTIAL/SECRET/TOP_SECRET hierarchy

**Preferred tagging:** Option A (`<White>`, `<Yellow>`, `<Red>`)  
**Reason:** Short, clear, color-coded (matches visual)

---

### Alex (Visual Design)

**STRONG YES - simplifies visual hierarchy!**

**Before (too complex):**
- WHAT vs HOW (dimension 1)
- 4 classification levels (dimension 2)
- = 8 possible visual states (confusing!)

**After (simple):**
- 3 network zones (+ 1 untagged state)
- = 4 visual states total
- Clear hierarchy: White < Yellow < Red

**Visual mapping:**
```
White (🌐) → No border (low priority)
Yellow (🏢) → Yellow border (medium priority)
Red (🔒) → Thick red border + tint (HIGH priority)
Untagged (⚠️) → Dimmed yellow (needs action)
```

**Secrets (Red) now have MAXIMUM contrast!**

---

### Casey (Information Architecture)

**YES - aligns with enterprise security model!**

**Real-world mapping:**

| Network Zone | Classification | AI Access | Enterprise Example |
|--------------|----------------|-----------|-------------------|
| White 🌐 | UNCLASSIFIED | Any AI | Public docs, open-source code |
| Yellow 🏢 | CONFIDENTIAL | Red Forge / On-prem | Business logic, internal APIs |
| Red 🔒 | SECRET+ | None | Crypto keys, defense systems |

**This matches SAAB's actual security model!**
- Public internet (White) → Can use ChatGPT
- Internal network (Yellow) → Can use on-prem AI
- Classified network (Red) → No AI, human only

**Users already understand this model from their organization!**

---

## 🎯 What About WHAT/HOW?

**Question:** Do we still need WHAT (capability) vs HOW (implementation)?

**Answer:** **NO - it's redundant with network zones!**

**Mapping:**
- **WHAT (capability)** = Usually White Network (UNCLASSIFIED)
  - Example: "This API encrypts data"
- **HOW (implementation)** = Usually Yellow Network (CONFIDENTIAL)
  - Example: "Uses AES-256"
- **HOW (sensitive details)** = Usually Red Network (SECRET)
  - Example: "Key derivation uses secret_salt=x7k2..."

**Network zone already captures WHAT vs HOW distinction!**

---

## 📊 Decision Matrix (Simplified)

| Content Type | Network Zone | Visual | Icon | Tooltip |
|--------------|--------------|--------|------|---------|
| Public API docs | White | None | 🌐 (hover) | "Safe for any AI" |
| Business logic | Yellow | Yellow border (3px) | 🏢 | "Red Forge/on-prem only" |
| Secrets/keys | Red | Red border (5px) + tint | 🔒 | "No AI - human only" |
| Untagged | Unknown | Yellow border (dimmed) | ⚠️ | "Tag before AI use" |

**That's it! 4 states instead of 8+.**

---

## 🧪 User Testing Scenarios

### Scenario 1: Writing API docs, wants AI help

```markdown
## encrypt(data: bytes) -> bytes

<White>
Encrypts arbitrary data and returns encrypted bytes.
</White>

   [Visual: Clean, no border]
   [User: "I can send this to ChatGPT"]

<Yellow>
Internally uses AES-256 in CBC mode with PKCS7 padding.
</Yellow>

🏢 │ [Visual: Yellow border]
    [User: "I can send this to Red Forge LLM but not ChatGPT"]

<Red>
Key derivation: HKDF-SHA256(secret_salt="x7k2p9m3", iterations=10000)
</Red>

🔒 │ [Visual: Thick red border + tint - STANDS OUT]
    [User: "Cannot send to ANY AI - this is classified"]
```

---

### Scenario 2: Scanning doc for secrets

**User wants to know:** "Where are the secrets I can't share?"

**Visual scan:**
- Reads normally (White content = invisible)
- Sees yellow borders (Yellow content = "be careful")
- **RED BORDER JUMPS OUT** (Red content = "STOP - secret here")

**High contrast achieved!**

---

### Scenario 3: Preparing content for AI

**User workflow:**
1. Opens doc in Red Forge IDE
2. Right-clicks file → "Extract for Claude (OpenAI)"
3. Preview shows ONLY White-tagged content
4. User reviews, approves
5. Sent to OpenAI

**Alternatively:**
1. Right-clicks file → "Extract for Red Forge LLM"
2. Preview shows White + Yellow content (no Red)
3. User reviews, approves
4. Sent to Red Forge LLM (on-prem)

**Network zones make extraction logic OBVIOUS!**

---

## ✅ Final Design Decision

**Unanimous vote:**
- Sam: ✅ YES (network zones = user mental model)
- Morgan: ✅ YES (simpler, clearer, matches workflow)
- Alex: ✅ YES (visual hierarchy finally makes sense)
- Casey: ✅ YES (aligns with enterprise security)

**Approved:** Network zone classification (White/Yellow/Red)

---

## 📋 Implementation Checklist

- [ ] Replace WHAT/HOW with network zones
- [ ] Support `<White>`, `<Yellow>`, `<Red>` tags
- [ ] Untagged defaults to Yellow (CONFIDENTIAL)
- [ ] Frontmatter: `network: yellow` instead of `what: U / how: C`
- [ ] Visual: No border (White), Yellow border (Yellow), Thick red border (Red)
- [ ] Icons: 🌐 (White), 🏢 (Yellow), 🔒 (Red), ⚠️ (Untagged)
- [ ] Tooltip shows network zone + AI access restrictions
- [ ] Update demo files to use network zone tagging
- [ ] "Extract for AI" workflow filters by network zone

---

## 🎯 Key Principles

1. **Network zone = primary classification** (not WHAT/HOW)
2. **Red must STAND OUT** (high contrast, thick border, tint)
3. **White should disappear** (no visual noise)
4. **Yellow = middle ground** (medium emphasis)
5. **Untagged = blocked** (force explicit tagging)

---

**Design Group: APPROVED ✅**  
**Paradigm shift complete. Ready for reimplementation.**

