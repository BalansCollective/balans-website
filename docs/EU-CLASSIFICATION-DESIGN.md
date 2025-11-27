# EU Classification Levels - Design Research & Implementation Strategy

## 🇪🇺 EU Classification Hierarchy

### Standard EU Levels (Official)
1. **EU RESTRICTED (RESTREINT UE)** ⚠️
   - Lowest EU classified level
   - Similar handling to Swedish BH, but NOT identical
   - Unauthorized disclosure = disadvantageous to EU/member states
   
2. **EU CONFIDENTIAL (CONFIDENTIEL UE)** 🔒
   - Medium sensitivity
   - Likely maps to Swedish "Konfidentiell" (K)
   
3. **EU SECRET (SECRET UE)** 🔐
   - High sensitivity
   - Likely maps to Swedish "Hemlig" (H)
   
4. **EU TOP SECRET (TRÈS SECRET UE / FOCAL POINT)** 🚨
   - Highest EU level
   - May map to Swedish "Kvalificerat Hemlig" (KH) or higher

---

## 🇸🇪 Swedish ↔ EU Mapping Problem

### Key Insight: **"Similar handling ≠ Same classification"**

```
Swedish National          EU Level                Handling Rules
─────────────────────────────────────────────────────────────────
Oklassificerad (O)        (No EU equivalent)     No EU access
Begränsad Hemlig (BH)     ≈ EU RESTRICTED*       Similar rules, different origin
Konfidentiell (K)         ≈ EU CONFIDENTIAL      Similar rules, different origin
Hemlig (H)                ≈ EU SECRET            Similar rules, different origin
Kvalificerat Hemlig (KH)  ≈ EU TOP SECRET        Similar rules, different origin
```

*⚠️ **CRITICAL**: EU RESTRICTED and BH are handled under the same **regelverk** (regulatory framework) 
but are **legally distinct** classifications.

---

## 🎯 Design Challenges

### Challenge 1: **Dual Classification System**
A file can be:
- **Swedish national only**: "Hemlig"
- **EU only**: "EU SECRET"
- **Both**: "EU SECRET / Hemlig" (marking shows both)

**Problem**: How do we represent dual classifications in our system?

### Challenge 2: **Access Control Precedence**
- If a file is "BH + EU RESTRICTED", which AI service level is required?
- Do we treat them as equivalent (same level) or separate (require higher clearance)?

### Challenge 3: **Audit Trail & Compliance**
- EU classifications require specific audit trails per EU regulations
- Swedish classifications require audit per Swedish law
- Dual-classified files need BOTH audit trails

### Challenge 4: **Declassification Workflow**
- Can you declassify "EU RESTRICTED" to Swedish "O"?
- Does declassification require EU approval vs. Swedish approval?

---

## 💡 Proposed Solutions

### Option A: **Separate Classification Dimensions**
```typescript
interface FileClassification {
  national: 'oklassificerad' | 'begransad-hemlig' | 'konfidentiell' | 'hemlig' | 'kvalificerat-hemlig';
  eu?: 'eu-restricted' | 'eu-confidential' | 'eu-secret' | 'eu-top-secret';
  nato?: 'nato-restricted' | 'nato-confidential' | 'nato-secret'; // Future
}
```

**Pros**:
- ✅ Explicit separation of classification systems
- ✅ Can represent dual classifications naturally
- ✅ Easy to add NATO/other international levels later

**Cons**:
- ❌ More complex UI (multiple dropdowns?)
- ❌ AI service routing logic becomes more complex
- ❌ Audit logging needs to handle multiple dimensions

---

### Option B: **Composite Classification Levels**
```typescript
type Classification = 
  | 'oklassificerad'
  | 'begransad-hemlig'
  | 'eu-restricted'           // NEW: Treated as ≈BH but distinct
  | 'konfidentiell'
  | 'eu-confidential'         // NEW: Treated as ≈K but distinct
  | 'hemlig'
  | 'eu-secret'               // NEW: Treated as ≈H but distinct
  | 'kvalificerat-hemlig'
  | 'eu-top-secret';          // NEW: Treated as ≈KH but distinct
```

**Pros**:
- ✅ Simple flat structure (easier to implement)
- ✅ Each classification is a distinct value
- ✅ AI service routing can map EU → Swedish equivalents

