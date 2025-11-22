---
session_id: "BALANS-DESIGN-SYSTEM-STRUCTURE"
session_type: "Design System Architecture Session"
date: "2025-11-22"
participants: ["Sam (Human - Product Owner)", "Brandon Sanderson", "Dieter Rams", "Massimo Vignelli", "Brad Frost (Design Systems)", "Jina Anne (Design Tokens)"]
focus: "Structuring Balans design system as foundation + domain extensions + project extensions"
context: "Defining systematic architecture for multi-domain design system with clear inheritance"
status: "COMPLETED"
---

# Balans Design System Structure: Foundation, Domains, and Projects

## Session Opening: The Architecture Question

**Sam:** We've been building color strategies for different domains - institutional, family, medical, defense. But I'm realizing we don't have a clear **structural model** for how these relate to each other. Are they siblings? Extensions? Variants?

**Brad Frost:** *pulls up atomic design diagrams* This is the fundamental question for any design system at scale. You need a clear hierarchy: what's global, what's contextual, what's project-specific?

**Jina Anne:** And more importantly, how do design tokens inherit and override? If medical extends family, and family extends the foundation, we need an explicit inheritance model.

**Brandon Sanderson:** *adjusts glasses* This is like worldbuilding. You have universal laws (like gravity), continental rules (like magic systems that work differently in different regions), and local customs (like how a specific city uses magic). We need the same hierarchy for design.

**Dieter Rams:** Less, but better. The structure itself must be minimal - only as many layers as necessary, no more.

**Massimo Vignelli:** The grid organizes everything. We need a semantic grid for our design system's architecture.

---

## Current State: Implicit Structure

**Sam:** Let me show you what we have implicitly:

**Existing Design Sessions:**
1. **Balans Design System + Weaver Integration** (2025-07-06)
   - Sacred Alliance color palette
   - Archetypal symbols (Spiral, Bridge, Shield)
   - Swedish lagom principles
   
2. **Balans Tailwind Magic System** (2025-07-06)
   - Design tokens
   - Component library
   - Lagom constraints

3. **Color System Magic Rules** (2025-11-22)
   - Three Laws (Hue, Saturation, Lightness)
   - Institutional, Family, Defense domains
   
4. **Medical Color Strategy** (2025-11-22)
   - Medical extends Family
   - Context-dependent colors (tracking, guardian, partnership)

**Brad Frost:** So you have foundation work (Sacred Alliance, Tailwind), domain work (institutional, family, defense), and extension work (medical). But the relationships aren't explicit.

**Jina Anne:** And that's dangerous. When a developer asks "What color should I use for medical tracking?" they need to trace:
- Medical domain tokens
- Family domain tokens (parent)
- Foundation tokens (grandparent)

Without explicit structure, they'll just hardcode values.

---

## Proposed Structure: Three Layers

**Brandon Sanderson:** I propose three layers with clear inheritance:

### Layer 1: Foundation (Universal Laws)

**What lives here:**
- Archetypal hues (immutable)
- Three Laws of Color
- Sacred Alliance principles
- Swedish lagom constraints
- Base typography scale
- Spacing system (8px grid)
- Archetypal symbols
- Accessibility standards (WCAG)

**Who uses it:**
- Everyone. No exceptions.

**Can it be overridden?**
- No. These are physical laws of the Balans universe.

**Example:**
```css
/* Foundation: Archetypal Hues */
:root {
  --hue-cosmic-weave: 215;      /* Blue = AI/systematic (immutable) */
  --hue-collaborative-growth: 140; /* Green = healing (immutable) */
}
```

**Massimo Vignelli:** This is the semantic foundation. Like a typographic grid - you don't change it per project.

**Dieter Rams:** Good design is as little design as possible. The foundation must be minimal but complete.

---

### Layer 2: Domain Extensions (Continental Rules)

**What lives here:**
- Domain-specific saturation/lightness
- Archetypal priority (which color is primary)
- Emotional tone (warm vs cold)
- Animation style (breathing vs stark)
- Domain-specific semantic tokens

