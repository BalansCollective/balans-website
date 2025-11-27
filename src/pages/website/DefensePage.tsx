import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function DefensePage() {
  const { t } = useTranslation(['defense', 'common']);

  return (
    <div className="min-h-screen bg-[#0a0e14]">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #dc2626 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <div className="bg-gradient-to-br from-red-800 to-red-600 border border-red-500 px-4 py-2 rounded-full font-mono text-sm font-semibold uppercase tracking-wider text-white">
                  {t('hero.badge')}
                </div>
              </div>
              
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-white leading-tight">
                {t('hero.title')}
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                {t('hero.subtitle_line1')}<br />
                <span className="text-red-400">{t('hero.subtitle_line2')}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <a href="#red-cell" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
                  {t('hero.cta_primary')}
                </a>
                <a href="#protocols" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-transparent border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200">
                  {t('hero.cta_secondary')}
                </a>
              </div>
            </div>
            
            <div>
              <a href="#red-cell" className="block cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] rounded-2xl">
                <img 
                  src="/images/defence-hero.png" 
                  alt={t('hero.image_alt')}
                  className="rounded-2xl shadow-2xl"
                  style={{boxShadow: '0 0 40px rgba(220, 38, 38, 0.3)'}}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Classification Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-6">{t('classification.title')}</h2>
            <p className="text-xl text-gray-300">
              {t('classification.subtitle_part1')} <span className="text-blue-400">{t('classification.what')}</span> {t('classification.subtitle_part2')},<br />
              {t('classification.subtitle_part3')} <span className="text-red-400">{t('classification.how')}</span> {t('classification.subtitle_part4')}.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* WHAT Card - Cold steel front, glowing red back */}
            <div className="relative group cursor-pointer">
              {/* Red hot glow behind card (visible on lift) */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-[#0066cc]/50 transition-all duration-300 group-hover:bg-[#0066cc]/20 group-hover:border-[#0066cc] group-hover:-translate-y-2 group-hover:shadow-[0_8px_30px_rgba(0,102,204,0.3)]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-[#0066cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <CardTitle className="text-2xl text-[#0066cc]">WHAT</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    <strong>{t('classification.what_title')}</strong> {t('classification.what_description')}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• {t('classification.what_items.0')}</li>
                    <li>• {t('classification.what_items.1')}</li>
                    <li>• {t('classification.what_items.2')}</li>
                    <li>• {t('classification.what_items.3')}</li>
                  </ul>
                  <p className="text-xs text-[#0066cc] mt-4 font-mono">→ {t('classification.what_classification')}</p>
                </CardContent>
              </Card>
            </div>

            {/* HOW Card - Cold steel front, INTENSE glowing red back */}
            <div className="relative group cursor-pointer">
              {/* INTENSE red hot glow behind card (visible on lift) */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-[#dc143c]/60 transition-all duration-300 group-hover:border-[#dc143c] group-hover:-translate-y-2 group-hover:shadow-[0_8px_60px_rgba(220,20,60,0.6)]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-[#dc143c] group-hover:text-[#ff4500] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <CardTitle className="text-2xl text-[#dc143c] group-hover:text-[#ff4500] transition-colors duration-300">HOW</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    <strong>{t('classification.how_title')}</strong> {t('classification.how_description')}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• {t('classification.how_items.0')}</li>
                    <li>• {t('classification.how_items.1')}</li>
                    <li>• {t('classification.how_items.2')}</li>
                    <li>• {t('classification.how_items.3')}</li>
                  </ul>
                  <p className="text-xs text-[#dc143c] group-hover:text-[#ff4500] mt-4 font-mono transition-colors duration-300">→ {t('classification.how_classification')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Red Cell Section */}
      <section id="red-cell" className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">{t('redcell.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('redcell.description')}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <span className="font-mono text-red-400">{t('redcell.phase1_label')}</span> {t('redcell.phase1_description')}<br />
              <span className="font-mono text-red-400">{t('redcell.phase2_label')}</span> {t('redcell.phase2_description')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Classification-Aware IDE Card */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-900/50 transition-all duration-300 group-hover:border-red-600 group-hover:-translate-y-2 group-hover:shadow-[0_8px_60px_rgba(220,20,60,0.6)]">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <CardTitle className="text-2xl text-red-400 group-hover:text-[#ff4500] transition-colors duration-300">{t('redcell.classification_ide.title')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    {t('redcell.classification_ide.description')}
                  </p>
                  <ul className="space-y-3 text-sm text-gray-400">
                    {(t('redcell.classification_ide.items', { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Secure LLM Servers Card */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-900/50 transition-all duration-300 group-hover:border-red-600 group-hover:-translate-y-2 group-hover:shadow-[0_8px_60px_rgba(220,20,60,0.6)]">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    <CardTitle className="text-2xl text-red-400 group-hover:text-[#ff4500] transition-colors duration-300">{t('redcell.secure_llm.title')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    {t('redcell.secure_llm.description')}
                  </p>
                  <ul className="space-y-3 text-sm text-gray-400">
                    {(t('redcell.secure_llm.items', { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Physical Facility Card */}
            <a href="/red-forge" className="relative group cursor-pointer block">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-900/50 transition-all duration-300 group-hover:border-red-600 group-hover:-translate-y-2 group-hover:shadow-[0_8px_60px_rgba(220,20,60,0.6)]">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <CardTitle className="text-2xl text-red-400 group-hover:text-[#ff4500] transition-colors duration-300">{t('redcell.physical_facility.title')}</CardTitle>
                    </div>
                    <span className="px-3 py-1 text-xs font-mono font-semibold bg-orange-900/30 border border-orange-700/50 text-orange-400 rounded-full">
                      KOMMER SNART
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    {t('redcell.physical_facility.description')}
                  </p>
                  <ul className="space-y-3 text-sm text-gray-400">
                    {(t('redcell.physical_facility.items', { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* Interactive Demo CTA */}
          <div className="bg-gradient-to-br from-red-900/30 to-gray-900/30 border-2 border-red-700/50 rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">{t('redcell.demo.title')}</h3>
            <p className="text-gray-300 mb-6">
              {t('redcell.demo.description')}
            </p>
            <a href="/red-forge-demo" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
              <span>{t('redcell.demo.cta')}</span>
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Protocols Section */}
      <section id="protocols" className="py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">{t('protocols.title')}</h2>
            <p className="text-xl text-gray-300">
              {t('protocols.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Guardian Protocol Card - Solid with red glowing back */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Link to="/guardian-protocol" state={{ from: 'defense' }} className="relative z-10 block group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-900/50 rounded-xl p-8 hover:border-red-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_60px_rgba(220,20,60,0.6)]">
                <div className="flex items-center space-x-3 mb-4">
                  <svg className="w-10 h-10 text-red-400 group-hover:text-red-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white group-hover:text-red-200 transition-colors duration-300">Guardian Protocol</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  {t('protocols.guardian.description')}
                </p>
                <div className="flex items-center text-red-400 group-hover:text-red-300">
                  <span className="text-sm font-semibold">{t('protocols.guardian.cta')}</span>
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* Forge Protocol Card - Solid with red glowing back */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Link to="/forge-protocol" state={{ from: 'defense' }} className="relative z-10 block group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-900/50 rounded-xl p-8 hover:border-red-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_60px_rgba(220,20,60,0.6)]">
                <div className="flex items-center space-x-3 mb-4">
                  <svg className="w-10 h-10 text-red-400 group-hover:text-red-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white group-hover:text-red-200 transition-colors duration-300">Forge Protocol</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  {t('protocols.forge.description')}
                </p>
                <div className="flex items-center text-red-400 group-hover:text-red-300">
                  <span className="text-sm font-semibold">{t('protocols.forge.cta')}</span>
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="font-display text-4xl font-bold text-white text-center mb-12">{t('usecases.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {(t('usecases.items', { returnObjects: true }) as Array<{ title: string, description: string }>).map((usecase, i) => (
              <div key={i} className="relative group cursor-pointer">
                {/* Red glow for use case cards */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 transition-all duration-300 group-hover:border-red-700/50 group-hover:-translate-y-2 group-hover:shadow-[0_8px_40px_rgba(220,20,60,0.4)]">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{usecase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">{usecase.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-900/20 to-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
              {t('cta.primary')}
            </a>
            <a href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-transparent border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200">
              {t('cta.secondary')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

