# Balans Website i18n Setup - Complete

## ✅ What's Been Set Up

### 1. Dependencies Installed
- `i18next` - Core i18n library
- `react-i18next` - React integration
- `i18next-browser-languagedetector` - Auto-detect browser language
- `i18next-http-backend` - Lazy load translation files

### 2. Configuration
- **File**: `src/i18n/index.ts`
- **Supported Languages**: sv, en, de, fr, es, pl, nl, fi, no, da
- **Namespaces**: common, medical, family, defense, institutional, homepage, medical-page, family-page
- **Detection**: Query string → LocalStorage → Browser navigator
- **Fallback**: English (en)

### 3. Translation Files Created

#### Common Translations (All Pages)
- `public/locales/sv/common.json` ✅
- `public/locales/en/common.json` ✅
  - Navigation, theme toggle, common buttons, footer

#### Medical Domain
- `public/locales/sv/medical.json` ✅ (Dashboard namespace)
- `public/locales/en/medical.json` ✅

#### Family Domain  
- `public/locales/sv/family.json` ✅ (Dashboard namespace)
- `public/locales/en/family.json` ✅
- `public/locales/sv/family-page.json` ✅ (Full page content)
- `public/locales/en/family-page.json` ✅

#### Defense Domain
- `public/locales/sv/defense.json` ✅
- `public/locales/en/defense.json` ✅

#### Institutional Domain
- `public/locales/sv/institutional.json` ✅
- `public/locales/en/institutional.json` ✅

#### Homepage
- `public/locales/sv/homepage.json` ✅
- `public/locales/en/homepage.json` ✅

### 4. Components Created
- **`src/components/LanguageSelector.tsx`** ✅
  - Dropdown with 10 European languages
  - Flag emojis for easy recognition
  - Dark mode compatible
  - Stores selection in localStorage

## 📋 Next Steps (Porting Order)

### Phase 1: Homepage (Foundation)
1. Read `balans-website-old/index.html`
2. Create `src/pages/website/HomePage.tsx`
3. Use `useTranslation('homepage')` hook
4. Apply light theme from design system
5. Test language switching

### Phase 2: Defense Page (Biggest Difference)
1. Read `balans-website-old/defense-military.html`
2. Create `src/pages/website/DefensePage.tsx`
3. Use `useTranslation('defense')` hook
4. Apply **dark theme** from design system
5. Add classification visual indicators (border stripes)
6. Test theme + language switching

### Phase 3: Family Page
1. Read `balans-website-old/family.html`
2. Create `src/pages/website/FamilyPage.tsx`
3. Use `useTranslation('family-page')` hook
4. Apply light theme (sage green accents)
5. Test language switching

### Phase 4: Medical Page
1. Port `src/pages/website/MedicalPage.tsx.bak`
2. Replace hardcoded Swedish text with `t()` calls
3. Use `useTranslation('medical-page')` hook (needs creation)
4. Keep existing React components (MedicalTimeline, ButtonPanel)
5. Test language switching

## 🎨 Design System Integration (After Translation Setup)

Once translations are ready, reload design docs:
- `compression/99-output/lumens/balans-design-system.md`
- `balans-website/transcripts/2025-11-22-color-system-magic-rules-session.md`
- `balans-website/transcripts/2025-11-22-design-system-structure-session.md`
- `balans-website/transcripts/2025-11-22-universal-semantic-classification-session.md`
- `balans-website/transcripts/2025-11-22-classification-visual-indicators-session.md`

Then apply:
- **Foundation colors** (Swedish Blue, Birch White, etc.)
- **Domain themes** (Family: sage green, Defense: red/copper, Institutional: blue/silver)
- **Classification indicators** (border stripes, icons, sticky bars)
- **Light/dark mode adaptation**

## 🔧 Usage Pattern

```typescript
import { useTranslation } from 'react-i18next';

function MyPage() {
  const { t } = useTranslation('namespace-name');
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  );
}
```

## 📊 Token Efficiency

**Namespace structure saves tokens:**
- Only load translations relevant to current page
- Medical dashboard doesn't load defense translations
- Clear separation between domains

**LLM Benefits:**
- Can read one namespace at a time
- Easier to maintain consistency
- Clearer domain boundaries

## ✅ Ready for Design Work

All translation infrastructure is in place. We can now:
1. Port pages one by one (index → defense → family → medical)
2. Apply design system during porting
3. Test multi-language + multi-theme combinations

**Status**: i18n setup complete. Ready to reload design docs and start porting homepage. 🌍