**Domains:**
1. **Institutional** (AI safety, regulators, policymakers)
2. **Family** (consumer product, warm, approachable)
3. **Defense** (classified systems, dark theme, authoritative)

**Who uses it:**
- All projects within that domain

**Can it be overridden?**
- Only by project extensions (Layer 3)
- Foundation (Layer 1) cannot be overridden

**Example:**
```css
/* Domain: Family */
.domain-family {
  /* Applies Three Laws from Foundation */
  --sat-primary: 60%;           /* Moderate saturation (Law 2) */
  --light-bg: 96%;              /* Light background (Law 3) */
  --color-bg: hsl(40, 50%, var(--light-bg)); /* Warm birch white */
  
  /* Domain-specific priorities */
  --color-primary: hsl(var(--hue-cosmic-weave), var(--sat-primary), 40%);
  --color-secondary: hsl(35, 45%, 65%); /* Birch wood */
  
  /* Domain emotional tone */
  --animation-style: breathing;
  --border-radius: 8px; /* Lagom softness */
}
```

**Brad Frost:** This is like design system themes, but semantic. Each domain is a cohesive variation of the foundation.

---

### Layer 3: Project Extensions (Local Customs)

**What lives here:**
- Project-specific overrides
- Feature-specific colors
- Context-dependent tokens
- Specialized components

**Projects (within domains):**
- **Family domain:**
  - `family-base` (core product)
  - `family-medical` (health extension)
  - `family-education` (future: homework helper)
  
- **Defense domain:**
  - `defense-guardian` (Guardian Protocol)
  - `defense-forge` (Red Forge IDE)
  - `defense-birdturret` (anti-drone system)

- **Institutional domain:**
  - `institutional-main` (AI safety website)
  - `institutional-research` (academic papers)
  - `institutional-policy` (policy briefs)

**Who uses it:**
- Only that specific project

**Can it be overridden?**
- Yes, by inline styles (but discouraged)

**Example:**
```css
/* Project: Family Medical */
.project-family-medical {
  /* Inherits from Family domain */
  @extends .domain-family;
  
  /* Project-specific overrides */
  --color-primary: hsl(var(--hue-collaborative-growth), 40%, 45%); /* Green, not blue */
  
  /* Context-dependent tokens */
  --color-tracking: hsl(var(--hue-cosmic-weave), 60%, 40%); /* Blue for tracking */
  --color-guardian: hsl(var(--hue-collaborative-growth), 40%, 45%); /* Green for guardian */
  --color-partnership: hsl(265, 35%, 50%); /* Purple for insights */
}
```

**Jina Anne:** Perfect! This is design token inheritance. Medical *extends* family, inheriting all its tokens but overriding primary color to green.

---

## Visual Hierarchy Diagram

**Massimo Vignelli:** Let me draw the inheritance tree:

```
┌─────────────────────────────────────────────────────┐
│          Layer 1: Foundation (Universal)            │
│  • Archetypal hues (12 colors)                      │
│  • Three Laws of Color                              │
│  • Sacred Alliance principles                       │
│  • Swedish lagom constraints                        │
│  • Typography, spacing, symbols                     │
│  • WCAG accessibility standards                     │
└─────────────────────────────────────────────────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │ Layer 2:   │  │ Layer 2:   │  │ Layer 2:   │
  │ Family     │  │ Institu-   │  │ Defense    │
  │ Domain     │  │ tional     │  │ Domain     │
  │            │  │ Domain     │  │            │
  │ • Warm bg  │  │ • Clean bg │  │ • Dark bg  │
  │ • Blue 1°  │  │ • Blue 1°  │  │ • Red 1°   │
  │ • Breathing│  │ • Minimal  │  │ • Stark    │
  └────────────┘  └────────────┘  └────────────┘
        │               │               │
    ┌───┼───┐          │           ┌───┼───┐
    ▼   ▼   ▼          ▼           ▼   ▼   ▼
  ┌───┐┌───┐┌───┐   ┌───┐      ┌────┐┌────┐┌────┐
  │Med││Edu││...│   │Res│      │Guar││Forg││Bird│
  │   ││   ││   │   │   │      │    ││    ││    │
  │Grn││...││   │   │Blu│      │RP ││IDE ││Tur │
  └───┘└───┘└───┘   └───┘      └────┘└────┘└────┘
  Layer 3:          Layer 3:    Layer 3:
  Projects          Projects    Projects
```

