# Balans Website

Modern website for Balans Collective showcasing AI safety systems for healthcare, families, and defense sectors.

## 🌐 Live Site

**GitHub Pages:** `https://[username].github.io/weavermesh/`

## 🎯 Key Pages

- **Homepage** (`/`): Institutional overview, three domains (Family, Medical, Defense)
- **Defense** (`/defense`): Red Forge classification-aware AI development
- **Red Forge Facility** (`/red-forge`): Physical space in Linköping (Ebbe Park), Phase 2 (2026)

## 🚀 Quick Start

```bash
cd balans-website
npm install
npm run dev
# Visit http://localhost:1420
```

## 📦 Deployment

Automatic deployment to GitHub Pages on push to `main`:

```bash
git add .
git commit -m "feat: update website"
git push origin main
```

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for full guide.

## 🎨 Design System

- **Foundation:** Sacred Alliance Design (Guardian/Magician archetypes)
- **Colors:** Swedish blue, sage green, copper/brass accents
- **Tone:** "Lagom ironic" - self-aware ambition + Swedish humility
- **Languages:** Swedish (primary), English
- **Themes:** Light (homepage), Dark (defense pages)

## 🏗️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS 4
- **i18n:** react-i18next
- **Routing:** React Router 7

## 📁 Structure

```
balans-website/
├── public/
│   ├── images/          # All website images
│   └── locales/         # Translations (sv/en)
├── src/
│   ├── pages/website/   # Main pages
│   ├── components/      # UI components
│   └── i18n/            # i18n configuration
└── transcripts/         # Design session transcripts
```

## 🎭 The Narrative

After 6 years of robotics consulting (Dyno Robotics), pivoting to defense tech with classification-aware AI systems. The "Anduril aesthetic" positioning is intentionally ironic - acknowledging the aspiration while being honest about Phase 1 (remote work) → Phase 2 (physical facility in 2026).

See `transcripts/2025-11-22-writing-group-red-forge-analysis.md` for the full narrative strategy analysis.

## 📞 Contact

**Samuel Lindgren**  
Email: samuel@dynorobotics.se  
Company: Dyno Robotics AB  
Location: Linköping, Sweden

---

**Built with lagom irony and Swedish self-awareness.** 🇸🇪☕🤖🔒
