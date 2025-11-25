# Multi-Country Classification System Design

**Date:** 2025-11-24  
**Context:** Designing a classification system that works across EU countries, Norway, and the US  
**Participants:** Sam (User Vision), Raven (Architecture), Morgan (Compliance)  
**Status:** ✅ Complete - Hybrid approach defined

---

## Session Goals

1. Determine if a "meta-classification" system is feasible
2. Design country-specific UI with shared AI routing
3. Handle edge cases (multi-national projects, cross-border collaboration)

---

## The Classification Mapping Problem

### **Countries & Their Systems:**

| Country | Levels | Unique Challenge |
|---------|--------|------------------|
| **Sweden (FMV)** | 5 | BEGRÄNSAT HEMLIG (between unclassified and confidential) |
| **Norway (NSM)** | 5 | BEGRENSET (similar to Swedish BH) |
| **US/NATO** | 4 | No "restricted" level |
| **Germany (BSI)** | 5 | VS-NUR FÜR DEN DIENSTGEBRAUCH (internal use, not technically classified) |
| **Finland (VAHTI)** | 5 | VIRANOMAISKÄYTTÖ (government use only) |
| **EU** | 4 | CONFIDENTIEL UE, SECRET UE, TRÈS SECRET UE |

### **Key Insight:**
European countries have a **5-level system** with a "restricted" level between unclassified and confidential. US/NATO uses **4 levels** (no middle tier).

---

## Three Approaches

### **Option A: Pure Meta-Classification**

Create abstract levels:
```
META-0: PUBLIC
META-1: RESTRICTED (European only)
META-2: CONFIDENTIAL
META-3: SECRET
META-4: TOP SECRET
```

**Verdict:** ❌ **Rejected** - Legal risk, customer confusion

---

### **Option B: Country-Specific Silos**

Separate implementations per country:
```
Red Forge SE Edition
Red Forge NO Edition
Red Forge US Edition
```

**Verdict:** ⚠️ **Workable but inefficient** - Too much duplication

---

### **Option C: Hybrid (Country UI + Meta Backend)**

**UI Layer:** Country-specific terminology
**Backend Layer:** 5-level meta-system for AI routing
**Compliance Layer:** Country-specific rules and messages

**Verdict:** ✅ **RECOMMENDED** - Best of both worlds

---

## Hybrid Architecture Design

### **1. Meta-Classification Levels (Internal Only)**

```typescript
// Internal representation (never shown to users)
export type MetaSecurityLevel = 
  | 'META_0_PUBLIC'
  | 'META_1_RESTRICTED'
  | 'META_2_CONFIDENTIAL'
  | 'META_3_SECRET'
  | 'META_4_TOP_SECRET';
```

### **2. Country-Specific Types (User-Facing)**

```typescript
// Sweden (FMV/SAK-IMS)
export type SwedishLevel = 'EJ_SEKRETESS' | 'BEGRANSAT_HEMLIG' | 'KONFIDENTIELL' | 'HEMLIG' | 'KVALIFICERAT_HEMLIG';

// Norway (NSM)
export type NorwegianLevel = 'ÅPEN' | 'BEGRENSET' | 'KONFIDENSIELL' | 'HEMMELIG' | 'STRENGT_HEMMELIG';

// US/NATO
export type USLevel = 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';

// Germany (BSI)
export type GermanLevel = 'OFFEN' | 'VS_NFD' | 'VS_VERTRAULICH' | 'GEHEIM' | 'STRENG_GEHEIM';

// Finland (VAHTI)
export type FinnishLevel = 'JULKINEN' | 'VIRANOMAISKAYTTÖ' | 'LUOTTAMUKSELLINEN' | 'SALAINEN' | 'ERITTÄIN_SALAINEN';

// EU
export type EULevel = 'UNCLASSIFIED_EU' | 'CONFIDENTIEL_UE' | 'SECRET_UE' | 'TRÈS_SECRET_UE';
```

### **3. Bidirectional Mapping**