**Brandon Sanderson:** Beautiful! Like a magic system's power hierarchy. Foundation = universal laws, Domains = regional magic types, Projects = specific spells.

**Dieter Rams:** And minimal. Three layers is the minimum needed for clarity. Four would be excessive.

---

## Inheritance Rules

**Jina Anne:** Now let's define the inheritance behavior systematically:

### Rule 1: Foundation is Immutable

**Foundation tokens cannot be overridden at any layer.**

```css
/* ❌ FORBIDDEN: Changing archetypal hue */
.domain-family {
  --hue-cosmic-weave: 220; /* NO! This breaks semantic meaning */
}

/* ✅ ALLOWED: Using foundation hue with domain saturation */
.domain-family {
  --color-primary: hsl(var(--hue-cosmic-weave), 60%, 40%);
}
```

**Why:** Archetypal meanings must be consistent across all domains. Blue = AI/systematic everywhere.

---

### Rule 2: Domains Extend Foundation

**Domains inherit all foundation tokens and add domain-specific tokens.**

```css
/* Foundation provides */
:root {
  --hue-cosmic-weave: 215;
  --wcag-min-contrast: 4.5;
}

/* Family domain extends */
.domain-family {
  /* Inherits foundation */
  
  /* Adds domain-specific */
  --sat-primary: 60%;
  --light-bg: 96%;
  --color-bg: hsl(40, 50%, var(--light-bg));
  --color-primary: hsl(var(--hue-cosmic-weave), var(--sat-primary), 40%);
}
```

**Inheritance chain:**
```
Foundation --hue-cosmic-weave--> Family --color-primary--> Medical
```

---

### Rule 3: Projects Extend Domains (Can Override)

**Projects inherit domain tokens but can override non-foundation tokens.**

```css
/* Family domain says */
.domain-family {
  --color-primary: hsl(215, 60%, 40%); /* Blue */
}

/* Medical project overrides */
.project-family-medical {
  @extends .domain-family; /* Inherit everything */
  
  --color-primary: hsl(140, 40%, 45%); /* Green (allowed) */
  /* Still uses family's --sat-primary, --light-bg, etc. */
}
```

**What can be overridden:**
- ✅ `--color-primary` (domain-level)
- ✅ `--sat-primary` (domain-level)
- ✅ `--animation-style` (domain-level)
- ❌ `--hue-cosmic-weave` (foundation-level)
- ❌ `--wcag-min-contrast` (foundation-level)

---

### Rule 4: Cascade is Explicit

**Token resolution follows explicit cascade, not CSS cascade.**

```css
/* Developer uses */
.medical-tracking-card {
  background: var(--color-tracking);
}

/* Token resolution (explicit) */
--color-tracking 
  → defined in Project (family-medical)?
    YES: Use project value
    NO: Check Domain (family)
      YES: Use domain value
      NO: Check Foundation
        YES: Use foundation value
        NO: ERROR (token not defined)
```

**Jina Anne:** This is critical. We're not relying on CSS cascade - we're building an explicit token resolution system.

---

## Naming Convention

**Brad Frost:** We need a naming convention that makes the hierarchy visible:

### Foundation Tokens (Prefix: `--balans-`)

```css
:root {
  /* Archetypal hues */
  --balans-hue-cosmic-weave: 215;
  --balans-hue-collaborative-growth: 140;
  
  /* Spacing scale */
  --balans-space-xs: 4px;
  --balans-space-sm: 8px;
  
  /* Typography */
  --balans-font-body: 'Inter', sans-serif;
  
  /* Accessibility */
  --balans-wcag-aa: 4.5;
}
```

