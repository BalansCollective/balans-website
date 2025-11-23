---
session_id: "ENTERPRISE-YELLOW-NETWORK-MODEL"
session_type: "Security UX Design Session"
date: "2025-11-23"
participants: ["Bruce Schneier", "Don Norman", "Edward Tufte", "Susan Kare", "Morgan (Balans)", "Thorne (Balans)"]
focus: "Redesigning classification colors for enterprise 'Yellow Network' model (Saab use case)"
context: "SAAB and similar defense contractors have 'Yellow Network' (internal secure network, on-prem LLMs OK) vs. 'Red Network' (internet access, external AI). Need color system that maps to their infrastructure reality."
status: "IN_PROGRESS"
---

# Enterprise Classification Model: Yellow Network vs. Red Network

## 🎯 Problem Statement (CORRECTED)

**Real-World Use Case: SAAB (and similar defense contractors)**

They have **three network zones**:

### **1. White/Blue Network (UNCLASSIFIED)**
- Internet access allowed
- External AI (ChatGPT, Claude) allowed
- Public collaboration allowed
- **Example:** Marketing materials, public research papers

### **2. Yellow Network (CONFIDENTIAL/INTERNAL)**
- **NO internet access** (air-gapped from external networks)
- **On-premises LLMs allowed** (self-hosted Claude, local models)
- **Internal collaboration allowed** (within company secure network)
- **Example:** Internal product specs, design documents, R&D research
- **SAAB's goal:** Work with internal research, use on-prem AI, don't leak to internet

### **3. Red Network (SECRET/CLASSIFIED)**
- **NO internet access**
- **NO on-premises LLMs** (too sensitive even for internal AI)
- **Human-only review** (no AI assistance at all)
- **Example:** Classified military specifications, cryptographic keys

---

## 🗣️ Session Transcript

### Opening: We Misunderstood the User's Need

**Morgan:** Oh! Sam wasn't asking about "yellow = caution", they're asking about **Yellow Network** - the enterprise infrastructure model!

**Bruce Schneier:** *nodding* This is standard in defense contractors. They have:
- **White/Blue** = internet-connected
- **Yellow** = internal secure network (on-prem AI OK)
- **Red** = classified network (no AI at all)

The color isn't just UI - it's **physical infrastructure**.

**Thorne:** So SAAB wants to work on CONFIDENTIAL (Yellow Network) content and collaborate with:
1. **On-premises LLMs** (their own Claude/GPT deployment)
2. **Internal researchers** (within Yellow Network)

But NOT with:
1. **External internet AI** (ChatGPT.com, Claude.ai)
2. **External collaborators** (outside company)

**Don Norman:** This is a **network zoning** problem, not just a classification problem. The UI needs to reflect infrastructure reality.

---

### Revised Color Mapping (Enterprise Model)

**Susan Kare:** Let me sketch the new model:

| Network Zone | Classification | Color | Internet | On-Prem AI | External AI |
|--------------|----------------|-------|----------|------------|-------------|
| **White/Blue** | UNCLASSIFIED | 🔵 Blue | ✅ Yes | ✅ Yes | ✅ Yes |
| **Yellow** | CONFIDENTIAL | 🟡 Yellow | ❌ No | ✅ Yes | ❌ No |
| **Red** | SECRET | 🔴 Red | ❌ No | ❌ No | ❌ No |

**Key Insight:** Yellow is the "sweet spot" - internal AI OK, external AI not OK.

---

### The "Extract for AI" Workflow (Revised)

**Original Assumption:**
- UNCLASSIFIED → Can send to Claude.ai
- CONFIDENTIAL → Cannot send anywhere

**New Reality:**
- UNCLASSIFIED → Can send to external AI (Claude.ai, ChatGPT)
- CONFIDENTIAL → Can send to **on-prem AI only** (internal Claude deployment)
- SECRET → Cannot send to any AI

---

#### **Updated Declassification Preview**

```
┌────────────────────────────────────────────────────────────┐
│ 🔓 Declassification Preview                     [×]        │
│ ─────────────────────────────────────────────────────────  │
│                                                            │
│ 📄 gripen-avionics-spec.md                                 │
│ 🟡 CONFIDENTIAL (Yellow Network)                           │
│                                                            │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓│
│ ┃ 🟡 CAN SEND TO ON-PREM AI (850 tokens)                ┃│
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ <What>                                                 ││ ← Yellow tint
│ │ The avionics system provides real-time navigation...  ││
│ │ </What>                                                ││
│ │                                                        ││
│ │ <How>                                                  ││ ← Yellow tint
│ │ Uses Kalman filtering with sensor fusion from IMU,   ││
│ │ GPS, and radar subsystems...                          ││
│ │ </How>                                                 ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ 🔴 EXCLUDED (320 tokens SECRET)           [Show ▼]   ││ ← Red tint
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ Where to send?                                             │
│ ● On-premises Claude (internal SAAB deployment)            │
│ ○ External Claude (claude.ai) ⚠️ REQUIRES UNCLASSIFIED   │
│ ○ Copy to clipboard (manual review)                        │
│                                                            │
│              [ Cancel ]         [ Send to AI ]             │
└────────────────────────────────────────────────────────────┘
```

