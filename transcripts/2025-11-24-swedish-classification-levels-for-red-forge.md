# Swedish Classification Levels for Red Forge

**Date:** 2025-11-24  
**Context:** Adapting Red Forge demo to use Swedish classification levels (SAK-IMS/FMV) instead of generic US levels  
**Participants:** Sam (User Vision), Raven (Compliance), Morgan (Legal)  
**Status:** ✅ Complete - Swedish classification mapping defined

---

## Session Goals

1. Map Swedish classification levels to Red Forge AI routing
2. Understand "Tilläggsbestämmelser för högre klassningar" (additional provisions for higher classifications)
3. Design how Red Forge handles Swedish defense contractor requirements

---

## Swedish Classification System (from SAK-IMS)

**Source:** Försvarets Materielverk (FMV) Industrisäkerhetsskyddsmanual (ISM) 2022

### **Four Swedish Classification Levels:**

1. **BEGRÄNSAT HEMLIG (BH)** - "Restricted Secret"
   - Lowest classified level
   - Requires säkerhetsskyddsavtal (security agreement) even at this level
   - FMV always requires formal agreement for BH and above

2. **KONFIDENTIELL (K)** - "Confidential"
   - Medium-low classification
   - Requires security-cleared personnel
   - Requires physical security measures

3. **HEMLIG (H)** - "Secret"
   - High classification
   - Requires enhanced security measures
   - Requires security-cleared facilities

4. **KVALIFICERAT HEMLIG (KH)** - "Qualified Secret" (Top Secret equivalent)
   - Highest classification
   - Requires special handling per Del 9 (HEMLIG bilaga - SECRET appendix)
   - "Skyddet ska i varje särskilt fall anpassas till de lokala förutsättningarna" (Protection must be adapted case-by-case)

### **Unclassified Level:**

- **Ej sekretess** - "Not secret" (Unclassified)
  - No security agreement required
  - Open handling

---

## Mapping to Red Forge AI Routing

### **Current Red Forge (US-style):**
- UNCLASSIFIED → Cloud AI (OpenAI, Claude)
- CONFIDENTIAL → On-Prem AI (Red Forge SaaS)
- SECRET → Air-gapped AI (Red Forge On-Prem)
- TOP_SECRET → No AI / Human Only

### **Proposed Red Forge (Swedish):**
- **Ej sekretess** → Cloud AI (OpenAI, Claude)
- **BEGRÄNSAT HEMLIG (BH)** → On-Prem AI (Red Forge SaaS, FMV-approved)
- **KONFIDENTIELL (K)** → On-Prem AI (Red Forge SaaS, enhanced security)
- **HEMLIG (H)** → Air-gapped AI (Red Forge On-Prem, security-cleared facility)
- **KVALIFICERAT HEMLIG (KH)** → No AI / Human Only / Case-by-case approval required

---

## "Tilläggsbestämmelser för högre klassningar" (Additional Provisions)

**From SAK-IMS Section 1.10:**

> "Enskilda uppdrag kan föranleda att ett utökat skydd behöver tillämpas."  
> (Individual assignments may require enhanced protection.)

> "För säkerhetsskyddsklass KVALIFICERAT HEMLIG ska skyddet i varje särskilt fall anpassas till de lokala förutsättningarna och verksamhetens karaktär."  
> (For KVALIFICERAT HEMLIG, protection must be adapted case-by-case to local conditions and operational character.)

**Examples of "Utökade skyddsåtgärder" (Enhanced Security Measures):**
- Utökade krav på informationssäkerhet (Enhanced information security)
- Utökade krav på IT-säkerhet (Enhanced IT security)
- Utökade krav på fysisk säkerhet (Enhanced physical security)
- Utökade krav på personalsäkerhet (Enhanced personnel security)

### **How Red Forge Handles This:**

**Option A: Lock KH entirely (safest)**
- KVALIFICERAT HEMLIG content → Hard block, no AI allowed
- User must manually review all KH content
- Guardian message: "KVALIFICERAT HEMLIG kräver manuell granskning. Ingen AI får anvä ndas." (KH requires manual review. No AI may be used.)

