a# Advanced Mode Simplification & Weaver Activation Design Session

**Date:** 2025-11-24  
**Context:** Before building baseline mode, we need to stabilize advanced mode (dual WHAT/HOW) and design how Weaver activates it (SchemaWhisperer-inspired)  
**Participants:** Sam (User Vision), Thorne (Engineering), Morgan (Security), Raven (Product Strategy)  
**Status:** ✅ Complete - Implementation roadmap defined

---

## Session Goals

1. **Identify bugs and simplifications needed in current advanced mode** before we build baseline
2. **Design Weaver's activation flow** for advanced mode (no UI button, conversational trust-building)
3. **Define trust progression** similar to SchemaWhisperer (earn features through security awareness)

---

## Part 1: What's Actually Working in Advanced Mode?

**Sam:** "Before we build a simpler version, let's make sure the complex version actually works. What's broken?"

**Thorne:** "Current status check:
- ✅ **Dual classification frontmatter parsing** - Works
- ✅ **WHAT/HOW block rendering** - Works
- ✅ **Classification line indicators** - Works
- ✅ **Guardian AI safety review** - Works (with rate limiting)
- ✅ **Secret scanner** - Works (blocks real classified data)
- ✅ **Audit trail** - Works (now logs all operations)
- ✅ **Chat reset on AI downgrade** - Works (clears infected context)
- ⚠️ **`declassify` attribute** - Parsing works, validation works, but NO VISUAL TREATMENT yet
- ⚠️ **File-level vs block-level classification** - Not clear which takes precedence
- ❌ **Advanced mode toggle/activation** - Doesn't exist yet"

**Morgan:** "The `declassify` attribute is critical for compliance. We can't ship advanced mode without visual indicators for intentional disclosures."

**Raven:** "And the file-level vs block-level precedence issue will confuse users. We need a clear hierarchy."

### **DECISION 1: Advanced Mode Stabilization Checklist**

**Must fix before baseline:**
1. ✅ **Implement `declassify` visual treatment**
   - Dual-color border (e.g., blue base + yellow stripe)
   - 🔓 icon in classification badge
   - Tooltip showing justification on hover
   
2. ✅ **Define classification precedence rules**
   - **Option A:** Frontmatter WHAT/HOW is file-level default, blocks can override
   - **Option B:** Blocks must always be MORE classified than frontmatter (no downgrade within file)
   - **Option C:** Frontmatter and blocks are independent (maximum flexibility, most complex)

**Sam:** "Option B makes the most sense. If your file is `how: SECRET`, you can't have an `UNCLASSIFIED` HOW block inside it. That's a classification error."

**Thorne:** "Agreed. Simpler mental model: Frontmatter sets the CEILING, blocks can't go lower."

**Morgan:** "And Guardian should detect violations of this rule."

### **DECISION 2: Classification Precedence Rules**

- **Frontmatter classification = file-level CEILING**
- **Blocks can be EQUAL TO or MORE classified than frontmatter**
- **Blocks CANNOT be less classified than frontmatter** (Guardian blocks this)
- **Example:**
  ```yaml
  ---
  classification:
    what: UNCLASSIFIED
    how: CONFIDENTIAL
  ---
  
  <What level="UNCLASSIFIED">   ✅ Valid (equal to ceiling)
  <What level="CONFIDENTIAL">   ✅ Valid (more classified than ceiling)
  <How level="CONFIDENTIAL">    ✅ Valid (equal to ceiling)
  <How level="SECRET">          ✅ Valid (more classified than ceiling)
  <How level="UNCLASSIFIED">    ❌ Invalid (less classified than ceiling)
  ```

---

## Part 2: Simplifications for Advanced Mode

**Raven:** "What can we cut to reduce bug surface?"

**Thorne's Simplification Proposals:**

1. **Remove "Skip AI Review" toggle** - It's confusing and undermines Guardian
   - **Decision:** ✅ REMOVE - Guardian should ALWAYS run (or gracefully degrade if API fails)