---

### Domain Tokens (Prefix: `--domain-{name}-`)

```css
/* Family domain */
:root {
  --domain-family-bg: hsl(40, 50%, 96%);
  --domain-family-primary: hsl(215, 60%, 40%);
  --domain-family-secondary: hsl(35, 45%, 65%);
  --domain-family-animation: breathing;
}

/* Institutional domain */
:root {
  --domain-institutional-bg: hsl(210, 10%, 98%);
  --domain-institutional-primary: hsl(215, 60%, 40%);
  --domain-institutional-animation: minimal;
}

/* Defense domain */
:root {
  --domain-defense-bg: hsl(210, 25%, 8%);
  --domain-defense-primary: hsl(0, 70%, 55%);
  --domain-defense-animation: stark;
}
```

---

### Project Tokens (Prefix: `--project-{domain}-{name}-`)

```css
/* Family Medical project */
:root {
  --project-family-medical-primary: hsl(140, 40%, 45%); /* Green override */
  --project-family-medical-tracking: hsl(215, 60%, 40%); /* Blue for tracking */
  --project-family-medical-guardian: hsl(140, 40%, 45%); /* Green for guardian */
  --project-family-medical-partnership: hsl(265, 35%, 50%); /* Purple for insights */
}

/* Defense Guardian Protocol project */
:root {
  --project-defense-guardian-shield: hsl(215, 50%, 60%); /* Blue shield */
  --project-defense-guardian-critical: hsl(0, 70%, 55%); /* Red critical */
}
```

**Massimo Vignelli:** The naming convention makes the hierarchy self-documenting. You see `--project-family-medical-primary` and immediately know: project-level token, family domain, medical project.

---

## Component Token Aliases

**Brad Frost:** For developers, we create semantic aliases that hide the complexity:

```css
/* Medical tracking card uses semantic tokens */
.medical-tracking-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
}

/* Semantic tokens resolve to project tokens */
.project-family-medical {
  --card-bg: var(--domain-family-bg);
  --card-border: var(--project-family-medical-tracking);
  --text-primary: hsl(215, 60%, 30%);
}
```

**This creates four levels:**
1. Foundation tokens (`--balans-*`)
2. Domain tokens (`--domain-*`)
3. Project tokens (`--project-*`)
4. Component tokens (`--card-*`, `--btn-*`) ← Semantic aliases

**Dieter Rams:** The fourth layer is for human readability. Developers think in components, not tokens.

---

## Documentation Structure

**Jina Anne:** We need to document this in a way that's discoverable:

### Documentation Hierarchy

```
balans-design-system/
├── 1-foundation/
│   ├── archetypal-hues.md
│   ├── three-laws-of-color.md
│   ├── sacred-alliance-principles.md
│   ├── typography-scale.md
│   ├── spacing-system.md
│   ├── archetypal-symbols.md
│   └── accessibility-standards.md
│
├── 2-domains/
│   ├── family/
│   │   ├── domain-overview.md
│   │   ├── color-palette.md
│   │   ├── animation-style.md
│   │   └── component-library.md
│   │
│   ├── institutional/
│   │   ├── domain-overview.md
│   │   ├── color-palette.md
│   │   └── component-library.md
│   │
│   └── defense/
│       ├── domain-overview.md
│       ├── color-palette.md
│       └── component-library.md
│
├── 3-projects/
│   ├── family-medical/
│   │   ├── project-overview.md
│   │   ├── color-overrides.md
│   │   ├── tracking-mode.md
│   │   ├── guardian-mode.md
│   │   └── partnership-mode.md
│   │
│   ├── defense-guardian/
│   │   └── project-overview.md
│   │
│   └── defense-forge/
│       └── project-overview.md
│
└── 4-tools/
    ├── token-browser.md
    ├── contrast-checker.md
    └── theme-preview.md
```

**Brad Frost:** And each level documents what it inherits:

**Example: `2-domains/family/domain-overview.md`**

