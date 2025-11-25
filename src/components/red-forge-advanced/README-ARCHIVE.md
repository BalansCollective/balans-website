# Red Forge Advanced Version Archive

**Archived:** 2025-11-24  
**Reason:** Trojan Horse Strategy - Phase 1 KISS Baseline

## What This Is

This is the **advanced version** of Red Forge with:
- ✅ WHAT/HOW dual classification UI
- ✅ Tabs (Weaver/Audit)
- ✅ Advanced approval modal (cost calculator, declassify preview)
- ✅ Override options
- ✅ Full MDX dual-line visualization

## Why Archived

Per strategic decision (see `.coordination/outbox/morgan/COMPREHENSIVE-RED-FORGE-HANDOFF.md`):
- **Phase 1:** Market (SAAB/FMV) not ready for WHAT/HOW complexity
- **Phase 1 Demo:** Simple single-level classification (ES/BH/K/H)
- **Phase 2 Plan:** Reintroduce WHAT/HOW after 6-12 months when trust established

## Files Archived

```
red-forge-advanced-archive/
├── AuditTrailPanel.tsx
├── DemoData.ts
├── DemoSafetyModal.tsx
├── FileTreeItem.tsx
├── MDXRenderer.tsx
├── SendToAIButton.tsx
└── WeaverAssistant.tsx

../pages/RedForgeIDEPage.tsx.advanced-archive
```

## How to Restore

If/when Phase 2 needs advanced version:

```bash
# Copy back to active
cp -r red-forge-advanced-archive/* red-forge/

# Copy page
cp ../pages/RedForgeIDEPage.tsx.advanced-archive ../pages/RedForgeIDEPage.tsx

# Or serve on /advanced route
# <Route path="/red-forge/advanced" element={<RedForgeAdvancedPage />} />
```

## Strategic Context

**Defense Page KEEPS WHAT/HOW explanation** (strategic vision, thought leadership)  
**Demo UI SIMPLIFIED to KISS baseline** (market readiness, adoption barrier removal)

This is NOT deleting the capability, just phasing the rollout.

---

**Archive Status:** Preserved for Phase 2  
**Do Not Delete:** Contains working advanced implementation  
**Reference:** `.coordination/outbox/morgan/COMPREHENSIVE-RED-FORGE-HANDOFF.md`