```typescript
// Map country-specific level to meta-level
export function toMetaLevel(
  level: SwedishLevel | NorwegianLevel | USLevel | GermanLevel | FinnishLevel | EULevel,
  country: CountryCode
): MetaSecurityLevel {
  const mappings = {
    SE: {
      'EJ_SEKRETESS': 'META_0_PUBLIC',
      'BEGRANSAT_HEMLIG': 'META_1_RESTRICTED',
      'KONFIDENTIELL': 'META_2_CONFIDENTIAL',
      'HEMLIG': 'META_3_SECRET',
      'KVALIFICERAT_HEMLIG': 'META_4_TOP_SECRET',
    },
    NO: {
      'ÅPEN': 'META_0_PUBLIC',
      'BEGRENSET': 'META_1_RESTRICTED',
      'KONFIDENSIELL': 'META_2_CONFIDENTIAL',
      'HEMMELIG': 'META_3_SECRET',
      'STRENGT_HEMMELIG': 'META_4_TOP_SECRET',
    },
    US: {
      'UNCLASSIFIED': 'META_0_PUBLIC',
      // US has no META_1_RESTRICTED
      'CONFIDENTIAL': 'META_2_CONFIDENTIAL',
      'SECRET': 'META_3_SECRET',
      'TOP_SECRET': 'META_4_TOP_SECRET',
    },
    DE: {
      'OFFEN': 'META_0_PUBLIC',
      'VS_NFD': 'META_1_RESTRICTED',
      'VS_VERTRAULICH': 'META_2_CONFIDENTIAL',
      'GEHEIM': 'META_3_SECRET',
      'STRENG_GEHEIM': 'META_4_TOP_SECRET',
    },
    // ... etc
  };
  
  return mappings[country][level];
}

// Map meta-level back to country-specific level
export function fromMetaLevel(
  metaLevel: MetaSecurityLevel,
  country: CountryCode
): SwedishLevel | NorwegianLevel | USLevel {
  // Reverse mapping
}
```

### **4. AI Service Configuration (Meta-Level Based)**

```typescript
export interface AIServiceConfig {
  service: string;
  displayName: string;
  maxMetaLevel: MetaSecurityLevel; // AI routing uses meta-levels
  openRouterModel: string;
  networkZone: 'white' | 'yellow' | 'red';
}

export const AI_SERVICE_CONFIGS = [
  {
    service: 'openai',
    displayName: 'Claude Sonnet 4.5 (Cloud)',
    maxMetaLevel: 'META_0_PUBLIC',
    openRouterModel: 'anthropic/claude-sonnet-4.5',
    networkZone: 'white'
  },
  {
    service: 'redforge-saas',
    displayName: 'Red Forge SaaS',
    maxMetaLevel: 'META_2_CONFIDENTIAL', // Handles META_0, META_1, META_2
    openRouterModel: 'meta-llama/llama-3.3-70b-instruct',
    networkZone: 'yellow'
  },
  {
    service: 'redforge-onprem',
    displayName: 'Red Forge On-Prem',
    maxMetaLevel: 'META_3_SECRET', // Handles up to META_3
    openRouterModel: 'meta-llama/llama-3.3-70b-instruct',
    networkZone: 'red'
  }
];
```

### **5. Country-Specific UI & Guardian Messages**

```typescript
// UI shows country-specific labels
<CountryClassificationBadge 
  level="BEGRANSAT_HEMLIG" 
  country="SE" 
/>
// Renders: "BEGRÄNSAT HEMLIG (BH)"

// Guardian uses country-specific terminology
if (country === 'SE') {
  return `🚫 BLOCKERAD: Denna fil är klassificerad BEGRÄNSAT HEMLIG.
  
  För att hantera BEGRÄNSAT HEMLIG, byt till Red Forge SaaS (FMV Nivå 2-godkänd).`;
}

if (country === 'NO') {
  return `🚫 BLOKKERT: Denne filen er klassifisert BEGRENSET.
  
  For å håndtere BEGRENSET, bytt til Red Forge SaaS (NSM Nivå 2-godkjent).`;
}
```

---

## Edge Cases & Solutions

### **Edge Case 1: Multi-National Projects**

**Scenario:** SAAB (Sweden) working with Lockheed Martin (US) on NATO project

**Solution:** User selects primary country, but can view mappings:
```
[🇸🇪 Sverige] [Show US Equivalents]

File: birdturret-v3.md
- VAD: BEGRÄNSAT HEMLIG (BH) ≈ US: Between UNCLASSIFIED and CONFIDENTIAL
- HUR: KONFIDENTIELL (K) ≈ US: CONFIDENTIAL
```

**AI Routing:** Uses meta-levels (BH → META_1, K → META_2), works regardless of country

---

### **Edge Case 2: US User Uploads Swedish-Classified File**

**Scenario:** US user opens file with `<What level="BH">...</What>`

**Solution:** Red Forge auto-detects country from classification markers:
```
⚠️ This file uses Swedish classification (BEGRÄNSAT HEMLIG).

Switch to Swedish mode? [Yes] [No, show US equivalent]
```

