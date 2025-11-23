import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function HomePage() {
  const { t } = useTranslation('homepage');

  return (
    <div className="min-h-screen bg-[#f8f6f0] pt-16">
      {/* Hero Section */}
      <section className="alliance-pattern py-20 lg:py-32 bg-[#f8f6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-swedish-blue dark:text-swedish-blue-dark leading-tight mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl lg:text-2xl text-swedish-blue dark:text-swedish-blue-dark mb-8 leading-relaxed opacity-80">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-alliance-purple hover:bg-alliance-purple/90 text-white font-medium rounded-lg transition-colors"
                >
                  {t('hero.cta_primary')}
                </a>
                <a 
                  href="#approach"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent hover:bg-white/5 text-truth-copper border-2 border-truth-copper font-medium rounded-lg transition-colors"
                >
                  {t('hero.cta_secondary')}
                </a>
              </div>
            </div>

            <div className="relative">
              <img 
                src="/images/balans-collective-hero.png" 
                alt="Balans AI-säkerhet" 
                className="w-full h-auto rounded-2xl lagom-shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Warm Birch White */}
      <section id="mission" className="py-20 lg:py-32 bg-[#f8f6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-swedish-blue dark:text-swedish-blue-dark mb-6">
                {t('mission.title')}
              </h2>
              <p className="text-xl text-swedish-blue dark:text-swedish-blue-dark leading-relaxed opacity-80">
                {t('mission.subtitle')}
              </p>
            </div>
            <div>
              <a href="/approach" className="block cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(44,90,160,0.15)] rounded-2xl">
                <img 
                  src="/images/safety-mission.png" 
                  alt="AI-säkerhet" 
                  className="w-full h-auto rounded-2xl lagom-shadow"
                />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Guardian Shield - Safety First */}
            <Card variant="flat" className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <img 
                  src="/images/guardian-shield-icon.png" 
                  alt="Guardian Shield"
                  className="w-20 h-20 object-contain rounded-xl"
                />
              </div>
              <CardTitle className="text-2xl mb-4">{t('mission.safety_first.title')}</CardTitle>
              <p className="text-gray-700 leading-relaxed">
                {t('mission.safety_first.description')}
              </p>
            </Card>

            {/* Spiral - Proven Methods (Middle) */}
            <Card variant="flat" className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <img 
                  src="/images/spiral-icon.png" 
                  alt="Growth Spiral"
                  className="w-20 h-20 object-contain rounded-xl"
                />
              </div>
              <CardTitle className="text-2xl mb-4">{t('mission.proven_methods.title')}</CardTitle>
              <p className="text-gray-700 leading-relaxed">
                {t('mission.proven_methods.description')}
              </p>
            </Card>

            {/* Loom - Human Alignment (Right) */}
            <Card variant="flat" className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <img 
                  src="/images/weaving-icon.png" 
                  alt="Weaving Loom"
                  className="w-20 h-20 object-contain rounded-xl"
                />
              </div>
              <CardTitle className="text-2xl mb-4">{t('mission.human_alignment.title')}</CardTitle>
              <p className="text-gray-700 leading-relaxed">
                {t('mission.human_alignment.description')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Narrative-Driven Design Section - Warm Birch White */}
      <section className="py-20 lg:py-32 bg-[#f8f6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <a href="/narratives" className="block cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(143,170,139,0.2)] rounded-2xl">
                <img 
                  src="/images/morgan-story.png" 
                  alt="Narrative-Driven Design" 
                  className="rounded-2xl shadow-2xl"
                />
              </a>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-block px-4 py-2 bg-sage-green/20 dark:bg-sage-green-dark/20 rounded-full">
                <span className="text-sm font-semibold text-sage-green dark:text-sage-green-dark uppercase tracking-wider">
                  {t('narrative.badge')}
                </span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-swedish-blue dark:text-swedish-blue-dark leading-tight">
                {t('narrative.title')}
              </h2>
              
              <p className="text-xl text-gray-700 dark:text-birch-white-dark/70 leading-relaxed">
                {t('narrative.description')}
              </p>
              
              <div className="space-y-4">
                {(t('narrative.benefits', { returnObjects: true }) as Array<{ title: string, description: string }>).map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-sage-green dark:text-sage-green-dark flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-swedish-blue dark:text-swedish-blue-dark">{benefit.title}</p>
                      <p className="text-sm text-gray-600 dark:text-birch-white-dark/60">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <a 
                href="/narratives"
                className="inline-flex items-center justify-center px-6 py-3 bg-sage-green hover:bg-sage-green/90 text-white font-medium rounded-lg transition-colors"
              >
                {t('narrative.cta')}
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Warm Birch White */}
      <section id="products" className="py-20 lg:py-32 bg-[#f8f6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-swedish-blue dark:text-swedish-blue-dark mb-6">
              {t('products.title')}
            </h2>
            <p className="text-xl text-swedish-blue dark:text-swedish-blue-dark leading-relaxed opacity-80">
              {t('products.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Family Product */}
            <Card variant="elevated" className="lagom-hover group overflow-hidden flex flex-col p-0 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(44,90,160,0.15)]">
              <div className="bg-[#f8f6f0] transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-[rgba(212,184,150,0.05)] group-hover:to-[#f8f6f0]">
                <img 
                  src="/images/family-domain.png" 
                  alt="Family domain"
                  className="w-full h-auto"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <CardHeader className="p-0 mb-4">
                  <CardTitle>{t('products.family.title')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow flex flex-col">
                  <p className="text-gray-700 mb-4 flex-grow">
                    {t('products.family.description')}
                  </p>
                  <a 
                    href="/family"
                    className="inline-flex items-center justify-center px-6 py-3 bg-alliance-purple hover:bg-alliance-purple/90 text-white font-medium rounded-lg transition-colors w-full"
                  >
                    {t('products.family.cta')} →
                  </a>
                </CardContent>
              </div>
            </Card>

            {/* Medical Product */}
            <a href="/medical" className="block">
              <Card variant="elevated" className="lagom-hover group overflow-hidden flex flex-col p-0 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(44,90,160,0.15)]">
                <div className="bg-[#f8f6f0] transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-[rgba(143,170,139,0.05)] group-hover:to-[#f8f6f0]">
                  <img 
                    src="/images/medIcal-domain.png" 
                    alt="Medical domain"
                    className="w-full h-auto"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle>{t('products.medical.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow flex flex-col">
                    <p className="text-gray-700 mb-4 flex-grow">
                      {t('products.medical.description')}
                    </p>
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-alliance-purple hover:bg-alliance-purple/90 text-white font-medium rounded-lg transition-colors w-full">
                      {t('products.medical.cta')} →
                    </div>
                  </CardContent>
                </div>
              </Card>
            </a>

            {/* Defense Product */}
            <a href="/defense" className="block">
              <Card variant="elevated" className="lagom-hover group overflow-hidden flex flex-col p-0 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(44,90,160,0.15)]">
                <div className="bg-[#f8f6f0] transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-[rgba(44,90,160,0.05)] group-hover:to-[#f8f6f0]">
                  <img 
                    src="/images/defence-domain.png" 
                    alt="Defense domain"
                    className="w-full h-auto"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle>{t('products.defense.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow flex flex-col">
                    <p className="text-gray-700 mb-4 flex-grow">
                      {t('products.defense.description')}
                    </p>
                    <a 
                      href="/defense"
                      className="inline-flex items-center justify-center px-6 py-3 bg-alliance-purple hover:bg-alliance-purple/90 text-white font-medium rounded-lg transition-colors w-full"
                    >
                      {t('products.defense.cta')} →
                    </a>
                  </CardContent>
                </div>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* Approach Section - Warm Birch White */}
      <section id="approach" className="py-20 lg:py-32 bg-[#f8f6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-swedish-blue dark:text-swedish-blue-dark mb-6">
                {t('approach.title')}
              </h2>
              <p className="text-xl text-swedish-blue dark:text-swedish-blue-dark leading-relaxed opacity-80">
                {t('approach.subtitle')}
              </p>
            </div>
            <div>
              <a href="/approach" className="block cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(44,90,160,0.15)] rounded-2xl">
                <img 
                  src="/images/dual-protocols.png" 
                  alt="Guardian och Forge protokoll" 
                  className="w-full h-auto rounded-2xl lagom-shadow"
                />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Guardian Protocol */}
            <Card variant="elevated" className="lagom-hover group">
              <CardHeader>
                <CardTitle className="text-2xl">{t('approach.guardian.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-birch-white-dark/70 mb-4">
                  {t('approach.guardian.description')}
                </p>
                <a href="/guardian-protocol" className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium rounded-lg bg-swedish-blue text-birch-white hover:bg-swedish-blue-600 transition-all duration-200">
                  {t('approach.guardian.cta')} →
                </a>
              </CardContent>
            </Card>

            {/* Forge Protocol */}
            <Card variant="elevated" className="lagom-hover group">
              <CardHeader>
                <CardTitle className="text-2xl">{t('approach.forge.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-birch-white-dark/70 mb-4">
                  {t('approach.forge.description')}
                </p>
                <a href="/forge-protocol" className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium rounded-lg bg-swedish-blue text-birch-white hover:bg-swedish-blue-600 transition-all duration-200">
                  {t('approach.forge.cta')} →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-swedish-blue dark:bg-swedish-blue-dark text-birch-white dark:text-birch-white-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-birch-white dark:text-birch-white-dark mb-8 leading-relaxed opacity-90">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-birch-white hover:bg-birch-white/90 text-swedish-blue font-medium rounded-lg transition-colors"
            >
              {t('cta.primary')}
            </a>
            <a 
              href="#products"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-birch-white text-birch-white hover:bg-birch-white hover:text-swedish-blue font-medium rounded-lg transition-colors"
            >
              {t('cta.secondary')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
