# Balans Hover Effect Patterns

**Version:** 1.0.0  
**Date:** 2025-11-22  
**Status:** ACTIVE  
**Context:** Institutional domain interactive feedback patterns

---

## Overview

Hover effects on the Balans website follow **Tier 2 (Moderate)** guidelines - providing functional feedback while respecting institutional lagom constraints.

**Design Session:** See `transcripts/2025-11-22-image-hover-magic-session.md` for full rationale.

---

## Core Principles

1. **Function over decoration** - Hover confirms interactivity (usability)
2. **Lagom timing** - 300ms duration (not too fast, not too slow)
3. **Subtle transforms** - 4px lift maximum for institutional contexts
4. **Archetypal glows** - 5% domain-specific color overlay (barely visible)
5. **Accessibility first** - Respects `prefers-reduced-motion`, keyboard focus, touch

---

## Product Card Hover Pattern

### Implementation

```tsx
// Card wrapper - Tier 2 hover
className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(44,90,160,0.15)]"

// Image container - Domain-specific archetypal glow
<div className="bg-[#f8f6f0] transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-[rgba(R,G,B,0.05)] group-hover:to-[#f8f6f0]">
```

### Domain-Specific Glows

| Domain | Archetypal Color | RGB Values | Meaning |
|--------|------------------|------------|---------|
| **Family** | Birch Wood Warmth | `212, 184, 150` | Authenticity, human wisdom |
| **Medical** | Sage Green Healing | `143, 170, 139` | Growth, collaborative care |
| **Defense** | Swedish Blue Systematic | `44, 90, 160` | Precision, protection |

---

## Effect Breakdown

### On Hover:
1. **Lift:** `-translate-y-1` (4px upward)
2. **Shadow:** `0 12px 28px rgba(44,90,160,0.15)` (Swedish Blue tinted)
3. **Glow:** 5% archetypal gradient from top
4. **Duration:** 300ms (`duration-300`)
5. **Easing:** Tailwind default (`ease-in-out`)

### Visual Result:
- Cards "lift" slightly, confirming clickability
- Shadow deepens, suggesting depth
- Background subtly shifts to domain color
- Smooth, professional animation

---

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Transform disabled, use outline instead */
  .product-card:hover {
    transform: none;
    box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.5);
  }
}
```

### Keyboard Focus
```tsx
// Same hover effect applied to :focus-visible
className="focus-visible:outline focus-visible:outline-3 focus-visible:outline-swedish-blue focus-visible:-translate-y-1"
```

### Touch Devices
- Hover effect triggers on `:active` state (tap feedback)
- No "stuck hover" on mobile

---

## Usage Guidelines

### ✅ DO Use Tier 2 Hover For:
- Product cards (homepage)
- Clickable images with links
- Interactive panels requiring feedback
- Institutional contexts needing professional tone

### ❌ DON'T Use For:
- Non-interactive images (no link)
- Autonomous animations (breathing, floating)
- Family domain pages (use Tier 3 - more expressive)
- Defense pages (consider Tier 1 - more restrained)

---

## Tier Reference

### Tier 1: Minimal (Defense/High Authority)
- 2px lift
- 10% shadow opacity
- No color glow
- Maximum restraint

### Tier 2: Moderate (Institutional Homepage) ✅ CURRENT
- 4px lift
- 15% shadow opacity
- 5% archetypal glow
- Balanced feedback

### Tier 3: Expressive (Family/Consumer)
- 6px lift + 2% scale
- 20% shadow opacity
- 10% archetypal glow
- Noticeable personality

---

## Testing Criteria

### Lagom Validation
- Swedish user panel rating: **Target 7-8/10** (balanced, not excessive)
- If >8: Too expressive, reduce
- If <7: Too subtle, enhance

### CTR Impact
- A/B test: Hover vs No Hover
- Expected: 5-15% increase in click-through
- If no impact: Effect too subtle to provide feedback value

### Professional Credibility
- Show to 3 regulators/policymakers
- Question: "Does this feel professional or playful?"
- Target: 100% "professional" responses

---

## Implementation Notes

### Tailwind Classes Used
- `cursor-pointer` - Visual feedback
- `transition-all duration-300` - Lagom 300ms timing
- `hover:-translate-y-1` - 4px lift (0.25rem)
- `hover:shadow-[custom]` - Swedish Blue tinted shadow
- `group-hover:bg-gradient-to-b` - Archetypal glow
- `group-hover:from-[rgba(R,G,B,0.05)]` - 5% color overlay

### Why These Values?
- **300ms:** Foundation `--lagom-duration` variable
- **4px lift:** Visible but not aggressive (Goldilocks zone)
- **15% opacity:** Subtle depth without heaviness
- **5% glow:** Barely perceptible archetypal hint

---

## Future Considerations

1. **Navigation hover effects** - Apply similar pattern?
2. **Protocol cards** (Guardian/Forge) - Same treatment?
3. **Button hover consistency** - Align with card patterns?
4. **Hero image parallax** - Static or subtle scroll effect?

---

## Related Documentation

- **Design Session:** `transcripts/2025-11-22-image-hover-magic-session.md`
- **Foundation Reference:** `compression/1-sources/balans/brand/reference/foundation-reference.md`
- **Institutional Domain:** `compression/1-sources/balans/brand/reference/domain-institutional-reference.md`
- **Design System Lumen:** `compression/99-output/lumens/balans-design-system.md`

---

**Last Updated:** 2025-11-22  
**Implemented On:** Homepage product cards (family, medical, defense)

