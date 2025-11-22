# Balans Website Deployment Guide

## 🚀 Quick Deploy to GitHub Pages

### Prerequisites
1. ✅ All images generated and saved to `public/images/`
2. ✅ Website tested locally (`npm run dev`)
3. ✅ GitHub repository with Pages enabled

### Deployment Steps

#### 1. Enable GitHub Pages (One-time setup)
```bash
# In GitHub repository settings:
# Settings → Pages → Source: "GitHub Actions"
```

#### 2. Deploy
```bash
# Commit and push your changes
git add .
git commit -m "feat(balans-website): deploy Red Forge website"
git push origin main
```

The GitHub Action will automatically:
- Build the website
- Deploy to GitHub Pages
- Make it available at: `https://[username].github.io/weavermesh/`

#### 3. Verify
- Check Actions tab in GitHub for deployment status
- Visit your GitHub Pages URL
- Test all pages: Home, Defense, Red Forge

---

## 📋 Pre-Deploy Checklist

### Critical Items
- [ ] Generate `red-forge-floor-plan.png` (L-shape layout)
- [ ] All images in `balans-website/public/images/`
- [ ] Test locally: `cd balans-website && npm run dev`
- [ ] Check all routes: `/`, `/defense`, `/red-forge`
- [ ] Verify translations work (SV/EN toggle)
- [ ] Check responsive design (mobile/desktop)

### Nice-to-Have
- [ ] Replace `defence-hero.png` with new dual-monitor version (optional)
- [ ] Test on different browsers
- [ ] Check console for errors

---

## 🔧 Local Development

```bash
cd balans-website
npm install
npm run dev
# Visit http://localhost:1420
```

---

## 📁 Repository Structure

```
weavermesh/
├── .github/
│   └── workflows/
│       └── deploy-balans-website.yml  ← GitHub Actions deployment
├── balans-website/
│   ├── public/
│   │   ├── images/               ← All website images here
│   │   └── locales/              ← Translations (sv/en)
│   ├── src/
│   │   ├── pages/
│   │   │   └── website/
│   │   │       ├── HomePage.tsx
│   │   │       ├── DefensePage.tsx
│   │   │       └── RedForgePage.tsx
│   │   └── components/
│   │       └── Navigation.tsx
│   └── vite.config.ts            ← Already configured for GitHub Pages
```

---

## 🎯 For Tomas (Ebbe Park Pitch)

**Website URL:** `https://[username].github.io/weavermesh/`

**Key Pages:**
- Homepage: Overview of Balans (institutional positioning)
- Defense page (`/defense`): Red Forge overview, dual classification
- Red Forge facility (`/red-forge`): Physical space requirements, timeline, Linköping location

**Pitch Points:**
- Phase 1 (2025): Remote work with secure infrastructure
- Phase 2 (2026 Q2): Physical facility at Ebbe Park
- Space needed: ~120-150 sqm (Common Area + Meeting Room + Red Forge)
- Target: NATO DIANA startups, Saab partnerships, defense tech innovation

**Contact:**
- Samuel Lindgren
- Email: samuel@dynorobotics.se
- Company: Dyno Robotics AB (6 years robotics consulting)
- Pivot: Medical AI → Defense tech classification systems

---

## 🐛 Troubleshooting

### Build fails
```bash
cd balans-website
npm install
npm run build
# Check for TypeScript errors
```

### Images not loading
- Verify all images are in `public/images/`
- Check exact filenames match (case-sensitive!)
- Test locally first

### Translations missing
- Check `public/locales/sv/` and `public/locales/en/`
- Verify namespace in `src/i18n/index.ts`

### GitHub Pages shows 404
- Check Actions tab for deployment errors
- Verify Pages is enabled in repository settings
- Wait 2-3 minutes after first deployment

---

## 📝 Notes

- Website is React + Vite + TypeScript
- Styling: Tailwind CSS with custom design system
- i18n: Swedish (primary) + English
- Theme: Light (homepage), Dark (defense pages)
- "Lagom ironic" positioning: Self-aware Anduril aesthetic

---

**Ready to deploy! Just generate the floor plan image and push to GitHub.** 🚀