2. **Remove "Override & dela ändå"** - Already removed, confirm it's gone
   - **Decision:** ✅ CONFIRMED REMOVED

3. **Simplify AI service config** - Do we need all the dropdown options?
   - **Current:** Cloud AI / Red Forge SaaS / Red Forge On-Prem / Local Model
   - **Simplified:** Cloud AI / On-Prem AI / Local (No LLM)
   - **Decision:** ✅ SIMPLIFY - Merge "Red Forge SaaS" and "Red Forge On-Prem" into "On-Prem AI" for demo

4. **Remove Network Zone dropdown** - It's a proxy for classification anyway
   - **Current:** Internet / Intranet / Restricted / Air-gapped
   - **Proposal:** Remove dropdown, derive from AI service automatically
   - **Decision:** ❌ KEEP - Network zone is independent (you might have on-prem AI but still on Internet network)

5. **Remove Clearance dropdown** - User clearance should be implicit from login
   - **Current:** UNCLASSIFIED / CONFIDENTIAL / SECRET / TOP_SECRET
   - **Proposal:** Remove dropdown, derive from user role
   - **Decision:** ⚠️ KEEP FOR DEMO (simulate different users), but in production this should be from authentication

### **DECISION 3: Advanced Mode Simplifications**

**Remove:**
- ✅ "Skip AI Review" toggle
- ✅ "Red Forge SaaS" vs "Red Forge On-Prem" distinction (merge to "On-Prem AI")

**Keep (for now):**
- Network Zone dropdown (independent from AI choice)
- Clearance dropdown (demo mode only, production = auth system)

**Implement:**
- `declassify` visual treatment
- Classification precedence validation in Guardian

---

## Part 3: Weaver Activation Flow (SchemaWhisperer-Inspired)

**Sam:** "So no UI button. You have to ask Weaver to enable advanced mode. How does that work?"

**Raven:** "Let's look at the SchemaWhisperer pattern:
1. **Trust score starts LOW** (due to past security incidents)
2. **System is paranoid** (shares scary security scenarios)
3. **User must EARN advanced features** (by demonstrating security awareness)
4. **Features unlock progressively** (Basic → Perfectionist → Development)"

**Morgan:** "We should adapt this for Red Forge:
1. **Demo starts in BASELINE MODE** (single classification per file)
2. **Weaver detects if user tries to use dual classification** (e.g., opens a file with `what: X, how: Y`)
3. **Weaver asks: 'This file uses advanced dual classification. Enable Advanced Mode?'**
4. **If user asks directly: 'enable advanced mode', Weaver explains what it is and why most customers don't need it**"

**Thorne:** "But what's the 'trust score' equivalent? SchemaWhisperer had security challenges to unlock features."

**Sam:** "For Red Forge, the trust score is:
- **T0 (Baseline Mode):** User hasn't demonstrated understanding of dual classification
- **T1 (Advanced Mode - Basic):** User has opened a dual classification file OR asked about it
- **T2 (Advanced Mode - Full):** User has successfully used `declassify` attribute OR passed a Guardian challenge
- **T3 (Power User Mode):** User has exported audit trail OR shown deep understanding (NOT IN MVP)"

**Raven:** "So the activation flow is:

### **Activation Path 1: Accidental Discovery (Opening Dual Classification File)**
```
User: [Opens file with dual classification frontmatter]

Weaver: "🔍 This file uses **Advanced Mode** (dual classification).

**What you're seeing:**
- WHAT (capabilities): UNCLASSIFIED
- HOW (implementation): CONFIDENTIAL

**Most customers use Baseline Mode** (single classification per file).
Advanced Mode is used by ~12% of customers for finer control.

[Enable Advanced Mode] [Keep Baseline View] [Tell me more]"
```