**Option B: Case-by-case approval (flexible)**
- KVALIFICERAT HEMLIG content → Require explicit approval from security officer
- User must provide justification + approval reference number
- Guardian logs all KH operations to audit trail for FMV inspection

**Option C: Restricted on-prem AI (complex)**
- KVALIFICERAT HEMLIG content → Only allowed with special on-prem instance
- Requires Del 9 compliance (HEMLIG bilaga - SECRET appendix)
- Requires FMV pre-approval of AI deployment

**Sam:** "For MVP, Option A. We hard-block KVALIFICERAT HEMLIG. No AI, period. When SAAB asks 'what about KH?', we say 'that requires FMV approval and a custom deployment per Del 9.'"

**Morgan:** "Agreed. Option A is the only defensible position for a SaaS product. B and C require case-by-case contracts with FMV."

### **DECISION 1: KVALIFICERAT HEMLIG Handling**

- ✅ **Hard block** all KVALIFICERAT HEMLIG content from AI
- ✅ Guardian message (Swedish): "KVALIFICERAT HEMLIG kräver specialhantering enligt Del 9. Ingen AI får användas utan FMV-godkännande."
- ✅ Guardian message (English): "KVALIFICERAT HEMLIG requires special handling per Part 9. No AI may be used without FMV approval."
- ✅ Audit trail logs all attempts to send KH to AI
- ✅ Sales positioning: "For KH handling, contact us for custom on-prem deployment with FMV compliance."

---

## Demo Configuration for Swedish Market

### **File Classification Frontmatter (Swedish Mode):**

```yaml
---
classification:
  what: BH  # BEGRÄNSAT HEMLIG
  how: K    # KONFIDENTIELL
---
```

Or single classification (baseline mode):

```yaml
---
classification: BH  # BEGRÄNSAT HEMLIG
---
```

### **AI Service Dropdown (Swedish Labels):**

- **Offentligt moln (OpenAI/Claude)** - Max: Ej sekretess
- **Red Forge SaaS (FMV-godkänd)** - Max: KONFIDENTIELL
- **Red Forge On-Prem (Luftgapad)** - Max: HEMLIG
- **Ingen AI (Manuell granskning)** - For KVALIFICERAT HEMLIG

### **MDX Classification Blocks (Swedish):**

```markdown
<What level="BH">
BirdTurret kan detektera och neutralisera drönare.
</What>

<How level="K">
Använder LIDAR + AI-målidentifiering med 99.9% precision.
</How>

<How level="H">
Algoritmen är baserad på [KLASSIFICERAD IMPLEMENTATION].
</How>

<How level="KH">
[KVALIFICERAT HEMLIG - requires Del 9 compliance]
</How>
```

### **Guardian Messages (Swedish):**

**Blockerad (BH till Cloud AI):**
> "🚫 **BLOCKERAD:** Denna fil är klassificerad BEGRÄNSAT HEMLIG.
> 
> **Din nuvarande konfiguration:**
> - AI-tjänst: Claude Sonnet (Offentligt moln) - Max: Ej sekretess
> - Fil: BEGRÄNSAT HEMLIG
> 
> **Alternativ:**
> 1. Byt till Red Forge SaaS (hanterar BH/K)
> 2. Ändra klassificering till Ej sekretess (om lämpligt)
> 
> [Byt AI] [Ändra klassificering]"

**Blockerad (KH till någon AI):**
> "🚫 **KRITISK BLOCKERING:** KVALIFICERAT HEMLIG upptäckt.
> 
> KVALIFICERAT HEMLIG-innehåll kräver specialhantering enligt FMV Del 9.
> Ingen AI får användas utan FMV-godkännande.
> 
> **Åtgärd:** Ta bort KVALIFICERAT HEMLIG-innehåll eller kontakta
> säkerhetsskyddschef för godkännande av speciallösning.
> 
> [Kontakta support för FMV-godkänd lösning]"

---

