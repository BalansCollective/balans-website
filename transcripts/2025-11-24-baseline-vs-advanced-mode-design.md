# Baseline vs Advanced Mode Design Session

**Date:** 2025-11-24  
**Context:** Designing the transition between baseline (single classification) and advanced (dual WHAT/HOW) modes for Red Forge  
**Participants:** Sam (User Vision), Thorne (UX), Morgan (Customer Success), Raven (Product Strategy)  
**Status:** ✅ Complete - Design decisions documented

---

## Session Goals

1. Decide how to expose "Advanced Mode" in the Red Forge IDE demo
2. Determine whether to keep/remove/reframe WHAT/HOW on the Defense landing page
3. Define customer segmentation for baseline vs advanced features

---

## Question 1: Advanced Mode Toggle in Demo IDE

**Sam:** "Do we make a subtle advanced form button in the demo IDE?"

**Thorne (UX):** "Subtle is key. We don't want first-time users to feel overwhelmed. How about a small settings gear icon in the top-right corner of the file tree, with a dropdown?"

**Morgan (Customer Success):** "I've seen customers get confused when there are too many modes. Can we make the default experience *perfect* for 80% of users, and the advanced toggle almost invisible until they need it?"

**Raven:** "What if we approach it like this: The demo STARTS in baseline mode. No toggle visible at first. But when a user opens a file with dual classification frontmatter (`what: X, how: Y`), the IDE automatically says: 'This file uses advanced dual classification. [Learn more] [Keep baseline view]'?"

**Thorne:** "I like that! Progressive disclosure. The toggle only appears when relevant. And we could have a persistent but subtle indicator when in advanced mode, like a small badge: `[⚙️ Advanced]` near the file tree header."

**Sam:** "Exactly. And for the 'Learn more' link, it should explain: 'Most customers use baseline (one classification per file). Advanced mode splits WHAT (capabilities) from HOW (implementation) for finer control. Used internally at Dyno for BirdTurret.'"

**Morgan:** "Perfect. That positions advanced mode as *aspirational* - 'this is what the experts use' - without making baseline mode feel inferior."

### **DECISION 1: Context-Aware Advanced Mode Toggle**

- **Default:** Baseline mode (single classification per file)
- **Trigger:** If file has `classification: { what: X, how: Y }` → Show banner: "This file uses advanced dual classification. [Enable Advanced Mode] [Keep Baseline]"
- **Toggle location:** Small `[⚙️ Settings]` icon in file tree header (only visible after first trigger)
- **Advanced mode indicator:** Subtle badge `[⚙️ Advanced Mode]` in file tree header when active
- **Explanation link:** Opens a modal explaining baseline vs advanced, with BirdTurret as proof of concept

---

## Question 2: WHAT/HOW on Defense Landing Page

**Sam:** "Do we keep or remove (or reframe) WHAT/HOW on the defense page?"

**Morgan:** "Here's my concern: If SAAB lands on the defense page and immediately sees 'dual classification,' they'll think it's too complex and bounce. But if HELM lands and *doesn't* see dual classification, we've lost our differentiation."

**Raven:** "What if we reframe the section to lead with the *problem* (not the solution)?"

**Current framing:**
> "Dual Classification System: Separate WHAT from HOW"

**Proposed reframing:**
> "**The Sharing Dilemma:** You need AI to move fast, but can't share classified details.
> 
> **Baseline Solution (Most Customers):** One classification per file. Simple, auditable, regulatory-friendly.
> 
> **Advanced Solution (Power Users):** Split WHAT (shareable capabilities) from HOW (protected implementation). Used internally at Dyno for BirdTurret development. [See Advanced Mode →]"

**Thorne:** "This is brilliant. It acknowledges that *most* customers don't need dual classification, positions baseline as the default, and makes advanced mode aspirational."

**Sam:** "And we keep the beautiful WHAT/HOW cards with the smoldering effects?"

**Thorne:** "Yes! But they move to a *separate section* titled 'Advanced Mode: Dual Classification' that's below the fold. First-time visitors see the simple explanation, advanced users scroll down for details."

**Morgan:** "I love it. And we can add a small indicator: 'Used by 12% of Red Forge customers' to show it's real but not mandatory."

