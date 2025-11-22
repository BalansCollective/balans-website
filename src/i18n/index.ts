import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18next
  .use(Backend) // Lazy load translations from public/locales
  .use(LanguageDetector) // Auto-detect browser language
  .use(initReactI18next)
  .init({
    fallbackLng: 'sv',
    supportedLngs: ['en', 'sv', 'de', 'fr', 'es', 'pl', 'nl', 'fi', 'no', 'da'],
    
    // Namespaces for domain separation
    ns: ['common', 'homepage', 'medical', 'family', 'defense', 'red-forge', 'guardian', 'forge', 'institutional'],
    defaultNS: 'common',
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'balans-language',
    },
    
    // Development options
    debug: import.meta.env.DEV,
    
    // Return key if translation missing (for development)
    returnNull: false,
  });

export default i18next;

