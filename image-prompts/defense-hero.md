# Defense Page Hero Image - DALL-E Prompt

## Context
Hero image for the Defense page (`/defense`) featuring dual classification system and Red Forge environment. Dark theme with red accents, Anduril-style tech aesthetic.

---

## Primary Prompt (Recommended)

```
Professional photograph of a high-tech defense AI development environment. Anduril/Palantir aesthetic: sleek, modern, serious but not boring.

SCENE COMPOSITION:
- Main focus: Dual monitors side-by-side showing classified content separation
- LEFT monitor: Glowing blue interface (Guardian Protocol - verifiable data)
- RIGHT monitor: Glowing red/orange interface (classified content with redacted sections)
- Monitors sit on a premium matte black desk in a darkened secure room
- Subtle red LED accent lighting along edges (ambient, not harsh)
- Background: Blurred server racks with small glowing status indicators
- Professional Herman Miller chair partially visible (graphite color)

TECHNICAL DETAILS:
- Monitors: Modern 4K displays with thin bezels
- LEFT screen showing: Clean data visualization (graphs, network diagrams in blue)
- RIGHT screen showing: Document with [REDACTED] blocks visible, classification banner at top
- Keyboard: Minimal mechanical keyboard with subtle backlighting
- Mouse: Premium design mouse (Logitech MX Master style)
- Small details: Coffee mug, notebook, security badge on lanyard

LIGHTING:
- Primary: Cool monitor glow (blue from left, red/orange from right)
- Ambient: Subtle red LED strip along ceiling edge
- Accent: Small desk lamp with warm light (off to side)
- Overall mood: Dramatic, high-contrast, focused work environment

COLOR PALETTE:
- Base: Matte black desk, charcoal gray walls
- Accent: Red/crimson LED glow (#dc143c)
- Monitor glows: Blue (#3498db) and red/orange (#ff4500)
- Highlights: Brushed metal accents on hardware

MOOD: "Serious classified work happening here - secure, focused, cutting-edge"
STYLE: Professional tech photography, dramatic lighting, Anduril office aesthetic
CAMERA: Slight over-the-shoulder angle, showing both monitors clearly
REFERENCE: Palantir workstations, Anduril engineering spaces, defense tech marketing

AVOID:
- Military camouflage or weapons
- Government bureaucracy aesthetic (no gray cubicles)
- Overly aggressive red (keep it sophisticated)
- Cartoon or illustration style (photorealistic only)
```

---

## Alternative: Red Door Focus

```
Close-up photograph of a secure workspace entrance. Anduril-style defense tech aesthetic.

MAIN SUBJECT:
- Premium secure door with electronic access control
- Matte black steel door with deep red accent strip (5cm vertical stripe along edge)
- Modern capacitive touch keypad (brushed aluminum, glowing white buttons)
- RFID badge reader below (small red LED indicator showing "locked")
- Small modern sign: "RED FORGE - AUTHORIZED PERSONNEL ONLY" (Swedish/English)

CONTEXT (visible in background, slightly out of focus):
- Through glass partition: Glimpse of workstations with glowing monitors
- Hint of red LED ambient lighting from secure room
- Professional hallway with industrial-modern design
- Exposed concrete ceiling with black painted pipes

LIGHTING:
- Dramatic spotlight on keypad (focused, creating shadows)
- Red glow from LED indicator
- Subtle red light leaking from under/around door frame
- Background: Moody, darker hallway with pendant lights

DETAILS:
- Door handle: Premium matte black lever (industrial design)
- Floor: Polished concrete with subtle yellow warning stripe before door
- Wall beside door: Badge reader with small LCD display
- Everything looks expensive, intentional, cool

MOOD: "This is the gateway to serious classified work"
STYLE: Architectural/product photography, dramatic lighting, cyberpunk-adjacent but real
REFERENCE: Apple Park security, Tesla Gigafactory design, Anduril branding
```

---

## Alternative: Guardian Protocol Visualization

```
Digital interface photograph showing AI safety protocol in action. Clean, modern, professional.

SCENE:
- Large ultrawide curved monitor (49") dominating the frame
- Interface showing "Guardian Protocol" dashboard
- Split screen: LEFT = verifiable data (blue theme), RIGHT = AI-generated content (red/orange theme)
- Center: Clear separation line with lock icon and "VERIFICATION BOUNDARY" label

INTERFACE ELEMENTS (visible on screen):
- TOP: Classification banner "UNCLASSIFIED // FOR OFFICIAL USE ONLY"
- LEFT panel: Network graph showing data provenance (blue nodes, connections)
- RIGHT panel: AI chat interface with confidence scores and source citations
- BOTTOM: Timeline showing verification history
- Small indicators: "Data Diode Active" with green checkmark

PHYSICAL SETUP:
- Premium desk setup: Matte black surface, clean cable management
- Mechanical keyboard with subtle RGB (mostly white/blue)
- High-end mouse with ergonomic design
- Coffee mug with tech startup logo (subtle, not distracting)
- Second smaller monitor visible to side (showing code/terminal)

ENVIRONMENT:
- Modern office/lab setting
- Dark walls with subtle texture
- Red LED accent strip along ceiling (ambient glow)
- Professional task lighting (desk lamp)
- Background: Blurred server rack with status LEDs

MOOD: "This is how we build AI systems with verifiable trust"
STYLE: Tech product photography, clean interface design, professional
REFERENCE: Palantir Foundry screenshots, modern SaaS dashboards, defense tech UI
```

---

## Recommended Choice: **Primary Prompt**

**Why:** 
- Clearly shows dual classification concept
- Anduril aesthetic nailed (premium, serious, cool)
- Red accent lighting matches page theme
- Photorealistic and professional
- Not too technical (accessible to non-engineers)

---

## Image Specifications

**Filename:** `defense-hero.png`
**Aspect Ratio:** 16:9 or 3:2 (landscape for hero section)
**Resolution:** At least 1920x1080 (2560x1440 preferred)
**Format:** PNG or high-quality JPG
**Location:** `balans-website/public/images/`

---

## Usage on Page

Replace current hero image in `DefensePage.tsx`:

```tsx
<img 
  src="/images/defense-hero.png" 
  alt="Dual classification AI development workspace"
  className="rounded-2xl shadow-2xl"
  style={{boxShadow: '0 0 40px rgba(220, 38, 38, 0.3)'}}
/>
```

---

## Color Consistency

Match these exact colors from defense page:
- Background: `#0a0e14` (dark blue-gray)
- Red accent: `#dc143c` (crimson)
- Blue (Guardian): `#3498db`
- Orange (Forge): `#ff4500`
- Monitor glow: Cool white with color tint

---

**READY TO GENERATE!** 🔒🎨

Use **Primary Prompt** for best results - clearly shows the dual classification concept while maintaining Anduril-style premium aesthetic.