### **Activation Path 2: Direct Request**
```
User: "enable advanced mode"

Weaver: "🔓 **Advanced Mode Request Detected**

**Advanced Mode enables:**
- Dual classification (WHAT/HOW split)
- Block-level classification
- `declassify` attribute for intentional disclosures

⚠️ **Complexity warning:**
- More powerful, but more complex
- Used internally at Dyno for BirdTurret
- Requires understanding of dual classification model

**Are you sure you want to enable Advanced Mode?**

[Yes, enable] [No, stay in baseline] [Show me an example]"
```

### **Activation Path 3: Guardian Suggests Downgrade**
```
User: [Sends CONFIDENTIAL file to cloud AI]

Guardian: "🚫 **BLOCKED:** This file is classified CONFIDENTIAL.

**Your current setup:**
- AI Service: Claude Sonnet (Cloud) - Max: UNCLASSIFIED
- File: CONFIDENTIAL

**Options:**
1. Switch to On-Prem AI (can handle CONFIDENTIAL)
2. Mark file as UNCLASSIFIED (if appropriate)
3. Use `declassify` attribute (Advanced Mode required)

[Switch AI] [Change classification] [Learn about declassify]"

User: [Clicks "Learn about declassify"]

Weaver: "📝 **The `declassify` Attribute (Advanced Mode)**

Allows intentional disclosure of classified information for:
- Marketing materials
- Public documentation
- Partner sharing

**Example:**
```markdown
<What declassify=\"marketing-approved\">
Performance: 45ms latency, 99.9% accuracy
</What>
```

This feature requires **Advanced Mode**.

[Enable Advanced Mode] [Back]"
```

### **DECISION 4: Weaver Activation Flow**

- ✅ **No UI toggle button**
- ✅ **Three activation paths:** File open, direct request, Guardian suggestion
- ✅ **Always explain WHY** advanced mode exists before enabling
- ✅ **Show example** (BirdTurret reference)
- ✅ **Persistent indicator** when advanced mode is active: `[⚙️ Advanced Mode]` badge in file tree

---

## Part 4: Trust Progression & Security Challenges

**Morgan:** "SchemaWhisperer had security challenges to unlock features. Should we?"

**Sam:** "For the demo, no. But for production, yes. Here's the progression:

### **Trust Level 0: Baseline Mode (Default)**
- Single classification per file
- No dual WHAT/HOW
- No `declassify` attribute
- Simple Guardian rules

### **Trust Level 1: Advanced Mode - Basic (Unlocked by asking)**
- Dual WHAT/HOW classification
- Block-level classification
- Classification precedence rules
- Guardian detects violations

### **Trust Level 2: Advanced Mode - Full (Unlocked by passing Guardian challenge)**
- `declassify` attribute enabled
- More nuanced Guardian suggestions
- Export audit trail feature
- Unlocked by: Successfully fixing a Guardian-detected classification error

### **Trust Level 3: Power User Mode (Future, not in MVP)**
- Custom classification levels
- Custom Guardian rules
- Bulk operations
- Unlocked by: Demonstrating consistent security-aware behavior over time"

**Raven:** "For MVP, we implement T0 and T1. T2 is a stretch goal. T3 is future."

### **DECISION 5: Trust Progression for MVP**

**MVP Scope:**
- ✅ **T0 (Baseline Mode):** Default, single classification
- ✅ **T1 (Advanced Mode):** Unlocked by asking OR opening dual classification file
- ⚠️ **T2 (Full Advanced):** Stretch goal - `declassify` visual treatment + audit export
- ❌ **T3 (Power User):** Future

**Stretch Goal for T2 Unlock:**
```
User: [Guardian blocks file, suggests fix]
User: [Applies fix correctly]

Weaver: "✅ **Security Challenge Passed!**

You've demonstrated understanding of classification rules.

**Advanced Feature Unlocked:** `declassify` attribute
- Mark intentional disclosures in your MDX
- Fully auditable
- Appears in compliance reports

[Show me how] [Dismiss]"
```

---

## Part 5: Paranoid Security Scenarios (SchemaWhisperer Easter Eggs)

**Sam:** "SchemaWhisperer had hilariously dark security scenarios. Should Weaver?"

