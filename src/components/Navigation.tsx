import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useEffect, useState } from 'react';

export function Navigation() {
  const { i18n, t } = useTranslation('common');
  const location = useLocation();
  
  // Track theme context
  const [themeContext, setThemeContext] = useState<string | null>(null);
  
  useEffect(() => {
    // Save current page to sessionStorage for next navigation
    if (location.pathname === '/defense' || location.pathname === '/red-forge') {
      sessionStorage.setItem('lastContext', 'dark');
    } else if (location.pathname === '/') {
      sessionStorage.setItem('lastContext', 'light');
    }
    
    // For protocol pages, check where we came from
    if (location.pathname === '/guardian-protocol' || location.pathname === '/forge-protocol') {
      const context = sessionStorage.getItem('lastContext');
      setThemeContext(context);
    } else {
      setThemeContext(null);
    }
  }, [location.pathname]);
  
  // Determine if we're on a dark-themed page
  const isDarkPage = location.pathname === '/defense' 
    || location.pathname === '/red-forge'
    || ((location.pathname === '/guardian-protocol' || location.pathname === '/forge-protocol') && themeContext === 'dark');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'sv' ? 'en' : 'sv';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${
      isDarkPage 
        ? 'bg-gray-900/95 border-gray-800' 
        : 'bg-birch-white/95 border-gentle-silver/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <a href="/" className={`text-xl font-bold ${
              isDarkPage ? 'text-white' : 'text-swedish-blue'
            }`}>
              Balans
            </a>
            {isDarkPage && <span className="text-xs text-red-500 font-mono">// DEFENSE</span>}
          </div>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isDarkPage ? (
              <>
                <a href={location.pathname === '/red-forge' ? '/defense' : '/'} className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.home', 'Hem')}
                </a>
                <a href="/guardian-protocol" className="text-gray-300 hover:text-white transition-colors">
                  Guardian
                </a>
                <a href="/forge-protocol" className="text-gray-300 hover:text-white transition-colors">
                  Forge
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection('mission')}
                  className="text-gray-700 hover:text-swedish-blue transition-colors"
                >
                  {t('navigation.mission')}
                </button>
                <button
                  onClick={() => scrollToSection('products')}
                  className="text-gray-700 hover:text-swedish-blue transition-colors"
                >
                  {t('navigation.products')}
                </button>
                <a
                  href="/narratives"
                  className="text-gray-700 hover:text-swedish-blue transition-colors"
                >
                  {t('navigation.narratives')}
                </a>
              </>
            )}
          </div>

          {/* Right Side - Language Toggle + CTA */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className={`rounded-full p-1 ${isDarkPage ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  isDarkPage
                    ? i18n.language === 'sv' 
                      ? 'bg-red-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                    : i18n.language === 'sv'
                      ? 'bg-swedish-blue text-white'
                      : 'text-swedish-blue hover:bg-gray-200'
                }`}
              >
                SV
              </button>
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  isDarkPage
                    ? i18n.language === 'en' 
                      ? 'bg-red-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                    : i18n.language === 'en'
                      ? 'bg-swedish-blue text-white'
                      : 'text-swedish-blue hover:bg-gray-200'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