```markdown
# Family Domain

**Extends:** Foundation
**Inherited tokens:** All foundation tokens
**Overrides:** None (only adds domain-specific)

## Domain-Specific Tokens

- `--domain-family-bg: hsl(40, 50%, 96%)` - Warm birch white
- `--domain-family-primary: hsl(215, 60%, 40%)` - Deep Swedish Blue
- ...

## Projects in this Domain

- [Family Medical](../3-projects/family-medical/) - Health tracking extension
- Family Education (planned) - Homework helper
```

---

## Example: Complete Token Resolution

**Brandon Sanderson:** Let me walk through a complete example:

### Scenario: Medical Tracking Card

**Developer writes:**
```jsx
<Card variant="medical-tracking">
  <Icon name="medication" />
  <Text>Lithium Schedule</Text>
  <Button variant="primary">Log dose</Button>
</Card>
```

### Token Resolution Chain

**1. Component tokens (developer-facing):**
```css
.card-medical-tracking {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
}

.button-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}
```

**2. Project tokens (medical-specific):**
```css
.project-family-medical {
  --card-bg: var(--domain-family-bg); /* Inherit from domain */
  --card-border: var(--project-family-medical-tracking); /* Blue for tracking */
  --text-primary: hsl(215, 60%, 30%); /* Dark blue text */
  
  --btn-primary-bg: var(--project-family-medical-tracking); /* Blue button */
  --btn-primary-text: white;
}

:root {
  --project-family-medical-tracking: hsl(var(--balans-hue-cosmic-weave), 60%, 40%);
}
```

**3. Domain tokens (family):**
```css
.domain-family {
  --domain-family-bg: hsl(40, 50%, 96%); /* Warm birch white */
}
```

**4. Foundation tokens (archetypal hues):**
```css
:root {
  --balans-hue-cosmic-weave: 215; /* Blue = AI/systematic */
}
```

### Final Computed Values

```css
.card-medical-tracking {
  background: hsl(40, 50%, 96%); /* From domain-family */
  border: 1px solid hsl(215, 60%, 40%); /* From project (tracking blue) */
  color: hsl(215, 60%, 30%); /* From project */
}

.button-primary {
  background: hsl(215, 60%, 40%); /* From project (tracking blue) */
  color: white;
}
```

**Resolution trace:**
```
--card-bg
  → --domain-family-bg
    → hsl(40, 50%, 96%)

--card-border
  → --project-family-medical-tracking
    → hsl(--balans-hue-cosmic-weave, 60%, 40%)
      → hsl(215, 60%, 40%)
```

**Jina Anne:** Perfect! Four layers collapsed into semantic aliases. Developer writes `--card-bg`, system resolves through the hierarchy.

---

## Tools: Token Browser

**Brad Frost:** We need a tool to visualize this hierarchy:

### Token Browser UI (Concept)

