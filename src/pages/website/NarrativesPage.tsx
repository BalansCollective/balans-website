import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function NarrativesPage() {
  const { t } = useTranslation('narratives');

  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1f26] to-[#2c3e50] py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-[#b87333]/20 rounded-full mb-6">
                <span className="text-[#c9a96e] font-semibold text-sm tracking-wide uppercase">
                  {t('hero.badge')}
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-[#f8f6f0] leading-tight mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl lg:text-2xl text-[#f8f6f0] leading-relaxed opacity-90">
                {t('hero.subtitle')}
              </p>
            </div>
            
            <div>
              <img 
                src="/images/morgan-story.png" 
                alt="Morgan's Story" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Narratives Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2c5aa0] mb-12">
              {t('why.title')}
            </h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-[#2c5aa0] leading-relaxed mb-6">
                {t('why.paragraph1')}
              </p>

              <div className="bg-[#f8f6f0] border-l-4 border-[#b87333] p-6 my-8 rounded-r-lg">
                <p className="text-lg text-[#2c5aa0] italic">
                  {t('why.quote')}
                </p>
              </div>

              <p className="text-xl text-[#2c5aa0] leading-relaxed mb-6">
                {t('why.paragraph2')}
              </p>

              <p className="text-xl text-[#2c5aa0] leading-relaxed">
                {t('why.paragraph3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Process Section */}
      <section className="py-20 lg:py-32 bg-[#f8f6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2c5aa0] mb-12">
              {t('process.title')}
            </h2>

            <div className="space-y-12">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex gap-6">
                  <div className={`flex-shrink-0 w-12 h-12 ${
                    step === 1 ? 'bg-[#2c5aa0]' :
                    step === 2 ? 'bg-[#8faa8b]' :
                    step === 3 ? 'bg-[#6b5b95]' :
                    step === 4 ? 'bg-[#b87333]' :
                    'bg-[#c9a96e] text-[#2c5aa0]'
                  } text-[#f8f6f0] rounded-full flex items-center justify-center font-bold text-xl`}>
                    {step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-[#2c5aa0] mb-3">
                      {t(`process.step${step}.title`)}
                    </h3>
                    <p className="text-lg text-[#2c5aa0] leading-relaxed opacity-80">
                      {t(`process.step${step}.description`)}
                    </p>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-[#b8c5d1]">
                      <p className={`text-sm text-[#2c5aa0] ${step === 2 || step === 5 ? 'italic' : 'font-mono'}`}>
                        <strong>{t(`process.step${step}.example_label`)}:</strong> {t(`process.step${step}.example`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why This Works Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2c5aa0] mb-12">
              {t('benefits.title')}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((benefit) => (
                <div key={benefit} className="bg-[#f8f6f0] p-8 rounded-xl border border-[#b8c5d1]">
                  <div className={`w-12 h-12 ${
                    benefit === 1 ? 'bg-[#2c5aa0]/10' :
                    benefit === 2 ? 'bg-[#8faa8b]/10' :
                    benefit === 3 ? 'bg-[#6b5b95]/10' :
                    'bg-[#b87333]/10'
                  } rounded-lg flex items-center justify-center mb-6`}>
                    <span className="text-3xl">{t(`benefits.benefit${benefit}.icon`)}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#2c5aa0] mb-3">
                    {t(`benefits.benefit${benefit}.title`)}
                  </h3>
                  <p className="text-[#2c5aa0] leading-relaxed opacity-80">
                    {t(`benefits.benefit${benefit}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Narratives Collection */}
      <section className="py-20 lg:py-32 bg-[#f8f6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#2c5aa0] mb-6">
              {t('collection.title')}
            </h2>
            <p className="text-xl text-[#2c5aa0] leading-relaxed opacity-80 max-w-3xl mx-auto">
              {t('collection.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            {/* Morgan's Dilemma */}
            <a 
              href="/narratives/morgans-dilemma"
              className="group bg-white rounded-xl p-8 shadow-[0_4px_6px_-1px_rgba(44,90,160,0.1)] hover:shadow-[0_10px_15px_-3px_rgba(44,90,160,0.2)] transition-all duration-300 hover:-translate-y-1 border border-[#b8c5d1]"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-20 h-20 bg-[#b87333]/20 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🛡️</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[#2c5aa0]/10 text-[#2c5aa0] text-sm font-semibold rounded-full">
                      {t('collection.morgans.tag')}
                    </span>
                    <span className="px-3 py-1 bg-[#8faa8b]/10 text-[#8faa8b] text-sm font-semibold rounded-full">
                      {t('collection.morgans.reading_time')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-[#2c5aa0] mb-3 group-hover:text-[#6b5b95] transition-colors">
                    {t('collection.morgans.title')}
                  </h3>
                  <p className="text-[#2c5aa0] leading-relaxed mb-4 opacity-75">
                    {t('collection.morgans.description')}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#2c5aa0] opacity-60">
                    <span>{t('collection.morgans.theme')}</span>
                    <span>•</span>
                    <span>{t('collection.morgans.classification')}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#b8c5d1]">
                    <p className="text-sm text-[#2c5aa0] italic">
                      <strong>{t('collection.morgans.discovery_label')}:</strong> {t('collection.morgans.discovery')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <span className="text-[#c9a96e] font-semibold group-hover:text-[#6b5b95] transition-colors">
                  {t('collection.morgans.cta')} →
                </span>
              </div>
            </a>

            {/* Coming Soon Placeholders */}
            <div className="bg-white rounded-xl p-8 border border-[#b8c5d1] opacity-60">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-20 h-20 bg-[#8faa8b]/20 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🏥</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[#8faa8b]/10 text-[#8faa8b] text-sm font-semibold rounded-full">
                      {t('collection.medical.tag')}
                    </span>
                    <span className="px-3 py-1 bg-[#b8c5d1]/30 text-[#2c5aa0] text-sm font-semibold rounded-full">
                      {t('collection.coming_soon')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-[#2c5aa0] mb-3">
                    {t('collection.medical.title')}
                  </h3>
                  <p className="text-[#2c5aa0] leading-relaxed opacity-75">
                    {t('collection.medical.description')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-[#b8c5d1] opacity-60">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-20 h-20 bg-[#d4b896]/20 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">👨‍👩‍👧‍👦</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[#d4b896]/20 text-[#2c5aa0] text-sm font-semibold rounded-full">
                      {t('collection.family.tag')}
                    </span>
                    <span className="px-3 py-1 bg-[#b8c5d1]/30 text-[#2c5aa0] text-sm font-semibold rounded-full">
                      {t('collection.coming_soon')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-[#2c5aa0] mb-3">
                    {t('collection.family.title')}
                  </h3>
                  <p className="text-[#2c5aa0] leading-relaxed opacity-75">
                    {t('collection.family.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-[#2c5aa0] text-[#f8f6f0]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl leading-relaxed mb-8 opacity-90">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:samuel@dynorobotics.se?subject=Feedback på Design-Narrativ" 
              className="px-8 py-4 bg-[#b87333] text-[#f8f6f0] rounded-lg hover:bg-[#c9a96e] transition-colors shadow-lg font-semibold"
            >
              {t('cta.primary')}
            </a>
            <a 
              href="/guardian-protocol" 
              className="px-8 py-4 border-2 border-[#f8f6f0] text-[#f8f6f0] rounded-lg hover:bg-[#f8f6f0] hover:text-[#2c5aa0] transition-colors font-semibold"
            >
              {t('cta.secondary')}
            </a>
          </div>
          <p className="mt-8 text-sm opacity-75">
            {t('cta.note')}
          </p>
        </div>
      </section>
    </div>
  );
}

