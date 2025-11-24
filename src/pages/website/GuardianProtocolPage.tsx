import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useEffect, useState } from 'react';

export function GuardianProtocolPage() {
  const { t } = useTranslation(['guardian', 'common']);
  
  // Check theme context from sessionStorage
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const context = sessionStorage.getItem('lastContext');
    setIsDarkMode(context === 'dark');
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0e14]' : 'bg-[#f8f6f0]'}`}>
      {/* Hero Section */}
      <section className={`py-20 lg:py-32 ${isDarkMode ? 'bg-gradient-to-b from-[#0a0e14] to-gray-900' : 'bg-gradient-to-b from-[#f8f6f0] to-white'}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h1 className={`font-display text-5xl lg:text-6xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-[#2c5aa0]'} mb-4`}>
            {t('hero.title')}
          </h1>
          <p className={`text-2xl ${isDarkMode ? 'text-blue-300/80' : 'text-[#2c5aa0]/80'} mb-6`}>
            {t('hero.subtitle')}
          </p>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('hero.byline')}
          </p>
        </div>
      </section>

      {/* Executive Summary */}
      <section className={`py-12 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#2c5aa0] text-white'}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold mb-6">{t('summary.title')}</h2>
          <p className="text-lg mb-6 opacity-90">
            {t('summary.description')}
          </p>
          <p className="text-xl font-semibold text-green-400 mt-6">
            {t('summary.tagline')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <article className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          {/* Problem Section */}
          <section className="mb-16">
            <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-[#2c5aa0]'} mb-8`}>{t('problem.title')}</h2>
            
            <div className="space-y-6">
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('problem.scenario')}
              </p>
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-orange-300' : 'text-[#b87333]'}`}>
                {t('problem.adaptation')}
              </p>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('problem.dilemma')}
              </p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-[#2c5aa0]'} mt-6`}>
                {t('problem.question')}
              </p>
            </div>
          </section>

          {/* Solution Section */}
          <section className="mb-16">
            <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-[#2c5aa0]'} mb-8`}>{t('solution.title')}</h2>
            
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('solution.approach')}
            </p>
            
            <div className="space-y-6">
              {(t('solution.tiers', { returnObjects: true }) as Array<{title: string, description: string, example: string}>).map((tier, i) => (
                <div key={i} className="border-l-4 border-[#6b5b95] pl-6">
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-[#2c5aa0]'} mb-3`}>{tier.title}</h3>
                  <p className={`leading-relaxed mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tier.description}</p>
                  <p className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <strong>Example:</strong> {tier.example}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Value Section */}
          <section className="mb-16">
            <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-[#2c5aa0]'} mb-8`}>{t('value.title')}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {(t('value.sectors', { returnObjects: true }) as Array<{title: string, problem: string, solution: string, benefit: string}>).map((sector, i) => (
                <Card key={i} variant="flat" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#f8f6f0]'}>
                  <CardHeader>
                    <CardTitle className={`text-xl ${isDarkMode ? 'text-blue-300' : 'text-[#2c5aa0]'}`}>{sector.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <strong className="text-[#b87333]">Problem:</strong>
                      <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sector.problem}</p>
                    </div>
                    <div>
                      <strong className="text-[#8faa8b]">Lösning:</strong>
                      <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sector.solution}</p>
                    </div>
                    <div>
                      <strong className="text-[#6b5b95]">Värde:</strong>
                      <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sector.benefit}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Narrative CTA */}
          <section className="mb-16">
            <div className={`border-l-4 border-[#b87333] p-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-[#f8f6f0]'}`}>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-[#2c5aa0]'} mb-4`}>{t('narrative.title')}</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('narrative.description')}</p>
              <a href={t('narrative.link')} className="inline-flex items-center gap-2 text-[#6b5b95] font-semibold hover:underline">
                {t('narrative.cta')} →
              </a>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-12">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-[#2c5aa0]'} mb-4`}>{t('cta.title')}</h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className={`inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#2c5aa0] text-white hover:bg-[#234a85]'}`}>
                {t('cta.primary')}
              </a>
              <a href="/defense" className={`inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg border-2 transition-all duration-200 ${isDarkMode ? 'border-red-600 text-red-400 hover:bg-red-600 hover:text-white' : 'border-[#2c5aa0] text-[#2c5aa0] hover:bg-[#2c5aa0] hover:text-white'}`}>
                {t('cta.secondary')}
              </a>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