## "Säkerhetsskyddsavtal" Levels (Security Agreement Levels)

**From SAK-IMS:**

- **Nivå 1:** BEGRÄNSAT HEMLIG + säkerhetskänslig verksamhet
- **Nivå 2:** KONFIDENTIELL + säkerhetskänslig verksamhet
- **Nivå 3:** HEMLIG + säkerhetskänslig verksamhet
- **Nivå 4 (implied):** KVALIFICERAT HEMLIG (requires Del 9 special provisions)

### **Red Forge SaaS Positioning:**

- **Red Forge SaaS = Nivå 2-godkänd** (handles BH + K)
- **Red Forge On-Prem = Nivå 3-godkänd** (handles BH + K + H)
- **Red Forge KH = Custom** (requires FMV contract, Del 9 compliance)

**Sales messaging:**
> "Red Forge SaaS är FMV Nivå 2-godkänd och kan hantera BEGRÄNSAT HEMLIG och KONFIDENTIELL uppgifter säkert. För HEMLIG eller KVALIFICERAT HEMLIG, kontakta oss för on-prem/custom-lösning."

---

## Implementation Checklist

### **Phase 1: Swedish Classification Support**
- [ ] Add Swedish classification levels to `design-tokens.ts`:
  - `EJ_SEKRETESS` (blue)
  - `BEGRANSAT_HEMLIG` (yellow/orange)
  - `KONFIDENTIELL` (orange/red)
  - `HEMLIG` (red)
  - `KVALIFICERAT_HEMLIG` (dark red + special icon)
- [ ] Update MDX parser to recognize Swedish abbreviations: `BH`, `K`, `H`, `KH`
- [ ] Add locale toggle: US classifications ↔ Swedish classifications
- [ ] Update Guardian prompts with Swedish messages
- [ ] Add `[🇸🇪 Svenska]` language toggle in demo

### **Phase 2: FMV Compliance Messaging**
- [ ] Add "FMV-godkänd" badge to Red Forge SaaS in demo
- [ ] Create modal explaining säkerhetsskyddsavtal levels
- [ ] Add "Kontakta support för FMV-compliance" CTA for KH
- [ ] Update audit trail to use Swedish terminology

### **Phase 3: SAAB Demo Variant**
- [ ] Create `demo-saab.balans-collective.com` subdomain
- [ ] Pre-configure with Swedish classifications
- [ ] Pre-load BirdTurret V2 example (BH/K levels only)
- [ ] Disable US classification option entirely
- [ ] Add SAAB logo to demo header (with permission)

---

## Key Quotes

**Sam:** "SAAB won't understand 'CONFIDENTIAL'. They need to see 'BEGRÄNSAT HEMLIG' and 'FMV-godkänd'."

**Morgan:** "KVALIFICERAT HEMLIG is a hard no for SaaS. That requires custom contracts with FMV per Del 9."

**Raven:** "We position Red Forge SaaS as 'Nivå 2-godkänd'. That covers 80% of defense contractor use cases (BH + K)."

---

## Session Duration

~45 minutes

---

## Related Documents

- `balans-website/_ref/sak-ims.com` (FMV Industrisäkerhetsskyddsmanual 2022)
- `balans-website/src/lib/red-forge/design-tokens.ts` (needs Swedish levels)
- `balans-website/transcripts/2025-11-24-advanced-mode-simplification-and-weaver-activation.md` (trust progression)
- `compression/1-sources/birdturret/` (BH/K example content needed)

---

## Next Steps

**Immediate:**
1. Add Swedish classification constants to `design-tokens.ts`
2. Update MDX parser to recognize `BH`, `K`, `H`, `KH`
3. Create Guardian message templates in Swedish

**Short-term:**
4. Build locale toggle (US ↔ SE)
5. Create SAAB demo variant with Swedish-only UI
6. Get FMV compliance legal review for "Nivå 2-godkänd" claim

**Long-term:**
7. Pursue actual FMV Nivå 2 approval (requires security audit)
8. Create Del 9 compliance package for KH handling (custom deployments only)