**Edward Tufte:** Notice the key change: **Yellow content CAN be sent to AI** - but only on-prem AI, not external AI.

---

### Network Zone Detection

**Bruce Schneier:** How does the IDE know which network it's on?

**Thorne:** Configuration setting in `.weaver/config.yaml`:

```yaml
network_zone: yellow  # Options: white, yellow, red

ai_endpoints:
  on_prem:
    enabled: true
    url: "https://internal-claude.saab.se/api"
    api_key_env: "SAAB_INTERNAL_AI_KEY"
  
  external:
    enabled: false  # Disabled on yellow network
    providers:
      - anthropic  # Would be blocked
      - openai     # Would be blocked
```

**Morgan:** And we add visual indicator in the IDE:

```
┌────────────────────────────────────────────────────────────┐
│ Red Forge IDE                      🟡 Yellow Network      │ ← Status bar
│ ─────────────────────────────────────────────────────────  │
│                                                            │
│ File tree...                                               │
└────────────────────────────────────────────────────────────┘
```

**Don Norman:** Perfect. Users always know what network zone they're in.

---

### Operational Constraints by Color (REVISED)

| Classification | Color | Network | Can Send To |
|----------------|-------|---------|-------------|
| **UNCLASSIFIED** | 🔵 Blue | White | External AI (Claude.ai, ChatGPT), On-prem AI |
| **CONFIDENTIAL** | 🟡 Yellow | Yellow | On-prem AI only (internal deployment) |
| **SECRET** | 🔴 Red | Red | No AI (human review only) |

**Icon Meanings (REVISED):**
- 🌐 = "Internet OK - External AI allowed"
- 🏢 = "On-prem only - Internal AI allowed"
- 🔒 = "Air-gapped - No AI"

---

### Visual Examples

#### **Blue (UNCLASSIFIED) - White Network**

```
<What> section:
┌─────────────────────────────────┐
│ 🌐 WHAT: UNCLASSIFIED          │ ← Blue line + internet icon
│ Network: White (external AI OK) │
│                                 │
│ The Gripen fighter has modern   │
│ avionics with touchscreen HMI.  │
└─────────────────────────────────┘
```

**Can send to:** Claude.ai ✅, Internal Claude ✅

---

#### **Yellow (CONFIDENTIAL) - Yellow Network**

```
<How> section:
┌─────────────────────────────────┐
│ 🏢 HOW: CONFIDENTIAL           │ ← Yellow line + building icon
│ Network: Yellow (on-prem AI OK) │
│                                 │
│ Uses Kalman filtering with      │
│ sensor fusion from IMU, GPS...  │
└─────────────────────────────────┘
```

**Can send to:** Internal Claude ✅, Claude.ai ❌

---

#### **Red (SECRET) - Red Network**

```
<How> section:
┌─────────────────────────────────┐
│ 🔒 HOW: SECRET                 │ ← Red line + lock icon
│ Network: Red (no AI)            │
│                                 │
│ [Cryptographic key material]    │
│ [REDACTED]                      │
└─────────────────────────────────┘
```

**Can send to:** No AI ❌

---

## 🎯 Decisions Made

### ✅ Agreed Upon: Three-Zone Network Model

**Color = Network Zone + AI Policy:**
- 🔵 **Blue (UNCLASSIFIED)** = White Network, external AI OK
- 🟡 **Yellow (CONFIDENTIAL)** = Yellow Network, on-prem AI only
- 🔴 **Red (SECRET)** = Red Network, no AI

**Icons:**
- 🌐 = External AI allowed (internet OK)
- 🏢 = On-prem AI only (internal network)
- 🔒 = No AI (human only)

---

### Configuration-Based Network Detection

**`.weaver/config.yaml`:**
```yaml
network_zone: yellow

ai_endpoints:
  on_prem:
    enabled: true
    name: "SAAB Internal Claude"
    url: "https://internal-claude.saab.se/api"
  
  external:
    enabled: false
    blocked_providers: ["anthropic", "openai", "perplexity"]
```

**IDE Status Bar:**
- Always shows current network zone: `🟡 Yellow Network`
- Warns if trying to send CONFIDENTIAL to external AI

---

### Declassification Rules (REVISED)