**Cons**:
- ❌ Can't represent **dual** classifications (file marked both EU + Swedish)
- ❌ Implies EU and Swedish are mutually exclusive (they're not)
- ❌ Harder to extend to NATO/other systems

---

### Option C: **Hybrid Approach** (RECOMMENDED)
```typescript
interface FileClassification {
  primary: NationalClassification | EUClassification;
  secondary?: NationalClassification | EUClassification;
  // If secondary exists, file is dual-classified
}

type NationalClassification = 'oklassificerad' | 'begransad-hemlig' | 'konfidentiell' | 'hemlig';
type EUClassification = 'eu-restricted' | 'eu-confidential' | 'eu-secret' | 'eu-top-secret';
```

**Pros**:
- ✅ Supports both single and dual classification
- ✅ Clear primary/secondary distinction
- ✅ Extensible to NATO/other systems
- ✅ UI can show primary prominently, secondary as badge

**Cons**:
- ⚠️ "Primary" concept may not always make sense (which is more important?)
- ⚠️ Complexity in deciding AI service level (use highest?)

---

## 🛠️ Implementation Recommendations

### For Red Forge Demo (MVP):
**Use Option B (Composite) for simplicity**:
- Add `eu-restricted` as a classification level
- Map it to same AI service level as `begransad-hemlig` (SaaS Lumen)
- Add visual distinction (🇪🇺 badge or color)
- Add note in UI: "EU RESTRICTED hanteras enligt samma regelverk som BH"

### For Production System:
**Use Option C (Hybrid) for correctness**:
- Support dual classifications
- Implement precedence rules (highest level wins for access control)
- Separate audit trails for EU vs. national
- Declassification workflows aware of classification origin

---

## 🎨 UI Considerations

### Classification Display:
```
┌─────────────────────────────────────┐
│ 📁 nato-interop-specs.md            │
│ 🇪🇺 EU RESTRICTED / 🇸🇪 BH          │  ← Dual classification
│ AI: SaaS Lumen (max: BH/EU-R)      │
└─────────────────────────────────────┘
```

### Declassification:
```
Deklassificera från:
┌─────────────────────┐
│ 🇪🇺 EU RESTRICTED   │ → 🇸🇪 Oklassificerad ✓ (allowed)
└─────────────────────┘

⚠️ OBS: EU-klassificering kräver EU-godkännande för deklassificering.
Denna demo visar endast tekniskt flöde.
```

---

## 🔐 AI Service Routing Rules

### Mapping Table (for MVP):
```
Classification Level       AI Service Required    Notes
────────────────────────────────────────────────────────────────
Oklassificerad (O)         Claude Cloud          Public models OK
Begränsad Hemlig (BH)      SaaS Lumen            Domain-specific
🇪🇺 EU RESTRICTED          SaaS Lumen            Same as BH
Konfidentiell (K)          Red Forge Local       Classified env
🇪🇺 EU CONFIDENTIAL        Red Forge Local       Same as K
Hemlig (H)                 Red Forge Air-Gap     Air-gapped
🇪🇺 EU SECRET              Red Forge Air-Gap     Same as H
🇪🇺 EU TOP SECRET          Red Forge Air-Gap+    Requires special clearance
```

### Dual Classification Rules:
```typescript
function getRequiredAIService(classification: FileClassification): AIService {
  const levels = [classification.primary];
  if (classification.secondary) levels.push(classification.secondary);
  
  // Use HIGHEST level for access control
  const maxLevel = Math.max(...levels.map(c => CLASSIFICATION_LEVELS[c]));
  return findServiceForLevel(maxLevel);
}
```

---

## 📋 Audit Trail Requirements

### For EU Classifications:
```yaml
audit_entry:
  timestamp: 2025-11-27T10:15:30Z
  file: nato-interop-specs.md
  classification: eu-restricted
  action: ai_access
  ai_service: saas-lumen
  user: operator-123
  jurisdiction: EU  # ← CRITICAL for compliance
  regulation: "EU 2023/1234"  # Reference to specific EU regulation
```

### For Dual Classifications:
```yaml
audit_entry:
  timestamp: 2025-11-27T10:15:30Z
  file: joint-analysis.md
  classifications:
    - type: national
      level: begransad-hemlig
      jurisdiction: SE
      regulation: "Säkerhetsskyddslagen (2018:585)"
    - type: eu
      level: eu-restricted
      jurisdiction: EU
      regulation: "EU 2023/1234"
  action: declassification_attempt
  result: blocked  # Requires both SE and EU approval
```

---

## 🚀 MVP Implementation Plan

### Phase 1: Add EU RESTRICTED (This PR)
1. ✅ Add `eu-restricted` to `Classification` type
2. ✅ Map to same level as `begransad-hemlig` (level 1)
3. ✅ Add 🇪🇺 visual indicator in UI
4. ✅ Update tests to include EU RESTRICTED
5. ✅ Add demo file with EU RESTRICTED classification

### Phase 2: Full EU Support (Future)
1. Add all 4 EU levels (RESTRICTED, CONFIDENTIAL, SECRET, TOP SECRET)
2. Implement dual classification (Option C)
3. Add jurisdiction-aware audit trails
4. Add EU-specific declassification workflows

### Phase 3: NATO & International (Future)
1. Add NATO classification levels
2. Add generic "international" classification support
3. Implement coalition-specific access rules

---

## 🧪 Test Cases to Add

```typescript
describe('EU Classification Handling', () => {
  it('should treat EU RESTRICTED same as BH for AI service routing', () => {
    const file = { classification: 'eu-restricted' };
    const service = getRequiredAIService(file);
    expect(service).toBe('saas-lumen');
  });
  
  it('should display EU badge for EU classifications', () => {
    const label = getClassificationLabel('eu-restricted');
    expect(label).toContain('🇪🇺');
  });
  
  it('should log jurisdiction in audit trail for EU files', () => {
    const entry = createAuditEntry('eu-restricted');
    expect(entry.jurisdiction).toBe('EU');
  });
  
  it('should handle declassification of EU RESTRICTED to O', () => {
    const result = canDeclassify('eu-restricted', 'oklassificerad');
    expect(result.allowed).toBe(true);
    expect(result.warning).toContain('EU-godkännande krävs');
  });
});
```

---

## 💭 Open Questions for User

1. **Scope for demo**: Should we add just EU RESTRICTED, or all 4 EU levels?
2. **Dual classification**: Do we need to support files marked both EU + Swedish now, or later?
3. **Visual distinction**: How prominent should EU vs. Swedish classification be in UI?
4. **Audit compliance**: Does demo need real EU audit trail format, or is simplified OK?
5. **NATO**: Should we plan for NATO levels now (architecture decision) or add later?

---

## 📚 References

- **EU Security Classification Rules**: Council Decision 2013/488/EU
- **Swedish Implementation**: Säkerhetsskyddslagen (2018:585)
- **Swedish-EU Mapping**: MSB guidance on EU-klassificerad information
- **GDPR Intersection**: EDPB guidelines on handling classified personal data

---

**Recommendation**: Start with Phase 1 (add `eu-restricted` as composite level), then iterate based on real usage patterns and compliance requirements.