If "Show US equivalent":
```
BEGRÄNSAT HEMLIG (BH) ≈ UNCLASSIFIED + (internal use only)

⚠️ Note: US has no exact equivalent. Closest is UNCLASSIFIED, but BH 
requires säkerhetsskyddsavtal (security agreement) in Sweden.
```

---

### **Edge Case 3: Country Has No META_1 Equivalent**

**Scenario:** US user tries to create META_1_RESTRICTED content

**Solution:** Red Forge warns:
```
⚠️ US classification system has no "RESTRICTED" level.

Options:
1. Classify as UNCLASSIFIED (closest US equivalent)
2. Switch to EU/Swedish mode (has RESTRICTED level)
3. Add note: "Internal use only" (non-binding in US)
```

---

### **Edge Case 4: Cross-Country Export**

**Scenario:** Swedish BEGRÄNSAT HEMLIG file needs to be shared with US partner

**Solution:** Red Forge provides classification translation tool:
```
Export to US Classification:

Original (SE):
- VAD: BEGRÄNSAT HEMLIG (BH)
- HUR: KONFIDENTIELL (K)

Suggested US Classification:
- WHAT: UNCLASSIFIED (with caveat: "Swedish BEGRÄNSAT HEMLIG")
- HOW: CONFIDENTIAL

⚠️ Warning: US has no BEGRÄNSAT HEMLIG equivalent. Recipient may 
treat as UNCLASSIFIED. Confirm with legal before sharing.

[Cancel] [Export with caveat] [Upgrade to CONFIDENTIAL]
```

---

## Implementation Checklist

### **Phase 1: Core Meta-System**
- [ ] Define `MetaSecurityLevel` enum
- [ ] Create bidirectional mapping functions (`toMetaLevel`, `fromMetaLevel`)
- [ ] Update AI service configs to use `maxMetaLevel`
- [ ] Test AI routing with meta-levels

### **Phase 2: Country-Specific UI**
- [ ] Add country selector: `[🇸🇪 SE] [🇳🇴 NO] [🇺🇸 US] [🇩🇪 DE] [🇫🇮 FI] [🇪🇺 EU]`
- [ ] Country-specific classification dropdowns
- [ ] Country-specific Guardian messages
- [ ] Country-specific system prompts for AI

### **Phase 3: Multi-Country Features**
- [ ] "Show US Equivalent" toggle
- [ ] Auto-detect country from file content
- [ ] Classification translation tool for export
- [ ] Multi-national project support (dual labels)

### **Phase 4: Compliance & Legal**
- [ ] Legal review of "equivalent" mappings
- [ ] FMV approval for Swedish variant (Nivå 2/3 claims)
- [ ] NSM approval for Norwegian variant
- [ ] DoD approval for US variant (if targeting defense)

---

## Complexity Assessment

**How complicated does it get?**

### **Minimal Viable (MVP):**
- 2 countries (Sweden + US)
- No multi-country features
- Simple 1:1 mapping where possible
- **Complexity: MODERATE** (2 weeks work)

### **Full Multi-Country (Production):**
- 6+ countries (SE, NO, US, DE, FI, EU)
- Multi-national project support
- Classification translation tool
- Legal compliance per country
- **Complexity: HIGH** (2-3 months work + legal review)

---

## Recommendation for MVP

**Start with Swedish-only variant:**
1. ✅ Implement Swedish classification (done!)
2. Add locale toggle: `[🇸🇪 Svenska] [🇺🇸 English/US]`
3. Show "US Equivalent" button in Swedish mode
4. Don't build full meta-system yet (YAGNI until we have 3+ countries)

**When to build meta-system:**
- After we have 2+ European customers (Norway, Finland, or Germany)
- When we have a multi-national project (e.g., SAAB + Lockheed)
- When legal review confirms equivalency mappings are acceptable

---

## Key Quotes

**Sam:** "Can we make a meta classification thing that maps to all the others?"

**Raven:** "Yes, but with caveats. European 'RESTRICTED' (BH/BEGRENSET/VS-NfD) has no US equivalent. We'd need legal sign-off on any 'equivalent' claims."

**Morgan:** "Each country has specific legal requirements. FMV Del 9 for Swedish KH is totally different from US TOP SECRET handling. Can't abstract that away."

---

## Session Duration

~90 minutes

---

## Related Documents

- `balans-website/transcripts/2025-11-24-swedish-classification-levels-for-red-forge.md`
- `balans-website/src/lib/red-forge/swedish-ai-service-config.ts`
- NATO STANAG 4774 (classification equivalency agreements)
- FMV SAK-IMS 2022 (Swedish classification requirements)