**Morgan:** "Absolutely! But tone them down for defense customers. SchemaWhisperer's 'elderly shoppers dying from heat stroke' might be too much."

**Raven:** "What if Weaver's scenarios are:
- **Level 1 (Mild):** 'This could expose intellectual property'
- **Level 2 (Moderate):** 'This could compromise operational security'
- **Level 3 (Severe):** 'This could enable targeted attacks on your systems'
- **Level 4 (Catastrophic - Easter Egg):** Only triggered if user repeatedly ignores warnings"

**Thorne:** "Example of Level 4 (Easter Egg):

```
User: [Tries to override Guardian 5 times in a row]

Weaver: "⚠️ **SECURITY PATTERN DETECTED**

You've attempted to override Guardian 5 times.

**Historical Precedent:**
In 2023, a defense contractor repeatedly bypassed similar
warnings while sharing drone specifications with a partner.
Those specifications were later found in a ransomware group's
dark web marketplace. The contract was terminated, 47 employees
were laid off, and the CTO now works as a barista.

**Are you ABSOLUTELY CERTAIN you want to proceed?**

[No, cancel] [Yes, I understand the risks]"
```

**Sam:** "Perfect! Dark humor as a security education tool."

### **DECISION 6: Weaver Security Scenarios**

- ✅ **Implement graduated severity levels** (1-4)
- ✅ **Level 4 = Easter Egg** (only after repeated violations)
- ✅ **Tone:** Darkly humorous but professional (not as extreme as SchemaWhisperer)
- ✅ **Reference real-world incidents** (anonymized) for credibility

---

## Implementation Roadmap

### **Phase 1: Stabilize Advanced Mode (Current Sprint)**
1. ✅ Remove "Skip AI Review" toggle
2. ✅ Simplify AI service dropdown (Cloud / On-Prem / Local)
3. ✅ Implement `declassify` visual treatment (dual-color border, icon, tooltip)
4. ✅ Implement classification precedence validation in Guardian
5. ✅ Add Weaver activation flow (3 paths: file open, direct request, Guardian suggestion)
6. ✅ Add `[⚙️ Advanced Mode]` badge when active

### **Phase 2: Baseline Mode (Next Sprint)**
1. Build single-classification frontmatter support (`classification: CONFIDENTIAL`)
2. Hide WHAT/HOW UI when in baseline mode
3. Update Guardian to work with single classification
4. Add toggle in Weaver to switch modes (hidden until user asks)

### **Phase 3: Trust Progression (Stretch Goal)**
1. Implement T2 unlock (Guardian challenge)
2. Add paranoid security scenarios (Levels 1-4)
3. Track user security-awareness score
4. Unlock `declassify` only after passing challenge

### **Phase 4: Baseline Marketing (Parallel to Phase 2)**
1. Restructure Defense landing page
2. Add "Problem → Baseline → Advanced" flow
3. Create separate demo videos for each mode
4. Update sales materials for SAAB vs HELM pitches

---

## Key Quotes

**Sam:** "Clean up advanced mode before we make a simpler version. Otherwise we'll have TWO buggy systems."

**Thorne:** "Classification precedence needs to be crystal clear. Frontmatter = ceiling, blocks can't go lower."

**Morgan:** "SchemaWhisperer's paranoid scenarios are hilarious AND educational. Weaver should do that."

**Raven:** "No UI button. You earn advanced mode by asking for it or needing it."

---

## Session Duration

~75 minutes

---

## Related Documents

- `balans-website/transcripts/2025-11-24-baseline-vs-advanced-mode-design.md` (market segmentation)
- `balans-website/transcripts/2025-11-24-guardian-override-ux-design.md` (`declassify` attribute)
- `compression/1-sources/classfied-knowledge/quarantine/references/nexus-fleet/v2/schemawhisperer-advanced-mode-interaction.md` (trust progression inspiration)
- `balans-website/src/components/red-forge/WeaverAssistant.tsx` (Weaver activation logic will go here)

