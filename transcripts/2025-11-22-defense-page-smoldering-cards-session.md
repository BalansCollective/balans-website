# Defense Page: Smoldering Cards Effect Session

**Date:** 2025-11-22  
**Context:** Implementing Red Forge design reference compliance + smoldering card effect  
**Status:** ✅ Complete - Ready for editorial review

---

## Session Goals

1. Make Defense page compliant with Red Forge design reference
2. Implement "smoldering cards" effect (cold steel front, glowing red back)
3. Fix naming: Red Forge (not Red Cell)
4. Editorial review to tighten copy

---

## Design Decisions

### Smoldering Cards Concept

**User's vision:** "Intense smoldering red behind things you activate that shows up on hover"

**Initial misunderstanding:** I put glow effects INSIDE cards (transparent)  
**Correction:** Cards must be SOLID - cold steel front, glowing hot back

**Final implementation:**
- **Framsida:** Solid metallic (`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`)
- **Baksida:** Red/orange smoldering (dual layer: gradient blur + radial glow)
- **On hover:** Card lifts 8px, red glow becomes visible behind it
- **Effect:** Like classified documents with red security markings on back

### Color Compliance (Red Forge Reference)

**Changes:**
- WHAT card: Model Confidence Blue `#0066cc` (not generic blue)
- HOW card: Critical Red `#dc143c` (not generic red)
- All cards: Red smoldering back (classification visual)

**Smoldering back (consistent across all cards):**
```css
/* Layer 1: Gradient blur */
bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70
blur-3xl

/* Layer 2: Radial glow (concentrated center) */
bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)]
blur-2xl

/* Both layers: opacity 0 → 100 on hover, scale 95 → 110 */
```

---

## Implementation Summary

### Cards Updated

1. **WHAT Card** (Dual Classification) - Blue front, red glowing back
2. **HOW Card** (Dual Classification) - Red front, INTENSE red glowing back
3. **Data Diode Card** (Red Forge) - Red front, red glowing back
4. **LLM Classification Awareness Card** (Red Forge) - Red front, red glowing back
5. **Guardian Protocol Card** (Protocols) - Blue front, red glowing back
6. **Forge Protocol Card** (Protocols) - Orange front, red glowing back
7. **Use Cases Cards** (3×) - Gray front, red glowing back

### Hover Behavior (all cards)

- Lift: `-translate-y-2` (8px up)
- Duration: `500ms` for glow layers, `300ms` for card/text
- Glow: Two layers intensify (gradient + radial)
- Shadow: Massive red shadow cast below card
- Text: Color shifts slightly warmer on hover

---

## Editorial Review: Defense Page Copy

**Issue:** Red Cell → Red Forge (wrong product name)

**Areas to tighten:**
- [ ] Hero section - check verbosity
- [ ] Red Forge description - clearer value prop
- [ ] Data Diode explanation - simpler?
- [ ] Use cases - concrete or abstract?
- [ ] CTA section - compelling enough?

---

## Writing Group Checklist

### Institutional Tone
- [ ] Active voice (not passive)
- [ ] Concrete language (not abstract jargon)
- [ ] Specific examples (not generic claims)
- [ ] Benefits clear (why should defense care?)

### Content Quality
- [ ] No repetition between sections
- [ ] Technical accuracy (classification levels, protocols)
- [ ] Consistent terminology (Red Forge not Red Cell)
- [ ] Clear hierarchy (what → why → how)

### Defense Audience Expectations
- [ ] Security-first framing
- [ ] Operational clarity (not theoretical)
- [ ] Risk mitigation focus
- [ ] NATO/classification compliance signals

---

## Next Steps

1. **Fix:** Red Cell → Red Forge everywhere
2. **Review:** Copy verbosity and clarity
3. **Check:** Translation files (sv/en) both updated
4. **Validate:** Technical accuracy of claims

---

## Technical Notes

**File modified:** `balans-website/src/pages/website/DefensePage.tsx`

**Key pattern (reusable for other domains):**
```tsx
<div className="relative group cursor-pointer">
  {/* Smoldering red back (dual layer) */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
  
  {/* Cold steel front (solid) */}
  <Card className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-900/50 transition-all duration-300 group-hover:border-red-600 group-hover:-translate-y-2 group-hover:shadow-[0_8px_60px_rgba(220,20,60,0.6)]">
    {/* Content */}
  </Card>
</div>
```

---

## Design System Compliance

✅ Red Forge reference colors used  
✅ Smoldering effect consistent across all cards  
✅ Solid backgrounds (not transparent)  
✅ WCAG contrast maintained (solid gray backgrounds)  
✅ Hover timing matches homepage patterns (300-500ms)

---

## Session Duration

~45 minutes (including design iterations and color fixes)