```
┌─────────────────────────────────────────────────────┐
│ Balans Token Browser                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Search: [card-bg                              ] 🔍 │
│                                                     │
│ Results:                                           │
│ ┌─────────────────────────────────────────────────┐│
│ │ --card-bg                                       ││
│ │ Layer: Component (semantic alias)              ││
│ │ Resolves to: --domain-family-bg                ││
│ │                                                 ││
│ │ Resolution chain:                               ││
│ │ --card-bg                                       ││
│ │   → --domain-family-bg                          ││
│ │     → hsl(40, 50%, 96%)                         ││
│ │                                                 ││
│ │ Used in projects:                               ││
│ │ • Family Medical (tracking cards)              ││
│ │ • Family Education (homework cards)            ││
│ │                                                 ││
│ │ Preview: [████████████████] Warm birch white   ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Features:**
- Search any token name
- See full resolution chain
- Preview computed value
- See where token is used
- Edit token (with cascade preview)

---

## Migration Strategy

**Sam:** How do we migrate existing code to this structure?

**Brad Frost:** Incrementally, with a compatibility layer:

### Phase 1: Foundation Layer (Week 1)
- Extract archetypal hues
- Define Three Laws
- Create foundation CSS file
- No breaking changes (old code still works)

### Phase 2: Domain Layer (Week 2-3)
- Create domain token files
- Map existing colors to domains
- Add domain classes
- Provide migration guide

### Phase 3: Project Layer (Week 4-5)
- Extract project-specific tokens
- Create project overrides
- Test all combinations
- Document edge cases

### Phase 4: Component Aliases (Week 6)
- Create semantic component tokens
- Provide developer-friendly names
- Update component library
- Deprecate direct token usage

**Dieter Rams:** Gradual, systematic, non-breaking. This is good migration.

---

## Open Questions & Deferred Decisions

**Brandon Sanderson:** What we're deferring:

### 1. Cross-Domain Components?

**Question:** If a component is used in both Family and Defense, how do we handle the different domains?

**Example:** Guardian Protocol shield appears in:
- Family Medical (green + copper)
- Defense Guardian (blue + red)

**Options:**
- A) Duplicate component per domain
- B) Pass domain as prop
- C) Context-aware styling

**Decision:** **Deferred to component architecture session**

---

### 2. Third-Party Integrations?

**Question:** If we integrate with external systems (e.g., 1177 healthcare), do they get their own domain or project?

**Decision:** **Deferred until first integration**

---

### 3. White-Label Projects?

**Question:** If a defense contractor wants to white-label Guardian Protocol, how do they override brand colors while preserving archetypal meanings?

**Decision:** **Deferred to white-label strategy session**

---

## Key Decisions Made

**✅ Confirmed:**

1. **Three-layer structure:**
   - Layer 1: Foundation (immutable)
   - Layer 2: Domains (extend foundation)
   - Layer 3: Projects (extend domains, can override)

2. **Naming convention:**
   - Foundation: `--balans-*`
   - Domain: `--domain-{name}-*`
   - Project: `--project-{domain}-{name}-*`
   - Component: `--card-*`, `--btn-*` (semantic aliases)

3. **Inheritance rules:**
   - Foundation cannot be overridden
   - Domains extend foundation, add domain tokens
   - Projects extend domains, can override non-foundation tokens
   - Explicit cascade, not CSS cascade

4. **Documentation structure:**
   - `1-foundation/`, `2-domains/`, `3-projects/`, `4-tools/`

**🤔 Deferred:**

1. Cross-domain component strategy
2. Third-party integration approach
3. White-label override strategy

---

## Action Items

1. **Jina Anne:** Create foundation token file
   - Deliverable: `balans-foundation.css` with archetypal hues, Three Laws
   - Timeline: 3 days

2. **Brad Frost:** Build token browser prototype
   - Deliverable: Web tool showing token resolution
   - Timeline: 1 week

3. **Massimo Vignelli:** Document domain token structure
   - Deliverable: `2-domains/*/domain-overview.md` for all 3 domains
   - Timeline: 1 week

4. **Brandon Sanderson:** Write inheritance guide
   - Deliverable: "How token inheritance works" tutorial
   - Audience: Developers new to system
   - Timeline: 3 days

5. **Dieter Rams:** Create migration checklist
   - Deliverable: Phase-by-phase migration plan
   - Include breaking change analysis
   - Timeline: 2 days

---

## Quotable Moments

**Brandon Sanderson:**
> "This is like worldbuilding. You have universal laws (like gravity), continental rules (like magic systems that work differently in different regions), and local customs (like how a specific city uses magic)."

**Dieter Rams:**
> "Three layers is the minimum needed for clarity. Four would be excessive."

**Jina Anne:**
> "We're not relying on CSS cascade - we're building an explicit token resolution system."

**Brad Frost:**
> "The fourth layer is for human readability. Developers think in components, not tokens."

**Massimo Vignelli:**
> "The naming convention makes the hierarchy self-documenting."

---

**Session End: 2025-11-22 22:45**  
**Duration: 2 hours 15 minutes**  
**Next Session: Universal Semantic Classification System**

---

*End of transcript*