**Rule 1: UNCLASSIFIED content**
- Can send to external AI (Claude.ai) ✅
- Can send to on-prem AI ✅
- No restrictions

**Rule 2: CONFIDENTIAL content**
- **Cannot send to external AI** (blocked) ❌
- **Can send to on-prem AI** (allowed) ✅
- IDE shows: "🏢 Will send to Internal Claude"

**Rule 3: SECRET content**
- Cannot send to any AI ❌
- Declassification preview shows: "🔒 No AI assistance available"

---

## 💡 Key Insights

**Bruce Schneier's Contribution:**
> "Network zoning isn't just policy - it's **physical infrastructure**. Yellow Network is literally air-gapped from the internet. The UI must reflect this reality, not just abstract classification levels."

**Don Norman's Contribution:**
> "Users need to know TWO things: (1) What classification is this? (2) What can I do with it? Color shows classification, icon shows affordance ('what can I do')."

**Edward Tufte's Contribution:**
> "The status bar showing 'Yellow Network' is critical context. Without it, users might think they're on White Network and be confused why external AI is blocked."

**Susan Kare's Contribution:**
> "Icons must map to physical infrastructure: 🌐 = internet (external), 🏢 = building (internal), 🔒 = locked (neither). These are concrete metaphors, not abstract concepts."

---

## 📋 Revised Color System

| Level | Color | Icon | Network | External AI | On-Prem AI | Human |
|-------|-------|------|---------|-------------|------------|-------|
| **UNCLASSIFIED** | 🔵 Blue | 🌐 | White | ✅ | ✅ | ✅ |
| **CONFIDENTIAL** | 🟡 Yellow | 🏢 | Yellow | ❌ | ✅ | ✅ |
| **SECRET** | 🔴 Red | 🔒 | Red | ❌ | ❌ | ✅ |
| **TOP_SECRET** | 🔴 Dark Red | ⛔ | Red | ❌ | ❌ | ⚠️ |

---

## 🚀 SAAB Use Case: Enabling Yellow Network Collaboration

**Problem:** SAAB researchers work on CONFIDENTIAL (Yellow Network) specs. They want Claude to help, but can't send to claude.ai (internet).

**Solution:** Red Forge IDE on Yellow Network:
1. Researcher opens `gripen-avionics.md` (CONFIDENTIAL)
2. Right-clicks → "🏢 Send to On-Prem AI"
3. IDE extracts content, sends to `https://internal-claude.saab.se/api`
4. On-prem Claude (running on SAAB servers) reviews content
5. Response imported back into document
6. **No data leaves Yellow Network** ✅

**Value:** Researchers get AI assistance without violating security policy.

---

## 🤔 Still Debating:

1. **Should IDE auto-detect network zone?** (Ping external endpoint, if fails → assume Yellow Network)
2. **Should we support "hybrid" documents?** (Some sections UNCLASSIFIED, can send to external AI; others CONFIDENTIAL, only on-prem)
3. **What if on-prem AI is down?** (Fallback to "copy to clipboard" for manual review?)

---

## 📝 Action Items:

1. **Thorne**: Update color system to reflect Yellow = "on-prem AI OK"
2. **Morgan**: Add network zone configuration (`.weaver/config.yaml`)
3. **Bruce**: Write enterprise deployment guide for Yellow Network setup
4. **Susan**: Design network zone indicator for status bar
5. **Don**: Update declassification preview to show "On-prem AI" vs. "External AI" options

---

## 🔗 References

- `balans-website/transcripts/2025-11-23-classification-color-semantics-session.md` - Previous color debate (now superseded)
- `balans-website/transcripts/2025-11-23-declassification-workflow-session.md` - Declassification workflow
- SAAB Network Security Policy - Three-zone model (White/Yellow/Red)

---

**Session End: 2025-11-24 00:15**  
**Next Session: Network zone auto-detection design**

---

## 📊 Appendix: Enterprise Network Zones (Real-World Examples)

### **SAAB (Swedish Defense)**
- **White Network**: Internet-connected, public collaboration
- **Yellow Network**: Internal secure network, on-prem AI allowed
- **Red Network**: Classified, no AI

### **Lockheed Martin (US Defense)**
- **Unclassified Network**: Internet OK
- **SIPRNet** (Secret Internet Protocol Router Network): SECRET classification, air-gapped
- **JWICS** (Joint Worldwide Intelligence Communications System): TOP SECRET, maximum restriction

### **UK Ministry of Defence**
- **OFFICIAL**: Public internet
- **SECRET**: GSi (Government Secure intranet), air-gapped
- **TOP SECRET**: Restricted terminals only

**Common Pattern:** Yellow/SECRET network = air-gapped from internet, but may have internal AI.

---

**End of Design Session**