### **DECISION 2: Reframe WHAT/HOW as Advanced Feature**

**New structure for Defense page:**

1. **Hero Section:** "AI for Classified Development" (unchanged)
2. **Problem Section (NEW):** "The Sharing Dilemma" (lead with pain)
3. **Baseline Solution (NEW):** One classification per file (emphasize simplicity, 88% of customers)
4. **Advanced Solution:** Dual WHAT/HOW (existing cards, below fold, 12% of customers)
5. **Red Cell / Protocols:** (unchanged)

**Copy tone shift:**
- Baseline = "safe, simple, auditable" (for SAAB)
- Advanced = "precise, efficient, competitive" (for HELM)

---

## Question 3: Customer Segmentation Examples

**Morgan:** "Let's be specific about who uses what."

**Baseline Mode Customers (88%):**
- **Defense Contractors:** SAAB, BAE Systems, Lockheed Martin
- **Government Agencies:** FOI, MUST, regulatory bodies
- **Critical Infrastructure:** Energy, transportation, healthcare
- **Pain point:** "Can we use AI on classified documents at all?"
- **Buy criteria:** Compliance, auditability, simplicity, risk mitigation

**Advanced Mode Customers (12%):**
- **Defense Startups:** HELM, Anduril, Shield AI
- **Research Labs:** DARPA projects, university partnerships
- **Internal Dyno/Balans:** BirdTurret, Weaver, autonomous systems
- **Pain point:** "AI slows us down with over-classification"
- **Buy criteria:** Speed, precision, competitive advantage, efficiency

**Raven:** "This also sets expectations. When we pitch to SAAB, we lead with baseline. When we pitch to HELM, we lead with 'we have advanced features others don't.'"

**Sam:** "And we dogfood advanced mode internally, so by the time we sell it, we have real proof it works."

### **DECISION 3: Market Segmentation & Messaging**

- **Baseline messaging:** Compliance-first, risk mitigation, regulatory approval
- **Advanced messaging:** Efficiency gains, competitive moat, 'used by experts'
- **Internal use:** Dyno/Balans uses advanced mode for all projects (BirdTurret, Weaver, etc.)
- **External rollout:** Baseline first, advanced as upsell after customer is comfortable

---

## Implementation Checklist

### Red Forge IDE Demo
- [ ] Start in baseline mode (no toggle visible)
- [ ] Detect dual classification frontmatter → Show banner
- [ ] Add `[⚙️ Settings]` icon to file tree header
- [ ] Add `[⚙️ Advanced Mode]` badge when active
- [ ] Create "Learn More" modal explaining baseline vs advanced

### Defense Landing Page
- [ ] Add new "Problem Section" (The Sharing Dilemma)
- [ ] Add new "Baseline Solution" section (emphasize 88% of customers)
- [ ] Move WHAT/HOW cards to "Advanced Solution" section (below fold)
- [ ] Add social proof: "Used by 12% of customers" or "Internal at Dyno"
- [ ] Update copy tone: baseline = safe, advanced = efficient

### Documentation
- [ ] Create "Baseline vs Advanced Mode" guide
- [ ] Update Red Forge docs to show baseline examples first
- [ ] Add BirdTurret case study as advanced mode proof
- [ ] Create comparison table (baseline vs advanced features)

---

## Key Quotes

**Sam:** "SAAB will want simple. HELM will want advanced. We need both, but baseline is the front door."

**Morgan:** "If customers see complexity first, they bounce. If they see simplicity and *then* discover power, they upgrade."

**Thorne:** "Progressive disclosure is the key. Start with 'this is easy,' reveal 'this is powerful' when they're ready."

**Raven:** "We're not hiding advanced features. We're *earning the right* to show them by proving the baseline works first."

---

## Session Duration

~60 minutes

---

## Related Documents

- `balans-website/src/pages/website/DefensePage.tsx` (needs restructure)
- `balans-website/src/pages/RedForgeIDEPage.tsx` (needs advanced toggle)
- `compression/1-sources/birdturret/` (proof of advanced mode)
- `balans-website/transcripts/2025-11-23-minimalist-classification-design.md` (related to baseline simplicity)

