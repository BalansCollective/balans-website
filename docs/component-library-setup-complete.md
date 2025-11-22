# Balans Component Library - Setup Complete

**Date:** 2025-11-22  
**Status:** ✅ READY FOR USE

---

## What's Been Set Up

### 1. Dependencies Installed ✅
- `@headlessui/react` - Accessible primitives (Dialog, Popover, Menu, Transition, Tab)
- `@heroicons/react` - Consistent icon system
- `class-variance-authority` - Type-safe variant management
- `clsx` - Conditional className utility
- `tailwind-merge` - Deduplicates Tailwind classes

### 2. Foundation Components Built ✅

#### `src/components/ui/Button.tsx`
**Variants:**
- `primary` - Swedish Blue (systematic action)
- `secondary` - Transparent with border
- `success` - Sage Green (growth)
- `warning` - Thread Gold (caution)
- `danger` - Truth Copper (critical)
- `alliance` - Sacred Alliance Purple (collaborative)
- `ghost` - Minimal styling

**Sizes:** `sm`, `md`, `lg`, `xl`  
**Full width support:** `fullWidth={true}`

**Example:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg">
  Explore Solutions
</Button>

<Button variant="alliance" fullWidth>
  Join Collaboration
</Button>
```

#### `src/components/ui/Card.tsx`
**Variants:**
- `default` - Clean white card with border
- `elevated` - More prominent, Swedish Blue border
- `archetypal` - Sacred Alliance Purple border
- `flat` - Minimal styling
- `outlined` - Border only, transparent background

**Subcomponents:**
- `CardHeader` - Header section
- `CardTitle` - Styled heading (h3)
- `CardDescription` - Secondary text
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Example:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Balans Family</CardTitle>
    <CardDescription>Support for the whole family</CardDescription>
  </CardHeader>
  <CardContent>
    <p>AI-assisted medical tracking...</p>
  </CardContent>
</Card>
```

### 3. Balans Domain Components Built ✅

#### `src/components/balans/ClassificationBadge.tsx`
**Universal semantic classification system integrated!**

**Classification Levels:**
- `public` - Blue (open, transparent)
- `internal` - Teal (organization-internal)
- `private` - Gold (personal, sensitive)
- `protected` - Orange (guardian-locked, immutable)
- `critical` - Red (urgent, highest security)

**Sensitivity Types:**
- `what` - Capability information (eye icon)
- `how` - Implementation details (code icon)

**Features:**
- Automatic color coding (border stripe, background, text)
- Hover tooltip with classification explanation
- Dark mode support
- Accessible (Headless UI Popover)

**Example:**
```tsx
import { ClassificationBadge } from '@/components/balans';

<ClassificationBadge 
  level="protected" 
  sensitivity="how"
  explanation="Implementation details for guardian protocol"
>
  Guardian Protocol
</ClassificationBadge>
```

### 4. Utilities Created ✅

#### `src/lib/utils.ts`
**`cn()` function** - Merges Tailwind classes safely
```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-class', isActive && 'active-class', customClass)} />
```

### 5. Configuration Updated ✅

#### Path Alias Support
- **tsconfig.json** - `@/*` maps to `./src/*`
- **vite.config.ts** - Vite resolver configured

**Now you can import:**
```tsx
import { Button, Card } from '@/components/ui';
import { ClassificationBadge } from '@/components/balans';
import { cn } from '@/lib/utils';
```

---

## Design System Integration

### Color Inheritance Working ✅
All components inherit from Foundation → Domain → Component:

```
Foundation (Tailwind config)
├── swedish-blue (systematic action)
├── birch-wood (human warmth)
├── alliance-purple (collaboration)
├── sage-green (growth)
├── thread-gold (creativity)
├── truth-copper (protection)
└── gentle-silver (precision)
    ↓
Domain Adaptations
├── Family: Warmer variants
├── Defense: High-contrast tactical
├── Medical: Clinical precision + warmth
└── Institutional: Professional trust
    ↓
Component Variants
├── Button variants map to archetypal meanings
├── Card variants adapt to context
└── Classification badges encode semantics
```

### Universal Classification System ✅
**Semantic color coding works across ALL domains:**

| Level | Color | Defense Usage | Medical Usage | Family Usage |
|-------|-------|---------------|---------------|--------------|
| Public (Blue) | `#2c5aa0` | Unclassified | Public trends | Family calendar |
| Internal (Teal) | `#2c7d6e` | Internal comms | Family-shared | Household rules |
| Private (Gold) | `#c9a96e` | Confidential | Personal notes | Personal journals |
| Protected (Orange) | `#d2691e` | Secret | Guardian plans | Child protection |
| Critical (Red) | `#b87333` | Top Secret | Active crisis | Emergency |

---

## What's Next

### Immediate: Port Homepage
1. Read `balans-website-old/index.html`
2. Create `src/pages/website/HomePage.tsx`
3. Use Foundation components (Button, Card)
4. Apply i18n with `useTranslation('homepage')`
5. Test light/dark themes

### Phase 2: Build More Components
**Still need:**
- Input components (text, select, checkbox)
- Modal/Dialog wrapper (using Headless UI Dialog)
- Navigation components
- Archetypal symbol components (Spiral, Loom, Bridge, Anchor)

### Phase 3: Domain-Specific Components
**Medical domain:**
- GrowthIndicator (with spiral animation)
- MedicationCard (with guardian lock)
- TimelineCard (with progress tracking)

**Defense domain:**
- ThreatCard (with threat level colors)
- MissionStatus (with phase indicators)
- ClassifiedDocument (with security markings)

---

## Testing Components

**Quick test in App.tsx:**
```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ClassificationBadge } from '@/components/balans';

function TestComponents() {
  return (
    <div className="p-8 space-y-4 bg-birch-white dark:bg-bg-main min-h-screen">
      <h1 className="text-3xl font-bold text-swedish-blue dark:text-swedish-blue-dark">
        Component Test
      </h1>

      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="alliance">Alliance</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassificationBadge level="protected" sensitivity="what">
            Protected Content
          </ClassificationBadge>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Key Decisions from Design Session

1. **Headless UI over shadcn/ui** - Single design system (Balans only)
2. **Build on primitives** - Full control over styling
3. **Archetypal symbols as first-class** - Not hacked into existing structure
4. **Classification system universal** - Works across all domains

---

**Status:** ✅ Foundation complete, ready to port pages  
**Next:** Port homepage from `balans-website-old/index.html`

