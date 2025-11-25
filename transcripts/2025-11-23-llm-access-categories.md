# Design Session: LLM Access Level Categories

**Date:** 2025-11-23  
**Session Type:** Defining Categories  
**Trigger:** Sam asking "What should the categories be?"  
**Participants:** Sam (Product Owner), Thorne (Implementation), Design Group (Morgan, Alex, Casey)

---

## 🎯 Sam's LLM Access Levels (Raw List)

From Sam:
1. Open cloud (OpenAI/Claude)
2. Red Forge (hosted in Sweden)
3. On-prem (customer's own infrastructure)
4. Red Forge physical red room
5. Truly airgapped on local Windows machine

**Question:** How do we organize these into clear categories?

---

## 🧠 Design Group Analysis

### Morgan (User Mental Model)

**Key insight:** These aren't all different categories - some are deployment variants!

**Two dimensions:**
1. **AI Provider** (Who runs the AI?)
   - External (OpenAI/Claude)
   - Red Forge (Balans-hosted)
   - Self-hosted (customer's own)
   - No AI (human only)

2. **Network Isolation** (Where does it run?)
   - Internet (cloud)
   - Internal network (on-prem)
   - Air-gapped (physically isolated)

**Example:**
- "Red Forge hosted in Sweden" = Red Forge provider + Internet accessible
- "Red Forge physical red room" = Red Forge provider + Air-gapped
- "On-prem AI" = Self-hosted + Internal network

**Users care more about RISK LEVEL than deployment details!**

---

### Alex (Visual Design)

**Problem:** 5 categories = too many visual states!

**Minimalist principle:** Max 3-4 visual states for clarity.

**Proposal:** Group by risk level (what user cares about):

1. **PUBLIC** (lowest risk) - Any AI, any network
2. **RESTRICTED** (medium risk) - Trusted AI only, controlled network
3. **CLASSIFIED** (high risk) - No AI, human only
4. **UNTAGGED** (unknown risk) - Force user to decide

**Visual hierarchy:**
- PUBLIC = No visual noise (fades away)
- RESTRICTED = Medium emphasis (yellow)
- CLASSIFIED = HIGH emphasis (red, stands out)

---

### Casey (Information Architecture)

**Mapping Sam's list to risk levels:**

| Sam's Category | Risk Level | AI Access | Network | Visual |
|----------------|------------|-----------|---------|--------|
| Open cloud (OpenAI/Claude) | **PUBLIC** | External | Internet | None (clean) |
| Red Forge (hosted Sweden) | **RESTRICTED** | Red Forge | Internet (Sweden) | Yellow |
| On-prem (customer infra) | **RESTRICTED** | Self-hosted | Internal | Yellow |
| Red Forge physical red room | **CLASSIFIED** | Red Forge | Air-gapped | Red |
| Airgapped local Windows | **CLASSIFIED** | Self-hosted | Air-gapped | Red |

**Key insight:** Risk level collapses to 3 categories!

- PUBLIC = Content safe for any AI
- RESTRICTED = Content requires trusted AI (Red Forge or on-prem)
- CLASSIFIED = Content cannot use ANY AI (air-gapped only)

---

## 💡 Proposed Category System

### Option A: Risk-Based (3 Categories)

**🌐 PUBLIC (UNCLASSIFIED)**
- Classification: UNCLASSIFIED
- AI Access: Any (OpenAI, Claude, Gemini, Red Forge, on-prem)
- Network: Any
- Use Case: Public APIs, open-source code, general documentation
- Visual: No border, clean text

**🏢 RESTRICTED (CONFIDENTIAL)**
- Classification: CONFIDENTIAL
- AI Access: Trusted only (Red Forge hosted/physical, customer on-prem)
- Network: Controlled (Sweden-hosted or internal network or air-gapped)
- Use Case: Business logic, internal architecture, algorithms
- Visual: Yellow border + 🏢 icon

**🔒 CLASSIFIED (SECRET)**
- Classification: SECRET / TOP_SECRET
- AI Access: NONE (human review only)
- Network: Air-gapped (Red Forge red room or customer airgapped machine)
- Use Case: Cryptographic keys, defense systems, classified data
- Visual: Thick red border + red tint + 🔒 icon

---

### Option B: Network-Based (4 Categories)

**🌐 INTERNET (White Network)**
- AI: Any external (OpenAI, Claude) OR Red Forge (Sweden-hosted)
- Network: Internet-connected
- Risk: Low (UNCLASSIFIED)
- Visual: No border

**🏢 INTERNAL (Yellow Network)**
- AI: On-prem (customer-controlled) OR Red Forge (Sweden-hosted)
- Network: Internal corporate network (no direct internet)
- Risk: Medium (CONFIDENTIAL)
- Visual: Yellow border

**🔒 AIR-GAPPED (Red Network)**
- AI: Red Forge red room OR customer airgapped machine
- Network: Physically isolated (no network at all)
- Risk: High (SECRET)
- Visual: Red border

**⚠️ NO AI (Truly Classified)**
- AI: None allowed (human only)
- Network: Air-gapped
- Risk: Highest (TOP SECRET)
- Visual: Dark red border + strong tint

---

### Option C: Deployment-Specific (5+ Categories)

**Sam's original list as-is:**

1. 🌐 **OpenAI/Claude** (external cloud)
2. 🇸🇪 **Red Forge Sweden** (Balans-hosted cloud)
3. 🏢 **On-Prem AI** (customer-hosted)
4. 🔴 **Red Forge Red Room** (Balans air-gapped)
5. 💻 **Local Airgapped** (customer air-gapped)
6. 🚫 **No AI** (human only)

**Problem:** Too many visual states, users get confused.

---

## 🎯 Design Group Recommendation

### Morgan's Vote: **Option A (Risk-Based, 3 Categories)**

**Reasoning:**
- Users think about risk ("How sensitive is this?")
- Deployment details are secondary ("Which AI should I use?")
- 3 categories = simple visual hierarchy
- Matches standard classification levels (U/C/S)

**User workflow:**
1. Tag content by risk: PUBLIC, RESTRICTED, or CLASSIFIED
2. IDE shows which AI options are available based on tag
3. User selects AI from allowed options

**Example:**
```markdown
<Public>
This API provides encryption.
</Public>
[Available AI: OpenAI, Claude, Red Forge, On-prem]

<Restricted>
Uses AES-256 in CBC mode.
</Restricted>
[Available AI: Red Forge, On-prem only]

<Classified>
Key: HKDF-SHA256(salt="x7k2...")
</Classified>
[Available AI: None - human only]
```

---

### Alex's Vote: **Option A (Risk-Based)**

**Reasoning:**
- 3 visual states = clean hierarchy
- PUBLIC (invisible) < RESTRICTED (yellow) < CLASSIFIED (red)
- High contrast for secrets achieved
- Simple for users to remember

**Visual mockup:**
```
   Normal text (PUBLIC)
🏢 │ Yellow border (RESTRICTED)
🔒 │ THICK RED BORDER + TINT (CLASSIFIED) ← Stands out!
```

---

### Casey's Vote: **Option A, but with AI selector**

**Reasoning:**
- Risk-based tagging is clearest for writers
- But users still need to pick specific AI when extracting
- Solution: Show risk level in docs, show AI options in "Extract" dialog

**Workflow:**
1. Writer tags content: `<Restricted>Implementation details</Restricted>`
2. When extracting, dialog shows: "Available: Red Forge (Sweden), Red Forge (Red Room), On-Prem"
3. User selects: "Red Forge (Sweden)"
4. Content sent to Sweden-hosted Red Forge LLM

**Separation of concerns:**
- **Tagging = risk level** (what writer thinks about)
- **AI selection = deployment** (what user chooses at runtime)

---

## ✅ Consensus: Option A (Risk-Based, 3 Categories)

**Unanimous agreement:**
- Sam: ✅ (simpler than 5 categories)
- Morgan: ✅ (matches user mental model)
- Alex: ✅ (clean visual hierarchy)
- Casey: ✅ (with runtime AI selector)

---

## 📋 Final Category Definition

### 🌐 PUBLIC (Risk: Low)

**Classification:** UNCLASSIFIED  
**AI Access:** Any AI service  
**Available LLMs:**
- ✅ OpenAI (GPT-4, ChatGPT)
- ✅ Anthropic (Claude)
- ✅ Red Forge LLM (Sweden-hosted)
- ✅ On-prem AI (customer infrastructure)
- ✅ Red Forge Red Room (air-gapped)

**Use Cases:**
- Public API documentation
- Open-source code examples
- General tutorials
- Marketing content

**Visual:**
- No border
- No icon (or 🌐 on hover only)
- Clean text, fades into background

**Tagging:**
```markdown
<Public>
This API provides encryption capabilities.
</Public>
```

---

### 🏢 RESTRICTED (Risk: Medium)

**Classification:** CONFIDENTIAL  
**AI Access:** Trusted AI only (Red Forge or on-prem)  
**Available LLMs:**
- ❌ OpenAI (NO - external risk)
- ❌ Anthropic Claude (NO - external risk)
- ✅ Red Forge LLM (Sweden-hosted, GDPR-compliant)
- ✅ On-prem AI (customer infrastructure)
- ✅ Red Forge Red Room (air-gapped)

**Use Cases:**
- Business logic
- Internal architecture
- Algorithm details (non-cryptographic)
- Performance optimizations
- Vendor integrations

**Visual:**
- Yellow left border (3px)
- 🏢 icon in margin
- Subtle yellow background tint

**Tagging:**
```markdown
<Restricted>
Implementation uses AES-256 in CBC mode with PKCS7 padding.
</Restricted>
```

**Tooltip:**
```
🏢 RESTRICTED
• Trusted AI only
• Available: Red Forge, On-prem
• Not for external AI (OpenAI/Claude)
```

---

### 🔒 CLASSIFIED (Risk: High)

**Classification:** SECRET / TOP_SECRET  
**AI Access:** NONE (human review only)  
**Available LLMs:**
- ❌ OpenAI (NO)
- ❌ Anthropic Claude (NO)
- ❌ Red Forge LLM Sweden (NO - still networked)
- ❌ On-prem AI (NO - could have vulnerabilities)
- ⚠️ Red Forge Red Room (MAYBE - air-gapped but still AI)
- ❌ NO AI at all (safest)

**Use Cases:**
- Cryptographic keys and secrets
- Defense system details
- Classified algorithms
- Customer PII
- National security data

**Visual:**
- **Thick red border (5px)**
- 🔒 icon in margin (always visible)
- **Red background tint (noticeable)**
- **HIGH CONTRAST** - stands out immediately

**Tagging:**
```markdown
<Classified>
Key derivation: HKDF-SHA256(secret_salt="x7k2p9m3", iterations=10000)
Master key stored in HSM slot 3.
</Classified>
```

**Tooltip:**
```
🔒 CLASSIFIED
• NO AI access
• Human review only
• Requires declassification approval
• Air-gapped systems only
```

---

## 🎨 AI Selection Dialog (Runtime)

**When user clicks "Extract for AI":**

```
┌─────────────────────────────────────────────┐
│ Extract Content for AI Collaboration       │
├─────────────────────────────────────────────┤
│ Content Selection:                          │
│ ✅ Include PUBLIC sections                  │
│ ✅ Include RESTRICTED sections              │
│ ❌ Include CLASSIFIED sections (disabled)   │
│                                             │
│ Select AI Provider:                         │
│ ⚪ OpenAI GPT-4 (requires PUBLIC only)      │
│ 🔵 Red Forge LLM (Sweden) ← Selected       │
│ ⚪ Red Forge Red Room (air-gapped)          │
│ ⚪ On-Prem AI (192.168.1.100)               │
│                                             │
│ Preview will show: 45 lines                 │
│ (23 PUBLIC + 22 RESTRICTED)                 │
│                                             │
│ [Preview]  [Cancel]  [Send to AI]          │
└─────────────────────────────────────────────┘
```

**Dynamic filtering:**
- Select "OpenAI" → Only PUBLIC content shown
- Select "Red Forge Sweden" → PUBLIC + RESTRICTED shown
- Select "Red Forge Red Room" → All content (with human review)

---

## 📊 Risk Level Mapping Table

| Risk Level | Classification | OpenAI/Claude | Red Forge Sweden | On-Prem | Red Forge Red Room | Airgapped Local |
|------------|----------------|---------------|------------------|---------|-----------------------|-----------------|
| PUBLIC | UNCLASSIFIED | ✅ | ✅ | ✅ | ✅ | ✅ |
| RESTRICTED | CONFIDENTIAL | ❌ | ✅ | ✅ | ✅ | ✅ |
| CLASSIFIED | SECRET+ | ❌ | ❌ | ❌ | ⚠️ (with approval) | ❌ (human only) |

---

## ✅ Final Decision

**3 Risk-Based Categories:**
1. 🌐 PUBLIC (UNCLASSIFIED)
2. 🏢 RESTRICTED (CONFIDENTIAL)
3. 🔒 CLASSIFIED (SECRET)

**Runtime AI selection:**
- User picks which AI to use from allowed options
- IDE filters content based on risk level + selected AI
- Clear preview before sending

**Visual hierarchy:**
- PUBLIC = No border (minimal noise)
- RESTRICTED = Yellow border (medium emphasis)
- CLASSIFIED = Thick red border + tint (HIGH emphasis)

---

**Design Group: APPROVED ✅**  
**Ready for implementation.**

