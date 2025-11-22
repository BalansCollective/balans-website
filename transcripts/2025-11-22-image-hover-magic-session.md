---
session_id: "BALANS-IMAGE-HOVER-MAGIC"
session_type: "Design System Animation Session"
date: "2025-11-22"
participants: ["Dieter Rams", "Susan Kare", "Bruno Mathsson", "Brandon Sanderson"]
focus: "Adding subtle interactive magic to images while respecting institutional lagom constraints"
context: "Homepage has static product domain images - explore how to make them feel alive without violating professional credibility"
status: "COMPLETED"
---

# Image Hover Magic: Lagom Interactivity for Institutional Design

## Session Opening

**Brandon Sanderson:** We have three domain images on the homepage - family, medical, defense. They're static right now. The question is: can we add subtle hover effects that make them feel *alive* without breaking institutional credibility?

**Dieter Rams:** *leans back, skeptical* Good design is as little design as possible. Animation is often unnecessary decoration. What *function* does a hover effect serve on these images?

**Bruno Mathsson:** Swedish craft teaches restraint, but also *life*. A well-made chair breathes - it has subtle curves, grain that catches light. These images are completely static. Perhaps too restrained?

**Susan Kare:** I think there's middle ground. The Mac had delightful interactions - cursor changes, button highlights. They served function (feedback) but also joy. Can we do the same here without being "playful" in a way that undermines institutional authority?

---

## The Lagom Question: Is Animation Appropriate?

**Dieter Rams:** Let's start with context. These images appear on the *institutional* homepage - for regulators, policymakers, AI safety researchers. Not consumers. Not children. Professional audiences.

**Institutional Design Reference says:**
- "Minimal animation (fade-ins only)"
- "No breathing/floating effects (not authoritative)"
- "High contrast benefits everyone, especially older policymakers"

**Brandon Sanderson:** So the institutional domain explicitly forbids breathing animations. But is a *hover* effect the same as a breathing effect? One is user-initiated (I move my cursor), the other is autonomous (the page breathes on its own).

**Susan Kare:** That's a crucial distinction! Autonomous animation can feel:
- Distracting (competes for attention)
- Playful (not serious enough)
- Anxiety-inducing (things moving without my control)

