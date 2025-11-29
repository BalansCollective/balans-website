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
                {t('hero.subtitle')}
              </p>
              
              <div className="bg-gray-900/50 border border-red-900/50 rounded-xl p-6">
                <p className="text-lg text-gray-300 mb-4">
                  {t('hero.problem')}
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  {(t('hero.problems', { returnObjects: true }) as string[]).map((problem, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>

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
                  src="/images/defense-hero.jpeg" 
                  alt={t('hero.image_alt')}
                  className="rounded-2xl shadow-2xl"
                  style={{boxShadow: '0 0 40px rgba(220, 38, 38, 0.3)'}}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ISM-2022 Classification Levels Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-6">{t('redforge.classification_levels.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Red Forge stödjer samtliga ISM-2022 klassificeringsnivåer för svensk försvarsindustri
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Black PC - Ej Sekretess */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600/40 to-gray-800/40 rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 transition-all duration-300 group-hover:border-gray-500 group-hover:-translate-y-2">
                <CardHeader>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
                      <span className="text-3xl">⚫</span>
                    </div>
                    <CardTitle className="text-2xl text-gray-300">{t('redforge.classification_levels.black_pc.name')}</CardTitle>
                    <p className="text-sm text-gray-500 mt-2">{t('redforge.classification_levels.black_pc.level')}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    <strong className="text-gray-300">Användning:</strong><br />
                    {t('redforge.classification_levels.black_pc.usage')}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Zenoh Diode:</strong><br />
                    {t('redforge.classification_levels.black_pc.zenoh')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Yellow PC - K/BH */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/40 to-yellow-800/40 rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-900/50 transition-all duration-300 group-hover:border-yellow-700 group-hover:-translate-y-2">
                <CardHeader>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-900/30 border-2 border-yellow-700 flex items-center justify-center">
                      <span className="text-3xl">🟡</span>
                    </div>
                    <CardTitle className="text-2xl text-yellow-400">{t('redforge.classification_levels.yellow_pc.name')}</CardTitle>
                    <p className="text-sm text-yellow-600 mt-2">{t('redforge.classification_levels.yellow_pc.level')}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    <strong className="text-gray-300">Användning:</strong><br />
                    {t('redforge.classification_levels.yellow_pc.usage')}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Export:</strong><br />
                    {t('redforge.classification_levels.yellow_pc.export')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Red PC - H/KH */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 to-red-800/40 rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-900/50 transition-all duration-300 group-hover:border-red-700 group-hover:-translate-y-2">
                <CardHeader>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/30 border-2 border-red-700 flex items-center justify-center">
                      <span className="text-3xl">🔴</span>
                    </div>
                    <CardTitle className="text-2xl text-red-400">{t('redforge.classification_levels.red_pc.name')}</CardTitle>
                    <p className="text-sm text-red-600 mt-2">{t('redforge.classification_levels.red_pc.level')}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    <strong className="text-gray-300">Användning:</strong><br />
                    {t('redforge.classification_levels.red_pc.usage')}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Export:</strong><br />
                    {t('redforge.classification_levels.red_pc.export')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Enligt <strong>ISM-2022</strong> (Industrisäkerhetsskyddsmanual) från FMV
            </p>
          </div>
        </div>
      </section>

      {/* AI-Assisted Declassification Section */}
      <section className="py-16 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-white mb-6">{t('redforge.declassification.title')}</h2>
              <p className="text-xl text-gray-300 mb-8">
                {t('redforge.declassification.description')}
              </p>
              
              <ul className="space-y-4 mb-8">
                {(t('redforge.declassification.items', { returnObjects: true }) as string[]).map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-6">
                <p className="text-lg font-semibold text-red-400 mb-2">
                  {t('redforge.declassification.benefit')}
                </p>
                <p className="text-sm text-gray-400">
                  Säkerhetschef granskar AI-förslag istället för manuell läsning av 500+ rader kod. 
                  Human final approval alltid krävs – AI är ett verktyg, inte decision-maker.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-gray-900 border border-red-900/50 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-400 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Utvecklare begär export</p>
                      <p className="text-sm text-gray-400">AI scannar filer automatiskt (30 sek)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-400 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">AI identifierar risker</p>
                      <p className="text-sm text-gray-400">IP-adresser, API-nycklar, proprietär info</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-400 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Säkerhetschef granskar</p>
                      <p className="text-sm text-gray-400">Dedicated UI, 5-15 min istället för 2-3 dagar</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Godkänd för export</p>
                      <p className="text-sm text-gray-400">Krypterad USB, Chronicle audit trail</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product & Pricing Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-6">{t('product.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('product.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* USB Diode Tier */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600/40 to-gray-800/40 rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 transition-all duration-300 group-hover:border-gray-500 group-hover:-translate-y-2">
                <CardHeader>
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-mono bg-gray-800 text-gray-400 rounded-full mb-3">
                      STARTER
                    </span>
                    <div className="text-4xl font-bold text-white mb-2">5 990 kr</div>
                    <p className="text-sm text-gray-400">{t('product.tiers.starter.frequency')}</p>
                  </div>
                  <CardTitle className="text-xl text-center text-gray-300">{t('product.tiers.starter.name')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-400 mb-6">
                    {(t('product.tiers.starter.features', { returnObjects: true }) as string[]).map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 text-center">{t('product.tiers.starter.target')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Early Adopter Tier */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-[#1a0505] to-gray-900 border-2 border-red-600/50 transition-all duration-300 group-hover:border-red-500 group-hover:-translate-y-2 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                <CardHeader>
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-mono bg-red-900/30 text-red-400 rounded-full mb-3">
                      LIMITED
                    </span>
                    <div className="space-y-1">
                      <div className="text-4xl font-bold text-white">{t('product.tiers.early_adopter.price')}</div>
                      <div className="text-lg text-gray-500 line-through">{t('product.tiers.early_adopter.original_price')}</div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{t('product.tiers.early_adopter.frequency')}</p>
                  </div>
                  <CardTitle className="text-xl text-center text-red-400">{t('product.tiers.early_adopter.name')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-400 mb-6">
                    {(t('product.tiers.early_adopter.features', { returnObjects: true }) as string[]).map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 text-center">{t('product.tiers.early_adopter.target')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Complete Workstation Tier */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/40 via-[#ff4500]/40 to-[#8b0000]/40 rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-600/30 transition-all duration-300 group-hover:border-red-600 group-hover:-translate-y-2">
                <CardHeader>
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-mono bg-red-900/20 text-red-400 rounded-full mb-3">
                      TURNKEY
                    </span>
                    <div className="text-4xl font-bold text-white mb-2">115 000 kr</div>
                    <p className="text-sm text-gray-400">{t('product.tiers.complete.frequency')}</p>
                  </div>
                  <CardTitle className="text-xl text-center text-red-400">{t('product.tiers.complete.name')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-400 mb-6">
                    {(t('product.tiers.complete.features', { returnObjects: true }) as string[]).map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 text-center">{t('product.tiers.complete.target')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Enterprise Tier */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 transition-all duration-300 group-hover:border-red-600 group-hover:-translate-y-2">
                <CardHeader>
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-mono bg-gray-800 text-gray-400 rounded-full mb-3">
                      ENTERPRISE
                    </span>
                    <div className="text-4xl font-bold text-white mb-2">Från 50k kr</div>
                    <p className="text-sm text-gray-400">{t('product.tiers.enterprise.frequency')}</p>
                  </div>
                  <CardTitle className="text-xl text-center text-red-400">{t('product.tiers.enterprise.name')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-400 mb-6">
                    {(t('product.tiers.enterprise.features', { returnObjects: true }) as string[]).map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 text-center">{t('product.tiers.enterprise.target')}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              {t('product.note')}
            </p>
            <a href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
              {t('product.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* Red Forge Stack Section */}
      <section id="red-cell" className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">{t('redforge.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('redforge.description')}
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
                    <CardTitle className="text-2xl text-red-400 group-hover:text-[#ff4500] transition-colors duration-300">{t('redforge.zenoh_kvm.title')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    {t('redforge.zenoh_kvm.description')}
                  </p>
                  <ul className="space-y-3 text-sm text-gray-400">
                    {(t('redforge.zenoh_kvm.items', { returnObjects: true }) as string[]).map((item, i) => (
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
                    <CardTitle className="text-2xl text-red-400 group-hover:text-[#ff4500] transition-colors duration-300">{t('redforge.curated_stack.title')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    {t('redforge.curated_stack.description')}
                  </p>
                  <ul className="space-y-3 text-sm text-gray-400">
                    {(t('redforge.curated_stack.items', { returnObjects: true }) as string[]).map((item, i) => (
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

            {/* Consulting Services Card */}
            <a href="/contact" className="relative group cursor-pointer block">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 rounded-lg blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,20,60,0.8),rgba(255,69,0,0.4),transparent_70%)] rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <Card variant="flat" className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-red-900/50 transition-all duration-300 group-hover:border-red-600 group-hover:-translate-y-2 group-hover:shadow-[0_8px_60px_rgba(220,20,60,0.6)]">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <CardTitle className="text-2xl text-red-400 group-hover:text-[#ff4500] transition-colors duration-300">{t('redforge.consulting.title')}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    {t('redforge.consulting.description')}
                  </p>
                  <ul className="space-y-3 text-sm text-gray-400">
                    {(t('redforge.consulting.items', { returnObjects: true }) as string[]).map((item, i) => (
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
            <h3 className="text-3xl font-bold text-white mb-4">{t('redforge.demo.title')}</h3>
            <p className="text-gray-300 mb-6">
              {t('redforge.demo.description')}
            </p>
            <a href="/red-forge-demo" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200">
              <span>{t('redforge.demo.cta')}</span>
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