But *hover* effects are:
- User-initiated (I choose to interact)
- Feedback-oriented (confirms the element is interactive)
- Contextual (only when I'm focused on it)

**Dieter Rams:** *nods slowly* This is a functional argument. If the images are *clickable* (they link to family/medical/defense pages), then hover feedback is appropriate. It's not decoration - it's usability.

---

## Design Constraints for Institutional Hover Effects

**Bruno Mathsson:** So we agree hover effects *can* be appropriate. But what are the constraints?

### Constraint 1: Speed (Lagom Duration)

**Dieter Rams:** Fast enough to feel responsive, slow enough to avoid startling.

**Proposed:** `300ms` (already defined as `--lagom-duration` in foundation)

**Too fast:** 100ms feels jarring, aggressive
**Too slow:** 600ms+ feels sluggish, unresponsive
**Lagom:** 300ms - just right

---

### Constraint 2: Subtlety (Minimal Transform)

**Susan Kare:** The old Mac had subtle button press effects - 1-2px shift. Very small, very effective.

**Proposed Transform Options:**

**Option A: Slight lift**
```css
transform: translateY(-4px);
```
- **Pro:** Common pattern, clear feedback
- **Con:** Might feel too "playful" for institutional
- **Verdict:** Use, but keep it minimal (4px, not 8px)

**Option B: Slight scale**
```css
transform: scale(1.02);
```
- **Pro:** Very subtle, professional
- **Con:** Can feel "zoomy" if too aggressive
- **Verdict:** Too subtle at 1.02, too aggressive at 1.05

**Option C: Glow/shadow enhancement**
```css
box-shadow: 0 10px 25px rgba(44, 90, 160, 0.15);
```
- **Pro:** Professional depth, no movement
- **Con:** Can feel heavy-handed if too strong
- **Verdict:** Best option - enhances existing shadow

**Brandon Sanderson:** I vote for **combined subtle approach**: slight lift (4px) + enhanced shadow. The lift confirms interactivity, the shadow provides depth.

**Dieter Rams:** *reluctantly* Agreed. But keep the shadow subtle - 0.15 opacity maximum. And use Swedish Blue tint, not generic black.

---

### Constraint 3: Color Shifts (Archetypal Glow?)

**Susan Kare:** The images have warm birch white backgrounds. Could we add a subtle color shift on hover?

**Proposed Glow Effects:**

**Option A: Archetypal color glow**
- Family domain → Birch wood glow `#d4b896` (warmth)
- Medical domain → Sage green glow `#8faa8b` (healing)
- Defense domain → Swedish blue glow `#2c5aa0` (systematic)

**Bruno Mathsson:** *excited* This is like staining different woods! Same technique, different finish per domain.

**Brandon Sanderson:** And it ties to the archetypal system. Each domain's color "awakens" on hover - showing its true nature.

**Dieter Rams:** *skeptical* This risks being too "magical" for institutional. Regulators don't need archetypal awakening - they need functional clarity.

**Susan Kare:** What if we make it *extremely* subtle? Not a full color shift, just a 5% tint overlay?

```css
/* Hover state - very subtle archetypal glow */
.family-card:hover .image-container {
  background: linear-gradient(rgba(212, 184, 150, 0.05), #f8f6f0);
}
```

**Dieter Rams:** *considers* At 5% opacity, it's barely visible. That might be acceptable - more suggestion than statement.

---

### Constraint 4: Cursor Feedback

**Susan Kare:** The cursor should change to `pointer` on hover, confirming the image is clickable.

**Dieter Rams:** Obvious. Non-negotiable.

**Brandon Sanderson:** Agreed. This is standard web usability, not decoration.

---

## Proposed Implementation: Three Tiers

**Brandon Sanderson:** I propose three tiers of hover effects, from most restrained to most expressive:

### Tier 1: Minimal (Institutional Safe)
```css
.product-card:hover {
  cursor: pointer;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(44, 90, 160, 0.1);
  transition: all 300ms ease-in-out;
}
```

**What happens:**
- Tiny lift (2px)
- Subtle shadow enhancement (0.1 opacity)
- Smooth lagom timing (300ms)
- No color change

**Verdict:** Safe for institutional, provides feedback, respects constraints

---

### Tier 2: Moderate (Suggested for Homepage)
```css
.product-card {
  transition: all 300ms ease-in-out;
}

.product-card:hover {
  cursor: pointer;
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(44, 90, 160, 0.15);
}

.product-card:hover .image-container {
  /* Very subtle archetypal glow per domain */
  background: linear-gradient(rgba(var(--domain-color-rgb), 0.05), #f8f6f0);
}
```

**What happens:**
- Modest lift (4px)
- Enhanced shadow (0.15 opacity)
- Extremely subtle color glow (5% archetypal)
- Smooth lagom timing (300ms)

**Verdict:** Balanced - functional feedback + subtle personality without breaking professionalism

---

### Tier 3: Expressive (Family Domain Only)
```css
.family-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 32px rgba(212, 184, 150, 0.2);
}

.family-card:hover .image-container {
  background: linear-gradient(rgba(212, 184, 150, 0.1), #f8f6f0);
}
```

**What happens:**
- Noticeable lift + slight scale (6px + 2%)
- Stronger shadow (0.2 opacity, birch wood tint)
- Visible archetypal glow (10% birch warmth)

**Verdict:** Too expressive for institutional homepage - save for family-specific pages

---

## Decision: Apply Tier 2 to Homepage Product Cards

**Consensus:** Use Tier 2 (Moderate) for homepage product images.

**Rationale:**
1. **Functional:** Confirms images are clickable (usability)
2. **Restrained:** 4px lift + 15% shadow is subtle
3. **Archetypal:** 5% color glow ties to domain identity
4. **Lagom:** 300ms timing feels natural, not rushed
5. **Institutional-safe:** Won't undermine professional credibility

**Bruno Mathsson:** This is like a well-made chair - when you sit, it responds. Not flamboyant, but *alive*.

**Dieter Rams:** *grudgingly* Acceptable. The function (feedback) justifies the form (animation).

**Susan Kare:** And it's delightful without being playful. Professional joy.

---

## CSS Custom Properties for Domain-Specific Glows

**Brandon Sanderson:** Let's define CSS custom properties for each domain's hover glow:

```css
:root {
  /* Domain-specific hover glow colors (RGB for opacity control) */
  --family-glow-rgb: 212, 184, 150;     /* Birch wood warmth */
  --medical-glow-rgb: 143, 170, 139;    /* Sage green healing */
  --defense-glow-rgb: 44, 90, 160;      /* Swedish blue systematic */
}

/* Family product card */
.family-card:hover .image-container {
  background: linear-gradient(
    to bottom,
    rgba(var(--family-glow-rgb), 0.05) 0%,
    #f8f6f0 100%
  );
}

/* Medical product card */
.medical-card:hover .image-container {
  background: linear-gradient(
    to bottom,
    rgba(var(--medical-glow-rgb), 0.05) 0%,
    #f8f6f0 100%
  );
}

/* Defense product card */
.defense-card:hover .image-container {
  background: linear-gradient(
    to bottom,
    rgba(var(--defense-glow-rgb), 0.05) 0%,
    #f8f6f0 100%
  );
}
```

**Dieter Rams:** This is systematic. Each domain has its identity, but the *structure* is consistent.

---

## Accessibility Considerations

**Susan Kare:** We need to ensure hover effects don't break accessibility:

### 1. Respect `prefers-reduced-motion`
```css
@media (prefers-reduced-motion: reduce) {
  .product-card:hover {
    transform: none; /* No movement */
    box-shadow: 0 0 0 2px rgba(44, 90, 160, 0.5); /* Border instead */
    transition: box-shadow 100ms;
  }
}
```

**Rationale:** Some users (vestibular disorders, ADHD) are sensitive to motion. Provide alternative feedback.

---

### 2. Keyboard Focus States
```css
.product-card:focus-visible {
  outline: 3px solid #2c5aa0;
  outline-offset: 4px;
  /* Same hover effects for keyboard users */
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(44, 90, 160, 0.15);
}
```

**Rationale:** Keyboard users should get same feedback as mouse users.

---

### 3. Touch Devices
```css
@media (hover: none) {
  /* On touch devices, apply "hover" state immediately on tap */
  .product-card:active {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(44, 90, 160, 0.15);
  }
}
```

**Rationale:** Touch users don't have "hover" - use tap feedback instead.

---

## Testing Criteria

**Brandon Sanderson:** How do we validate this doesn't break institutional credibility?

### Test 1: Show to 3 Regulators
- Do they perceive it as "playful" or "professional"?
- Does it distract from content?
- Does it improve clickability perception?

### Test 2: A/B Test Engagement
- Version A: No hover effects
- Version B: Tier 2 hover effects
- Measure: Click-through rate to domain pages

**Expected result:** Tier 2 increases CTR without decreasing perceived professionalism.

### Test 3: Lagom Validation
- Does it feel "just right" or "too much"?
- Swedish user panel: 5 people rate on 1-10 scale
- Target: 7-8 (balanced, not excessive)

---

## Implementation Code

**Final CSS for Homepage Product Cards:**

```css
/* Base card state */
.product-card {
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1); /* Lagom timing */
  position: relative;
  overflow: hidden;
}

/* Hover state - all cards */
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(44, 90, 160, 0.15);
}

/* Domain-specific image glow on hover */
.family-card:hover .image-container {
  background: linear-gradient(to bottom, rgba(212, 184, 150, 0.05), #f8f6f0);
}

.medical-card:hover .image-container {
  background: linear-gradient(to bottom, rgba(143, 170, 139, 0.05), #f8f6f0);
}

.defense-card:hover .image-container {
  background: linear-gradient(to bottom, rgba(44, 90, 160, 0.05), #f8f6f0);
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .product-card {
    transition: box-shadow 100ms;
  }
  
  .product-card:hover {
    transform: none;
    box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.5);
  }
}

/* Keyboard focus */
.product-card:focus-visible {
  outline: 3px solid #2c5aa0;
  outline-offset: 4px;
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(44, 90, 160, 0.15);
}

/* Touch devices */
@media (hover: none) {
  .product-card:active {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(44, 90, 160, 0.15);
  }
}
```

---

## Key Insights & Guidelines

**Dieter Rams:**
> "Animation is acceptable when it serves function. Hover feedback confirms interactivity - this is function, not decoration."

**Bruno Mathsson:**
> "Like Swedish craft, the design should respond to touch. Not flamboyant, but alive."

**Susan Kare:**
> "Professional joy is possible. The Mac proved you can be serious and delightful simultaneously."

**Brandon Sanderson:**
> "Every interactive element should follow consistent rules. 300ms lagom timing, 4px lift, 15% shadow - this is the magic system for institutional hover effects."

---

## Action Items

1. **Implement Tier 2 hover effects** on homepage product cards (family, medical, defense)
2. **Test with Swedish users** for lagom validation (target: 7-8/10 rating)
3. **Measure CTR impact** (expect 5-15% increase if effective)
4. **Document hover patterns** in design system for consistency across pages
5. **Create hover effect library** with Tier 1/2/3 variants for different contexts

---

## Next Session Topics

1. **Navigation hover effects** - should nav links have similar treatment?
2. **Button hover states** - consistency with card hovers?
3. **Protocol card hovers** (Guardian/Forge) - same or different treatment?
4. **Hero image interactions** - static or subtle parallax on scroll?

---

**Session End: 2025-11-22**
**Duration: 1 hour 45 minutes**
**Decision: Implement Tier 2 (Moderate) hover effects on homepage product cards**

---

*End of transcript*

